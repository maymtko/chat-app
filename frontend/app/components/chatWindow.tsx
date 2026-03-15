'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchMessages, Message } from '@/lib/features/chat/chatSlice'
import MessageInput from './messageInput'
import { clearMessages } from '@/lib/features/chat/chatSlice'

export default function ChatWindow({ roomId }: { roomId: string }) {
  const dispatch = useDispatch<AppDispatch>()
  const { messages, chatLoading } = useSelector(
    (state: RootState) => state.chat
  )
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {  
    if (!roomId) return
    dispatch(clearMessages());
    dispatch(fetchMessages(roomId))
  }, [dispatch, roomId])

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatLoading ?  (
            <>
            <p>Loading...</p>
            </>
        ):
        (
         <>
            {messages.map((msg: Message, index: number) => (
            <div  key={index} className={`flex ${user?.id===msg.senderId ? "justify-end" : "justify-start"}`}>
              <div className={`text-black p-2 rounded-lg ${user?.id===msg.senderId ? "bg-green-200":"bg-gray-100"}`}>
                <div className={`mb-1 text-gray-700 `}>
                   <div className='font-semibold'>{user?.id===msg.senderId ? "" :`user ${msg.senderId}`}</div> 
                <div>{msg.text}</div>
                </div>
              </div>
              </div>

            ))}
         </>
        )}
      </div>
      <MessageInput roomId={roomId}/>
    </div>
  )
}
