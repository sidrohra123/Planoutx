import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  constructor(public data:DataService, public methods:MethodsService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      if(params && params.mainCatIndex){
        this.methods.getCatalog().then((res)=>{
          this.methods.getSubCatByMainCat(params.mainCatIndex);
        });
        this.data.selectedSubCat = undefined;
      }
      if(params && params.catIndex && params.subIndex){
        this.methods.getCatalog().then((res)=>{
          this.methods.getSubSubCatBySubCat(params.catIndex, params.subIndex);
        });
        this.data.selectedCat = undefined;
      }
    })
  }

}
