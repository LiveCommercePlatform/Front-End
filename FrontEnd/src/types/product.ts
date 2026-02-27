export type ProductStatus = "all" | "active" | "inactive";

export type Engagement = {
  liked: boolean;
  disliked : boolean;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  status: "active" | "inactive";
  cover?: string;
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
export type ProductDetails = {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  cover_image?: string;
  owner?: { id: string; name: string };
  view_count?: number;
  like_count?: number;
  dislike_count?: number;
  rating_avg?: number;
  rating_count?: number;
  category_id: number;
  category?: { id: number; name_fa: string; parent_id?: number };
  tags?: { id: number; name: string }[];
  created_at?: string;
  updated_at?: string;
  liked? : boolean;
  disliked? : boolean;
};
export type StatBoxProps = {
  statKey: string; // مثلا: "like"
  icon: (active: boolean) => React.ReactNode;
  label: string;
  value: number | string;
  initiallyActive?: boolean;
  disabled?: boolean;
};