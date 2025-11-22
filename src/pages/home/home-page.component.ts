import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto mt-10 px-4">

      
      <div class="text-center py-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl mb-10">
        <h1 class="text-4xl md:text-6xl font-bold mb-3">{{ restaurantInfo.name }}</h1>
        <p class="text-lg opacity-90 mb-6">{{ restaurantInfo.slogan }}</p>

        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
          class="w-full max-h-[400px] object-cover rounded-xl shadow-xl"
        />
      </div>

      
      <div class="grid md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white rounded-xl shadow p-6 text-center">
          <h2 class="text-2xl font-semibold mb-2">📍 Adresse</h2>
          <p class="text-gray-600">{{ restaurantInfo.address }}</p>
        </div>

        <div class="bg-white rounded-xl shadow p-6 text-center">
          <h2 class="text-2xl font-semibold mb-2">📞 Contact</h2>
          <p class="text-gray-600">{{ restaurantInfo.phone }}</p>
        </div>

        <div class="bg-white rounded-xl shadow p-6 text-center">
          <h2 class="text-2xl font-semibold mb-2">🕐 Horaires</h2>
          <p class="text-gray-600">
            Lun - Ven: {{ restaurantInfo.hours.weekdays }} <br>
            Sam - Dim: {{ restaurantInfo.hours.weekend }}
          </p>
        </div>
      </div>

      
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow p-6 text-center transform transition hover:scale-105">
          <h3 class="text-xl font-semibold">🍽️ Notre Menu</h3>
          <p class="text-gray-500 mb-4">Découvrez nos plats délicieux</p>
          <a routerLink="/menu" class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Voir le Menu
          </a>
        </div>

        <div class="bg-white rounded-xl shadow p-6 text-center transform transition hover:scale-105">
          <h3 class="text-xl font-semibold">🛒 Commander</h3>
          <p class="text-gray-500 mb-4">Passez votre commande en ligne</p>
          <a routerLink="/order" class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Commander
          </a>
        </div>

        <div class="bg-white rounded-xl shadow p-6 text-center transform transition hover:scale-105">
          <h3 class="text-xl font-semibold">📅 Réserver</h3>
          <p class="text-gray-500 mb-4">Réservez votre table</p>
          <a routerLink="/reservation" class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Réserver
          </a>
        </div>
      </div>

    </div>
  `,
  styles: []
})
export class HomeComponent {
  restaurantInfo = {
    name: 'Le Gourmet',
    slogan: 'Savourez l\'excellence',
    address: 'Supmti - OUJDA. Maroc',
    phone: '+212 7 01 02 03 04',
    hours: {
      weekdays: '11h00 - 23h00',
      weekend: '10h00 - 00h00'
    }
  };
}
