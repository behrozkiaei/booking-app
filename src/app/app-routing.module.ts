import { BookingComponent } from './pages/booking/booking.component';
import { FormComponent } from './pages/form/form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'form', component: FormComponent },
  { path: 'form/:index', component: FormComponent },
  { path: 'booking', component: BookingComponent },
  { path: '', component: BookingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
