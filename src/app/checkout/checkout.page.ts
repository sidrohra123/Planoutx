import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MycouponsPage } from '../profile/mycoupons/mycoupons.page';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  public maxCake = 25;
  public couponFormOpened:boolean = false;
  public couponcode = '';
  cartFilter = {
    type:'none'
  }
  constructor(public data:DataService, public methods:MethodsService, public router:Router, public modalController: ModalController) { }

  ngOnInit() {
    this.methods.getUserAddresses().then((addrs:any)=>{
      if(addrs.length){
        this.data.deliveryAddress = addrs[0];
      }
    });

    this.methods.getAllCoupons();
    this.methods.processLogin();
  }

  keepGettingCart(){
    let cartget = setInterval(() => {
      if(this.data.cart && this.data.cart.length){
        this.showCouponsPopup().then(() => {
          this.data.isCouponPopup = true;
        });
        clearInterval(cartget);
      }
    },100);
    setTimeout(() => {
      clearInterval(cartget);
    },10000);
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
    if(!this.data.couponCode.trim()){
      this.methods.showToast('Please enter coupon code');
      return false;
    }
    this.methods.applyCoupon(this.data.couponCode);
  }

  removeCoupon(){

  }

  toggleUpsell(e, prod){
    if(e.detail.checked){
      let today = new Date()
      prod.shipping_time = {
        from:this.data.deliveryHours.from,
        to:this.data.deliveryHours.to
      }
      prod.shipping_date = today.setDate(today.getDate()+5);
      this.methods.addUpsell(prod, 1);
      prod.isUpsellAdded = true;
    } else {
      this.methods.removeFromCart(prod);
      prod.isUpsellAdded = false;
    }
  }

  ionViewDidEnter(){
    this.keepGettingCart();
  }

  async showCouponsPopup(){
    var popupInteracted = sessionStorage.getItem('couponPopupInteracted');
    console.log(popupInteracted);
    if(!this.data.appliedCoupon && !popupInteracted){
      this.data.couponsModal = await this.modalController.create({
        component: MycouponsPage,
        cssClass: 'couponsPopup',
        backdropDismiss:true,
        mode:'ios'
      });
      return await this.data.couponsModal.present();
    }
  }

}
