import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Dish } from '../models/dish.model';
import { Reservation } from '../models/reservation.model';
import { Order } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  dishes = signal<Dish[]>([]);
  reservations = signal<Reservation[]>([]);
  orders = signal<Order[]>([]);
  cart = signal<CartItem[]>([]);

  cart$ = this.cart.asReadonly();

  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.dish.price * item.quantity, 0)
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.load();
  }


  addDish(dish: Dish) {
    this.dishes.set([...this.dishes(), dish]);
    this.save();
  }

  deleteDish(id: number) {
    this.dishes.set(this.dishes().filter(d => d.id !== id));
    this.save();
  }



  addReservation(r: Reservation) {
    this.reservations.set([...this.reservations(), r]);
    this.save();
  }


  addToCart(dish: Dish) {
    const cart = this.cart();
    const exist = cart.find(c => c.dish.id === dish.id);

    if (exist) {
      exist.quantity++;
      this.cart.set([...cart]);
    } else {
      this.cart.set([...cart, { dish, quantity: 1 }]);
    }

    this.save();
  }

  updateCartQuantity(dishId: number, qty: number) {
    const cart = this.cart().map(item =>
      item.dish.id === dishId ? { ...item, quantity: qty } : item
    );

    this.cart.set(cart);
    this.save();
  }

  removeFromCart(dishId: number) {
    this.cart.set(this.cart().filter(item => item.dish.id !== dishId));
    this.save();
  }

  getCartTotal(): number {
    return this.cartTotal();
  }

  clearCart() {
    this.cart.set([]);
    this.save();
  }

 addOrder(order: Order) {
  this.orders.set([...this.orders(), order]);
  this.save();

}

  createOrder(customerName: string, phone: string, orderType: string) {

    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customerName,
      phone,
      orderType,
      items: this.cart(),
      total: this.getCartTotal()
    };

    this.orders.set([...this.orders(), newOrder]);
    this.clearCart();
    this.save();

    return newOrder;
  }



  private save() {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('restaurant-data', JSON.stringify({
      dishes: this.dishes(),
      reservations: this.reservations(),
      orders: this.orders(),
      cart: this.cart()
    }));
  }

  private load() {
    if (!isPlatformBrowser(this.platformId)) return;

    const saved = localStorage.getItem('restaurant-data');
    if (saved) {
      const data = JSON.parse(saved);
      this.dishes.set(data.dishes || []);
      this.reservations.set(data.reservations || []);
      this.orders.set(data.orders || []);
      this.cart.set(data.cart || []);
    }
  }
}
