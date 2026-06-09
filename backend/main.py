from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

import models, schemas, database

# Config
SECRET_KEY = "your_super_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app = FastAPI(title="Zepnest API")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Auth Utilities
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/api/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = get_password_hash(user.password)
    new_user = models.User(full_name=user.full_name, email=user.email, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/requests", response_model=list[schemas.RequestOut])
def get_requests(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.ServiceRequest).filter(models.ServiceRequest.user_id == current_user.id).all()

@app.post("/api/requests", response_model=schemas.RequestOut)
def create_request(request: schemas.RequestCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    new_request = models.ServiceRequest(**request.dict(), user_id=current_user.id)
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@app.patch("/api/requests/{id}/status", response_model=schemas.RequestOut)
def update_status(id: int, status_update: schemas.RequestUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == id, models.ServiceRequest.user_id == current_user.id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found or unauthorized")
        
    # Explicitly grab the string value (e.g., "In Progress")
    req.status = status_update.status.value 
    
    db.commit()
    db.refresh(req)
    return req

@app.delete("/api/requests/{id}")
def delete_request(id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == id, models.ServiceRequest.user_id == current_user.id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found or unauthorized")
    db.delete(req)
    db.commit()
    return {"message": "Request deleted successfully"}