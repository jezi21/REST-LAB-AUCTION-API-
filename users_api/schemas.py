from typing import Optional, List
from pydantic import BaseModel



class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None





class UserBase(BaseModel):
    name: str
    surname: str
    email: str

class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserInDB(User):
    hashed_password: str

class UsersList(BaseModel):
    users: List[UserInDB]

