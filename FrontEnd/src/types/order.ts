export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  product_id: string;
  qty: number;
  unit_price: number;
  total_price: number;
  product?: {
    id: string;
    title?: string;
    price?: number;
    owner_id?:string;
    images?: string[];
  };
};

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  receiver_name: string;
  phone: string;
  address: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
  live_room_id?: string | null;
  items: OrderItem[];
  user?: {
    id: string;
    name?: string;
    phone?: string;
    owner_id?:string;
    email:string;
  };
};

export type CreateOrderInput = {
  items: Array<{ product_id: string; qty: number }>;
  live_room_id?: string | null;
};