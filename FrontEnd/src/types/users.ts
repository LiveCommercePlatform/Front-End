
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