import json
import os
from database import SessionLocal, Product, init_db

# Custom helper items to ensure full coverage of all garment parts
helper_products = [
    # Tiul Stabilny (Stable Tulle)
    {
        "id": "tiul-stabilny-cielisty-custom",
        "name": "Tiul stabilny gorseciarski (Cielisty)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/32.jpg",
        "price": 12.00,
        "category": "fabric",
        "colorName": "Cielisty",
        "colorHex": "#fbcfe8",
        "unit": "m",
        "standard_qty": 0.5
    },
    {
        "id": "tiul-stabilny-czarny-custom",
        "name": "Tiul stabilny gorseciarski (Czarny)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/21.jpg",
        "price": 12.00,
        "category": "fabric",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "m",
        "standard_qty": 0.5
    },
    
    # Tiul Elastyczny (Elastic Tulle)
    {
        "id": "tiul-elastyczny-szmaragd-custom",
        "name": "Tiul elastyczny / Siatka (Szmaragdowa)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/10.jpg",
        "price": 14.50,
        "category": "fabric",
        "colorName": "Szmaragdowy",
        "colorHex": "#047857",
        "unit": "m",
        "standard_qty": 0.5
    },
    {
        "id": "tiul-elastyczny-czarny-custom",
        "name": "Tiul elastyczny / Siatka (Czarna)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/4.jpg",
        "price": 14.00,
        "category": "fabric",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "m",
        "standard_qty": 0.5
    },
    
    # Bawełna na klin (Gusset Cotton)
    {
        "id": "bawelna-klin-cielista-custom",
        "name": "Dzianina bawełniana na klin (Cielista)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/80.jpg",
        "price": 8.00,
        "category": "fabric",
        "colorName": "Cielisty",
        "colorHex": "#fbcfe8",
        "unit": "m",
        "standard_qty": 0.2
    },
    {
        "id": "bawelna-klin-czarna-custom",
        "name": "Dzianina bawełniana na klin (Czarna)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/81.jpg",
        "price": 8.00,
        "category": "fabric",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "m",
        "standard_qty": 0.2
    },
    
    # Koronka stabilna (Stable Lace)
    {
        "id": "koronka-stabilna-czarna-custom",
        "name": "Koronka stabilna (Czarna)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/21.jpg",
        "price": 16.00,
        "category": "fabric",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "m",
        "standard_qty": 1.0
    },
    {
        "id": "koronka-stabilna-cielista-custom",
        "name": "Koronka stabilna (Cielista)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/32.jpg",
        "price": 16.00,
        "category": "fabric",
        "colorName": "Cielisty",
        "colorHex": "#fbcfe8",
        "unit": "m",
        "standard_qty": 1.0
    },
    
    # Tkanina elastyczna (Elastic Fabric)
    {
        "id": "tkanina-elastyczna-czarna-custom",
        "name": "Tkanina elastyczna / Satyna (Czarna)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/81.jpg",
        "price": 22.00,
        "category": "fabric",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "m",
        "standard_qty": 0.5
    },
    {
        "id": "tkanina-elastyczna-rozowa-custom",
        "name": "Tkanina elastyczna / Satyna (Różowa)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/12.jpg",
        "price": 22.00,
        "category": "fabric",
        "colorName": "Pudrowy Róż",
        "colorHex": "#fda4af",
        "unit": "m",
        "standard_qty": 0.5
    },
    
    # Tkanina stabilna (Stable Fabric)
    {
        "id": "tkanina-stabilna-czarna-custom",
        "name": "Tkanina stabilna (Czarna)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/81.jpg",
        "price": 25.00,
        "category": "fabric",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "m",
        "standard_qty": 0.5
    },
    {
        "id": "tkanina-stabilna-cielista-custom",
        "name": "Tkanina stabilna (Cielista)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/80.jpg",
        "price": 25.00,
        "category": "fabric",
        "colorName": "Cielisty",
        "colorHex": "#fbcfe8",
        "unit": "m",
        "standard_qty": 0.5
    },
    
    # Kokardka (Bow)
    {
        "id": "kokardka-czarna-custom",
        "name": "Kokardka satynowa ozdobna (Czarna)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/4.jpg",
        "price": 1.20,
        "category": "bow",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "szt",
        "standard_qty": 1.0
    },
    {
        "id": "kokardka-szmaragd-custom",
        "name": "Kokardka satynowa ozdobna (Szmaragdowa)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/10.jpg",
        "price": 1.20,
        "category": "bow",
        "colorName": "Szmaragdowy",
        "colorHex": "#047857",
        "unit": "szt",
        "standard_qty": 1.0
    },
    {
        "id": "kokardka-roz-custom",
        "name": "Kokardka satynowa ozdobna (Różowa)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/12.jpg",
        "price": 1.20,
        "category": "bow",
        "colorName": "Pudrowy Róż",
        "colorHex": "#fda4af",
        "unit": "szt",
        "standard_qty": 1.0
    },

    # Nici (Threads)
    {
        "id": "nici-czarne-custom",
        "name": "Nici Ariadna Talia 120 (Czarny)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/81.jpg",
        "price": 5.50,
        "category": "threads",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "szp",
        "standard_qty": 1.0
    },
    {
        "id": "nici-szmaragd-custom",
        "name": "Nici Ariadna Talia 120 (Szmaragdowy)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/10.jpg",
        "price": 5.50,
        "category": "threads",
        "colorName": "Szmaragdowy",
        "colorHex": "#047857",
        "unit": "szp",
        "standard_qty": 1.0
    },
    {
        "id": "nici-rozowe-custom",
        "name": "Nici Ariadna Talia 120 (Jasny Róż)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/12.jpg",
        "price": 5.50,
        "category": "threads",
        "colorName": "Pudrowy Róż",
        "colorHex": "#fda4af",
        "unit": "szp",
        "standard_qty": 1.0
    },

    # Miseczki wkładki (Cup inserts)
    {
        "id": "miseczki-beze-custom",
        "name": "Miseczki piankowe profilowane (Beżowe)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/80.jpg",
        "price": 12.00,
        "category": "cup_insert",
        "colorName": "Cielisty",
        "colorHex": "#fbcfe8",
        "unit": "para",
        "standard_qty": 1.0
    },
    {
        "id": "miseczki-czarne-custom",
        "name": "Miseczki piankowe profilowane (Czarne)",
        "url": "https://subtelnedetale.pl/sklep/",
        "image": "https://subtelnedetale.pl/wp-content/uploads/81.jpg",
        "price": 12.00,
        "category": "cup_insert",
        "colorName": "Czarny",
        "colorHex": "#111827",
        "unit": "para",
        "standard_qty": 1.0
    }
]

def seed_database():
    print("Initializing Database...")
    init_db()
    session = SessionLocal()

    # Clear old records
    session.query(Product).delete()

    crawled_path = "all_extracted_products.json"
    if not os.path.exists(crawled_path):
        crawled_path = r"C:\Users\m-win\.gemini\antigravity\scratch\all_extracted_products.json"
    
    # Load crawled WooCommerce products
    if os.path.exists(crawled_path):
        print(f"Loading crawled products from {crawled_path}...")
        with open(crawled_path, "r", encoding="utf-8") as f:
            crawled_products = json.load(f)
            
        for item in crawled_products:
            # Avoid duplicate primary keys
            existing = session.query(Product).filter_by(id=item["id"]).first()
            if not existing:
                # Map product category names to match frontend logic
                cat = item["category"]
                if cat == "guma-obszywkowa" or cat == "elastic_trim":
                    cat = "elastic_trim"
                elif cat == "guma-ramiaczkowa" or cat == "elastic_strap":
                    cat = "elastic_strap"
                
                db_prod = Product(
                    id=item["id"],
                    name=item["name"],
                    url=item["url"],
                    image=item["image"],
                    price=item["price"],
                    category=cat,
                    colorName=item["colorName"],
                    colorHex=item["colorHex"],
                    unit=item["unit"],
                    standard_qty=item["standard_qty"]
                )
                session.add(db_prod)
    else:
        print("Warning: Crawled products file not found. Seeding helpers only.")

    # Add custom helper items
    print("Seeding helper items...")
    for item in helper_products:
        existing = session.query(Product).filter_by(id=item["id"]).first()
        if not existing:
            db_prod = Product(
                id=item["id"],
                name=item["name"],
                url=item["url"],
                image=item["image"],
                price=item["price"],
                category=item["category"],
                colorName=item["colorName"],
                colorHex=item["colorHex"],
                unit=item["unit"],
                standard_qty=item["standard_qty"]
            )
            session.add(db_prod)

    session.commit()
    total = session.query(Product).count()
    print(f"Database successfully seeded! Total products: {total}")
    session.close()

if __name__ == "__main__":
    seed_database()
