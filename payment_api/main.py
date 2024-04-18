from fastapi import FastAPI,Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from requests import get, post


from database import get_db, engine
from schemas import Auction, PaymentSchema
from models import Payment
from datetime import datetime

import stripe



import models, schemas

FRONTEND_URL = "http:///127.0.0.1:3000/"
USERS_API_URL = "http://127.0.0.1:8000/"
AUCTION_API_URL = "http://127.0.0.1:8001/"



models.Base.metadata.create_all(bind=engine)

stripe.api_key = open("stripe_key.txt", "r").read()

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




async def get_current_user(request: Request):
    headers = request.headers
    if "Authorization" not in request.headers:
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = headers["Authorization"]
    response = get(f"{USERS_API_URL}users/me", headers={"Authorization": token})
    return response

async def get_auction(auction_id: int):
    response = get(f"{AUCTION_API_URL}auctions/{auction_id}")
    return response


async def create_product(auction: Auction):
    product = stripe.Product.create(
        name=auction["title"],
        description=auction["description"],
        images=[auction["image_url"]],
    )
    price = stripe.Price.create(
        # convert to cents
        unit_amount=int(auction["current_bid"]*100),
        currency='usd',
        product=product.id,
    )
    return price.id

async def __creeate_checkout_session(price_id):
    checkout_session = stripe.checkout.Session.create(
        line_items=[
            {
                'price': price_id,
                'quantity': 1,
            },
        ],
        mode='payment',
        success_url="https://tfstats.net",
        cancel_url="https://tfstats.net"
    )
    return checkout_session

@app.post("/payments/{auction_id}", response_model=PaymentSchema)
async def create_checkout_session(auction_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    
    # check if payment exists
    payment = db.query(Payment).filter(Payment.auction_id == auction_id).filter(Payment.user_id == user.json()["id"]).first()
    if payment is not None:
        return payment
    
    auction = await get_auction(auction_id)
    if auction.status_code != 200:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    auction = auction.json()

    if datetime.strptime(auction["end_date"], "%Y-%m-%dT%H:%M:%S") > datetime.now():
        raise HTTPException(status_code=400, detail="Auction has not ended yet")
    
    if auction["current_bidder_id"] != user.json()["id"]:
        raise HTTPException(status_code=400, detail="You are not the highest bidder")
    
    price_id = await create_product(auction)
    checkout_session = await __creeate_checkout_session(price_id)
  

    payment = Payment(
        price=auction["current_bid"],
        auction_id=auction_id,
        user_id=user.json()["id"],
        checkout_session_id=checkout_session.id,
        checkout_session_url=checkout_session.url,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment







