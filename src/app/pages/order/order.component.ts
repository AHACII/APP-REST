import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartItem } from '../../models/dish.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderForm: FormGroup;
  orderConfirmed = false;
  orderId = 0;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
      orderType: ['sur_place', Validators.required]
    });
  }

  ngOnInit(): void {
    this.restaurantService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  get total(): number {
    return this.restaurantService.getCartTotal();
  }

  updateQuantity(dishId: number, quantity: number): void {
    this.restaurantService.updateCartItemQuantity(dishId, quantity);
  }

  removeItem(dishId: number): void {
    this.restaurantService.removeFromCart(dishId);
  }

  clearCart(): void {
    this.restaurantService.clearCart();
  }

  submitOrder(): void {
    if (this.orderForm.valid && this.cartItems.length > 0) {
      const order = this.restaurantService.addOrder({
        items: [...this.cartItems],
        customerName: this.orderForm.value.customerName,
        phone: this.orderForm.value.phone,
        orderType: this.orderForm.value.orderType,
        total: this.total
      });
      this.orderId = order.id;
      this.orderConfirmed = true;
      this.orderForm.reset({ orderType: 'sur_place' });
    }
  }

  closeConfirmation(): void {
    this.orderConfirmed = false;
  }
}
