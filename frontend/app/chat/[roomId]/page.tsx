'use client'

import { useParams } from 'next/navigation'
import ChatWindow from '@/app/components/chatWindow'

export default function RoomPage() {
  const { roomId } = useParams()

  return <ChatWindow roomId={roomId as string} />
}
