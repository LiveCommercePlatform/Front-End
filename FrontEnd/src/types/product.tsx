export type ProductStatus = "all" | "active" | "inactive";

export type Product = {
  id: number;
  title: string;
  price: number;
  status: "active" | "inactive";
  cover?: string; // 👈 آدرس عکس
};