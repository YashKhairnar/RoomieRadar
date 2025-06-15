'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    __SESSION_ID__: string;
  }
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ userId, setUserId ] = useState<string | null>(null);

  // Initialize session on component mount
  useEffect(() => {
    if( window.__SESSION_ID__) {
      setSessionId(window.__SESSION_ID__); // Set sessionId from global window object
      console.log('Session ID already set:', window.__SESSION_ID__);
      return; // If sessionId is already set, skip initialization
    }
    const getSessionId = async()=>{
      try{
        console.log('Fetching new session ID...');
        const response = await fetch(`http://127.0.0.1:8000/_synthetic/new_session`,{
          method: 'POST',
        })
        const data = await response.json()
        const sessionId = data.session_id
        if(!sessionId){
          throw new Error('No session ID in the response');
        }
        console.log('New session ID:', sessionId);
        setSessionId(sessionId);
        window.__SESSION_ID__ = sessionId; // Store in global window object
       } 
      catch (error) {
        console.error('Error fetching session ID:', error);
        alert('Failed to initialize session. Please try again later.');
      }}
      getSessionId();
  }, []);

  // Check localStorage for user_id on component mount
  // This will only run in the browser, not during server-side rendering
  useEffect(() => {
    // Access localStorage only in the browser
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      setUserId(storedId);
      console.log('User ID from localStorage:', storedId);
    } else {
      console.log('No user_id found in localStorage');
    }
  },[sessionId]);

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Initializing session...</div>
      </div>
    );
  }

  return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
              {/* content */}
              <div className="flex flex-col items-start justify-center h-full p-8">
                <h1 className="text-7xl font-bold text-black">Find Your Perfect Roommate!</h1>
                <p className="py-4 text-2xl font-semibold text-gray-700">
                  Search, Match and Connect with 
                  <br/>Potential Roommates Effortlessly
                </p>
                <Link 
                  href={userId ? '/listing' : '/login'}>
                 <button className="btn btn-primary">Get Started</button>
                </Link>
              </div>
    
            {/* bg image */}
            <Image
               alt="Roommate Search"
               src="/13027.jpg"
               className="w-1/2 p-8"
               width={800}
               height={600}
               style={{ objectFit: "cover" }}
               priority={true}
              />
          </div>
  );
}
