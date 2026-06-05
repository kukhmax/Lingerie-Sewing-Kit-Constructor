from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy.orm import Session
import database as db

app = FastAPI(
    title="Lingerie Sewing Kit Constructor API",
    description="Python API backend for completing personalized lingerie kits from subtelnedetale.pl",
    version="1.0.0"
)

# Enable CORS for frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (e.g. React dev server on 5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get db session
def get_db():
    session = db.SessionLocal()
    try:
        yield session
    finally:
        session.close()

# Color Harmony mapping rules
# Maps the primary chosen color of the fabric to lists of compatible colors for other parts
COLOR_HARMONY = {
    "Szmaragdowy": ["Szmaragdowy", "Cielisty", "Inny", "Biały"],
    "Wino": ["Wino", "Czarny", "Inny"],
    "Pudrowy Róż": ["Pudrowy Róż", "Cielisty", "Inny", "Biały"],
    "Czarny": ["Czarny", "Inny"],
    "Biały": ["Biały", "Inny", "Pudrowy Róż"],
    "Cielisty": ["Cielisty", "Pudrowy Róż", "Inny", "Biały"],
    "Inny": ["Inny", "Czarny", "Biały", "Szmaragdowy", "Wino", "Pudrowy Róż", "Cielisty"]
}

class ProductResponse(BaseModel):
    id: str
    name: str
    url: Optional[str] = None
    image: Optional[str] = None
    price: float
    category: str
    colorName: str
    colorHex: str
    unit: str
    standard_qty: float

    class Config:
        from_attributes = True

class CartItem(BaseModel):
    product_id: str
    quantity: float = Field(..., gt=0)

class CartPayload(BaseModel):
    items: List[CartItem]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Lingerie Sewing Kit Constructor API is running."}

@app.get("/api/materials", response_model=List[ProductResponse])
def get_materials(
    category: Optional[str] = Query(None, description="Filter products by category type"),
    primary_color: Optional[str] = Query(None, description="Primary color to filter by color harmony rules"),
    db_session: Session = Depends(get_db)
):
    query = db_session.query(db.Product)
    
    # Apply category filter
    if category:
        query = query.filter(db.Product.category == category)
        
    products = query.all()
    
    # Apply Color Harmony logic in python if primary_color is supplied
    if primary_color:
        allowed_colors = COLOR_HARMONY.get(primary_color, ["Inny"])
        # Filter products list
        products = [
            p for p in products 
            if p.colorName in allowed_colors or p.colorName == primary_color
        ]
        
    return products

@app.post("/api/cart/add")
def add_to_cart(payload: CartPayload, db_session: Session = Depends(get_db)):
    added_items = []
    
    for item in payload.items:
        product = db_session.query(db.Product).filter(db.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=422, 
                detail=f"Produkt o ID '{item.product_id}' nie istnieje w bazie danych."
            )
        added_items.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": item.quantity,
            "total_price": round(product.price * item.quantity, 2)
        })
        
    return {
        "success": True,
        "message": "Twój zestaw został pomyślnie dodany do koszyka sklepu!",
        "added_items": added_items,
        "redirect_url": "https://subtelnedetale.pl/koszyk/" # Real cart path
    }
