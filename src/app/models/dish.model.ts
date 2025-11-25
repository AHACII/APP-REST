export interface Dish {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
}
export interface CartItem {
  dish: Dish;
  quantity: number;
}
