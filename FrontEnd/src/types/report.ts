// types/report.ts
export type ReportType = "product" | "comment" | "user";
export type ReportStatus = "new" | "reviewing" | "closed";

export type Report = {
  id: number;
  type: ReportType;
  status: ReportStatus;
  reason: string;
  reporter: string;
  createdAt: string;
};
