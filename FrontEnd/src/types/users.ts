
export type Profile = {
  name: string;
  email: string;
  phone: string;
  postal_code: string;
  address: string;
};

export type ProfileFormValues = {
  name: string;
  phone: string;
  postal_code: string;
  address: string;
  email: string;
};

export type PasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UserStatus = "all" | "active" | "inactive";

export type User = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
  role: "admin" | "user";
};

export type UserCardProps = {
  name: string;
  email?: string;
  role: "admin" | "user" | "banned";
  status: "active" | "banned";
  onView: () => Promise<AdminUser | null>;
  onBan: () => void;
  onDelete: () => void;
  onUpgrade: () => void;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "banned";
  verified?: boolean;
  phone?: string | null;
  address?: string | null;
  postal_code?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AdminUserListResponse = {
  data: AdminUser[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminUserParams = {
  page: number;
  pageSize: number;
  role?: string;
  search?: string;
};