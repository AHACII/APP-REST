import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Dish } from '../models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items = signal<CartItem[]>([]);

  addToCart(dish: Dish) {
    const existing = this.items().find(i => i.dish.id === dish.id);
    if (existing) {
      existing.quantity++;
      this.items.set([...this.items()]);
    } else {
      this.items.set([...this.items(), { dish, quantity: 1 }]);
    }
    this.save();
  }

  updateQuantity(dishId: number, quantity: number) {
    const updated = this.items().map(item =>
      item.dish.id === dishId ? { ...item, quantity } : item
    );
    this.items.set(updated);
    this.save();
  }

  removeItem(dishId: number) {
    this.items.set(this.items().filter(item => item.dish.id !== dishId));
    this.save();
  }

  clear() {
    this.items.set([]);
    this.save();
  }

  getTotal() {
    return this.items().reduce((sum, i) => sum + i.dish.price * i.quantity, 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }

  load() {
    const saved = localStorage.getItem('cart');
    if (saved) this.items.set(JSON.parse(saved));
  }
}
