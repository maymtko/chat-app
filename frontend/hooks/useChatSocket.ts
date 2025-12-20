"use client";

import { useEffect, useRef, useState } from "react";

export function useChatSocket(
  roomId: string,
  onMessage: (msg: any) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket(
      `ws://localhost:8000/ws/rooms/${roomId}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      setIsOpen(true);
    };

    ws.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    ws.onclose = () => {
      setIsOpen(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [roomId, onMessage]);

  const sendMessage = (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready");
      return;
    }

    wsRef.current.send(JSON.stringify({ text }));
  };

  return { sendMessage, isOpen };
}
