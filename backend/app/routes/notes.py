from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from db.synthetic_models import RoommateSignUp, RoommateLogin, RoommateRegisterProfile
from db.db import db
from db.models import User, RoommateProfile
from utils.logger import logger
import hashlib

router = APIRouter()

def fake_hash(pwd):
    return hashlib.sha256(pwd.encode()).hexdigest()

@router.post("/signup")
def register(user: RoommateSignUp,db_session:Session = Depends(db.get_db)):
    # Check if username already exists
    existing_user = db_session.query(User).filter(User.email == user.email).first()
    password = user.password # In production, hash this password
    hashed_password = fake_hash(password)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username email already exists")
    
    # Create new user
    new_user = User(
        email=user.email,
        password=hashed_password,  # In production, hash this password
    )

    db_session.add(new_user)
    db_session.commit()
    db_session.refresh(new_user)
    # logger.log_action(
    #     session_id, 
    #     ActionType.DB_UPDATE, 
    #     {
    #         "table_name": "users", 
    #         "update_type": "insert", 
    #         "text": f"User {new_user.username} created in database with id {new_user.id}, username {new_user.username}, password {new_user.password}",
    #         "values": {
    #             "id": new_user.id,
    #             "username": new_user.username,
    #             "password": new_user.password,
    #             "created_at": new_user.created_at.isoformat() if new_user.created_at else None,
    #             "updated_at": new_user.updated_at.isoformat() if new_user.updated_at else None
    #         }
    #     }
    # )
    return {"email": new_user.email, "userId":new_user.id}



@router.post("/login")
def login(user: RoommateLogin, db_session: Session = Depends(db.get_db)):
    email = user.email
    password = user.password
    # Find user by email and password (in production, use hashed password verification)
    hashed_password = fake_hash(password)
    # print(f"Hashed password: {hashed_password}")
    user = db_session.query(User).filter(
        User.email == email,
        User.password == hashed_password  # In production, use proper password verification
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # logger.log_action(
    #     session_id,
    #     ActionType.CUSTOM,
    #     {
    #         "custom_action": "login", 
    #         "text": f"User {user.username} logged in",
    #         "data": {"userId": user.id}
    #     }
    # )

    return {"userId": user.id}


@router.post("/register")
def register_roommate(user : RoommateRegisterProfile, request:Request, db_session: Session = Depends(db.get_db)):
    user_id = request.query_params.get("userId") #getting from query
    hobbies_list = user.hobbies
    hobbies_str = ", ".join(hobbies_list) if hobbies_list else ""  # Convert list to comma-separated string
    #create a new roommate profile
    new_roommate = RoommateProfile(
        user_id = int(user_id),
        first_name = user.first_name,
        last_name = user.last_name,
        age = user.age, 
        gender = user.gender,
        occupation = user.occupation,
        bio = user.bio,
        preferred_location = user.preferred_location,
        preferred_room_type = user.preferred_room_type,
        hobbies = hobbies_str,  # Convert list to comma-separated string
        pets_allowed = user.pets_allowed,
        smoking_allowed = user.smoking_allowed,
        drinking_allowed = user.drinking_allowed,
        sleepSchedule = user.sleepSchedule,
        cookingFrequency = user.cookingFrequency,
        cleanlinessLevel = user.cleanlinessLevel,
        noiseTolerance = user.noiseTolerance,
        socialInteraction = user.socialInteraction,
        move_in_date = user.move_in_date,
        move_out_date = user.move_out_date,
        budget_min = user.budget_min,
        budget_max = user.budget_max,
        verified = user.verified,
        image_url = user.image_url # Handle empty string as Non
    )
    db_session.add(new_roommate)
    db_session.commit()
    db_session.refresh(new_roommate)

    return {"userId": new_roommate.user_id, "message": "Roommate profile created successfully" }