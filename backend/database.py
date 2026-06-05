import os
from sqlalchemy import create_url, create_engine, Column, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Default database is SQLite in the backend container for easy testing.
# In production, specify DATABASE_URL=mysql+pymysql://user:password@host/db_name in environment.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./constructor.db")

# SQLite needs specific parameters for thread safety
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    url = Column(String(500), nullable=True)
    image = Column(String(500), nullable=True)
    price = Column(Float, nullable=False, default=0.0)
    
    # Categories: fabric, elastic_trim, elastic_strap, slider, ring, closure, underwire, tunnel, threads, bow, cup_insert
    category = Column(String(50), nullable=False, index=True)
    
    colorName = Column(String(50), nullable=False, default="Inny")
    colorHex = Column(String(7), nullable=False, default="#d1d5db")
    unit = Column(String(10), nullable=False, default="m")
    standard_qty = Column(Float, nullable=False, default=1.0)

def init_db():
    Base.metadata.create_all(bind=engine)
