'use client'
import React, { useState, useEffect } from 'react';
import { Heart, X, TriangleAlert, BadgeCheck} from 'lucide-react';
import RoommateFilter from '@/components/filterbar';
import Link from 'next/link';

const RoommateSwiper = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [roommates, setRoommates] = useState([]);

  // Check if user is logged in and registered
  useEffect(()=>{
    // Get userId from localStorage
    const storedId = localStorage.getItem('user_id');
    if (!storedId) {
      console.error('No user_id found in localStorage');
      return;
    }
    setUserId(storedId);
    const fetchUserProfile = async()=>{
      const res =  await fetch(`http://127.0.0.1:8000/api/roommate/${storedId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if(res.status === 200){
        setRegistered(true);
      }
    }
    fetchUserProfile()
  },[]);

  // Fetch roommates candidates for the logged-in user
  useEffect(() => {
    if(!userId || !registered) 
      return;

    const fetchRoommates = async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/roommates?user_id=${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch roommates');
      }
      const data = await res.json();
      console.log(data);
      setRoommates(data);
    };
    fetchRoommates();
  }, [userId, registered]);

  // Handle swipe actions
  const handleSwipe = (direction) => {
    if (isAnimating || currentIndex >= roommates.length) return;
    setIsAnimating(true);
    setSwipeDirection(direction);
    // Simulate swipe animation duration
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  // Handle matching with a roommate. This function sends a POST request to the backend to create a match
  const handleMatch = async(roommateId)=>{
    const data = await fetch(`http://127.0.0.1:8000/api/createMatch?user_id=${userId}&match_roommate_id=${roommateId}`, {
      method: 'POST'
    })
    const res = await data.json();
    if(res.message){
      console.log("Match created successfully");
    }
    else{
      console.error("Failed to create match");
    }
  }

  const currentRoommate = roommates[currentIndex];
  const vibescore = currentRoommate ? currentRoommate.vibe_score.toPrecision(2) : 0;

  if(!userId){
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100">
        <div className="p-8 rounded-xl shadow-lg max-w-sm text-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to view roommate matches. Please log in to continue.</p>
          <Link href={`/login`}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Go to Login
          </Link>
        </div>
      </div>
    );
  }
  else if(!registered){
    return (  
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100'>
        <div className='p-8 rounded-xl shadow-lg max-w-md text-center bg-white'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Complete Your Profile</h2>
        <p className='text-gray-600 mb-6'>To start swiping and finding your perfect roommate, please complete your profile registration.</p>
        <Link href={`/register?userId=${userId}`}
              className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'>
              Complete Registration
        </Link>
        </div>
      </div>
      )
  }
  else{
   return (
    <div className="h-screen bg-white flex">
      <RoommateFilter roommates={roommates} setRoommates={setRoommates} setCurrentIndex={setCurrentIndex}/>
      { currentIndex < roommates.length ? (
      <div className="max-w-md mx-auto w-[400px]">
        {/* Card Stack */}
        <div className="relative h-[600px] mb-8">
          {/* Next card (slightly visible behind) */}
          {currentIndex + 1 < roommates.length && (
            <div className="absolute inset-0 bg-white rounded-2xl shadow-lg transform scale-95 opacity-50">
              <div className="h-full bg-gradient-to-t from-gray-400 to-gray-200 rounded-2xl"></div>
            </div>
          )}

          {/* Current card */}
          <div className={`absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            swipeDirection === 'left' ? 'transform -translate-x-full rotate-12 opacity-0' :
            swipeDirection === 'right' ? 'transform translate-x-full rotate-12 opacity-0' : ''
          }`}>
            {/* Image */}
            <div className="relative h-72 overflow-hidden">
              <img 
                src={currentRoommate.image_url} 
                alt={currentRoommate.first_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Basic info overlay */}
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold">{currentRoommate.first_name} {currentRoommate.last_name}, {currentRoommate.age}</h2>
                <p className="text-lg opacity-90">{currentRoommate.occupation}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-2 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4 relative">
                {/* Verification Badge */}
                {currentRoommate.verified ? (
                  <div className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-gray-400">
                    <BadgeCheck className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 font-medium">Identity Verified</span>
                  </div>
                ) : (
                  <div className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-gray-400">
                    <span className="text-gray-700 font-medium">Unverified</span>
                  </div>
                )}

                {/* View More Link */}
                <Link
                  href={`/roommate/${currentRoommate.user_id}`}
                  className="text-green-600 px-3 py-1 font-semibold text-sm hover:underline"
                >
                  View More
                </Link>
              </div>
              
              {/* Vibe Score */}
              <div className="flex flex-col justify-center items-center">
                <h1 className='text-gray-800 p-1'>Vibe Score</h1>
                <h2 className='text-gray-500 pb-2'>A measure of how well you and this person might get along as roommates.</h2>
                <div
                  className="radial-progress bg-purple-100 text-purple-500 border-purple-100 border-8"
                  style={{ "--value": `${vibescore*10}`, "--size": "8rem", "--thickness": "1rem" } /* as React.CSSProperties */ } 
                  aria-valuenow={vibescore}
                  role="progressbar"
                >
                  {vibescore}/10
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center items-center gap-6">
          <button 
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
            className="w-14 h-14 bg-red-100 rounded-full shadow-lg flex items-center justify-center text-red-500  hover:bg-red-100 hover:scale-110 transition-all duration-300 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          
          <button 
            onClick={() => {
              handleSwipe('right')
              handleMatch(currentRoommate.user_id)
            }}
            disabled={isAnimating}
            className="w-14 h-14 bg-green-100 rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 hover:scale-110 transition-all duration-300 disabled:opacity-50"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>
      ):(
        <div className="flex flex-col items-center justify-center w-full h-full p-8">
          <TriangleAlert className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No roommates available
          </h3>
          <p className="text-gray-500 text-center max-w-xs mb-6">
            We couldn’t find any matches right now. Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
};
}

export default RoommateSwiper;