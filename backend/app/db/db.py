from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from .base import Base
from .models import User, RoommateProfile, Matches, Conversation, Messages
from ..utils.dummyData import fake_users, fake_roommate_profiles
# from .base import Base
# from .models import User, RoommateProfile, Matches, Conversation, Messages
# from utils.dummyData import fake_users, fake_roommate_profiles

class Database:
    def __init__(self):
        self.db_path = os.path.join(os.path.dirname(__file__), "database.db")
        self.db_url = f"sqlite:///{self.db_path}"
        self.engine = None
        self.SessionLocal = None

    def create_database(self):
        self.engine = create_engine(self.db_url, connect_args={"check_same_thread": False})
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)

    def get_db(self):
        if not self.SessionLocal:
            self.create_database()
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

    """
    Populate the database with synthetic data.
    You should update this function set the database in its initial state.
    Feel free to use the Faker library (with a seed), or hardcode the data.
    """
    def populate_database(self):
        db = next(self.get_db())
        #creating roommate profiles
        for profile_data in fake_users:
            user = User(
                id = profile_data["id"],
                email = profile_data["email"],
                password = profile_data["password_hash"],
                is_active = profile_data["is_active"]
            )
            db.add(user)  

        for profile_data in fake_roommate_profiles:
            profile = RoommateProfile(
                user_id = profile_data["user_id"],
                first_name = profile_data["first_name"],
                last_name = profile_data["last_name"], 
                age = profile_data["age"],
                gender = profile_data["gender"],
                occupation = profile_data["occupation"],
                bio = profile_data["bio"],
                preferred_location = profile_data["preferred_location"],
                preferred_room_type = profile_data["preferred_room_type"],
                hobbies = profile_data["hobbies"],
                pets_allowed = profile_data["pets_allowed"],
                smoking_allowed = profile_data["smoking_allowed"],
                drinking_allowed = profile_data["drinking_allowed"],            
                sleepSchedule = profile_data["sleepSchedule"],
                cookingFrequency = profile_data["cookingFrequency"],
                cleanlinessLevel = profile_data["cleanlinessLevel"],
                noiseTolerance = profile_data["noiseTolerance"],
                socialInteraction = profile_data["socialInteraction"],
                move_in_date = profile_data["move_in_date"],
                move_out_date = profile_data["move_out_date"],
                budget_min = profile_data["budget_min"],
                budget_max = profile_data["budget_max"],
                verified = profile_data["verified"],
                image_url = profile_data["image_url"]
            )
            db.add(profile)

        #add a dummy match 
        match = Matches(
            user_id  = 5,
            match_roommate_id = 1
        )
        db.add(match)

        #add conversations
        conversation = Conversation(
            user_id = 5,
            roommate_profile_id = 1,
        )
        db.add(conversation)

        #add dummy messages 
        messages = [
            Messages(conversation_id=1, sender_id=5, content="Hey! I saw your profile. Are you still looking for a roommate?"),
            Messages(conversation_id=1, sender_id=1, content="Hey! Yes, I am. Are you still available?"),
            Messages(conversation_id=1, sender_id=5, content="Absolutely! I work nearby and prefer early mornings."),
            Messages(conversation_id=1, sender_id=1, content="Great! I’m also an early riser. How about weekends?"),
            Messages(conversation_id=1, sender_id=5, content="Weekends are usually chill for me. Want to catch up for a coffee?"),
        ]
        db.add_all(messages)
        
        db.commit()


    def reset_database(self):
        # Drop all tables and recreate them
        Base.metadata.drop_all(bind=self.engine)
        Base.metadata.create_all(bind=self.engine)
        # Repopulate tables
        self.populate_database()

# Create a singleton instance
db = Database()
