import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {
  reservationForm: FormGroup;
  reservationConfirmed = false;
  reservationId = 0;
  minDate: string;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
      numberOfPeople: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      date: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      time: ['', Validators.required]
    });
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { pastDate: true };
  }

  getAvailableTimes(): string[] {
    const times: string[] = [];
    for (let hour = 11; hour <= 22; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      const formValue = this.reservationForm.value;
      const reservation = this.restaurantService.addReservation({
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        numberOfPeople: formValue.numberOfPeople,
        date: new Date(formValue.date),
        time: formValue.time
      });
      this.reservationId = reservation.id;
      this.reservationConfirmed = true;
      this.reservationForm.reset({ numberOfPeople: 2 });
    }
  }

  closeConfirmation(): void {
    this.reservationConfirmed = false;
  }
}
