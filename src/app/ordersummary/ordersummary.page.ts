import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

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
            }
            console.log(this.summary);
            this.data.cart && this.data.cart.length ? this.data.cart.forEach((item)=>{
              this.methods.removeFromCart(item, 'noalert');
            }) : this.methods.getCart().then((cart)=>{
              this.data.cart.forEach((item)=>{
                this.methods.removeFromCart(item, 'noalert');
              })
            });
          }
        });
      }
    });

    window.onbeforeunload = ((e)=>{
      self.location.href="/";
    });
  }

}
