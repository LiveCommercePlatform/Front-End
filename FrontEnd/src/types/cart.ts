export type CartItemType = {
  id: number | string
  name: string
  price: number
  qty: number
  image: string
  deliveryInfo?: string
}

export type Props = {
  item: CartItemType
  onQtyChange: (id: number | string, qty: number) => void
  onRemove: (id: number | string) => void
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