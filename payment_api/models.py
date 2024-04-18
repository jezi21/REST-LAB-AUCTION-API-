from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    
    price = Column(Integer)
    auction_id = Column(Integer)
    user_id = Column(Integer)
    
    checkout_session_id = Column(String)
    checkout_session_url = Column(String)

    payment_date = Column(DateTime, nullable=True)

    status = Column(String, default="pending")
