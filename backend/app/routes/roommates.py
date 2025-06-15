from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from fastapi.responses import JSONResponse
from db.db import db
from db.models import RoommateProfile, Matches
from utils.logger import logger
from db.synthetic_models import RoommateProfile as ORMRoommateProfile
from utils.vibeModel import calculate_similarity_score

router = APIRouter()

def get_vibe_score(user, roommate):
    """
    Calculate the vibe score between two roommates.
    """
    try:
        score = calculate_similarity_score(user, roommate) # np.float()
        return score
    except Exception as e:
        # logger.error(f"Error calculating vibe score: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    

##### API Routes #####
@router.get("/roommates")
def get_roommates(request: Request):
    user_id = request.query_params.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id query param is required")
    
    try:
        db_session = next(db.get_db())

        # Fetch requesting user
        user = db_session.query(RoommateProfile).filter(RoommateProfile.user_id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get other roommates
        roommates = db_session.query(RoommateProfile).filter(RoommateProfile.user_id != int(user_id)).all()
        if not roommates:
            raise HTTPException(status_code=404, detail="No roommates found")

        # Convert user to dict for vibe calculation
        user_dict = {
            column.name: getattr(user, column.name) for column in user.__table__.columns
        }

        response = []
        for roommate in roommates:
            roommate_dict = {
                column.name: getattr(roommate, column.name) for column in roommate.__table__.columns
            }
            score = get_vibe_score(user_dict, roommate_dict)
            roommate_data = roommate_dict.copy()
            roommate_data["vibe_score"] = round(score, 2)
            response.append(roommate_data)
        
        print(f"Returning {len(response)} roommates with vibe scores")
        return response

    except Exception as e:
        print(f"Error fetching roommates: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/roommate/{id}", response_model=ORMRoommateProfile)
def get_roommate(id:int):
    try:
        db_session = next(db.get_db())
        roommate = db_session.query(RoommateProfile).filter(RoommateProfile.user_id == id).first()
        if not roommate:
            raise HTTPException(status_code=404, detail="Roommate not found")
        return roommate
    except Exception as e:
        # logger.error(f"Error fetching roommate with id {id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/matches/{id}", response_model=List[ORMRoommateProfile])
def get_matches(id: int):
    print(f"Fetching matches for user ID: {id}")
    db_session = next(db.get_db())

    # Get matches created by this user
    matches = db_session.query(Matches).filter(Matches.match_roommate_id == id).all()

    matched_profiles = []
    for match in matches:
        roommate = db_session.query(RoommateProfile).filter(RoommateProfile.user_id == match.user_id).first()
        if roommate:
            matched_profiles.append(roommate)

    return matched_profiles

@router.post("/createMatch")
def create_match(request: Request):
    user_id = request.query_params.get("user_id")
    match_roommate_id = request.query_params.get("match_roommate_id")

    if not user_id or not match_roommate_id:
        raise HTTPException(status_code=400, detail="User ID and Match Roommate ID are required")
    print(f"Creating match for user {user_id} with roommate {match_roommate_id}")
    try:
        db_session = next(db.get_db())
        match = Matches(
            user_id=user_id,
            match_roommate_id=match_roommate_id,
        )
        db_session.add(match)
        db_session.commit()
        return JSONResponse(content={"message": match.user_id}, status_code=200)
    except Exception as e:
        # logger.error(f"Error creating match: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
