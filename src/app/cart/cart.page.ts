import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  constructor(public methods:MethodsService, public data:DataService, public router:Router) { }

  ngOnInit() {
    
  }

  toCheckout(){
    this.router.navigate(['/checkout']);
  }

  addAddon(parentProd,prod){
    this.methods.addAddon(parentProd,prod,1);
  }

}
