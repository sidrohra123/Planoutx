import { Component, OnInit, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { PopoverController } from '@ionic/angular';
import { MethodsService } from 'src/app/methods.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sort-products',
  templateUrl: './sort-products.component.html',
  styleUrls: ['./sort-products.component.scss'],
})
export class SortProductsComponent implements OnInit {
  constructor(public data:DataService, public popoverController:PopoverController, public methods:MethodsService) { }

  ngOnInit() {
    
  }

  sortProductsBy(type){
    this.data.selectedSortBy = type;
    this.sortProducts(type);
    this.popoverController.dismiss();
  }
  

  sortProducts(type){
    console.log(type);
    if(type=='new'){
      this.data.allFiltered.products.sort((a,b)=>{
        if(new Date(a.products_date_added) > new Date(b.products_date_added)){
          return -1;
        }
        else{
          return 1;
        }
      });
    }
    if(type=='recommended'){
      this.methods.filterEverythingByNames(this.data.filterParams);
    }
    if(type=='pltoh'){
      this.data.allFiltered.products.sort((a,b)=>{
        if(+a.products_price < +b.products_price){
          return -1;
        }
        else{
          return 1;
        }
        return 0;
      });
    }
    if(type=='phtol'){
      this.data.allFiltered.products.sort((a,b)=>{
        if(+a.products_price > +b.products_price){
          return -1;
        }
        else{
          return 1;
        }
        return 0;
      });
    }
  }

}
