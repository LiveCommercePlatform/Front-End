export type StreamStatus = "scheduled" | "live" | "ended";

export type Stream = {
  ID: string;
  Title: string;
  Description?: string;
  products?: [{ product: { title: string } }];
  //   productTitle?: string;
  cover?: string;
  Status: StreamStatus;

  // scheduledAt?: string; // ISO
  StartedAt?: string; // ISO
  EndedAt?: string; // ISO
  IsRecorded?: boolean;
  TotalViews?: number;
  // ordersCount?: number;
  CreatedAt?: string; // ISO

  Duration?: number;
  HostID?: string;
  SFURoomID?: string;
  // Host
  // :
  // {id: '00000000-0000-0000-0000-000000000000', name: '', email: '', role: '', verified: false, …}


  TotalDislikes
  :number;
  
  TotalLikes
  :number;
};
