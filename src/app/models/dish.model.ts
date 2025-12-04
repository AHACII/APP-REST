export interface Dish {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  customerName: string;
  phone: string;
  orderType: 'sur_place' | 'a_emporter';
  total: number;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  numberOfPeople: number;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}
