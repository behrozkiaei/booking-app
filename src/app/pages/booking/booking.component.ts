import { StoreService } from './../../core/services/store.service';
import { PopupService } from '../../core/services/popup.service';
import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet'; 
import { NgElement, WithProperties } from '@angular/elements';
import { CustomPopupComponent } from '../../components/custom-popup/custom-popup.component';
Leaflet.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  constructor( private popupService : PopupService , private storeService : StoreService) { }
  locations
  ngOnInit(): void {
  }
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:  'Communere Co.',
      })
    ],
    zoom: 16,
    center: { lat: 28.626137, lng: 79.821603 }
  }

  initMarkers() {
    this.storeService.currentStore.subscribe(res=>{
      
      const initialMarkers = [ ];
      this.locations = res ;
      
      this.locations.forEach((element , index) => {
        initialMarkers.push({
            position: { lat: element.lat, lng: element.lng },
        })
      })

      for (let index = 0; index < initialMarkers.length; index++) {
        const data = initialMarkers[index];
        const popupEl = this.popupService.returnPopUpHTML({
          ...this.locations[index] ,
          index : index
        });
        const marker = this.generateMarker(data, index);
        marker.addTo(this.map)
        .bindPopup(popupEl)
        this.map.panTo(data.position);
        this.markers.push(marker)
      }
    })
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
    
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    // console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 
 
}
