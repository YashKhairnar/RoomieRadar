from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .db import Base
from .models import *

"""
Application models: The ORM models that represent the database tables.
"""
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    roommate_profile = relationship("RoommateProfile", back_populates="user", uselist=False)

class RoommateProfile(Base):
    __tablename__ = "roommate_profiles"
    
    user_id = Column(Integer,ForeignKey("user.id"), nullable=False, primary_key=True)  # Foreign key to User
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    gender = Column(String(10), nullable=False)
    age = Column(Integer, nullable=False)
    occupation = Column(String(100), nullable=False)
    bio = Column(String(1000))
    preferred_location = Column(String(200), nullable=False)
    preferred_room_type = Column(String(50), nullable=False)  # e.g., "Single", "Shared"
    hobbies = Column(String(500))  # Comma-separated list of hobbies
    pets_allowed = Column(Boolean, default=False)
    smoking_allowed = Column(Boolean, default=False)
    drinking_allowed = Column(Boolean, default=False)
    sleepSchedule = Column(String(200), nullable=False, default="Night Owl")  # e.g., "Night Owl", "Early Bird"
    cookingFrequency = Column(String(50), nullable=False, default="Daily")  # e.g., "Daily", "Weekly", "Rarely"
    cleanlinessLevel = Column(Integer, nullable=False, default=1)  # e.g., "Very Clean", "Moderately Clean", "Not Clean"
    noiseTolerance = Column(Integer, nullable=False, default=1)  # e.g., "Very Tolerant", "Moderately Tolerant", "Not Tolerant"
    socialInteraction = Column(Integer, nullable=False, default=2)  # e.g., "Very Social", "Moderately Social", "Not Social"
    move_in_date = Column(Date, nullable=False)
    move_out_date = Column(Date, nullable=True)  # Optional
    budget_min = Column(Integer)
    budget_max = Column(Integer)
    verified = Column(Boolean, default=False)
    image_url = Column(String(500), nullable=False, server_default="https://i.pravatar.cc/200")  # URL to the profile image
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # for user table
    user = relationship("User",back_populates="roommate_profile")

    # for matches table
    matches_initiated = relationship("Matches", back_populates="roommate_profile", cascade="all, delete-orphan", foreign_keys="[Matches.user_id]")
    matches_received = relationship("Matches", back_populates="matched_roommate", cascade="all, delete-orphan", foreign_keys="[Matches.match_roommate_id]")
class Matches(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("roommate_profiles.user_id"), nullable=False) # Foreign key to User
    match_roommate_id = Column(Integer, ForeignKey("roommate_profiles.user_id"), nullable=False) # Foreign key to RoommateProfile

    roommate_profile = relationship("RoommateProfile", foreign_keys=[user_id], back_populates="matches_initiated")
    matched_roommate = relationship("RoommateProfile", foreign_keys=[match_roommate_id], back_populates="matches_received")
