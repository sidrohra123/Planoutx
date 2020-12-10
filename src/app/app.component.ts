import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MethodsService } from './methods.service';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  public loadingAnimPaths = ['assets/loading/11504-birthday.json', 'assets/loading/7991-fixed-scheduling.json', 'assets/loading/12389-happy-holidays.json', 'assets/loading/5602-credit-card-party.json', 'assets/loading/13498-new-year-party.json'];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public methods:MethodsService,
    public router:Router,
    public data:DataService
  ) {
    this.methods.updateAppIfAvailable();
    this.data.multilottieConfig = {
      path: this.data.loadingAnimPaths[Math.floor(Math.random()*this.loadingAnimPaths.length)],
      autoplay: true,
      loop: true
    };
    this.initializeApp();
    this.methods.checkIfMobile();
    window.onresize = ()=>{
      this.methods.checkIfMobile();
    };
    this.methods.checkIfLoggedIn();
    this.methods.getCatalog().then(()=>{
      this.methods.initFirebase();
      this.methods.getUserBalance();
      this.methods.getUserAddresses();
      this.methods.getOrders();
      this.methods.getWishList();
      this.methods.getCart();
      this.methods.getAppSettings();
      this.methods.getAllOffersNew();
      this.methods.getAllPages().then((pages)=>{});
      this.methods.getBanners().then((banners)=>{});
    }).catch((err)=>{
      console.log(err);
    });
    this.checkFirstTimeUser();
  }

  checkFirstTimeUser(){
    let firstTimeUser = localStorage.getItem('firstPopupInteracted');
    if(firstTimeUser == null){
      this.data.isFirstTimeUser = true;
    } else {
      this.data.isFirstTimeUser = false;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')){
        this.statusBar.backgroundColorByHexString('#f5444c');
        this.splashScreen.hide();
      }
    });
  }

  handleAnimation(e){
    console.log(e);
    this.anim = e;
  }

  onNavStart(){
    this.data.multilottieConfig['path'] = this.data.loadingAnimPaths[Math.floor(Math.random()*this.data.loadingAnimPaths.length)];
    this.methods.generateCanonical();
  }

  sendToWhatsapp(){
    self.location.href = 'https://api.whatsapp.com/send?phone=918920547957&text=Hey, I need your help in making our moments more special and memorable!';
  }

  setFirstTimeUser(){
    localStorage.setItem('firstPopupInteracted', 'true');
    this.data.isFirstTimeUser = false;
  }

  setCakeVisited(){
    this.data.isNewSignup = false;
  }
}
