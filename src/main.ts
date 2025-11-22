import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HomeComponent } from './pages/home/home-page.component';

bootstrapApplication(HomeComponent, {
  providers: [provideRouter(routes)]
});
