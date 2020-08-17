import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  order:any;
  currDay = new Date().getDay();
  currMonth = new Date().getMonth();
  currYear = new Date().getFullYear();
  orderDay:any;
  isEligibleForReturn:boolean = false;
  maxReturnPeriod = 7;
  isReturnOpened:boolean = true;
  isFormOpened:boolean = false;
  public query = {
    name:'',
    email:'',
    feedback:''
  }
  constructor(public methods:MethodsService, public data:DataService, public route:ActivatedRoute, private alert:AlertController) { }

  ngOnInit() {
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.methods.getOrderFromListById(params.id, (order)=>{
          console.log(order);
          this.order = order;
          this.calculateEligibilityforReturn(order);
        });
      }
    })
  }

  calculateEligibilityforReturn(ordr){
    console.log(this.currMonth, this.currYear);
    let ordrDay = new Date(ordr.date_purchased).getDay();
    this.orderDay = ordrDay;
    let ordrMonth = new Date(ordr.date_purchased).getMonth();
    let ordrYear = new Date(ordr.date_purchased).getFullYear();
    console.log(ordrDay, ordrMonth, ordrYear);
    if(ordrMonth == this.currMonth && ordrYear==this.currYear && ordrDay < this.maxReturnPeriod){
      this.isEligibleForReturn = true;
    }
    else{
      this.isEligibleForReturn = false;
    }
  }

  async cancelProductFromOrder(prod){
    const alert = await this.alert.create({
      header:'Cancelling Product',
      backdropDismiss:false,
      message:'Are you sure you want to cancel <strong>'+prod.products_name+'</strong> from your Order?',
      buttons:[
        {
          text:'Confirm',
          handler:()=>{
            this.methods.cancelProductFromOrder(this.order,prod);
          }
        },
        {
          text:'No',
          handler:()=>{
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  async returnProductFromOrder(prod){
    const alert = await this.alert.create({
      header:'Returning Product',
      backdropDismiss:false,
      message:'Are you sure you want to return <strong>'+prod.products_name+'</strong> from your Order?',
      buttons:[
        {
          text:'Confirm',
          handler:()=>{
            this.methods.cancelProductFromOrder(this.order,prod);
          }
        },
        {
          text:'No',
          handler:()=>{
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  openRaiseQueryForm(){
    this.isFormOpened = true;
    this.populateFormFields();
  }

  populateFormFields(){
    this.methods.checkIfLoggedIn().then((usr)=>{
      this.query.name = this.data.userInfo.customers_firstname + ' ' + this.data.userInfo.customers_lastname;
      this.query.email = this.data.userInfo.customers_email_address;
      this.query.feedback = 'I have a query regarding my order with Id '+this.order.orders_id+ ' amounting to Rs.'+this.order.order_price+'.';
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
