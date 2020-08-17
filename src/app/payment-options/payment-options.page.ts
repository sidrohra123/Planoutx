import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.page.html',
  styleUrls: ['./payment-options.page.scss'],
})
export class PaymentOptionsPage implements OnInit {
  finalUsableAmount:number = 0;
  constructor(public data:DataService, public methods:MethodsService, public router:Router) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    if(!this.data.deliveryAddress || !this.data.cart || !this.data.cart.length){
      this.router.navigate(['/checkout']);
    }
    else{
      this.methods.getUserBalance().then((blnc)=>{
        console.log(blnc);
        this.getFinalWalletAmount();
      });
    }
  }

  getFinalWalletAmount(){
    let userWalletTotal = +this.data.userWalletBalance;
    let cartTotal = +this.data.cartTotal;
    let usableAmount = 20;
    let finalAmountUsable = 0;
    console.log(cartTotal);
    if(userWalletTotal < cartTotal){
      finalAmountUsable = (usableAmount/100)*userWalletTotal;
    } else if(cartTotal < userWalletTotal){
      finalAmountUsable = (usableAmount/100)*cartTotal;
    }
    this.finalUsableAmount = finalAmountUsable;
    console.log(finalAmountUsable);
  }

}
