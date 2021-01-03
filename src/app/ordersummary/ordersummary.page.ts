import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { sum } from 'lodash';
declare var fbq:any;

@Component({
  selector: 'app-ordersummary',
  templateUrl: './ordersummary.page.html',
  styleUrls: ['./ordersummary.page.scss'],
})
export class OrdersummaryPage implements OnInit {

  public summary;
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  public freeProduct:any;
  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '100%',
    margin: '0 auto',
  };
  constructor(public methods:MethodsService, public data:DataService, public route:ActivatedRoute, public router:Router) {
    this.lottieConfig = {
      path: 'assets/433-checked-done.json',
      autoplay: true,
      loop: false
    };
   }

   handleAnimation(e){
    console.log(e);
    this.anim = e;
  }

  ngOnInit() {
    this.methods.getCatalog();
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.methods.getOrderById(params.id).then((summ:any)=>{
          // this.anim.play();
          if(summ.data){
            this.summary = summ;
            if(this.summary.data.coupon_data){
              this.summary.data.coupon_data = JSON.parse(this.summary.data.coupon_data);
              let getProducts = setInterval(() => {
                if(this.data.allProducts.length){
                  this.checkForFreeProduct(this.summary.data.coupon_data);
                  clearInterval(getProducts);
                }
              },100);
            }
            if(this.summary.data.data && this.summary.data.data.length){
              this.summary.data.data.forEach((prod) => {
                if(prod.shipping_time){
                  prod.shipping_time = JSON.parse(prod.shipping_time);
                }
              });
            }
            console.log(this.summary);
            this.data.cart && this.data.cart.length ? this.data.cart.forEach((item)=>{
              this.methods.removeFromCart(item, 'noalert');
            }) : this.methods.getCart().then((cart)=>{
              this.data.cart.forEach((item)=>{
                this.methods.removeFromCart(item, 'noalert');
              })
            });
            fbq('track', 'Purchase', {currency: "INR", value: +summ.total_price});
          }
        });
      }
    });

    window.onbeforeunload = ((e)=>{
      self.location.href="/";
    });
  }

  checkForFreeProduct(coupon){
    if(+coupon.coupon_cake_id >= 1){
      this.data.allProducts.forEach((prod:any) => {
        if(+prod.products_id == +coupon.coupon_cake_id){
          this.freeProduct = prod;
        }
      })
      console.log(this.freeProduct)
    }
  }

}
