import { Routes } from '@angular/router';

export const routes: Routes = [
  
  // ➕ Admin route
  {
    path: 'admin',
    loadComponent: () =>
      import('../pages/admin/admin-page.component').then(m => m.AdminPageComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('../pages/home/home-page.component').then(m => m.HomeComponent)
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('../pages/menu/menu-page.component').then(m => m.MenuComponent)
  },
  {
    path: 'order',
    loadComponent: () =>
      import('../pages/commander/commander-page.component').then(m => m.CommanderComponent)
  },
  {
    path: 'reservation',
    loadComponent: () =>
      import('../pages/reserver/reserver-page.component').then(m => m.ReserverPageComponent)
  },


  {
    path: '**',
    redirectTo: ''
  }
];
