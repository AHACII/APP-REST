import { CartItem } from "./cart-item.model";

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  customerName: string;
  phone: string;
  type: 'sur place' | 'à emporter';
}
