import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
