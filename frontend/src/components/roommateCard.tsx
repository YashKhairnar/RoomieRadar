import Image from "next/image";
import { BadgeCheck, Bed, Calendar, ChevronLeft, DollarSign, MapPin } from "lucide-react";
import {
  Book,
  Plane,
  UtensilsCrossed,
  Sprout,
  Music,
  Clapperboard,
  Dumbbell,
  Camera,
  Paintbrush,
  Mountain,
  Fish,
  Volleyball,
  Gamepad2,
  Pencil,
  StretchHorizontal,
  Hammer,
  Brain,
  HandHeart,
  Star
} from 'lucide-react';
import React from "react";

type Roommate = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  occupation: string;
  bio: string;
  preferred_location: string;
  preferred_room_type: string;
  hobbies: string;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  drinking_allowed: boolean;
  sleepSchedule: string;
  cookingFrequency: string;
  cleanlinessLevel: number;
  noiseTolerance: number;
  socialInteraction: number;
  move_in_date: string;
  move_out_date?: string;
  budget_min: number;
  budget_max: number;
  verified: boolean;
  image_url: string;
  vibe_score: number;
};

export default function RoommateCard({ roommate , session_id}: { roommate: Roommate, session_id:any }) {
  // Sample roommate data
  const getInterestIcon = (interest:string) => {
    const icons : Record<string, React.ElementType> = {
      reading: Book,
      traveling: Plane,
      cooking: UtensilsCrossed,
      gardening: Sprout,
      listeningtomusic: Music,
      watchingmovies: Clapperboard,
      fitness: Dumbbell,
      photography: Camera,
      drawing: Paintbrush,
      painting: Paintbrush,
      dancing: Star,
      hiking: Mountain,
      fishing: Fish,
      playingsports: Volleyball,
      gaming: Gamepad2,
      writing: Pencil,
      yoga: StretchHorizontal,
      crafting: Hammer,
      meditation: Brain,
      volunteering: HandHeart,
    };
    return icons[interest] || Star;
  };

  const logGoBack = async()=>{
    const res = await fetch(`http://127.0.0.1:8000/_synthetic/log_event?session_id=${session_id}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "actionType" : 'go_back',
          'payload':{
              "text": "Going back to previous page",
              "page_url" : `${window.location.href}` 
            }
     })
    })
  }
  return (
    <div className="bg-gray-100 p-6 md:p-8 h-full">
      <div className="flex flex-col space-y-2 justify-start p-8 w-2/3 mx-auto rounded-lg shadow-lg bg-white">
        <ChevronLeft className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => {window.history.back(), logGoBack()}} />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Image
              src={roommate.image_url || "https://picsum.photos/200"}
              width={64}
              height={64}
              alt={`${roommate.first_name || "User"}'s profile picture`}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-black">Hi, I&apos;m {roommate.first_name}</h1>
              {roommate.verified && (
              <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-2 py-1 text-sm bg-gray-100">
                 <BadgeCheck className="w-5 h-5 text-green-600" />
               <span className="text-gray-700 font-medium">Identity Verified</span>
              </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-md font-semibold">
            {roommate.age} · {roommate.gender}
          </p>
        </div>

        {/* Introduction */}
        <div className="mt-6">
          <h2 className="text-md font-semibold text-gray-500 mb-1">INTRODUCTION</h2>
          <p className="text-black text-md whitespace-pre-line">
            {roommate.bio || "No bio provided."}
          </p>
        </div>

        {/* Location and Rent */}
        <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{roommate.preferred_location}</span>
        </div>
        {/* Budget */}
        <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            Budget : 
            <span className="font-semibold">{roommate.budget_min} - </span>
            <span className="font-semibold">{roommate.budget_max}</span>
        </div>
        {/* Move-in date */}
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Move-in date: {roommate.move_in_date}</span>
        </div>
        {/* Roommate type */}
        <div className='flex items-center gap-2 text-gray-600'>
            <Bed className="w-4 h-4"/>
            <span className="text-gray-600">{roommate.preferred_room_type}</span>
        </div>

        {/* Preferences */}
        <div className="bg-gray-200 rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {roommate.sleepSchedule && (
              <div>
                <span className="font-medium text-gray-500">Sleep Schedule:</span>{" "}
                {roommate.sleepSchedule}
              </div>
            )}
            {roommate.cookingFrequency && (
              <div>
                <span className="font-medium text-gray-500">Cooking Frequency:</span>{" "}
                {roommate.cookingFrequency}
              </div>
            )}
            {roommate.preferred_location && (
              <div>
                <span className="font-medium text-gray-500">Preferred Location:</span>{" "}
                {roommate.preferred_location}
              </div>
            )}
            {roommate.noiseTolerance && (
              <div>
                <span className="font-medium text-gray-500">Noise Tolerance:</span>{" "}
                {roommate.noiseTolerance}/5
              </div>
            )}
            {roommate.cleanlinessLevel && (
              <div>
                <span className="font-medium text-gray-500">Cleanliness Level:</span>{" "}
                {roommate.cleanlinessLevel}/5
              </div>
            )}
            {roommate.pets_allowed && (
              <div>
                <span className="font-medium text-gray-500">Pets Allowed:</span>{" "}
                {roommate.pets_allowed ? "Yes" : "No"}  
                </div>
            )}
            {roommate.smoking_allowed && (
              <div>
                <span className="font-medium text-gray-500">Smoking Allowed:</span>{" "}
                {roommate.smoking_allowed ? "Yes" : "No"}   
                </div>
            )}
            {roommate.drinking_allowed && (
              <div>
                <span className="font-medium text-gray-500">Drinking Allowed:</span>{" "}
                {roommate.drinking_allowed ? "Yes" : "No"}    
                </div>
            )}
          </div>
        </div>

        {/* Interests */}
        {roommate.hobbies && typeof roommate.hobbies === 'string' && (
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Interests</p>
            <div className="flex flex-wrap gap-2 text-blue-500">
              {roommate.hobbies.split(',').map((interest, index) => {
                const hobby = interest.trim().toLowerCase();
                return (
                  <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                    {React.createElement(getInterestIcon(hobby), { className: 'w-4 h-4' })}
                    <span>{interest.trim()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}