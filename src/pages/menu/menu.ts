import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Notre Menu</h1>

      <!-- Search + Category -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input 
          type="text"
          class="border p-2 rounded w-full"
          placeholder="Rechercher un plat..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange()"
        />

        <div class="flex flex-wrap gap-2">
          <button
            *ngFor="let category of categories"
            (click)="onCategoryChange(category)"
            class="px-4 py-2 rounded border transition"
            [ngClass]="selectedCategory === category 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-blue-600 border-blue-600'"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Dish cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let dish of filteredDishes"
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
                (click)="addToCart(dish)"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty message -->
      <div *ngIf="filteredDishes.length === 0"
           class="mt-6 text-blue-600 font-medium text-center">
        Aucun plat trouvé.
      </div>
    </div>
  `,
  styles: [`
    /* ممكن تزيد Tailwind فقط، لكن هنا خالين بلا SCSS */
  `]
})
export class HomeComponent implements OnInit {
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Tous';
  searchTerm: string = '';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.categories = ['Tous', ...this.restaurantService.getCategories()];
    this.restaurantService.dishes$.subscribe(dishes => {
      this.dishes = dishes;
      this.filterDishes();
    });
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

  onSearchChange(): void {
    this.filterDishes();
  }

  addToCart(dish: Dish): void {
    this.restaurantService.addToCart(dish);
    alert(`${dish.name} ajouté au panier!`);
  }
}
