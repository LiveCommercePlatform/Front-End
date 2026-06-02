export type StreamStatus = "scheduled" | "live" | "ended";

export type Stream = {
  ID: string;
  Title: string;
  Description?: string;
  Products: Array<
    {
      IsPinned: boolean;
      ProductID: string;
      Product: { title: string; description: string; price: number };
    }
  >;
  cover?: string;
  Status: StreamStatus;
  StartedAt?: string; 
  EndedAt?: string;
  IsRecorded?: boolean;
  TotalViews?: number;
  CreatedAt: string; 
  Duration: number;
  HostID: string;
  SFURoomID?: string;
  Host: { id: String; name: string };
  TotalDislikes: number;
  TotalLikes: number;
};

export type LiveRoomStats = {
  dislikes: number;
  likes: number;
};

export type ReactionType = "like" | "dislike" | null;
