import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Dish, Category } from '../../models/dish.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  categories: Category[] = [];
  selectedCategory = 'all';
  searchQuery = '';
  addedToCart: { [key: number]: boolean } = {};

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.dishes$.subscribe(dishes => {
      this.dishes = dishes;
      this.filterDishes();
    });
    
    this.restaurantService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterDishes();
  }

  filterDishes(): void {
    let result = this.dishes;

    if (this.selectedCategory !== 'all') {
      result = result.filter(dish => dish.category === this.selectedCategory);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(dish =>
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query)
      );
    }

    this.filteredDishes = result;
  }

  onSearch(): void {
    this.filterDishes();
  }

  addToCart(dish: Dish): void {
    this.restaurantService.addToCart(dish);
    this.addedToCart[dish.id] = true;
    setTimeout(() => {
      this.addedToCart[dish.id] = false;
    }, 1500);
  }
}
