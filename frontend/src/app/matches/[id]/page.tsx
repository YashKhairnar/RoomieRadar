'use client'
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MatchPage() {
  const { id } = useParams();
  const [matchedRoommates, setMatchedRoommates] = useState([]);
  const router = useRouter();
  const [session_id, setSessionId] = useState<any>(null)

  //fetch the session Id
  useEffect(()=>{
    const ssid = window.__SESSION_ID__;
    setSessionId(ssid)
  },[])

  //fetch the matches for the user
  useEffect(() => {
  const fetchRoomates = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/matches/${id}`);
    if (!res.ok) {
      console.error("Fetch error: status", res.status);
      return;
    }
    const data = await res.json();
    console.log("Matched roommates data:", data);
    setMatchedRoommates(data);
  };
  fetchRoomates();
 },[id]);

 const handleChat = async(userId:any)=>{
  const convo = await fetch(`http://127.0.0.1:8000/api/create_conversation?user1=${id}&user2=${userId}&session_id=${session_id}`,{
    method: 'POST',
  })
  if(convo.ok){
    console.log("Redirecting to the chat window")
    router.push(`/chat/${id}`)
    }
  else{
    console.log("Error creating conversation")
  }
 }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Matched Roommates</h1>
      {matchedRoommates.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matchedRoommates.map((roommate:any, idx) => (
            <div key={idx} className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col">
              {/* Profile Image (Optional) */}
              {roommate.image_url && (
                <Image
                  src={roommate.image_url}
                  alt={`${roommate.first_name} ${roommate.last_name}`}
                  className="w-full h-48 object-cover"
                   width={400}
                   height={300}
                />
              )}
              {/* Details */}
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold text-gray-800">
                  {roommate.first_name} {roommate.last_name}, {roommate.age}
                </h2>
                <p className="text-gray-600 mt-1">{roommate.bio}</p>
              </div>
              {/* Action Buttons */}
              <div className="px-4 py-3 bg-gray-100 flex items-center justify-between">
                <Link href={`/roommate/${roommate.user_id}`}>
                  <button className="text-purple-600 hover:underline font-medium">View Profile</button>
                </Link>
                  <button 
                    onClick={()=>handleChat(roommate.user_id)}
                    className="flex items-center gap-1 text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md">
                    <MessageCircle className="w-5 h-5" />
                    Chat
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-gray-600 text-lg">No matched roommates found.</p>
        </div>
      )}
    </div>
  );
}