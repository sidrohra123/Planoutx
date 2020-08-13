import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/data.service';
import { MethodsService } from 'src/app/methods.service';

@Component({
  selector: 'app-otherplans',
  templateUrl: './otherplans.page.html',
  styleUrls: ['./otherplans.page.scss'],
})
export class OtherplansPage implements OnInit {
  public plans = [];
  bannerConfig={
    loop:true
  }

  selectedPlan:any;
  public faqs = [
    {title:'WHAT IS PLANOUT PASSPORT', desc:'PLANOUT PASSPORT IS A MEMBERSHIP THAT ALLOWS YOU TO PLAN YOUR PARTY HASSLE FREE WITH ALL REQUIRED THINGS IN YOUR BUDGET'},
    {title:'FOR WHICH OCCASION I CAN USE THIS PASSPORT?', desc:'FOR ANY OCCASION WHEATHER IT’S YOUR BIRTHDAY, YOUR FRIEND’S BIRTHDAY, YOUR PARENTS ANNIVERSARY OR THEIR BIRTHDAY.'},
    {title:'HOW DOES IT WORK', desc:'JUST PURCHASE PASSPORT AND CLICK ON AVAIL NOW. GET IT DELIVERED ON SELECTED DATE.'},
    {title:'HOW MANY DEVICES CAN I USE MY PASSPORT ON?', desc:'YOU CAN USE YOUR PASSPORT TO PLAN YOUR SPECIAL DAY ONLY ON SINGLE DEVICE/ ONE TIME. WE HIGHLY RECOMMEND NOT TO SHARE YOUR LOGIN DETAILS WITH ANYONE ELSE.'},
  ];
  selectedFaq;
  constructor(public modalCtrl:ModalController, public data:DataService, public methods:MethodsService) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.methods.getPassportPlans().then((plans:any) => {
      this.plans = plans;
      this.selectPlan(0);
    });
  }

  dismiss(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  selectPlan(i){
    this.selectedPlan=this.plans[i];
  }

  selectFaq(index){
    this.selectedFaq && this.selectedFaq.title==this.faqs[index].title ? this.selectedFaq = undefined : this.selectedFaq = this.faqs[index];
  }

  buyMembership(){
    this.methods.addMembership(this.selectedPlan);
  }

}
