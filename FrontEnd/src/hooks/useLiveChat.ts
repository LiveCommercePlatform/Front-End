import { apiFetch } from "@/lib/api";
import { tokenStore } from "@/lib/token";
import { useEffect, useRef, useState, useCallback } from "react";

type ChatMessage = {
  id: string;
  userId: string;
  text: string;
  ts: number;
  pending?: boolean;
  clientId?: string;
};

type Status = "connecting" | "open" | "closed";

export const useLiveChat = (roomId: string, currentUserId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>("connecting");
  const [connectionError, setConnectionError] = useState<string | null>(null);
const refreshingCookieRef = useRef(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSend = useRef(0);
  const shouldReconnect = useRef(true);
  const cookieInitializedRef = useRef(false);
  const messageIds = useRef<Set<string>>(new Set());
  const sendQueue = useRef<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);


  const loadHistory = useCallback(async () => {
    try {
      const res = await apiFetch(`/live-rooms/${roomId}/chat/history?limit=50`);
      const data = await res.json();

      const normalized: ChatMessage[] = data.items
        .map((ev: any) => ({
          id: ev.data.id,
          userId: ev.data.user_id,
          text: ev.data.text,
          ts: ev.data.ts,
        }))
        .reverse();

      normalized.forEach((m) => messageIds.current.add(m.id));

      setMessages(normalized.slice(-200));
    } catch (err) {
      console.error("history error", err);
    }
  }, [roomId]);

  const setupCookie = async () => {
    const token = tokenStore.getAccess();
    await fetch("http://localhost:8080/auth/ws-cookie", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  };

  const flushQueue = () => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    while (sendQueue.current.length > 0) {
      const msg = sendQueue.current.shift();
      if (msg) ws.send(msg);
    }
  };

  const scheduleReconnect = () => {
    if (!shouldReconnect.current) return;

    reconnectTimer.current = setTimeout(() => {
      connect();
    }, 3000);
  };

  const connect = useCallback(async () => {
    if (!roomId) return;

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setStatus("connecting");

    try {
      if (!cookieInitializedRef.current) {
        cookieInitializedRef.current = true;
        await setupCookie();
      }

      const ws = new WebSocket(
        `ws://localhost:8080/ws/live-rooms/${roomId}/chat`,
        ["access-token"],
      );

      socketRef.current = ws;

      ws.onopen = () => {
        setStatus("open");
        flushQueue();
      };

      ws.onclose = async (event) => {
  setStatus("closed");

  if (event.code === 4401) {
    if (refreshingCookieRef.current) return;

    try {
      refreshingCookieRef.current = true;
      await setupCookie();
      scheduleReconnect();
    } catch (err) {
      console.error("cookie refresh failed", err);
      setConnectionError("Authentication refresh failed");
    } finally {
      refreshingCookieRef.current = false;
    }
    return;
  }
  scheduleReconnect();
};


      ws.onerror = () => {
        setConnectionError("WebSocket error");
        ws.close();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type !== "chat.message") return;

        const msgId = data.data.id;
        const text = data.data.text;
        const ts = data.data.ts;
        const userId = data.data.user_id;

        setMessages((prev) => {
          if (prev.some((m) => m.id === msgId)) return prev;

          const pendingIndex = prev.findIndex(
            (m) =>
              m.pending &&
              m.userId === currentUserId &&
              userId === currentUserId &&
              m.text === text,
          );

          if (pendingIndex !== -1) {
            const newMessages = [...prev];

            newMessages[pendingIndex] = {
              id: msgId,
              userId,
              text,
              ts,
              pending: false,
            };

            messageIds.current.add(msgId);

            return newMessages;
          }

          messageIds.current.add(msgId);

          return [
            ...prev,
            {
              id: msgId,
              userId,
              text,
              ts,
            },
          ].slice(-200);
        });
      };
    } catch (err) {
      console.error("ws connect error", err);
      scheduleReconnect();
    }
  }, [roomId, currentUserId]);

  useEffect(() => {
    shouldReconnect.current = true;

    const init = async () => {
      setMessages([]);
      messageIds.current.clear();
      sendQueue.current = [];

      await loadHistory();
      await connect();
    };

    init();

    return () => {
      shouldReconnect.current = false;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [roomId, connect, loadHistory]);

  const sendMessage = (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    if (Date.now() - lastSend.current < 400) return;
    lastSend.current = Date.now();

    const clientId = "tmp-" + crypto.randomUUID();

    const payload = JSON.stringify({
      type: "chat.send",
      text: clean,
      client_msg_id: clientId,
    });

    const msg: ChatMessage = {
      id: clientId,
      clientId,
      userId: currentUserId,
      text: clean,
      ts: Date.now(),
      pending: true,
    };

    setMessages((prev) => [...prev, msg].slice(-200));

    const ws = socketRef.current;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    } else {
      sendQueue.current.push(payload);
    }
  };

  const sendPending = messages.filter((m) => m.pending).length;

  return {
    messages,
    sendMessage,
    status,
    bottomRef,
    currentUserId,
    connectionError,
    sendPending,
  };
};
