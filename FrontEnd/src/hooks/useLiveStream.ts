"use client";

import { useCallback, useEffect, useState } from "react";
import { useLiveRooms } from "@/context/LiveRoomContext";
import { LiveRoomStats, ReactionType, Stream } from "@/types";

type UseLiveStreamReturn = {
  stream: Stream | null;
  stats: LiveRoomStats | null;
  myReaction: ReactionType;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  like: () => Promise<boolean>;
  dislike: () => Promise<boolean>;
  end: () => Promise<boolean>;
  pinLiveProduct: (productId: string, isPinned: boolean) => Promise<boolean>;
  removeProductFromLive: (productId: string) => Promise<boolean>;
};

export function useLiveStream(id?: string): UseLiveStreamReturn {
  const {
    getLiveRoomByIdCached,
    getLiveRoomStats,
    getMyReaction,
    likeStream,
    dislikeStream,
    removeReaction,
    endStream,
    pinLiveProduct: ctxPinLiveProduct,
    removeProductFromLive: ctxRemoveProductFromLive,
    invalidate,
  } = useLiveRooms();

  const [stream, setStream] = useState<Stream | null>(null);
  const [stats, setStats] = useState<LiveRoomStats | null>(null);
  const [myReaction, setMyReaction] = useState<ReactionType>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const [streamData, statsData, reactionData] = await Promise.all([
        getLiveRoomByIdCached(id),
        getLiveRoomStats(id),
        getMyReaction(id),
      ]);

      setStream(streamData);
      setStats(statsData);
      setMyReaction(reactionData);
    } catch (err: any) {
      setError(err?.message ?? "خطا در دریافت اطلاعات لایو");
    } finally {
      setLoading(false);
    }
  }, [id, getLiveRoomByIdCached, getLiveRoomStats, getMyReaction]);

  const end = useCallback(async () => {
    if (!id) return false;
    if (!id) return false;
    const ok = await endStream(id);
    return ok;
  }, [id, endStream]);

  const like = useCallback(async () => {
    if (!id) return false;

    let ok = false;

    if (myReaction === "like") {
      ok = await removeReaction(id);
    } else if (myReaction === "dislike") {
      const removed = await removeReaction(id);
      if (!removed) return false;
      ok = await likeStream(id);
    } else {
      ok = await likeStream(id);
    }
    if (!ok) return false;

    const [statsData, reactionData] = await Promise.all([
      getLiveRoomStats(id),
      getMyReaction(id),
    ]);

    setStats(statsData);
    setMyReaction(reactionData);

    return true;
  }, [
    id,
    myReaction,
    likeStream,
    removeReaction,
    getLiveRoomStats,
    getMyReaction,
  ]);

  const dislike = useCallback(async () => {
    if (!id) return false;

    let ok = false;

    if (myReaction === "dislike") {
      ok = await removeReaction(id);
    } else if (myReaction === "like") {
      const removed = await removeReaction(id);
      if (!removed) return false;
      ok = await dislikeStream(id);
    } else {
      ok = await dislikeStream(id);
    }

    if (!ok) return false;

    const [statsData, reactionData] = await Promise.all([
      getLiveRoomStats(id),
      getMyReaction(id),
    ]);

    setStats(statsData);
    setMyReaction(reactionData);

    return true;
  }, [
    id,
    myReaction,
    dislikeStream,
    removeReaction,
    getLiveRoomStats,
    getMyReaction,
  ]);

  const pinLiveProduct = useCallback(
    async (productId: string, isPinned: boolean) => {
      if (!id || !stream) return false;

      const prevStream = stream;

      const updatedProducts = stream.Products?.map((p) =>
        p.ProductID === productId ? { ...p, IsPinned: isPinned } : p,
      );

      setStream({
        ...stream,
        Products: updatedProducts,
      });

      const ok = await ctxPinLiveProduct(id, productId, isPinned);

      if (!ok) {
        setStream(prevStream);
        return false;
      }

      return true;
    },
    [id, stream, ctxPinLiveProduct],
  );

  const removeProductFromLive = useCallback(
    async (productId: string) => {
      if (!id || !stream) return false;
      const prevStream = stream;
      const updatedProducts = stream.Products?.filter(
        (p) => p.ProductID !== productId,
      );
      setStream({
        ...stream,
        Products: updatedProducts,
      });
      const ok = await ctxRemoveProductFromLive(id, productId);
      if (!ok) {
        setStream(prevStream);
        return false;
      }

      return true;
    },
    [id, stream, ctxRemoveProductFromLive],
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stream,
    stats,
    myReaction,
    loading,
    error,
    refetch,
    like,
    end,
    dislike,
    pinLiveProduct,
    removeProductFromLive,
  };
}
