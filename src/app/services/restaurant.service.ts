import { Injectable, signal } from '@angular/core';
import { Dish } from '../models/dish.model';
import { Reservation } from '../models/reservation.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  dishes = signal<Dish[]>([]);
  reservations = signal<Reservation[]>([]);
  orders = signal<Order[]>([]);

  constructor() {
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

  addOrder(order: Order) {
    this.orders.set([...this.orders(), order]);
    this.save();
  }

  save() {
    localStorage.setItem('restaurant-data', JSON.stringify({
      dishes: this.dishes(),
      reservations: this.reservations(),
      orders: this.orders()
    }));
  }

  load() {
    const saved = localStorage.getItem('restaurant-data');
    if (saved) {
      const data = JSON.parse(saved);
      this.dishes.set(data.dishes || []);
      this.reservations.set(data.reservations || []);
      this.orders.set(data.orders || []);
    }
  }
}
