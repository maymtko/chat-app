'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [prevRoomId, setPrevRoomId] = useState<string>(roomId)

  if (roomId !== prevRoomId) {
    setPrevRoomId(roomId)
    setTypingUsers([])
  }

  useEffect(() => {  
    if (!roomId) return
    dispatch(clearMessages());
    dispatch(fetchMessages(roomId))
  }, [dispatch, roomId])

  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTo({ top: messageRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, typingUsers]);

  const handleTypingFeedback = (data: { username: string; isTyping: boolean }) => {
    setTypingUsers((prev) => {
      if (data.isTyping) {
        return prev.includes(data.username) ? prev : [...prev, data.username]
      } else {
        return prev.filter((name) => name !== data.username)
      }
    })
  }

  function getDateLabel(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString();
  }

  function formatMessageTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className='relative h-full'>
    <div
    className="absolute inset-0 bg-repeat pointer-events-none"
    style={{
      backgroundImage: "url('/images/chat-bg.png')",
      backgroundSize: "400px",
    }}
  />
    <div 
    className="relative z-20 flex flex-col h-full w-full max-w-4xl mx-auto px-4">
      {/* Messages */}
      <div ref={messageRef} className="relative z-10 h-full flex-1 overflow-y-auto hide-scrollbar p-4 space-y-2">
        {chatLoading ? (
          <div className="animate-pulse space-y-3">
            {[
              { side: 'start', nameW: 'w-16', lineWidths: ['w-40', 'w-28'] },
              { side: 'end',   nameW: null,   lineWidths: ['w-32'] },
              { side: 'start', nameW: 'w-20', lineWidths: ['w-52', 'w-36', 'w-44'] },
              { side: 'end',   nameW: null,   lineWidths: ['w-48', 'w-24'] },
              { side: 'start', nameW: 'w-14', lineWidths: ['w-36'] },
            ].map((item, i) => (
              <div key={i} className={`flex ${item.side === 'end' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 space-y-2 ${item.side === 'end' ? 'bg-blue-300 rounded-2xl rounded-br-sm' : 'bg-gray-200 rounded-2xl rounded-bl-sm'}`}>
                  {item.nameW && <div className={`h-2.5 rounded bg-gray-400 ${item.nameW}`} />}
                  {item.lineWidths.map((w, j) => (
                    <div key={j} className={`h-3 rounded ${item.side === 'end' ? 'bg-blue-200' : 'bg-gray-300'} ${w}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ):
        (
         <>
          {messages.map((msg: Message, index: number) => {
            const isCurrentUser = user?.id===msg.senderId;
              const previousMessage = messages[index - 1];
              const nextMessage = messages[index + 1];

             const showName =!previousMessage || previousMessage.senderId !== msg.senderId;
               const showDate =!previousMessage ||
              new Date(msg.createdAt).toDateString() !==
                new Date(previousMessage.createdAt).toDateString();

              const isLastInStreak = !nextMessage || nextMessage.senderId !== msg.senderId;
              const isTimeGapLarge = nextMessage && 
                (new Date(nextMessage.createdAt).getTime() - new Date(msg.createdAt).getTime() > 120000);
              
              const showTimeBlock = isLastInStreak || isTimeGapLarge;

            return(
              <div key={index} className='space-y-1'>
              {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <div className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-2">
                        {getDateLabel(msg.createdAt)}
                      </div>
                      {/* <div className="pl-1">{formatMessageTime(msg.createdAt)}</div> */}
                    </div>                   
                  )}
            <div className={`flex flex-col w-full ${isCurrentUser ? "items-end" : "items-start"}`}>
            <div className={`flex w-full ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              {isCurrentUser ? (
                <div className="max-w-[70%] px-4 py-2 bg-blue-500 text-white rounded-2xl rounded-br-sm shadow-sm">
                  <p className="text-sm leading-relaxed wrap-break-word">{msg.text}</p>
                  {/* <span className="text-xs text-gray-300 flex justify-end">{formatMessageTime(msg.createdAt)}</span> */}
                </div>
              ) : (
                <div className="max-w-[70%] px-4 py-2 bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm border border-gray-200">
                  {showName && (<p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5 whitespace-pre-wrap wrap-break-word">{msg?.name ?? msg.senderId}</p>)}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {/* <span className="text-xs text-gray-400 flex justify-end">{formatMessageTime(msg.createdAt)}</span> */}
                </div>
              )}             
            </div>   
            {showTimeBlock && (
              <span className="text-[10px] opacity-70 text-gray-400 dark:text-zinc-500 mt-1 px-1 block select-none">
                {formatMessageTime(msg.createdAt)}
              </span>
            )}
                </div>     
            </div>
          )})}
         </>
        )}
      </div>
      {/* Real-time Visual Typing Overlay Hook */}
      {typingUsers.length > 0  && (user && !typingUsers?.includes(user?.display_name)) &&  (
        <div className="px-4 py-1.5 text-xs text-gray-500 dark:text-zinc-400 italic flex items-center gap-1.5 subtle-fade-in">
          <span>
            {typingUsers.length === 1 
              ? `${typingUsers[0]} is typing` 
              : `${typingUsers.join(", ")} are typing`}
          </span>
          <span className="flex space-x-0.5 items-center pt-1">
            <span className="h-1 w-1 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-1 w-1 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-1 w-1 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
          </span>
        </div>
      )}
      <MessageInput roomId={roomId} onTypingEvent={handleTypingFeedback}/>
    </div>
    </div>
  )
}
