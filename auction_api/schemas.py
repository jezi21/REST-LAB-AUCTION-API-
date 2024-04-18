from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class AuctionBase(BaseModel):
    title: str
    description: str

    image_url: Optional[str]
    category_id: int
    minimum_bid: float

    start_date: datetime
    end_date: datetime

class AuctionCreate(AuctionBase):
    pass

class Auction(AuctionBase):
    id: int
    current_bid: Optional[float]
    current_bidder_id: Optional[int]

    class Config:
        orm_mode = True

class AuctionList(BaseModel):
    auctions: Optional[List[Auction]]
    class Config:
        orm_mode = True

class Bid(BaseModel):
    amount: float


class CategoryBase(BaseModel):
    name: str
    description: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        orm_mode = True


class CategoriesList(BaseModel):
    categories: List[Category] = []
    class Config:
        orm_mode = True