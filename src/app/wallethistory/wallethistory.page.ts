import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-wallethistory',
  templateUrl: './wallethistory.page.html',
  styleUrls: ['./wallethistory.page.scss'],
})
export class WallethistoryPage implements OnInit {
  history = [];
  totalAmt = '';
  constructor(public data:DataService, public methods:MethodsService) { }

  ngOnInit() {
    this.methods.getUserBalance().then((hist:any)=>{
      let amount = 0;
      hist.forEach((wallet)=>{
        amount = amount + +wallet.amount;
        this.totalAmt = amount.toString();
        wallet.user_description ? wallet.user_description = JSON.parse(wallet.user_description) : null;
      });
      console.log(hist);
      this.history = hist.reverse();
    })
  }

}
