// types/report.ts
export type ReportType = "product" | "comment" | "user";
export type ReportStatus = "new" | "reviewing" | "closed";

export type ReportUser = {
  id: string;
  name?: string;
  email?: string;
  role?: "user" | "admin" | "banned";
};

export type AdminReport = {
  id: string;
  reporter_id?: string;
  reporter?: ReportUser;

  type: ReportType;
  status: ReportStatus;
  reason?: string;

  product_id?: string | null;
  comment_id?: string | null;
  target_user_id?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type AdminReportListResponse = {
  data: AdminReport[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminReportParams = {
  page: number;
  pageSize: number;
  type?: "" | ReportType;
  status?: "" | ReportStatus;
};