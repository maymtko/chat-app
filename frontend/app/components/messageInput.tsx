'use client'

import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'
// import { sendMessage } from '@/lib/features/chat/chatSlice'
import { useChatSocket } from "@/hooks/useChatSocket";
import { addMessage } from '@/lib/features/chat/chatSlice';


export default function MessageInput({ roomId }: { roomId: string }) {
  const [text, setText] = useState('')
  const dispatch = useDispatch<AppDispatch>()
//   const { sendMessage } = useChatSocket(roomId, (msg) => {
//     dispatch(addMessage(msg));
//   });

  const onMessage = useCallback((msg: any) => {
  dispatch(addMessage(msg));
}, [dispatch]);

const { sendMessage } = useChatSocket(roomId, onMessage);

  const submit = () => {
    if (!text.trim()) return
    sendMessage(text);
    setText('')
  }
 
  return (
    <div className="border-t p-2 flex gap-2">
      <input
        className="flex-1 border rounded px-2 py-2"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        onClick={submit}
        className="px-4 bg-black text-white rounded"
      >
        Send
      </button>
    </div>
  )
}
