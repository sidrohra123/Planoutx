import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OtherplansPage } from './otherplans/otherplans.page';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.page.html',
  styleUrls: ['./passport.page.scss'],
})
export class PassportPage implements OnInit {

  canUpgrade:boolean = false;

  bannerConfig={
    loop:true
  }

  selectedPlan:any;
  boughtPlan:any;

  passportBanners = [
    {url:'https://www.hospibuz.com/wp-content/uploads/2018/01/Merchant-Gold-Social-Post_2-777x437.jpg'},
    {url:'https://pbs.twimg.com/tweet_video_thumb/DYZVDzeW4AAAPM-.jpg'},
    {url:'https://www.grand-indonesia.com/wp-content/uploads/2019/12/GI-websitebanner.jpg'},
    {url:'https://www.shoppinglootz.com/wp-content/uploads/2019/10/c1e92fe7e30-zomato-in-app-banner-B.jpg'},
  ];
  plans = [];
  public faqs = [
    {title:'WHAT IS PLANOUT PASSPORT?', desc:'PLANOUT PASSPORT IS A MEMBERSHIP THAT ALLOWS YOU TO PLAN YOUR PARTY HASSLE FREE WITH ALL REQUIRED THINGS IN YOUR BUDGET'},
    {title:'FOR WHICH OCCASION I CAN USE THIS PASSPORT?', desc:'FOR ANY OCCASION WHEATHER IT’S YOUR BIRTHDAY, YOUR FRIEND’S BIRTHDAY, YOUR PARENTS ANNIVERSARY OR THEIR BIRTHDAY.'},
    {title:'HOW DOES IT WORK?', desc:'JUST PURCHASE PASSPORT AND CLICK ON AVAIL NOW. GET IT DELIVERED ON SELECTED DATE.'},
    {title:'HOW MANY DEVICES CAN I USE MY PASSPORT ON?', desc:'YOU CAN USE YOUR PASSPORT TO PLAN YOUR SPECIAL DAY ONLY ON SINGLE DEVICE/ ONE TIME. WE HIGHLY RECOMMEND NOT TO SHARE YOUR LOGIN DETAILS WITH ANYONE ELSE.'},
  ];
  selectedFaq;
  otherPlansWrapper:any;
  canBuyPassport:boolean = true;
  constructor(public methods:MethodsService, public data:DataService, public sanitize:DomSanitizer, public router:Router, public modalController: ModalController, ) { }

  ngOnInit() {
    this.checkIfPassportAvailableToBuy();
  }

  async openPlansPopup(){
    this.otherPlansWrapper = await this.modalController.create({
      component: OtherplansPage,
      mode:'ios',
      cssClass:'otherPlans',
      backdropDismiss:true,
      showBackdrop:true
    });
    return await this.otherPlansWrapper.present();
    
  }

  ionViewDidEnter(){
    this.boughtPlan = undefined;
    this.plans = [];
    this.getBoughtPlan();
  }

  selectPlan(i){
    this.selectedPlan=this.plans[i];
    let planList:any = document.getElementsByClassName('benefitsList');
    if(planList && planList.length){
      document.querySelectorAll('ion-content')[1].scrollToPoint(0, planList[0].offsetTop - 20, 500);
    }
  }

  buyMembership(){
    this.methods.addMembership(this.selectedPlan);
  }

  getBoughtPlan(){
    this.canUpgrade = false;
    this.methods.checkIfLoggedIn().then((usr)=>{
      this.data.isProcessing = true;
      this.methods.processLogin().then((newUsr)=>{
        this.data.isProcessing = false;
        if(this.data.userInfo.membership && this.data.userInfo.membership.length){
          this.boughtPlan = this.data.userInfo.membership[0];
        }
        else{
          this.methods.getPassportPlans().then((plans:any) => {
            this.plans = plans;
            this.selectPlan(0);
          });
        }
      });
    }).catch(()=>{
      this.methods.getPassportPlans().then((plans:any) => {
        this.plans = plans;
        this.selectPlan(0);
      });
    });
  }

  selectFaq(index){
    this.selectedFaq && this.selectedFaq.title==this.faqs[index].title ? this.selectedFaq = undefined : this.selectedFaq = this.faqs[index];
  }

  toCakes(){
    this.data.selectedFilters.price='Below ₹ 500';
    this.router.navigate(['/shop', 'cakes']);
  }

  toDecoration(){
    this.data.selectedFilters.price='Below ₹ 2000';
    this.router.navigate(['/shop', 'decoration']);
  }

  ionViewDidLeave(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  checkIfPassportAvailableToBuy(){
    if(this.data.passOffers.length){
      this.data.passOffers.forEach((offer)=>{
        if(offer.banners_url == 'passport_not_available'){
          this.canBuyPassport = false;
        }
      });
    }
    else{
      this.methods.getAllOffersNew().then((offs)=>{
        this.checkIfPassportAvailableToBuy()
      })
    }
  }

  getNotified(){
    let details = {
      feedback:'I want to purchase passport. Please have me notified if it\'s available!',
      responseMessage:'Thank you! You will be notified once our Passport service is available!'
    }
    this.methods.sendForm(details);
  }

}
