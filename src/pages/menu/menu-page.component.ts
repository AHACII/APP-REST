import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../app/services/restaurant.service';
import { Dish } from '../../app/models/dish.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Notre Menu</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input 
          type="text"
          class="border p-2 rounded w-full"
          placeholder="Rechercher un plat..."
          (input)="onSearchChange($event.target.value)"
        />

        <div class="flex flex-wrap gap-2">
          <button
            *ngFor="let category of categories"
            (click)="onCategoryChange(category)"
            class="px-4 py-2 rounded border transition"
            [ngClass]="selectedCategory === category 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-blue-600 border-blue-600'">
            {{ category }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let dish of filteredDishes; trackBy: trackByDishId"
             class="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer">
          <img [src]="dish.image" [alt]="dish.name" class="w-full h-48 object-cover">
          <div class="p-4">
            <span class="text-sm bg-gray-200 px-2 py-1 rounded">{{ dish.category }}</span>
            <h3 class="text-xl font-semibold mt-2">{{ dish.name }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ dish.description }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-lg font-bold">{{ dish.price }} DH</span>
              <button
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                (click)="addToCart(dish)">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredDishes.length === 0"
           class="mt-6 text-blue-600 font-medium text-center">
        Aucun plat trouvé.
      </div>

      <!-- Toast Notification -->
      <div *ngIf="toastMessage" 
           class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow">
        {{ toastMessage }}
      </div>
    </div>
  `
})
export class MenuComponent implements OnInit {

  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Tous';
  searchTerm: string = '';
  toastMessage: string = '';
  private searchTimeout: any;

  constructor(private restaurantService: RestaurantService) {
    effect(() => {
      this.dishes = this.restaurantService.dishes();
      this.updateCategories();
      this.filterDishes();
    });
  }

  ngOnInit(): void {
    this.updateCategories();
    this.filterDishes();
  }

  updateCategories() {
    this.categories = ['Tous', ...new Set(this.dishes.map(d => d.category))];
  }

  filterDishes(): void {
    let filtered = this.dishes;

    if (this.selectedCategory !== 'Tous') {
      filtered = filtered.filter(d => d.category === this.selectedCategory);
    }

    if (this.searchTerm.trim() !== '') {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredDishes = filtered;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterDishes();
  }

  onSearchChange(term: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchTerm = term;
      this.filterDishes();
    }, 300);
  }

addToCart(dish: Dish): void {
  this.restaurantService.addToCart(dish);
  this.showToast(`${dish.name} ajouté au panier!`);
}


  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  trackByDishId(index: number, dish: Dish) {
    return dish.id;
  }
}
