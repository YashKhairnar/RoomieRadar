import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const hobbiesList = [
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

const occupations = [
    "Student",
    "Teacher",
    "Software Engineer",
    "Nurse",
    "Doctor",
    "Retail Salesperson",
    "Construction Worker",
    "Electrician",
    "Driver (Truck/Taxi/Delivery)",
    "Farmer",
    "Customer Service Representative",
    "Accountant",
    "Marketing Specialist",
    "Administrative Assistant",
    "Police Officer",
    "Chef/Cook",
    "Waiter/Waitress",
    "Mechanic",
    "Warehouse Worker",
    "Data Analyst",
    "Financial Analyst"
]

export default function RegisterFormWithParams() {
  const params = useSearchParams();
  const userId = params.get('userId')
  const router = useRouter();
  const [form, setForm] = useState<{
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  occupation: string;
  bio: string;
  preferred_location: string;
  preferred_room_type: string;
  hobbies: string[];
  pets_allowed: boolean;
  smoking_allowed: boolean;
  drinking_allowed: boolean;
  sleepSchedule: string;
  cookingFrequency: string;
  cleanlinessLevel: number;
  noiseTolerance: number;
  socialInteraction: number;
  move_in_date: string ;
  move_out_date: string;
  budget_min: number;
  budget_max: number;
  verified: boolean;
  image_url: string | null;
}>({
    first_name: '',
    last_name: '',
    gender: '',
    age: 18,
    occupation: '',
    bio: '',
    preferred_location: '',
    preferred_room_type: '',
    hobbies: [],
    pets_allowed: false,
    smoking_allowed: false,
    drinking_allowed: false,
    sleepSchedule: '',
    cookingFrequency: '',
    cleanlinessLevel: 3,
    noiseTolerance: 3,
    socialInteraction: 3,
    move_in_date: '',
    move_out_date: '',
    budget_min: 1000,
    budget_max: 2000,
    verified: false,
    image_url: null,
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.currentTarget;
    const checked =
      type === 'checkbox' && 'checked' in e.currentTarget
        ? (e.currentTarget as HTMLInputElement).checked
        : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/register?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Acess-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(form),
    }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      }
      )
      .then((data) => {
        console.log('Profile successfully submitted:', data.userId);
        router.push(`/`); // Redirect to listing page
      }
      )
      .catch((error) => {
        console.error('Error submitting profile:', error);
        alert('Failed to submit profile. Please try again.');
      }
      );
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100'>

    <div className="w-1/2 mx-auto p-6 bg-white text-black shadow-lg m-1 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Your Profile Details</h2>
      <p className="mb-6 text-gray-700">Please fill out your profile details to help us find the best roommate match for you.</p>
    
      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Basic Info Section */}
        <fieldset className="col-span-full border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-800 mb-4 px-2">Basic Information</legend>

          <label className="block text-sm text-gray-700 mb-1" htmlFor="first_name">First Name</label>
          <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} className="input mb-4" required />

          <label className="block text-sm text-gray-700 mb-1" htmlFor="last_name">Last Name</label>
          <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} className="input mb-4" required />


          <label className="block text-sm text-gray-700 mb-1" htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="input mb-4" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label className="block text-sm text-gray-700 mb-1" htmlFor="age">Age</label>
          <input id="age" name="age" type="number" value={form.age} onChange={handleChange} className="input mb-4" required />

          <label htmlFor="occupation" className="block text-sm text-gray-700 mb-1">Occupation</label>
          <select
            id="occupation"
            name="occupation"
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select an occupation</option>
            {occupations.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-700 mb-1" htmlFor="preferred_location">Preferred Location</label>
          <input id="preferred_location" name="preferred_location" placeholder="Preferred Location" value={form.preferred_location} onChange={handleChange} className="input mb-4" required />

          <label className="block text-sm text-gray-700 mb-1" htmlFor="preferred_room_type">Preferred Room Type</label>
          <select id="preferred_room_type" name="preferred_room_type" value={form.preferred_room_type} onChange={handleChange} className="input mb-4">
            <option value="">Select</option>
            <option value="Private Room">Private Room</option>
            <option value="Shared Room">Shared Room</option>
          </select>

         <label className="block text-sm text-gray-700 mb-1">Select Your Hobbies</label>
         <div className="flex flex-wrap gap-2 mb-4">
            {hobbiesList.map((hobby) => (
              <button
                key={hobby}
                type="button"
                onClick={() => {
                  setForm((prev) => {
                    const selected = new Set(prev.hobbies);
                    selected.has(hobby) ? selected.delete(hobby) : selected.add(hobby);
                    return { ...prev, hobbies: Array.from(selected) };
                  });
                }}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  form.hobbies.includes(hobby)
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {hobby}
              </button>
            ))}
          </div>

          <label className="block text-sm text-gray-700 mb-1" htmlFor="bio">Short Bio</label>
          <textarea id="bio" name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} className="input md:col-span-2 mb-4" />
        </fieldset>

        {/* Preferences Section */}
        <fieldset className="col-span-full border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-800 mb-4 px-2">Lifestyle Preferences</legend>

          <label className="block text-sm text-gray-700 mb-1" htmlFor="sleepSchedule">Sleep Schedule</label>
          <select id="sleepSchedule" name="sleepSchedule" value={form.sleepSchedule} onChange={handleChange} className="input mb-4">
            <option value="">Select</option>
            <option value="Night Owl">Night Owl</option>
            <option value="Early Bird">Early Bird</option>
            <option value="Flexible">Flexible</option>
          </select>

          <label className="block text-sm text-gray-700 mb-1" htmlFor="cookingFrequency">Cooking Frequency</label>
          <select id="cookingFrequency" name="cookingFrequency" value={form.cookingFrequency} onChange={handleChange} className="input mb-4">
            <option value="">Select</option>
            <option value="Rarely">Rarely</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
            <option value="Never">Never</option>
          </select>
        </fieldset>

        {/* Budget and Dates Section */}
        <fieldset className="col-span-full border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-800 mb-4 px-2">Budget & Move Dates</legend>

          <label className="block text-sm text-gray-700 mb-1" htmlFor="move_in_date">Move-In Date</label>
          <input id="move_in_date" name="move_in_date" type="date" value={form.move_in_date} onChange={handleChange} className="input mb-4" required />

          <label className="block text-sm text-gray-700 mb-1" htmlFor="move_out_date">Move-Out Date</label>
          <input id="move_out_date" name="move_out_date" type="date" value={form.move_out_date} onChange={handleChange} className="input mb-4" />

          <label className="block text-sm text-gray-700 mb-1" htmlFor="budget_min">Minimum Budget ($)</label>
          <input id="budget_min" name="budget_min" type="number" value={form.budget_min} onChange={handleChange} className="input mb-4" required />

          <label className="block text-sm text-gray-700 mb-1" htmlFor="budget_max">Maximum Budget ($)</label>
          <input id="budget_max" name="budget_max" type="number" value={form.budget_max} onChange={handleChange} className="input mb-4" required />
        </fieldset>

        {/* Other Preferences Checkboxes */}
        <fieldset className="col-span-full border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-800 mb-4 px-2">Other Preferences</legend>

          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="pets_allowed" checked={form.pets_allowed} onChange={handleChange} />
            Pets Allowed
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="smoking_allowed" checked={form.smoking_allowed} onChange={handleChange} />
            Smoking Allowed
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="drinking_allowed" checked={form.drinking_allowed} onChange={handleChange} />
            Drinking Allowed
          </label>
        </fieldset>

        {/* Ratings Section */}
        <fieldset className="col-span-full border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-800 mb-4 px-2">Rate Your Preferences (1 - 5)</legend>

          {/* Cleanliness */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Cleanliness</span>
              <span>{form.cleanlinessLevel}/5</span>
            </div>
            <input
              name="cleanlinessLevel"
              type="range"
              min="1"
              max="5"
              value={form.cleanlinessLevel}
              onChange={handleChange}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Noise Tolerance */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Noise Tolerance</span>
              <span>{form.noiseTolerance}/5</span>
            </div>
            <input
              name="noiseTolerance"
              type="range"
              min="1"
              max="5"
              value={form.noiseTolerance}
              onChange={handleChange}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Social Interaction */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Social Interaction</span>
              <span>{form.socialInteraction}/5</span>
            </div>
            <input
              name="socialInteraction"
              type="range"
              min="1"
              max="5"
              value={form.socialInteraction}
              onChange={handleChange}
              className="w-full accent-purple-600"
            />
          </div>
        </fieldset>

        {/* Profile Image URL */}
        <fieldset className="col-span-full border border-gray-300 rounded p-4 mb-6">
          <legend className="text-lg font-semibold text-gray-800 mb-4 px-2">Profile Image</legend>
          <label className="block text-sm text-gray-700 mb-1" htmlFor="image_url">Profile Image URL</label>
          <input id="image_url" name="image_url" type="url" placeholder="Image URL"  onChange={handleChange} className="input" />
        </fieldset>

        <button type="submit" className="col-span-full mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
          Submit Profile
        </button>
      </form>

      <style jsx>{`
        .input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          width: 100%;
        }
      `}</style>
    </div>
 </div>
  );
}
