'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchRooms, Room } from '@/lib/features/chat/chatSlice'
import { useParams } from 'next/navigation'

export default function ChatRoomList() {
  const dispatch = useDispatch<AppDispatch>()
  const { rooms, loading } = useSelector(
    (state: RootState) => state.chat
  )
 const { user } = useSelector(
    (state: RootState) => state.auth
  )
  const { roomId }= useParams();

  useEffect(() => {
    if(user?.id){
    dispatch(fetchRooms())
    }
  }, [dispatch,user?.id])

  if (loading) {
      return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 animate-pulse">
          <div className="h-5 w-24 bg-gray-300 dark:bg-zinc-700 rounded mb-4"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-zinc-500 rounded"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-zinc-500 rounded"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-zinc-500 rounded"></div>
        </div>
      )
    }

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-2'>
      <h2 className="font-bold mb-3">Chat Rooms</h2>
      {rooms?.filter((item: Room)=>item?.members?.includes(user?.id ?? '')).map((room: Room) => (
        <Link
          key={room.id}
          href={`/chat/${room.id}`}
          className={`block p-2 rounded hover:bg-gray-100 dark:hover:text-black ${roomId===room.id ? "bg-blue-50 text-blue-600":""}`}
        >          
          {room.name}
        </Link>
      ))}
    </div>
  )
}
