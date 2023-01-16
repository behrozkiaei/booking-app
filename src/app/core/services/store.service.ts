import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private store = new BehaviorSubject<any>(JSON.parse(window.localStorage.getItem("data")) || []);
  public currentStore = this.store
    .asObservable()
    .pipe(distinctUntilChanged());
  constructor() { }

  updateStore(obj){
    this.store.next(obj)
    window.localStorage.setItem("data",JSON.stringify(obj))
  }

  
}
