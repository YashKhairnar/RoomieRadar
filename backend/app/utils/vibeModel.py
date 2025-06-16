from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# we use these properties to calculate the vibe score
# "gender": "Male", # male, female, other
# "age": 25,          
# "occupation": "Software Engineer",  
# "hobbies": "Hiking,Cooking,Coding", # Comma-separated list of hobbies
# "pets_allowed": True,
# "smoking_allowed": False,
# "drinking_allowed": True,
# "sleepSchedule": "Early Bird",  # e.g., "Night Owl", "Early Bird"
# "cookingFrequency": "Daily",  # e.g., "Daily", "Weekly", "Rarely"
# "cleanlinessLevel": 5,  # e.g., "Very Clean", "Moderately Clean", "Not Clean"
# "noiseTolerance": 2, # e.g., "Very Tolerant", "Moderately Tolerant", "Not Tolerant"
# "socialInteraction": 3

# multiple selection
hobbies = [
    "Reading",
    "Traveling",
    "Cooking",
    "Gardening",
    "Listening to Music",
    "Watching Movies",
    "Fitness/Working Out",
    "Photography",
    "Drawing/Painting",
    "Dancing",
    "Hiking",
    "Fishing",
    "Playing Sports",
    "Gaming",
    "Writing",
    "Yoga",
    "Crafting/DIY",
    "Meditation",
    "Learning Languages",
    "Volunteering"
]

#can be single only
occupations = {
    "Student": 1,
    "Teacher": 2,
    "Software Engineer": 3,
    "Nurse": 4,
    "Doctor": 5,
    "Retail Salesperson": 6,
    "Construction Worker": 7,
    "Electrician": 8,
    "Driver (Truck/Taxi/Delivery)": 9,
    "Farmer": 10,
    "Customer Service Representative": 11,
    "Accountant": 12,
    "Marketing Specialist": 13,
    "Administrative Assistant": 14,
    "Police Officer": 15,
    "Chef/Cook": 16,
    "Waiter/Waitress": 17,
    "Mechanic": 18,
    "Warehouse Worker": 19,
    "Data Analyst": 20,
    "Financial Analyst": 21
}

# sleeping schedule
sleep_schedules = {
    "Night Owl": 1,
    "Early Bird": 2,
    "Flexible": 3
}
# cooking frequency
cooking_frequencies = {
    "Daily": 1,
    "Weekly": 2,
    "Rarely": 3,
    "Never": 4
}

gender_values = {   
    "Male": 1,
    "Female": 2,
    "Other": 3
}

room_types = {
    "Private Room": 1,
    "Shared Room": 2,
}


def cal_normal_hobbie_score(hobbies):
    hobbies = hobbies.split(",")
    "calculate normalised hobby score"
    score = 0
    for hobby in hobbies:
        if hobby in hobbies:
            score += 1
    return score if hobbies else 0

def convert_to_vector(profile):
    # print("Converting profile to vector:", profile)
    h_score = cal_normal_hobbie_score(profile['hobbies'])
    gender = profile['gender']
    occupation = profile['occupation']
    sleep = profile['sleepSchedule']
    cooking = profile['cookingFrequency']
    room = profile['preferred_room_type']
    vector = []

    vector.append(profile['age'] / 100)  # Normalize age to [0, 1]
    vector.append(gender_values[gender])
    vector.append(room_types[room])  # Convert room type to binary (1 for Private, 2 for Shared)
    vector.append(profile['cleanlinessLevel'] / 5)  # Normalize cleanliness level to [0, 1]
    vector.append(profile['noiseTolerance'] / 5)  # Normalize noise tolerance to [0, 1]
    vector.append(profile['socialInteraction'] / 5)  # Normalize social interaction to [0, 1]
    vector.append(sleep_schedules[sleep])  # Normalize sleep schedule to [0, 1]
    vector.append(cooking_frequencies[cooking])  # Normalize cooking frequency to [0, 1]
    vector.append(profile['pets_allowed'])  # Convert boolean to int (True=1, False=0)
    vector.append(profile['smoking_allowed'])  # Convert boolean to int (True=1, False=0)
    vector.append(profile['drinking_allowed'])  # Convert boolean to int (True=1, False=0)
    vector.append(h_score)  # Normalized hobby score
    vector.append(occupations[occupation])  # Convert occupation to binary (1 if in list, else 0)
    return np.array(vector).reshape(1, -1)

def calculate_similarity_score(profile1, profile2):
    """
    Calculate cosine similarity score between two profiles.
    """
    vector1 = convert_to_vector(profile1)
    vector2 = convert_to_vector(profile2)
    # Calculate cosine similarity
    similarity = cosine_similarity(vector1, vector2)[0][0]
    #convert to python float
    similarity = float(similarity)
    return similarity*10


# Example usage:
# profile1 =  {'user_id': 5, 'first_name': 'Raj', 'last_name': 'Patel', 'gender': 'Male', 'age': 24, 'occupation': 'Data Analyst', 'bio': 'Early riser, gym goer, focused on career but always up for a coffee chat.', 'preferred_location': 'North San Jose', 'preferred_room_type': 'Single', 'hobbies': 'Fitness,Movies,Reading', 'pets_allowed': False, 'smoking_allowed': False, 'drinking_allowed': True, 'sleepSchedule': 'Early Bird', 'cookingFrequency': 'Daily', 'cleanlinessLevel': 5, 'noiseTolerance': 2, 'socialInteraction': 3, 'move_in_date': datetime.date(2025, 6, 14), 'move_out_date': datetime.date(2026, 4, 10), 'budget_min': 1000, 'budget_max': 1500, 'verified': True, 'image_url': 'https://xsgames.co/randomusers/assets/avatars/male/60.jpg', 'created_at': datetime.datetime(2025, 6, 13, 21, 9, 44), 'updated_at': None}
# print("Profile 1 Vector:", convert_to_vector(profile1))