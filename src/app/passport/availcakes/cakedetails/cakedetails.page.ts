import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MethodsService } from 'src/app/methods.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-cakedetails',
  templateUrl: './cakedetails.page.html',
  styleUrls: ['./cakedetails.page.scss'],
})
export class CakedetailsPage implements OnInit {
  cake:any;
  today = new Date();
  tomorrow = this.today.setDate(this.today.getDate() + 1);
  constructor(public route:ActivatedRoute, public methods:MethodsService, public data:DataService) { }

  ngOnInit() {
    this.methods.fetchUserLocationFromDb();
    this.route.params.subscribe((pars)=>{
      console.log(pars);
      if(pars.cakeName){
        this.methods.getProductsByName(pars.cakeName).then((prod)=>{
          console.log(prod);
          this.cake = prod;
          if(this.cake.attributes && this.cake.attributes.length){
            this.cake.attributes.forEach((attr)=>{
              if(!attr.selectedValue){
                attr.selectedValue = attr.values[0];
                this.cake.products_price = (+this.cake.products_price + +attr.selectedValue.price).toFixed(2);
                }
            });
          }
        });
      }
    });
  }

}
