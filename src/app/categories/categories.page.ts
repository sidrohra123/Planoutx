import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  constructor(public data:DataService, private route:ActivatedRoute, public methods:MethodsService) { 
    this.route.params.subscribe((params)=>{
      if(params.id){
        console.log(params.id);
        this.methods.getSubCatById(params.id);
      }
      else{
        this.data.subCategories = [];
      }
    })
  }

  ngOnInit() {
  }

}
