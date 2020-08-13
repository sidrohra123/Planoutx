import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-userorders',
  templateUrl: './userorders.page.html',
  styleUrls: ['./userorders.page.scss'],
})
export class UserordersPage implements OnInit {

  orders = [];
  isFormOpened:boolean = false;
  public query = {
    name:'',
    email:'',
    feedback:''
  }

  constructor(public methods:MethodsService, public data:DataService) { }

  ngOnInit() {
    this.methods.getOrders().then((ordrs:any)=>{
      this.orders = ordrs.reverse();
      console.log(this.orders);
    })
  }

  raiseQuery(order){
    this.populateFormFields(order);
    this.openRaiseQueryForm();
  }

  openRaiseQueryForm(){
    this.isFormOpened = true;
  }

  populateFormFields(order){
    this.methods.checkIfLoggedIn().then((usr)=>{
      this.query.name = this.data.userInfo.customers_firstname + ' ' + this.data.userInfo.customers_lastname;
      this.query.email = this.data.userInfo.customers_email_address;
      this.query.feedback = 'I have a query regarding my order with Id '+order.orders_id+ ' amounting to Rs.'+order.order_price+'.';
    });
  }

  closeQueryForm(){
    this.isFormOpened = false;
  }

  sendQuery(){
    if(!this.query.name.trim()){
      this.methods.showToast('Please enter your name first');
      return false;
    }
    if(!this.query.email.trim()){
      this.methods.showToast('Please enter your email first');
      return false;
    }
    if(!this.query.feedback.trim()){
      this.methods.showToast('Please enter atleast a few words to describe your query');
      return false;
    }
    this.methods.sendForm(this.query).then((dat)=>{
      this.query.name = '';
      this.query.email = '';
      this.query.feedback = '';
      this.closeQueryForm();
    });
  }

}
