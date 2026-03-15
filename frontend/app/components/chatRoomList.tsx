'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchRooms, Room } from '@/lib/features/chat/chatSlice'
import { useParams } from 'next/navigation'
import { logout } from '@/hooks/logout'
import { clearUserlogout } from '@/lib/features/auth/authSlice'
import { useRouter } from "next/navigation";

export default function ChatRoomList() {
  const dispatch = useDispatch<AppDispatch>()
  const { rooms, loading } = useSelector(
    (state: RootState) => state.chat
  )
 const { user } = useSelector(
    (state: RootState) => state.auth
  )
  const { roomId }=useParams();
  const router = useRouter();

  useEffect(() => {
    if(user?.id){
    dispatch(fetchRooms())
    }
  }, [dispatch,user?.id])

  if (loading) return <p className="p-4">Loading...</p>

  const LogOutUser =() =>{
    logout();
    router.push("/");
    dispatch(clearUserlogout())
  }
console.log('user',user);

  return (
    <div className='h-full flex flex-col justify-between'>
    <div className="p-4 space-y-2">
      <h2 className="font-bold mb-3">Chat Rooms</h2>
      {rooms?.filter((item: Room)=>item?.members?.includes(user?.id ?? '')).map((room: Room) => (
        <Link
          key={room.id}
          href={`/chat/${room.id}`}
          className={`block p-2 rounded hover:bg-gray-300 ${roomId===room.id ? "bg-gray-300 text-black":""}`}
        >          
          {room.name}
        </Link>
      ))}
    </div>
    <div onClick={LogOutUser}
    className='p-2 text-center font-semibold bg-gray-300 hover:bg-gray-400 text-black'>Log Out</div>
    </div>
  )
}
