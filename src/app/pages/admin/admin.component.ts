import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Dish, Order, Reservation, Category } from '../../models/dish.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  activeTab = 'dishes';
  dishes: Dish[] = [];
  orders: Order[] = [];
  reservations: Reservation[] = [];
  categories: Category[] = [];

  dishForm: FormGroup;
  categoryForm: FormGroup;
  
  editingDish: Dish | null = null;
  editingCategory: Category | null = null;
  showDishModal = false;
  showCategoryModal = false;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['']
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['bi-tag', Validators.required]
    });
  }

  ngOnInit(): void {
    this.restaurantService.dishes$.subscribe(dishes => this.dishes = dishes);
    this.restaurantService.orders$.subscribe(orders => this.orders = orders);
    this.restaurantService.reservations$.subscribe(reservations => this.reservations = reservations);
    this.restaurantService.categories$.subscribe(categories => this.categories = categories);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openAddDishModal(): void {
    this.editingDish = null;
    this.dishForm.reset({ price: 0 });
    this.showDishModal = true;
  }

  openEditDishModal(dish: Dish): void {
    this.editingDish = dish;
    this.dishForm.patchValue({
      name: dish.name,
      category: dish.category,
      description: dish.description,
      price: dish.price,
      image: dish.image
    });
    this.showDishModal = true;
  }

  closeDishModal(): void {
    this.showDishModal = false;
    this.editingDish = null;
  }

  saveDish(): void {
    if (this.dishForm.valid) {
      const dishData = this.dishForm.value;
      if (!dishData.image) {
        dishData.image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
      }
      
      if (this.editingDish) {
        this.restaurantService.updateDish({ ...dishData, id: this.editingDish.id });
      } else {
        this.restaurantService.addDish(dishData);
      }
      this.closeDishModal();
    }
  }

  deleteDish(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      this.restaurantService.deleteDish(id);
    }
  }

  openAddCategoryModal(): void {
    this.editingCategory = null;
    this.categoryForm.reset({ icon: 'bi-tag' });
    this.showCategoryModal = true;
  }

  openEditCategoryModal(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      icon: category.icon
    });
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      if (this.editingCategory) {
        this.restaurantService.updateCategory({ ...this.categoryForm.value, id: this.editingCategory.id });
      } else {
        this.restaurantService.addCategory(this.categoryForm.value);
      }
      this.closeCategoryModal();
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.restaurantService.deleteCategory(id);
    }
  }

  updateOrderStatus(orderId: number, status: Order['status']): void {
    this.restaurantService.updateOrderStatus(orderId, status);
  }

  deleteOrder(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.restaurantService.deleteOrder(id);
    }
  }

  updateReservationStatus(reservationId: number, status: Reservation['status']): void {
    this.restaurantService.updateReservationStatus(reservationId, status);
  }

  deleteReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.restaurantService.deleteReservation(id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get totalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  get confirmedOrders(): number {
    return this.orders.filter(o => o.status === 'confirmed').length;
  }

  get pendingReservations(): number {
    return this.reservations.filter(r => r.status === 'pending').length;
  }

  iconOptions = [
    'bi-egg-fried', 'bi-cup-hot', 'bi-cake2', 'bi-cup-straw',
    'bi-fish', 'bi-basket', 'bi-emoji-smile', 'bi-tag'
  ];
}
