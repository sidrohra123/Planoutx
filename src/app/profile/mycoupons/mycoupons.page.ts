import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MethodsService } from 'src/app/methods.service';

@Component({
  selector: 'app-mycoupons',
  templateUrl: './mycoupons.page.html',
  styleUrls: ['./mycoupons.page.scss'],
})
export class MycouponsPage implements OnInit {

  userCoupons = [];
  constructor(public methods:MethodsService, public data:DataService) { }

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.getUserCoupons();
  }

  getUserCoupons(){
    this.userCoupons = [];
    this.methods.getAllCoupons().then((coupons:any)=>{
      this.methods.checkIfLoggedIn().then((usr) => {
        console.log(coupons);
        if(coupons.length){
          coupons.forEach((coupon)=>{
            //check for user specific coupons
            if(coupon.email_restrictions){
              let emailsOfCoupon = coupon.email_restrictions.split(',');
              emailsOfCoupon.forEach((coupEmail)=>{
                if(coupEmail==this.data.userInfo.customers_email_address && coupon.discount_type!='membership_coupon'){
                  this.userCoupons.push(coupon);
                }
              });
            }
            //check for common coupons but not for members only coupons
            if(!coupon.email_restrictions && coupon.discount_type!='membership_coupon'){
              this.userCoupons.push(coupon);
            }
            //check for members only coupons
            if(coupon.discount_type=='membership_coupon' && coupon.coupon_mem!='1' && this.data.userInfo.membership && this.data.userInfo.membership.length){
              this.userCoupons.push(coupon);
            }

            if(coupon.expiry_date){
              //coupon.expiry_date = new Date(coupon.expiry_date).getTime().toString();
            }
          });
          console.log(this.userCoupons);
        }
      });
    });
  }

  copyCode(coupon){
    let nav:any = navigator;
    nav.clipboard.writeText(coupon.code).then((code)=>{
      this.methods.showToast('Code '+coupon.code+' copied successfully. Use this code in checkout.', 5000);
      this.data.couponFormOpened = true;
      this.data.couponCode = coupon.code;
      if(this.data.couponFormOpened){
        setTimeout(()=>{
          document.getElementById('couponCodeField') ? document.getElementById('couponCodeField').focus() : null;
        },100);
      }
      this.dismissModal();
    });
  }

  dismissModal(){
    this.data.couponsModal ? this.data.couponsModal.dismiss() : null;
    if(this.data.isCouponPopup){
      sessionStorage.setItem('couponPopupInteracted', 'true');
    }
  }

}
