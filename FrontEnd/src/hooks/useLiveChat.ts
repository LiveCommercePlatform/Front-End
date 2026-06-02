"use client";

import { apiFetch } from "@/lib/api";
import { tokenStore } from "@/lib/token";
import { useEffect, useRef, useState, useCallback } from "react";

type ChatMessage = {
  id: string;
  userId: string;
  userName?: string;
  text: string;
  ts: number;
  pending?: boolean;
  clientId?: string;
};

type Status = "idle" | "connecting" | "open" | "closed";

const WS_COOKIE_URL = "http://localhost:8080/auth/ws-cookie";
const WS_BASE_URL = "ws://localhost:8080";

export const useLiveChat = (
  roomId: string,
  currentUserId?: string,
  autoStart: boolean = true,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

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
      const res = await apiFetch(
        `/live-rooms/${roomId}/chat/history?limit=50`,
        {
          method: "GET",
        },
      );

      const data = await res.json();

      if (!res.ok || !Array.isArray(data?.items)) {
        return;
      }
      const normalized: ChatMessage[] = data.items
        .map((ev: any) => ({
          id: ev.id,
          userId: ev.user_id,
          userName: ev.user_name,
          text: ev.text,
          ts: ev.ts,
        }))
        .reverse();

      normalized.forEach((m) => messageIds.current.add(m.id));
      setMessages(normalized);
    } catch (err) {
      console.error("load history error", err);
    }
  }, [roomId]);

  const setupCookie = useCallback(async () => {
    const token = tokenStore.getAccess();

    if (!token) {
      throw new Error("NOT_AUTHENTICATED");
    }

    const res = await fetch(WS_COOKIE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (res.status === 401) {
      throw new Error("NOT_AUTHENTICATED");
    }

    if (!res.ok) {
      throw new Error("COOKIE_SETUP_FAILED");
    }
  }, []);

  const flushQueue = useCallback(() => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    while (sendQueue.current.length > 0) {
      const msg = sendQueue.current.shift();
      if (msg) ws.send(msg);
    }
  }, []);

  const clearReconnectTimer = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  };

  const scheduleReconnect = useCallback(() => {
    if (!shouldReconnect.current) return;
    if (!autoStart) return;

    clearReconnectTimer();

    reconnectTimer.current = setTimeout(() => {
      connectRef.current?.();
    }, 3000);
  }, [autoStart]);

  const markAuthRequired = useCallback(() => {
    setAuthRequired(true);
    setStatus("closed");
    setConnectionError("برای ارسال نظر ابتدا باید ثبت‌نام یا وارد شوید");
    shouldReconnect.current = false;
  }, []);

  const connectRef = useRef<null | (() => Promise<void>)>(null);

  const connect = useCallback(async () => {
    if (!roomId || !autoStart) return;

    clearReconnectTimer();
    setConnectionError(null);
    setAuthRequired(false);
    setStatus("connecting");

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    try {
      if (!cookieInitializedRef.current) {
        cookieInitializedRef.current = true;
        await setupCookie();
      }

      const ws = new WebSocket(`${WS_BASE_URL}/ws/live-rooms/${roomId}/chat`);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus("open");
        setConnectionError(null);
        setAuthRequired(false);
        flushQueue();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type !== "chat.message") return;

          const msgId = data.data.id;
          const text = data.data.text;
          const ts = data.data.ts;
          const userId = data.data.user_id;
          const userName = data.data.user_name;

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
              const next = [...prev];
              next[pendingIndex] = {
                id: msgId,
                userId,
                userName,
                text,
                ts,
                pending: false,
              };
              messageIds.current.add(msgId);
              return next.slice(-200);
            }

            messageIds.current.add(msgId);

            return [
              ...prev,
              {
                id: msgId,
                userId,
                userName,
                text,
                ts,
              },
            ].slice(-200);
          });
        } catch (err) {
          console.error("ws message parse error", err);
        }
      };

      ws.onerror = () => {
        setConnectionError("خطا در اتصال چت");
      };

      ws.onclose = async (event) => {
        setStatus("closed");

        if (!shouldReconnect.current || !autoStart) return;

        if (event.code === 4401) {
          if (refreshingCookieRef.current) return;

          try {
            refreshingCookieRef.current = true;
            cookieInitializedRef.current = false;
            await setupCookie();
            cookieInitializedRef.current = true;
            scheduleReconnect();
          } catch (err: any) {
            if (err?.message === "NOT_AUTHENTICATED") {
              markAuthRequired();
              return;
            }

            console.error("cookie refresh failed", err);
            setConnectionError("خطا در احراز هویت چت");
            scheduleReconnect();
          } finally {
            refreshingCookieRef.current = false;
          }

          return;
        }

        scheduleReconnect();
      };
    } catch (err: any) {
      if (err?.message === "NOT_AUTHENTICATED") {
        markAuthRequired();
        return;
      }

      console.error("ws connect error", err);
      setConnectionError("خطا در اتصال چت");
      scheduleReconnect();
    }
  }, [
    roomId,
    currentUserId,
    autoStart,
    setupCookie,
    flushQueue,
    scheduleReconnect,
    markAuthRequired,
  ]);

  connectRef.current = connect;

  useEffect(() => {
    shouldReconnect.current = true;

    const init = async () => {
      setMessages([]);
      setConnectionError(null);
      setAuthRequired(false);
      setStatus("idle");

      messageIds.current.clear();
      sendQueue.current = [];
      cookieInitializedRef.current = false;

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      await loadHistory();

      if (autoStart) {
        await connect();
      } else {
        setStatus("closed");
      }
    };

    init();

    return () => {
      shouldReconnect.current = false;
      clearReconnectTimer();

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [roomId, autoStart, loadHistory, connect]);

  const sendMessage = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean) return;

      if (!autoStart) {
        setConnectionError("چت زنده غیرفعال است");
        return;
      }

      if (authRequired || !currentUserId) {
        setConnectionError("برای ارسال نظر ابتدا باید ثبت‌نام یا وارد شوید");
        return;
      }

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
    },
    [authRequired, currentUserId, autoStart],
  );

  const sendPending = messages.filter((m) => m.pending).length;
  const canSend =
    autoStart && !!currentUserId && !authRequired && status === "open";

  return {
    messages,
    sendMessage,
    status,
    bottomRef,
    currentUserId,
    connectionError,
    sendPending,
    canSend,
    authRequired,
  };
};
