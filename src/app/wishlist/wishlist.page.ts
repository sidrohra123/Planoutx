import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  public wishlist = [];
  constructor(public data:DataService, public methods:MethodsService) { }

  ionViewDidEnter(){
    this.wishlist = [];
    this.methods.getWishList().then((dat:any)=>{
      this.getWishListProducts(dat);
    });
  }

  ngOnInit() {
    
  }

  removeProd(product){
    this.methods.removeFromWishList(product).then((res)=>{
      this.wishlist = [];
      this.methods.getWishList().then((dat:any)=>{
        this.getWishListProducts(dat);
      });
    });
  }

  getWishListProducts(dat){
    let d = dat;
    if(d.product_data && d.product_data.length){
      if(this.data.allProducts.length){
      d.product_data.forEach((wish)=>{
          this.data.allProducts.forEach((prod:any)=>{
            if(prod.products_id==wish.liked_products_id){
              this.wishlist.push(prod);
            }
          });
      });
    }
    else{
      this.methods.getCatalog().then(()=>{
        this.getWishListProducts(d);
      });
    }
    }
    console.log(this.wishlist);
  }

}
