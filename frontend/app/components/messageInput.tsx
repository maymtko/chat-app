'use client'

import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
// import { sendMessage } from '@/lib/features/chat/chatSlice'
import { useChatSocket } from "@/hooks/useChatSocket";
import { addMessage, SocketEvent, TypingEvent } from '@/lib/features/chat/chatSlice';
import { Send } from 'lucide-react';

interface MessageInputProps {
  roomId: string 
  onTypingEvent?: (data: TypingEvent) => void;
}

export default function MessageInput({ roomId, onTypingEvent }: MessageInputProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [text, setText] = useState('')

  const isTypingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const { sendMessage } = useChatSocket(roomId, (msg) => {
//     dispatch(addMessage(msg));
//   });

  const onMessage = useCallback((msg: SocketEvent) => {
    if (msg.type === 'typing') {
      onTypingEvent?.(msg);
        return;
    }
    dispatch(addMessage(msg));

  }, [dispatch, onTypingEvent]);

  const { sendMessage, socket } = useChatSocket(roomId, onMessage);

  const sendTypingStatus = (isTyping : boolean) => {
    if(!socket?.current || socket?.current?.readyState !== WebSocket.OPEN) return;

    socket.current.send(JSON.stringify({
      type: 'typing',
      username: user?.display_name || `User ${user?.id?.substring(0,4) || 'Anon'}`,
      isTyping: isTyping
    }))
    isTypingRef.current = isTyping
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      sendTypingStatus(true)
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      sendTypingStatus(false)
    }, 2500)   
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); 
        submit(); 
      }
    }
  };

  const submit = () => {
    if (!text.trim()) return
    // Clear out typing indicators immediately on send
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    sendTypingStatus(false)

    sendMessage(text);
    setText('')
  }
 
  return (
    <div className="border p-2 flex items-center gap-2 border-gray-200 rounded-2xl mb-4 bg-white dark:bg-[#09090b]">
      <textarea
        className="flex-1 rounded px-2 py-1 resize-none h-8 max-h-32 text-sm leading-relaxed border-gray-200 focus:outline-none"
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <button
        onClick={submit}
        className="p-2.5 bg-blue-500 text-white flex items-center rounded-full disabled:bg-gray-300"
        disabled={text?.length===0}
      >
        <Send className='w-4 h-4'/>
      </button>
    </div>
  )
}
