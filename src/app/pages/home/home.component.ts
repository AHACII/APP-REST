import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      icon: 'bi-book-half',
      title: 'Notre Menu',
      description: 'Découvrez nos plats délicieux',
      link: '/menu',
      buttonText: 'Voir le Menu'
    },
    {
      icon: 'bi-cart-check',
      title: 'Commander',
      description: 'Passez votre commande en ligne',
      link: '/order',
      buttonText: 'Commander'
    },
    {
      icon: 'bi-calendar-event',
      title: 'Réserver',
      description: 'Réservez votre table',
      link: '/reservation',
      buttonText: 'Réserver'
    }
  ];
}
