from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from database import Base

class StatusEnum(str, enum.Enum):
    pending = "Pending"
    in_progress = "In Progress"
    completed = "Completed"
    cancelled = "Cancelled"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    requests = relationship("ServiceRequest", back_populates="owner", cascade="all, delete-orphan")

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(150))
    description = Column(Text)
    category = Column(String(100))
    address = Column(String(255))
    preferred_time = Column(DateTime)
    
    # Changed from Enum(StatusEnum) to String(50) to resolve the casing mismatch
    status = Column(String(50), default="Pending") 
    
    image_url = Column(String(255), nullable=True)
    owner = relationship("User", back_populates="requests")