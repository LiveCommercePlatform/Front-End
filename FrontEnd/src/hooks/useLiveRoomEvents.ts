"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "connecting" | "open" | "closed";

type ReactionSummary = {
  likes: number;
  dislikes: number;
};

type Product = {
  id: string;
  [key: string]: any;
};

type ProductsUpdatedData = {
  action?: string;
  products: Product[];
};

type LiveRoomReactionEvent = {
  type: "live_room.reactions.updated";
  data: ReactionSummary;
  ts: number;
};

type LiveRoomProductsEvent = {
  type: "live_room.products.updated";
  data: ProductsUpdatedData;
  ts: number;
};

type LiveRoomEvent = LiveRoomReactionEvent | LiveRoomProductsEvent;

export const useLiveRoomEvents = (
  roomId: string,
  autoStart: boolean = true
) => {
  const [status, setStatus] = useState<Status>("idle");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [reactions, setReactions] = useState<ReactionSummary>({
    likes: 0,
    dislikes: 0,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [productsEvent, setProductsEvent] = useState<ProductsUpdatedData | null>(null);
  const [lastEvent, setLastEvent] = useState<LiveRoomEvent | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);

  const clearReconnectTimer = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  };

  const connectRef = useRef<null | (() => void)>(null);

  const scheduleReconnect = useCallback(() => {
    if (!shouldReconnect.current || !autoStart) return;

    clearReconnectTimer();

    reconnectTimer.current = setTimeout(() => {
      connectRef.current?.();
    }, 3000);
  }, [autoStart]);

  const connect = useCallback(() => {
    if (!roomId || !autoStart) return;

    clearReconnectTimer();
    setConnectionError(null);
    setStatus("connecting");

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    try {
      const ws = new WebSocket(`ws://localhost:8080/ws/live-rooms/${roomId}/events`);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus("open");
        setConnectionError(null);
      };

      ws.onmessage = (event) => {
        try {
          const parsed: LiveRoomEvent = JSON.parse(event.data);

          setLastEvent(parsed);

          if (parsed.type === "live_room.reactions.updated") {
            setReactions({
              likes: parsed.data?.likes ?? 0,
              dislikes: parsed.data?.dislikes ?? 0,
            });
            return;
          }

          if (parsed.type === "live_room.products.updated") {
            console.log(parsed)
            setProductsEvent(parsed.data);
            setProducts(parsed.data?.products ?? []);
            return;
          }
        } catch (err) {
          console.error("live room event parse error", err);
        }
      };

      ws.onerror = () => {
        setConnectionError("خطا در اتصال رویدادهای زنده");
      };

      ws.onclose = () => {
        setStatus("closed");

        if (!shouldReconnect.current || !autoStart) return;
        scheduleReconnect();
      };
    } catch (err) {
      console.error("live room events connect error", err);
      setConnectionError("خطا در اتصال رویدادهای زنده");
      scheduleReconnect();
    }
  }, [roomId, autoStart, scheduleReconnect]);

  connectRef.current = connect;

  useEffect(() => {
    shouldReconnect.current = true;

    setConnectionError(null);
    setStatus("idle");
    setLastEvent(null);
    setProductsEvent(null);
    setProducts([]);

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (autoStart) {
      connect();
    } else {
      setStatus("closed");
    }

    return () => {
      shouldReconnect.current = false;
      clearReconnectTimer();

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [roomId, autoStart, connect]);

  return {
    status,
    connectionError,
    reactions,
    products,
    productsEvent,
    lastEvent,
  };
};
