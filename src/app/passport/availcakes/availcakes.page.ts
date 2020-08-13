import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MethodsService } from 'src/app/methods.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availcakes',
  templateUrl: './availcakes.page.html',
  styleUrls: ['./availcakes.page.scss'],
})
export class AvailcakesPage implements OnInit {
  public cakes = [];
  public boughtPlan:any;
  constructor(public data:DataService, public methods:MethodsService, public router:Router) {
    console.log(router.url);
   }

  ngOnInit() {
    this.getEligibleCakes();
  }

  getEligibleCakes(){
    this.methods.checkIfLoggedIn().then((usr)=>{
      if(this.data.userInfo.membership && this.data.userInfo.membership.length){
        if(this.data.allProducts.length){
          this.methods.getPassportPlans().then((plans:any)=>{
            plans.forEach((plan)=>{
              if(plan.id==this.data.userInfo.membership[0].plan_id){
                this.boughtPlan = plan;
              }
            });
            console.log(this.boughtPlan);            
            let cakes = [];
            this.data.allProducts.forEach((prod:any)=>{
              if(prod.categories_id == '1' && +prod.products_price <= +this.boughtPlan.plan_cashback_cakes_base_value){
                cakes.push(prod);
              }
            });
            this.cakes = cakes;
            console.log(cakes);
          });
        }
        else{
          this.methods.getCatalog().then((cats)=>{
            this.getEligibleCakes();
          });
        }
      }
    });
  }

  goToProduct(product){
    this.router.navigate(['/passport/availcakes', product.products_name]);
  }

}
