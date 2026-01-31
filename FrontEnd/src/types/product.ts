export type ProductStatus = "all" | "active" | "inactive";

export type Product = {
  id: string;
  title: string;
  price: number;
  status: "active" | "inactive";
  cover: string; // 👈 آدرس عکس
  category?:string;
};

export type ProductCardStatus = "active" | "inactive";

export type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  status: ProductCardStatus;
  cover: string;
  showEdit?: boolean;
  showDelete?: boolean;
  showAddToCart?:boolean;
  showState?:boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};