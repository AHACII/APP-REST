import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../app/services/restaurant.service';

@Component({
  selector: 'app-commander',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-4">Your Order</h2>

      <div *ngIf="cart.length === 0" class="text-gray-500">
        No items in the cart.
      </div>

      <div *ngFor="let item of cart" class="p-3 border-b">
        <div class="font-semibold">{{ item.name }}</div>
        <div>Price: {{ item.price }} DH</div>
        <div>Qty: {{ item.quantity }}</div>
      </div>

      <div class="text-xl font-bold mt-4">
        Total: {{ total }} DH
      </div>

      <button
        (click)="confirmOrder()"
        class="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Confirm Order
      </button>
    </div>
  `
})
export class CommanderComponent {

  cart: any[] = [];
  total = 0;

  constructor(private restaurantService: RestaurantService) {

    // لازم يكون هنا ماشي فالـ ngOnInit
    effect(() => {
      this.cart = this.restaurantService.cart();
      this.total = this.restaurantService.getCartTotal();
    });

  }

  confirmOrder(): void {
    if (this.cart.length === 0) return;

    this.restaurantService.addOrder({
      id: Date.now(),
      items: this.cart,
      total: this.total,
      createdAt: new Date()
    });

    alert("Order confirmed!");
    this.restaurantService.clearCart();
  }
}
