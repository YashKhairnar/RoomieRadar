'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RoommateCard from "@/components/roommateCard";

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


export default function RoommateDetails() {
  const { id } = useParams();
  const [roommate, setRoommate] = useState<Roommate|null>(null);
  const [sessionId, setSessionId] = useState<any>(null)

  useEffect(()=>{
    const ssid = window.__SESSION_ID__;
    setSessionId(ssid)
  },[])

  useEffect(() => {
    const fetchRoommateDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/roommate/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch roommate details");
        }
        setRoommate(data);
      } catch (error) {
        console.error("Error fetching roommate details:", error);
      }
    };
    if (id) fetchRoommateDetails();
  }, [id]);


    return(
        <div className="w-full h-screen mx-auto bg-black">
             {roommate && <RoommateCard roommate={roommate} session_id={sessionId} />}
        </div>
    )
    
}