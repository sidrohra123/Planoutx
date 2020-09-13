import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.page.html',
  styleUrls: ['./addons.page.scss'],
})
export class AddonsPage implements OnInit {

  products = [];
  addonCart = [];
  cartProduct:any;
  addonSession:number;
  constructor(public methods:MethodsService, public data:DataService, public route:ActivatedRoute) { }

  ngOnInit() {
  }

  keepGettingCart(cb){
    let d = setInterval(()=>{
      if(this.data.cart.length && this.data.categories.length){
        cb(this.data.cart);
        clearInterval(d);
      }
    },100);
  }

  ionViewDidEnter(){
    this.addonSession = Math.floor(Math.random()*2000);
    this.products = [];
    this.keepGettingCart((cart)=>{
      this.route.params.subscribe((params) => {
        if(params.prodid && cart.length && this.data.categories.length){
          let currentProduct:any = _.find(this.data.allProducts, {'products_id':+params.prodid});
          let cartProduct = _.find(cart, {categories_product_id:currentProduct.category_ids});
          console.log(cartProduct);
          this.cartProduct = cartProduct;
          let currCategories = cartProduct ? cartProduct.categories_product_id.split(',') : undefined;
          currCategories && currCategories.length ? currCategories.forEach((cat) => {
            this.data.categories.forEach((allCat) => {
              if(allCat.id == +cat){
                if(allCat.addon_products){
                  allCat.addon_products.split(',').forEach((addonProd) => {
                    this.products.push(_.find(this.data.allProducts, {'products_id':+addonProd}));
                  });
                }
              }
            });
          }) : undefined;
        }
      });
    });
  }

  addAddon(parentProd,prod){
    parentProd.basket_id = parentProd.customers_basket_id;
    this.methods.addAddon(parentProd,prod,1).then((result) => {
      this.addonCart.push(result);
    }).catch((err) => {
      console.log(err);
    });
  }

}
