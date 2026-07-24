'use client'

import ChatRoomList from '@/app/components/chatRoomList'
import { SidebarFooter } from '../components/sideBarFooter'
import { useState } from 'react';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
      {/* <aside className="w-64 flex flex-col border-r border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-slate-900 overflow-hidden"> */}
        <div className="flex-1 overflow-y-auto" onClick={() => setIsSidebarOpen(false)}>
        <ChatRoomList />
        </div>
        <SidebarFooter/>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative"> 
      {/*Top Floating Mobile Menu Button*/}
        <div className="lg:hidden absolute top-4 left-4 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 shadow-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="flex-1 h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
