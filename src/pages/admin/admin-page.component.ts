import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../../app/services/restaurant.service';
import { Dish } from '../../app/models/dish.model';
import { Order } from '../../app/models/order.model';
import { Reservation } from '../../app/models/reservation.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  template: `
    <div class="max-w-6xl mx-auto p-4">

      <h1 class="text-3xl font-bold mb-6 text-gray-800">Administration</h1>

      <!-- TABS -->
      <div class="flex gap-4 border-b mb-6">
        <button class="pb-2 text-lg"
          [class.text-orange-500]="activeTab === 'dishes'"
          [class.border-b-2]="activeTab === 'dishes'"
          (click)="setActiveTab('dishes')">
          Gestion des plats
        </button>

        <button class="pb-2 text-lg"
          [class.text-orange-500]="activeTab === 'orders'"
          [class.border-b-2]="activeTab === 'orders'"
          (click)="setActiveTab('orders')">
          Commandes ({{ orders.length }})
        </button>

        <button class="pb-2 text-lg"
          [class.text-orange-500]="activeTab === 'reservations'"
          [class.border-b-2]="activeTab === 'reservations'"
          (click)="setActiveTab('reservations')">
          Réservations ({{ reservations.length }})
        </button>
      </div>

      <!-- DISHES TAB -->
      <div *ngIf="activeTab === 'dishes'">

        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4" (click)="openDishForm()">
          + Ajouter un plat
        </button>

        <!-- DISH FORM -->
        <div *ngIf="showDishForm" class="bg-white shadow rounded-lg p-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">
            {{ editingDish ? 'Modifier' : 'Ajouter' }} un plat
          </h3>

          <form [formGroup]="dishForm" (ngSubmit)="saveDish()" class="space-y-4">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-medium">Nom *</label>
                <input type="text" class="w-full border rounded-lg p-2"
                  formControlName="name">
              </div>

              <div>
                <label class="block mb-1 font-medium">Catégorie *</label>
                <select class="w-full border rounded-lg p-2" formControlName="category">
                  <option value="">Sélectionner...</option>
                  <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block mb-1 font-medium">Description *</label>
              <textarea rows="2" class="w-full border rounded-lg p-2" formControlName="description"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-medium">Prix (DH) *</label>
                <input type="number" class="w-full border rounded-lg p-2"
                  formControlName="price">
              </div>

              <div>
                <label class="block mb-1 font-medium">URL de l'image *</label>
                <input type="text" class="w-full border rounded-lg p-2"
                  formControlName="image">
              </div>
            </div>

            <div class="flex gap-3">
              <button class="px-4 py-2 bg-green-600 text-white rounded-lg"
                [disabled]="dishForm.invalid" type="submit">
                Enregistrer
              </button>

              <button type="button" class="px-4 py-2 bg-gray-500 text-white rounded-lg"
                (click)="closeDishForm()">
                Annuler
              </button>
            </div>
          </form>
        </div>

        <!-- DISHES TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-100 border-b">
                <th class="p-2">Image</th>
                <th class="p-2">Nom</th>
                <th class="p-2">Catégorie</th>
                <th class="p-2">Description</th>
                <th class="p-2">Prix</th>
                <th class="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let dish of dishes" class="border-b">
                <td class="p-2">
                  <img [src]="dish.image" class="w-16 h-16 object-cover rounded">
                </td>
                <td class="p-2">{{ dish.name }}</td>
                <td class="p-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded">{{ dish.category }}</span>
                </td>
                <td class="p-2">{{ dish.description }}</td>
                <td class="p-2">{{ dish.price }} DH</td>
                <td class="p-2 flex gap-2">
                  <button class="px-3 py-1 bg-yellow-500 text-white rounded"
                    (click)="openDishForm(dish)">
                    Modifier
                  </button>

                  <button class="px-3 py-1 bg-red-600 text-white rounded"
                    (click)="deleteDish(dish.id)">
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- ORDERS TAB -->
      <div *ngIf="activeTab === 'orders'">
        <div *ngIf="orders.length === 0" class="p-4 bg-blue-100 text-blue-700 rounded">
          Aucune commande pour le moment.
        </div>

        <div *ngFor="let order of orders" class="bg-white shadow p-4 rounded-lg mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <h5 class="text-xl font-semibold">Commande #{{ order.id }}</h5>
              <p><strong>Client:</strong> {{ order.customerName }}</p>
              <p><strong>Téléphone:</strong> {{ order.phone }}</p>
              <p><strong>Type:</strong>
                <span class="px-2 py-1 bg-blue-200 text-blue-800 rounded">{{ order.orderType }}</span>
              </p>
              <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
            </div>

            <div>
              <h6 class="font-semibold mb-2">Articles:</h6>
              <ul class="list-disc ml-5">
                <li *ngFor="let item of order.items">
                  {{ item.dish.name }} x{{ item.quantity }} -
                  {{ item.dish.price * item.quantity }} DH
                </li>
              </ul>

              <p class="text-right text-xl font-bold mt-2">
                Total: {{ order.total }} DH
              </p>
            </div>

          </div>
        </div>
      </div>

      <!-- RESERVATIONS TAB -->
      <div *ngIf="activeTab === 'reservations'">

        <div *ngIf="reservations.length === 0" class="p-4 bg-blue-100 text-blue-700 rounded">
          Aucune réservation pour le moment.
        </div>

        <div class="overflow-x-auto mt-4">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-100 border-b">
                <th class="p-2">Nom</th>
                <th class="p-2">Contact</th>
                <th class="p-2">Personnes</th>
                <th class="p-2">Date & Heure</th>
                <th class="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let r of reservations" class="border-b">
                <td class="p-2">{{ r.name }}</td>
                <td class="p-2">{{ r.contact }}</td>
                <td class="p-2">{{ r.persons }}</td>
                <td class="p-2">{{ formatDate(r.datetime) }}</td>
                <td class="p-2">
                  <button class="px-3 py-1 bg-red-600 text-white rounded"
                    (click)="deleteReservation(r.id)">
                    Supprimer
                  </button>
                </td>
              </tr>

            </tbody>

          </table>
        </div>

      </div>

    </div>
  `
})
export class AdminPageComponent implements OnInit {

  activeTab: 'dishes' | 'orders' | 'reservations' = 'dishes';

  dishes: Dish[] = [];
  orders: Order[] = [];
  reservations: Reservation[] = [];
  categories: string[] = [];

  dishForm: FormGroup;
  editingDish: Dish | null = null;
  showDishForm = false;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categories = this.restaurantService.getCategories();
    this.loadData();
  }

  loadData(): void {
    this.dishes = this.restaurantService.dishes();
    this.orders = this.restaurantService.orders();
    this.reservations = this.restaurantService.reservations();
  }

  setActiveTab(tab: any): void {
    this.activeTab = tab;
  }

  openDishForm(dish?: Dish): void {
    if (dish) {
      this.editingDish = dish;
      this.dishForm.patchValue(dish);
    } else {
      this.editingDish = null;
      this.dishForm.reset();
    }
    this.showDishForm = true;
  }

  closeDishForm(): void {
    this.showDishForm = false;
    this.dishForm.reset();
    this.editingDish = null;
  }

  saveDish(): void {
    if (this.dishForm.invalid) return;

    if (this.editingDish) {
      this.restaurantService.updateDish({
        ...this.dishForm.value,
        id: this.editingDish.id
      });
    } else {
      this.restaurantService.addDish(this.dishForm.value);
    }

    this.closeDishForm();
    this.loadData();
  }

  deleteDish(id: number): void {
    if (confirm('Supprimer ce plat ?')) {
      this.restaurantService.deleteDish(id);
      this.loadData();
    }
  }

  deleteReservation(id: number): void {
    if (confirm('Supprimer cette réservation ?')) {
      this.restaurantService.deleteReservation(id);
      this.loadData();
    }
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleString('fr-FR');
  }
}
