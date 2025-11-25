import { CartItem } from './cart-item.model';

export interface Order {
  id: number;
  date?: string;
  createdAt?: Date;
  customerName?: string;
  phone?: string;
  orderType?: string;
  items: any[];
  total: number;
}
