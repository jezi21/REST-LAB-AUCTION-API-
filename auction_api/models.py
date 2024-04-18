from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base


class Auction(Base):    
    __tablename__ = "auctions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    image_url = Column(String, index=True, default="https://placehold.co/600x400/png")
    

    minimum_bid = Column(Integer, index=True)
    current_bid = Column(Integer, index=True, nullable=True, default=None)
    current_bidder_id = Column(Integer, index=True, nullable=True, default=None)


    start_date = Column(DateTime, index=True)
    end_date = Column(DateTime, index=True)

    owner_id = Column(Integer,index=True)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)