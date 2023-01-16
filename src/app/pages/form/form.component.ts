import { StoreService } from './../../core/services/store.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as L from 'leaflet';
import { ActivatedRoute ,Router} from '@angular/router';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent   implements AfterViewInit  {
  file
  image
  lat
  lng
  map: any;
  zoom = 14;
  markers 
  marker
  showAlert = false
  showSuccess = false
  locationType = "business"
  editMode = false;
  editIndex ;
  constructor(
    private route: ActivatedRoute ,
    private store :StoreService,
    private router : Router) { }
  locationForm = new FormGroup({
    file: new FormControl('',[Validators.required]),
    locationName: new FormControl('',[Validators.required]),
    locationType: new FormControl('',[Validators.required]),
  });
  
  ngOnInit(): void {
    this.route.params
    .subscribe(params => {
      const index = params["index"]
      const data = JSON.parse(window.localStorage.getItem("data"))
      const indexData = data[parseInt(index)]
      if(indexData){
        this.editMode=true
        this.editIndex = index
        this.locationForm.setValue({
          locationName : indexData.name,
          locationType: indexData.type,
          file :indexData.image
       });
       this.locationType = indexData.type;
       this.image = indexData.image;
       this.lat  =indexData.lat;
       this.lng  = indexData.lng;
      }
  
    })
  }
  


 
  onFileSelect(event) {
    console.log(event.target.files)
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      const fr = new FileReader();
      fr.readAsDataURL(event.target.files[0])
      fr.addEventListener("load",()=>{
        this.image = fr.result;
      })
    }
  }

  
  public ngAfterViewInit(): void {
    this.loadMap();
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  private loadMap(): void {

    this.map = L.map('map').setView([0, 0], 1).on("click",(e)=>{
      this.map.removeLayer(this.marker);
   
      const icon = L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [this.zoom, this.zoom*2 ],
        iconAnchor: [0, 10],
      });
       this.lat = e.latlng.lat;
       this.lng = e.latlng.lng;
        this.marker = L.marker([e.latlng.lat,e.latlng.lng],{
          icon,
          draggable:true,
        }).on("dragend",(e)=>{
          this.onChangeLocation( e.target._latlng.lat,e.target._latlng.lng)
        }).addTo(this.map);

    }).on("zoomend",(e)=>{
      this.map.removeLayer(this.marker);
      this.zoom = e.target._zoom
      const iconZoomed = L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [this.zoom, this.zoom*2 ],
        iconAnchor: [0, 10],
      });
      this.marker = L.marker([this.lat,this.lng],{
        icon:iconZoomed,
        draggable:true,
      }).on("dragend",(e)=>{
        this.onChangeLocation( e.target._latlng.lat,e.target._latlng.lng)
      }).addTo(this.map);
    })

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Communere Co.',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: environment.mapbox.accessToken,
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconAnchor: [0, 10],
    });
    if(!this.editMode){

      this.getCurrentPosition()
      .subscribe((position: any) => {
          this.lat = position.latitude;
          this.lng = position.longitude;
          this.map.flyTo([position.latitude, position.longitude], 14);
          this.marker = L.marker([position.latitude, position.longitude],{
            icon,
            draggable:true
          }).on("dragend",(e)=>{
            this.onChangeLocation( e.target._latlng.lat,e.target._latlng.lng)
          })
          this.marker.addTo(this.map);
    });
    
    }else if(this.editMode){
          
          this.map.flyTo([this.lat, this.lng], 14);
          this.marker = L.marker([this.lat, this.lng],{
            icon,
            draggable:true
          }).on("dragend",(e)=>{
            this.onChangeLocation( e.target._latlng.lat,e.target._latlng.lng)
          })
          this.marker.addTo(this.map);
    }
  }
  onChangeLocation(lat,lng){
    this.lat =lat;
    this.lng = lng;
  }

  onSubmit(){
 
    if(this.locationForm.valid ){
      const data = {
        name :this.locationForm.get("locationName").value , 
        type : this.locationForm.get("locationType").value , 
        image : this.image,
        lat : this.lat,
        lng : this.lng, 
      }
      const storeSubscribe = this.store.currentStore.subscribe(res=>{
          const storeJson =res;
          if(this.editMode){
            storeJson[this.editIndex] = data;
          }else{
            storeJson.push(data)
          }
          this.store.updateStore(storeJson)
          this.showSuccess = true
        })
        storeSubscribe.unsubscribe()
    }else{
      this.showAlert = true
    }
  }
  reset(){
    this.showAlert = false
    this.showSuccess = false
  }

  tobooking(){
    this.router.navigate(["/booking"])
  }
}
