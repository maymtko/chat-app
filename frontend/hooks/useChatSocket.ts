"use client";

import { useEffect, useRef, useState } from "react";
import { SocketEvent } from "@/lib/features/chat/chatSlice";

export function useChatSocket(
  roomId: string,
  onMessage: (msg: SocketEvent) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
  onMessageRef.current = onMessage;
}, [onMessage]);

  useEffect(() => {
    if (!roomId) return;

    console.log("Creating websocket");
    let isMounted = true;

    async function connectSocket() {
      try {
        // Fetch token from Next.js server route (reads httpOnly cookie)
        const res = await fetch("/api/ws-token");
        if (!res.ok) {
          console.warn("Failed to retrieve WS auth token");
          return;
        }
        const { token } = await res.json();

    if (!isMounted) return;
    const rawBackendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // 2. Strip http:// or https:// and trailing slashes
    const cleanHost = rawBackendUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      
    const wsUrl = `${wsProtocol}//${cleanHost}/ws/rooms/${roomId}?token=${token}`;
    console.log("Connecting to WebSocket:", wsUrl);
    const ws = new WebSocket(wsUrl);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      setIsOpen(true);
    };

    ws.onmessage = (event) => {
      // onMessage(JSON.parse(event.data));
      onMessageRef.current(JSON.parse(event.data));
      console.log('message event',JSON.parse(event.data));    
    };

    ws.onclose = () => {
      setIsOpen(false);
    };
    } catch (err) {
        console.error("Error setting up WebSocket:", err);
    }
  }

  connectSocket();

  return () => {
      isMounted = false;
      if (wsRef.current) {
        console.log("Closing websocket");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [roomId]);

  const sendMessage = (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready");
      return;
    }

    wsRef.current.send(JSON.stringify({ text }));
  };

  return { 
    sendMessage, 
    isOpen, 
    socket: wsRef 
  };
}
