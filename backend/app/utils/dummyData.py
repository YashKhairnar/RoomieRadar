from datetime import datetime, timedelta

fake_users = [
    {
        "id": 1,
        "email": "alex.morgan@example.com",
        "password_hash":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        "is_active": True
    },
    {
        "id": 2,
        "email": "priya.sharma@example.com",
        "password_hash": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        "is_active": True
    },
    {
        "id": 3,
        "email": "daniel.kim@example.com",
        "password_hash":"5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        "is_active": True
    },
    {
        "id": 4,
        "email": "fatima.ali@example.com",
        "password_hash": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        "is_active": True
    },
    {
        "id": 5,
        "email": "yashkvk7@gmail.com",
        "password_hash": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        "is_active": True
    }
]

fake_roommate_profiles = [
    {
        "user_id": 1,
        "first_name": "Alex",
        "last_name": "Morgan",
        "gender": "Male",
        "age": 25,
        "occupation": "Software Engineer",
        "bio": "Tech enthusiast who enjoys hiking and cooking on weekends.",
        "preferred_location": "San Jose, CA",
        "preferred_room_type": "Private Room",  # e.g., "Private Room", "Shared Room"
        "hobbies": "Hiking,Cooking",
        "pets_allowed": True,
        "smoking_allowed": False,
        "drinking_allowed": True,
        "sleepSchedule": "Early Bird",  # e.g., "Night Owl", "Early Bird"
        "cookingFrequency": "Daily",  # e.g., "Daily", "Weekly", "Rarely"
        "cleanlinessLevel": 5,  # e.g., "Very Clean", "Moderately Clean", "Not Clean"
        "noiseTolerance": 2, # e.g., "Very Tolerant", "Moderately Tolerant", "Not Tolerant"
        "socialInteraction": 3,
        "move_in_date": datetime.now(),
        "move_out_date": datetime.now() + timedelta(days=365),
        "budget_min": 900,
        "budget_max": 1300,
        "verified": True,
        "image_url": 'https://xsgames.co/randomusers/assets/avatars/male/60.jpg'
    },
    {
        "user_id": 2,
        "first_name": "Priya",
        "last_name": "Sharma",
        "gender": "Female",
        "age": 23,
        "occupation": "Teacher",
        "bio": "Quiet and organized student at SJSU. Looking for a focused and respectful roommate.",
        "preferred_location": "Downtown San Jose",
        "preferred_room_type": "Shared Room",
        "hobbies": "Reading,Yoga,Drawing/Painting",
        "pets_allowed": False,
        "smoking_allowed": False,
        "drinking_allowed": False,
        "sleepSchedule": "Early Bird" , # e.g., "Night Owl", "Early Bird"
        "cookingFrequency": "Daily",  # e.g., "Daily", "Weekly", "Rarely"
        "cleanlinessLevel": 5,  # e.g., "Very Clean", "Moderately Clean", "Not Clean"
        "noiseTolerance": 2 ,# e.g., "Very Tolerant", "Moderately Tolerant", "Not Tolerant"
        "socialInteraction": 3,
        "move_in_date": datetime.now() + timedelta(days=15),
        "move_out_date": None,
        "budget_min": 600,
        "budget_max": 1000,
        "verified": False,
        "image_url": 'https://xsgames.co/randomusers/assets/avatars/female/60.jpg'
    },
    {
        "user_id": 3,
        "first_name": "Daniel",
        "last_name": "Kim",
        "gender": "Male",
        "age": 28,
        "occupation": "Doctor",
        "bio": "Creative, chill, and clean. Prefer quiet weekday nights.",
        "preferred_location": "West San Jose",
        "preferred_room_type": "Private Room",
        "hobbies": "Photography,Traveling,Drawing/Painting",
        "pets_allowed": True,
        "smoking_allowed": False,
        "drinking_allowed": True,
        "sleepSchedule": "Early Bird",  # e.g., "Night Owl", "Early Bird"
        "cookingFrequency": "Daily",  # e.g., "Daily", "Weekly", "Rarely"
        "cleanlinessLevel": 5,  # e.g., "Very Clean", "Moderately Clean", "Not Clean"
        "noiseTolerance": 2, # e.g., "Very Tolerant", "Moderately Tolerant", "Not Tolerant"
        "socialInteraction": 3,
        "move_in_date": datetime.now(),
        "move_out_date": None,
        "budget_min": 1000,
        "budget_max": 1600,
        "verified": True,
        "image_url": 'https://xsgames.co/randomusers/assets/avatars/male/61.jpg'
    },
    {
        "user_id": 4,
        "first_name": "Fatima",
        "last_name": "Ali",
        "gender": "Female",
        "age": 26,
        "occupation": "Nurse",
        "bio": "Responsible and friendly. I value a clean shared space.",
        "preferred_location": "San Jose State Area",
        "preferred_room_type": "Shared Room",
        "hobbies": "Gardening,Volunteering,Listening to Music",
        "pets_allowed": False,
        "smoking_allowed": False,
        "drinking_allowed": False,
        "sleepSchedule": "Early Bird",  # e.g., "Night Owl", "Early Bird"
        "cookingFrequency": "Daily",  # e.g., "Daily", "Weekly", "Rarely"
        "cleanlinessLevel": 5,  # e.g., "Very Clean", "Moderately Clean", "Not Clean"
        "noiseTolerance": 2, # e.g., "Very Tolerant", "Moderately Tolerant", "Not Tolerant"
        "socialInteraction": 3,
        "move_in_date": datetime.now() + timedelta(days=5),
        "move_out_date": datetime.now() + timedelta(days=200),
        "budget_min": 800,
        "budget_max": 1200,
        "verified": False,
        "image_url": 'https://xsgames.co/randomusers/assets/avatars/female/62.jpg'
    },
    {
        "user_id": 5,
        "first_name": "Raj",
        "last_name": "Patel",
        "gender": "Male",
        "age": 24,
        "occupation": "Data Analyst",
        "bio": "Early riser, gym goer, focused on career but always up for a coffee chat.",
        "preferred_location": "North San Jose",
        "preferred_room_type": "Private Room",
        "hobbies": "Fitness/Working Out,Watching Movies,Reading",
        "pets_allowed": False,
        "smoking_allowed": False,
        "drinking_allowed": True,
        "sleepSchedule": "Early Bird" , # e.g., "Night Owl", "Early Bird"
        "cookingFrequency": "Daily" , # e.g., "Daily", "Weekly", "Rarely"
        "cleanlinessLevel": 5 , # e.g., "Very Clean", "Moderately Clean", "Not Clean"
        "noiseTolerance": 2 ,# e.g., "Very Tolerant", "Moderately Tolerant", "Not Tolerant"
        "socialInteraction": 3,
        "move_in_date": datetime.now(),
        "move_out_date": datetime.now() + timedelta(days=300),
        "budget_min": 1000,
        "budget_max": 1500,
        "verified": True,
        "image_url": 'https://xsgames.co/randomusers/assets/avatars/male/63.jpg'
    }
]
