from fastapi import FastAPI,Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware


from database import get_db, engine
from requests import get


# import date time 
from datetime import datetime


def str_to_date(date_str:str)->datetime:
    return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")


import models, schemas

USERS_API_URL = "http://users_api:8000/"

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




def get_current_user(request: Request):
    headers = request.headers
    if "Authorization" not in request.headers:
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = headers["Authorization"]
    response = get(f"{USERS_API_URL}users/me", headers={"Authorization": token})
    return response


@app.post("/auctions/", response_model=schemas.Auction)
async def create_auction(auction: schemas.AuctionCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.status_code != 200:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    
    auction = models.Auction(**auction.dict())
    auction.owner_id = user.json()["id"]

    
    category = db.query(models.Category).filter(models.Category.id == auction.category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if auction.start_date > auction.end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    if auction.minimum_bid < 0:
        raise HTTPException(status_code=400, detail="Minimum bid must be positive")
    if auction.start_date < datetime.now():
        raise HTTPException(status_code=400, detail="Start date must be in the future")
    
    db.add(auction)
    db.commit()
    db.refresh(auction)


    return auction

@app.get("/auctions/", response_model=schemas.AuctionList)
async def read_auctions(skip: int = 0, limit: int = 100, category_id:int = None,show_ended:bool=False,from_user:int=None, db: Session = Depends(get_db)):
    auctions = db.query(models.Auction)

    if category_id is not None:
        auctions = auctions.filter(models.Auction.category_id == category_id)

    if show_ended:
        auctions = auctions.filter(models.Auction.end_date < datetime.now())
    else:
        auctions = auctions.filter(models.Auction.end_date > datetime.now())

    if from_user is not None:
        auctions = auctions.filter(models.Auction.owner_id == from_user)
    

   
    
    auctions = auctions.offset(skip).limit(limit).all()


    return {"auctions": auctions}


@app.get("/auctions/me", response_model=schemas.AuctionList)
async def read_user_auctions(user=Depends(get_current_user),db: Session = Depends(get_db)):
    if user.status_code != 200:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    auctions = db.query(models.Auction).filter(models.Auction.owner_id == user.json()["id"])

 
    return {"auctions": auctions}

@app.get("/auctions/bids/me", response_model=schemas.AuctionList)
async def read_user_bids(user=Depends(get_current_user),only_won:bool=False, db: Session = Depends(get_db)):
    if user.status_code != 200:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    auctions = db.query(models.Auction).filter(models.Auction.current_bidder_id == user.json()["id"])
    if only_won:
        # end date has passed and user is the highest bidder
        auctions = auctions.filter(models.Auction.end_date < datetime.now())

    auctions = auctions.all()
    
    return {"auctions": auctions}


@app.get("/auctions/{auction_id}", response_model=schemas.Auction)
async def read_auction(auction_id: int, db: Session = Depends(get_db)):
    auction = db.query(models.Auction).filter(models.Auction.id == auction_id).first()
    if auction is None:
        raise HTTPException(status_code=404, detail="Auction not found")
    return auction

@app.post("/auctions/{auction_id}/bid", response_model=schemas.Auction)
async def create_bid(auction_id: int, bid: schemas.Bid, user=Depends(get_current_user), db: Session = Depends(get_db)):

    if user.status_code != 200:
        raise HTTPException(status_code=401, detail="Unauthorized")
    

    
    auction = db.query(models.Auction).filter(models.Auction.id == auction_id).first()



    if auction is None:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    if auction.owner_id == user.json()["id"]:
        raise HTTPException(status_code=400, detail="You cannot bid on your own auction")
    
    if auction.current_bidder_id == user.json()["id"]:
        raise HTTPException(status_code=400, detail="You are already the highest bidder")
    
    if auction.end_date < datetime.now():
        raise HTTPException(status_code=400, detail="Auction has ended")
    
    if auction.start_date > datetime.now():
        raise HTTPException(status_code=400, detail="Auction has not started yet")
    

    current_bid=0
    if auction.current_bid is not None:
        current_bid=auction.current_bid

    if bid.amount <= current_bid:
        raise HTTPException(status_code=400, detail="Bid must be higher than current bid")
    if bid.amount < auction.minimum_bid:
        raise HTTPException(status_code=400, detail="Bid must be higher than minimum bid")
    
    auction.current_bid = bid.amount
    auction.current_bidder_id = user.json()["id"]
    db.commit()
    db.refresh(auction)

    return auction

@app.delete("/auctions/{auction_id}", response_model=schemas.Auction)
async def delete_auction(auction_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.status_code != 200:
        raise HTTPException(status_code=401, detail="Unauthorized")
    auction = db.query(models.Auction).filter(models.Auction.id == auction_id).first()
    if auction is None:
        raise HTTPException(status_code=404, detail="Auction not found")
    if auction.owner_id != user.json()["id"]:
        raise HTTPException(status_code=403, detail="You are not the owner of this auction")
    db.delete(auction)
    db.commit()
   

    return auction

@app.post("/categories/", response_model=schemas.Category)
async def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/categories/", response_model=schemas.CategoriesList)
async def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = db.query(models.Category).offset(skip).limit(limit).all()
    return {"categories": categories}

@app.get("/categories/{category_id}/", response_model=schemas.Category)
async def read_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@app.delete("/categories/{category_id}", response_model=schemas.Category)
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return models.delete_category(db=db, category=category)

