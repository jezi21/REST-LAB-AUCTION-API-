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

class PaymentSchema(BaseModel):
    id: int
    price: float
    auction_id: int
    user_id: int
    checkout_session_id: str
    checkout_session_url: str

    payment_date: Optional[datetime]
    status: str

    class Config:
        orm_mode = True