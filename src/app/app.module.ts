// import { PopupService } from './core/services/popup.service';
import { CustomPopupComponent } from './components/custom-popup/custom-popup.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './pages/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingComponent } from './pages/booking/booking.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    BookingComponent,
    CustomPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
