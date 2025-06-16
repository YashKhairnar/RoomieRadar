'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, X, Search } from "lucide-react";
import { UserRound } from 'lucide-react';
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Navbar(){
  const router = useRouter()
  const [userId, setUserId] = useState<string|null>(null)
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(()=>{
    const userId = localStorage.getItem('user_id')
    if(userId!=null){
      setUserId(userId);
    }
  },[userId])

  const handleLogout = ()=>{
    localStorage.removeItem('user_id')
    setUserId(null);
    setModalOpen(false);
    router.push('/login');
  }
  return (
    <div className="py-2 px-8 flex justify-between bg-white text-black">
      {/* logo  */}
      <div className="p-2">
        <Link href={"/"}
          className="text-2xl font-semibold">RoomieRadar</Link>
      </div>

      {/* nav items */}
      <ul className="flex text-md font-normal justify-center items-center">
        {userId ? (
          <div className="flex space-x-8 items-center">
              <li>
                <Link href={`/listing`}>
                  <Search className="inline-block mr-1" />
                </Link>
              </li>
              <li>
                <Link href={`/matches/${userId}`}>
                  <Heart className="inline-block mr-1" />
                </Link>
              </li>
              <li>
                <Link href={`/chat/${userId}`}>
                  <MessageCircle className="inline-block mr-1" />
                </Link>
              </li>
              <li>
                <button
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    <UserRound className="inline-block mr-1" />
                  </button>
              </li>
          </div>
          ):(
            pathname !== '/login' && (
                <li>
                 <Link href="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </li>
            )
          )}
      </ul>

      {/* modal for profile */}
      {modalOpen && (
        <div className="absolute right-8 top-16 z-50">
          <div className="bg-white p-4 rounded-xl shadow-lg w-64">
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500 font-medium">
                  Logout
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                >
                  <X className="inline-block text-red-600" size={18} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      </div>
  )
}