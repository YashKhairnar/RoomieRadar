'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RoommateCard from "@/components/roommateCard";

export default function RoommateDetails() {
  const { id } = useParams();
  const [roommate, setRoommate] = useState({});

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
            <RoommateCard roommate={roommate}/>
        </div>
    )
    
}