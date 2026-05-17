export type CartItemType = {
  id: string
  title: string
  price: number
  qty: number
  cover: string
  deliveryInfo?: string
}

export type CartProps = {
  item: CartItemType
  selected?: boolean
  onToggleSelect?: (id: number | string) => void
}

export type CartContextType = {
  cart: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getCart: () => CartItemType[];
};