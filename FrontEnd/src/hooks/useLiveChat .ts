import { tokenStore } from "@/lib/token";
import { useEffect, useRef, useState, useCallback } from "react";

type ChatMessage = {
  id: string;
  userId: string;
  text: string;
  ts: number;
  pending?: boolean;
};

type Status = "connecting" | "open" | "closed";

export const useLiveChat = (roomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>("connecting");

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const messageIds = useRef<Set<string>>(new Set());
  const lastSend = useRef<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  // -------------------
  // Load History
  // -------------------

  const loadHistory = async () => {
    try {
      const token = tokenStore.getAccess();

      const res = await fetch(
        `/live-rooms/${roomId}/chat/history?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const normalized = data.items
        .map((ev: any) => ({
          id: ev.data.id,
          userId: ev.data.user_id,
          text: ev.data.text,
          ts: ev.data.ts,
        }))
        .reverse();

      normalized.forEach((m: ChatMessage) => messageIds.current.add(m.id));

      setMessages(normalized);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------
  // Connect Socket
  // -------------------

  const connect = useCallback(() => {
    if (!roomId) return;

    const token = tokenStore.getAccess();

    setStatus("connecting");

    const ws = new WebSocket(
      `wss://your-domain/ws/live-rooms/${roomId}/chat?token=${token}`
    );

    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
    };

    ws.onclose = () => {
      setStatus("closed");

      reconnectTimer.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat.message") {
        const msgId = data.data.id;

        if (messageIds.current.has(msgId)) return;

        messageIds.current.add(msgId);

        setMessages((prev) => [
          ...prev,
          {
            id: msgId,
            userId: data.data.user_id,
            text: data.data.text,
            ts: data.data.ts,
          },
        ]);

        scrollToBottom();
      }

      if (data.type === "chat.ack") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.client_msg_id
              ? { ...m, id: data.id, pending: false }
              : m
          )
        );

        messageIds.current.add(data.id);
      }
    };
  }, [roomId]);

  // -------------------
  // Effects
  // -------------------

  useEffect(() => {
    loadHistory();
    connect();

    return () => {
      socketRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [roomId, connect]);

  // -------------------
  // Send Message
  // -------------------

  const sendMessage = (text: string) => {
    const ws = socketRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    // simple rate limit
    if (Date.now() - lastSend.current < 400) return;

    lastSend.current = Date.now();

    const tempId = "tmp-" + Date.now();

    const msg: ChatMessage = {
      id: tempId,
      userId: "me",
      text,
      ts: Date.now(),
      pending: true,
    };

    messageIds.current.add(tempId);

    setMessages((prev) => [...prev, msg]);

    scrollToBottom();

    ws.send(
      JSON.stringify({
        type: "chat.send",
        text,
        client_msg_id: tempId,
      })
    );
  };

  return {
    messages,
    sendMessage,
    status,
    bottomRef,
  };
};
