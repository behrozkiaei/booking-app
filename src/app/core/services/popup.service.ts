import { CustomPopupComponent } from '../../components/custom-popup/custom-popup.component';
import { Injectable } from '@angular/core';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  returnPopUpHTML(popupData: any): HTMLElement  {
    // Create element
    const popup = document.createElement('popup-component');

    // Create the component and wire it up with the element
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(CustomPopupComponent);
    const popupComponentRef = factory.create(this.injector, [], popup);

    // Attach to the view so that the change detector knows to run
    this.applicationRef.attachView(popupComponentRef.hostView);
  

    // Set the message
    popupComponentRef.instance.name = popupData.name;
    popupComponentRef.instance.type = popupData.type;
    popupComponentRef.instance.image = popupData.image;
    popupComponentRef.instance.index = popupData.index;

    // Return rendered Component
    return popup;
  }
}
