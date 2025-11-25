import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../../app/services/restaurant.service';

@Component({
  selector: 'app-reserver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto mt-10 p-4">
      <h1 class="text-3xl font-bold mb-6">Réserver une table</h1>

      <div 
        *ngIf="reservationConfirmed" 
        class="p-4 mb-4 bg-green-100 border-l-4 border-green-600 text-green-700 rounded"
      >
        ✅ Votre réservation a été enregistrée avec succès!
      </div>

      <div class="bg-white shadow-lg rounded-xl p-6">
        <form [formGroup]="reservationForm" (ngSubmit)="submitReservation()">

          <div class="mb-4">
            <label class="block font-medium mb-1">Nom *</label>
            <input
              type="text"
              formControlName="name"
              class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
              [ngClass]="{'border-red-500': reservationForm.get('name')?.invalid && reservationForm.get('name')?.touched}"
            />
            <div
              *ngIf="reservationForm.get('name')?.invalid && reservationForm.get('name')?.touched"
              class="text-red-600 mt-1 text-sm"
            >
              Le nom est obligatoire.
            </div>
          </div>

          <div class="mb-4">
            <label class="block font-medium mb-1">Email *</label>
            <input
              type="email"
              formControlName="contact"
              class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
              [ngClass]="{'border-red-500': reservationForm.get('contact')?.invalid && reservationForm.get('contact')?.touched}"
              placeholder="votre@email.com"
            />
            <div
              *ngIf="reservationForm.get('contact')?.invalid && reservationForm.get('contact')?.touched"
              class="text-red-600 mt-1 text-sm"
            >
              Un email valide est requis.
            </div>
          </div>

          <!-- زرّ الحجز -->
          <button
            type="submit"
            class="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            [disabled]="reservationForm.invalid"
          >
            Réserver
          </button>

        </form>
      </div>
    </div>
  `
})
export class ReserverPageComponent {
  reservationForm: FormGroup;
  reservationConfirmed = false;
  minDate: string;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', [Validators.required, Validators.email]],
      numberOfPeople: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

 submitReservation() {
  if (this.reservationForm.valid) {

    this.restaurantService.addReservation(this.reservationForm.value);

    this.reservationConfirmed = true;

    this.reservationForm.reset();
  }
}

}
