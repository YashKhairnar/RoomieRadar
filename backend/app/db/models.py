from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .db import Base
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
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

    sent_messages = relationship("Messages", back_populates="sender", cascade="all, delete-orphan", foreign_keys="[Messages.sender_id]")

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

    conversations = relationship("Conversation", back_populates="roommate_profile", cascade="all, delete-orphan", foreign_keys="[Conversation.roommate_profile_id]")

class Matches(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("roommate_profiles.user_id"), nullable=False) # Foreign key to User
    match_roommate_id = Column(Integer, ForeignKey("roommate_profiles.user_id"), nullable=False) # Foreign key to RoommateProfile

    roommate_profile = relationship("RoommateProfile", foreign_keys=[user_id], back_populates="matches_initiated")
    matched_roommate = relationship("RoommateProfile", foreign_keys=[match_roommate_id], back_populates="matches_received")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # Foreign key to User
    roommate_profile_id = Column(Integer, ForeignKey("roommate_profiles.user_id"), nullable=False)  # Foreign key to RoommateProfile

    
    user = relationship("User", back_populates="conversations")
    roommate_profile = relationship("RoommateProfile", back_populates="conversations")

    messages = relationship("Messages", back_populates="conversation", cascade="all, delete-orphan")


class Messages(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)  # Foreign key to Conversation
    sender_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # Foreign key to User
    content = Column(String(1000), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])