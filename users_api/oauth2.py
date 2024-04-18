from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

import database, models
from hash_pass import verify
from schemas import TokenData,TokenData,UserInDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')


SECRET_KEY = "554f373b120bd0b306b6b9cf8ef1f66235e18e61766f32d9fa9b16be6ce5dff6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 360


def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()



def create_access_token(data: dict,):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify(password, user.hashed_password):
        return False
    return user



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
       
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
       
        raise credentials_exception

  
    user = db.query(models.User).filter(
        models.User.email == token_data.email).first()
  
    if not user:
        raise credentials_exception
    
    return user

