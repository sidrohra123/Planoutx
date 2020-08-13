import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  public maxCake = 25;
  public couponFormOpened:boolean = false;
  public couponcode = '';
  constructor(public data:DataService, public methods:MethodsService, public router:Router) { }

  ngOnInit() {
    this.methods.getUserAddresses().then((addrs:any)=>{
      if(addrs.length){
        this.data.deliveryAddress = addrs[0];
      }
    });

    this.methods.getAllCoupons();
    this.methods.processLogin();
  }

  validateandplace(){
    if(!this.data.deliveryAddress){
      this.methods.showToast('Please select an address to continue');
    }
    else{
      this.router.navigate(['/payment-options']);
    }
  }

  toggleCouponForm(){
    this.data.couponFormOpened = !this.data.couponFormOpened;
    if(this.data.couponFormOpened){
      setTimeout(()=>{
        document.getElementById('couponCodeField').focus();
      },100);
    }
  }

  applyCoupon(){
    if(!this.couponcode.trim()){
      this.methods.showToast('Please enter coupon code');
      return false;
    }
    this.methods.applyCoupon(this.couponcode);
  }

  removeCoupon(){

  }

}
