import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-occasions',
  templateUrl: './occasions.page.html',
  styleUrls: ['./occasions.page.scss'],
})
export class OccasionsPage implements OnInit {

  constructor(public methods:MethodsService, public data:DataService) { }

  ngOnInit() {
    if(!this.data.ocassions.length){
      this.methods.getCatalog().then((catalog)=>{

      });
    }
  }

}
