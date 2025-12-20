'use client'

import ChatRoomList from '@/app/components/chatRoomList'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r">
        <ChatRoomList />
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
