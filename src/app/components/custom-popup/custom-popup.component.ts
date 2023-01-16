import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.css']
})
export class CustomPopupComponent implements OnInit {
  @Input() name = '';
  @Input() image = '';
  @Input() type = '';
  @Input() index;
  constructor(private route: Router) {

   }

  edit(index){
    this.route.navigate([`form/${index}`])
  }
  ngOnInit() {

  }

}