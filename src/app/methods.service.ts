import { Injectable, ViewChild } from '@angular/core';
import { MenuController, Platform, AlertController, ToastController, ActionSheetController, LoadingController, PopoverController } from '@ionic/angular';
import { DataService } from './data.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { ApiService } from './api.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import introJs from 'intro.js/intro.js';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import * as _ from "lodash";
import { UrlSlugPipe } from './url-slug.pipe';
import { SwUpdate } from '@angular/service-worker';
declare var AccountKit:any;
declare var zESettings:any;

@Injectable({
  providedIn: 'root'
})
export class MethodsService {
  constructor(private menu:MenuController, private data:DataService, private geolocation: Geolocation, private contacts: Contacts, private youtube: YoutubeVideoPlayer, private api:ApiService, private toast: ToastController, private platform:Platform, private fb: Facebook, private router:Router, private nativeStorage: NativeStorage, private googlePlus: GooglePlus, private alertController:AlertController, private nativeGeocoder: NativeGeocoder, public actionSheetController: ActionSheetController, private socialSharing: SocialSharing, public san:DomSanitizer, private loadingController: LoadingController, public route:ActivatedRoute, private titleService: Title, private metaService: Meta, private sw:SwUpdate) {
    
   }

  initZenDesk(){
    var scriptSrc = document.createElement('script');
    scriptSrc.id = 'ze-snippet';
    scriptSrc.src = 'https://static.zdassets.com/ekr/snippet.js?key=09b5ae81-65fe-47b8-a274-b2483582f69c';
    document.getElementById('chatNew').appendChild(scriptSrc);
    var d = setInterval(()=>{
      if(document.getElementById('launcher')){
        document.getElementById('launcher').click();
        clearInterval(d);
      }
    },100);
  }

  checkQueryParams(){
    this.route.queryParams.subscribe((params)=>{
      if(params){
        this.data.qParams = params;
        if(params.referral_id){
          this.data.referralCode = params.referral_id;
          this.showToast('Referral code applied.');
        }
      }
    })
  }

  intro(){
    let intro = introJs.introJs();
    intro.setOptions({
      doneLabel:'Finish',
      overlayOpacity:0.75,
      disableInteraction:false,
      showStepNumbers:false,
      steps: [
        {
          intro:'Welcome to Planout! This is a guide for you to get started.'
        },
        {
          element: document.querySelector('#step1'),
          intro: "From here you can access and manage your account."
        },
        {
          element: document.querySelector('#step2'),
          intro: "From this side menu you can access your wallet, track your orders and see the profile."
        },
        {
          element: document.querySelector('#step3'),
          intro: "Shop by Category allows you to browse categories and its sub categories as well."
        },
        {
          element: document.querySelector('#step4'),
          intro: "You can filter the products quickly by choosing the categories, recipient, occasion and Location."
        }
      ]
    });
    this.getFromDb('steps').then((dat:any)=>{
      console.log(dat);
      if(dat){
        if(dat && dat.length!=5){
          console.log('Not Watched');
          intro.start();
        }
        else{
        console.log('watched');
        }
      }
      else{
        intro.start();
      }
    }).catch((err)=>{
      intro.start();
    });
    let arrayOfSteps = [];
    intro.onchange((targetElement) => {
      arrayOfSteps.push(targetElement.id);
      
      console.log(targetElement);
      if(targetElement.id=='step2'){
        this.menu.open();
      }
      if(targetElement.id=='step3'){
        this.menu.close();
      }
      this.saveToDb('steps', arrayOfSteps);
    });
  }

  initAll(){
    this.getUserLocation();
    this._get_all_categories();
    this.getOffers();
    this.getLocations();
    this.getOccasions();
    this.getRecipients();
    this.getUserRartings();
    this.getUserCart();
    // this.getSideMenus();
    setTimeout(()=>{
      this.intro();
    },2000);
  }
  openMenu(){
    this.menu.enable(true,'sideMenu');
    this.menu.open('sideMenu');
  }

  getSubCatById(id){
    this.data.subCategories=[];
    if(this.data.fullCatalog.length){
      this.data.fullCatalog.forEach((cat)=>{
        if(cat.i_pki_id==id){
          if(cat.subcategory.length){
            cat.subcategory.forEach((subCat)=>{
              this.data.subCategories.push(subCat);
            });
          }
          
        }
      });
    }
  }

  openVideos(id){
    if(this.platform.is('cordova')){
      this.openVideo(id);
    }
    else{
      window.open('https://www.youtube.com/watch?v=' + id);
    }
  }

  getVideosByChannel(){
    let params = {
      key:'AIzaSyBeS1_QdimEJI232CDkDGG6wkbkq-Modco',
      playlistId:'PL0d2Gzm0xtlJzDmdS7UwQpOMlnFOCZVDq',
      part:'snippet,id',
      maxResults:'10'
    }
    this.api.getFromRoot('https://www.googleapis.com/youtube/v3/playlistItems', params).subscribe((res:any)=>{
      console.log(res);
      if(res.pageInfo && res.items){
        this.data.topVideos = res.items;
        if(!this.data.tags.length){
          this.data.topVideos.forEach((video:any)=>{
            this.getVideoDetails(video.snippet.resourceId.videoId);
          });
        }
      }
    })
  }

  searchYoutube(tag){
    let params = {
      key:'AIzaSyBeS1_QdimEJI232CDkDGG6wkbkq-Modco',
      playlistId:'PL0d2Gzm0xtlJzDmdS7UwQpOMlnFOCZVDq',
      q:'#{'+tag+'}',
      part:'snippet,id',
      maxResults:'10',
      type:'video'
    }
    this.api.getFromRoot('https://www.googleapis.com/youtube/v3/search', params).subscribe((res:any)=>{
      this.data.selectedTag = tag;
      console.log(res);
      if(res && res.items && res.items.length){
        this.data.resultedVideos = res.items;
      }
      else{
        this.showToast('No videos found for '+tag);
      }
    });
  }

  getVideoDetails(id){
    let params = {
      key:'AIzaSyBeS1_QdimEJI232CDkDGG6wkbkq-Modco',
      fields:'items(snippet(title,description,tags))',
      part:'snippet',
      id:id
    }
    this.api.getFromRoot('https://www.googleapis.com/youtube/v3/videos', params).subscribe((res:any)=>{
      if(res.items && res.items.length){
        if(res.items[0].snippet.tags && res.items[0].snippet.tags.length){
          res.items[0].snippet.tags.forEach((tag)=>{
            this.data.tags.push(tag);
          })
        }
      }
      console.log(this.data.tags);
      if(!this.data.resultedVideos.length){
        this.searchYoutube(this.data.tags[0]);
      }
      else{
        return false;
      }
    });
  }

  getVideoDetailsById(id){
    let params = {
      key:'AIzaSyBeS1_QdimEJI232CDkDGG6wkbkq-Modco',
      fields:'items(snippet(title,description,tags))',
      part:'snippet',
      id:'qAtBbgtMnZ8'
    }
    this.api.getFromRoot('https://www.googleapis.com/youtube/v3/videos', params).subscribe((res:any)=>{
      console.log(res);
    }, (err)=>{
      console.log(err);
    })
  }

  openSub(event, index){
    console.log(event);
    event.srcElement.classList.contains('opened') ? event.srcElement.classList.remove('opened') : event.srcElement.classList.add('opened');
    event.srcElement.classList.contains('opened') ? this.data.selectedSubCat = this.data.subCategories[index] : this.data.selectedSubCat=undefined;
  }

  getSubSubCatById(id){
    this.data.subSubCategories = [];
    if(this.data.subCategories.length){
      this.data.subCategories.forEach((subCat)=>{
        if(subCat.subsubcategory && subCat.subsubcategory.length){
          subCat.subsubcategory.forEach((subSubcat)=>{
            this.data.subSubCategories.push(subSubcat);
          });
        }
      });
    }
  }

  initFirebase(){
    var firebaseConfig = {
      apiKey: "AIzaSyAC5RE53YiguyfAo-fLph7gTNjvQgefp7o",
      authDomain: "planoutx.firebaseapp.com",
      databaseURL: "https://planoutx.firebaseio.com",
      projectId: "planoutx",
      storageBucket: "",
      messagingSenderId: "956820123214",
      appId: "1:956820123214:web:a92d2d52a2980934"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
  closeMenu(){
    this.menu.close('sideMenu');
  }
  manageLoading(time){
    setTimeout(()=>{
      this.data.isContent = true;
    },time);
  }
  getUserLocation(){
    this.data.isFetching = true;
    return new Promise((resolve,reject)=>{
      this.geolocation.getCurrentPosition().then((resp)=>{
        console.log(resp);
        resolve(resp.coords);
        this.data.isFetching = false;
      }).catch((error)=>{
        this.data.isFetching = false;
        reject('User denied the location');
        console.log('Error getting location', error);
      });
    });
  }
  getAllContacts(){
    if(this.platform.is('cordova')){
      if(this.contacts){
        this.contacts.find(["*"], {multiple:true}).then((data)=>{
          console.log(data);
        }).catch((err)=>{
          console.log(err);
        });
      }
    }
  }
  openVideo(id){
    this.youtube.openVideo(id);
  }
  getUserCart(){
    this.data.isFetching = true;
    let params = {
      user_id:'1'
    }
    this.api.get('cakes_api/cart_display.php', params).subscribe((res:any)=>{
      console.log(res);
      this.data.isFetching = false
      if(res.status=="200"){
        // this.data.sideMenuItems = res.data;
        // this.showToast('Menus received successfully');
      }
    }, (err)=>{
      console.log(err);
      this.data.isFetching = false
      // this.showToast('Error receiving menus');
    });
  }
  getSideMenus(){
    this.data.isFetching = true;
    let params = {
      user_id:'1'
    }
    this.api.get('cakes_api/menu.php', params).subscribe((res:any)=>{
      console.log(res);
      this.data.isFetching = false
      if(res.status=="200"){
        this.data.sideMenuItems = res.data;
        // this.showToast('Menus received successfully');
      }
    }, (err)=>{
      console.log(err);
      this.data.isFetching = false
      // this.showToast('Error receiving menus');
    })
  }
  async showToast(message, duration?:number){
      const toast = await this.toast.create({
        message:message,
        duration:duration ? duration : 2000,
        showCloseButton:true,
        cssClass:'plnToaster'
      });
      toast.present();
  }
  signInFb(){
    this.data.googleData = undefined;
    this.data.googleResponse = undefined;
    if(!this.platform.is('cordova')){
      this.data.isProcessing = true;

      firebase.auth().signOut().then(()=>{
        var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('email');
      firebase.auth().signInWithPopup(provider).then((result:any)=>{
        console.log(result);
        this.data.fbResponse = result;
        let params={
          accessToken:result.credential.accessToken,
          userID:result.additionalUserInfo.profile.id,
          platform:'fb',
          email:result.additionalUserInfo.profile.email,
          picture:''
        }
        this.data.fbData = params;
        // this.signInPlanout('fb', result, params);
        let getProfile = fetch(`https://graph.facebook.com/v5.0/${params.userID}?access_token=${params.accessToken}&fields=id%2Cname%2Cpicture.width(800)`).then(response => response.json()).then((usr)=>{
          if(usr.picture){
            params.picture = usr.picture.data.url;
            this.data.fbData = params;
            this.signInPlanoutNew(params);
          }
        }).catch((err)=>{
          console.log(err);
        })
      }).catch((err)=>{
        this.data.isProcessing = false;
        console.log(err);
        this.showToast(err.message);
      })
      })
      
    }
    else{
      this.data.isProcessing = true;

      (<any>window).AccountKitPlugin.logout();
      this.fb.login(['email']).then((response)=>{
        // this.showToast(JSON.stringify(response));
        this.fb.api('me/?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then((res)=>{
          console.log(res);
          this.data.fbResponse = res;
          // this.data.userInfoApp = res;
          let params = {
            accessToken:response.authResponse.accessToken,
            userID:response.authResponse.userID,
            platform:"fb"
          }
          console.log(params);
          this.data.fbData = params;
          this.data.isFetching = false;
          this.data.isProcessing = false;

          // this.signInPlanout('fb', res, params);
        });
      }).catch((err)=>{
        this.showToast('Account exists with Google. Please login with Google');
      })
    }
  }

  signInPlanoutNew(params){
    console.log(params);
    let body = {
      // access_token:params.accessToken
      customers_email_address:params.email
    }
    this.api.post('checkUser', body).toPromise().then((res:any)=>{
      this.data.isProcessing = false;
      console.log(res);
      //case of login
      if(res.success == '0' && res.data.user){
        this.showToast('Welcome ' + res.data.user.customers_firstname + '! You are logged in successfully');
        res.data.membership ? res.data.user['membership'] = res.data.membership : null;
        res.data.user['customers_picture'] = params.picture ? params.picture : res.data.user.customers_picture;
        this.saveToDb('user', res.data.user);
        this.getUserBalance();
        this.getUserAddresses();
        this.getCart();
        this.data.userInfo = res.data.user;
        this.data.qParams && this.data.qParams.next ? this.router.navigateByUrl(this.data.qParams.next) : this.router.navigate(['/']);
      }
      else if(res.data.is_insertable == 1){
        this.data.isNewUser = true;
      }
      // if(res.success=='2'){
      //   this.showToast(res.message);
      //   this.saveToDb('user', res.data[0]);
      //   this.data.userInfo = res.data[0];
      //   this.router.navigate(['/home']);
      // }
    }).catch((err)=>{
      this.data.isProcessing = false;
      console.log(err);
    })
  }

  sendOtp(){
    if(this.data.phoneNum.toString()){
      if(!this.data.phoneNum.toString().match(this.data.numRegex)){
        this.showToast('Please enter your correct 10 digit mobile number.');
        return false;
      }
      let body = {
        phn_number:'+91' + this.data.phoneNum.toString()
      }
      this.data.isProcessing = true;
      this.api.post('getOtp', body).subscribe((res:any)=>{
        console.log(res);
        this.data.isProcessing = false;
        if(res.data.otp){
          this.data.receivedOtp = res.data.otp;
          this.startOtpTimer();
        }
        else{
          this.showToast(res.message ? res.message : 'Something went wrong! Please try again');
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
        this.showToast('Unable to send otp. Please try again!');
      })
    }
    else{
      this.data.isProcessing = false;
      this.showToast('Please enter phone number');
    }
  }

  startOtpTimer(){
    this.data.otp_secondsLeft = 59;
    var c = setInterval(()=>{
      this.data.otp_secondsLeft --;
      if(this.data.otp_secondsLeft == 0){
        clearInterval(c);
      }
    },1000);
  }

  updateProfileInfo(details){
    this.checkIfLoggedIn().then((usr)=>{
      let body = {
        customers_firstname:details.first_name,
        customers_lastname:details.last_name,
        customers_email_address:details.email,
        customers_telephone:details.mobilenum.toString(),
        customers_gender:details.gender,
        customers_dob:details.dob,
        customers_id:this.data.userInfo.customers_id,
        customers_picture:this.data.userInfo.customers_picture
      }
      this.data.isProcessing = true;
      this.api.post('updateCustomerInfo', body).subscribe((res:any)=>{
        this.data.isProcessing = false;
        console.log(res);
        if(res.data && res.data.length){
          this.showToast('Profile updated successfully');
          let membershipData = this.data.userInfo.membership;
          let profilePic = this.data.userInfo.customers_picture;
          let newInfo = res.data[0];
          newInfo.membershipData = membershipData;
          newInfo.customers_picture = profilePic;
          this.data.userInfo = newInfo;
          this.saveToDb('user', this.data.userInfo);
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  verifyOtp(){
    if(!this.data.otpToSend){
      this.showToast('Please enter otp');
      return false;
    }
    if(this.data.otpToSend!=this.data.receivedOtp){
      this.showToast('Wrong otp entered! Please enter a correct one!');
      return false;
    }
    let body = {};
    if(this.data.fbResponse){
      body = {
        customers_firstname:this.data.fbResponse.additionalUserInfo.profile.first_name,
        customers_lastname:this.data.fbResponse.additionalUserInfo.profile.last_name,
        customers_email_address:this.data.fbResponse.additionalUserInfo.profile.email,
        customers_password:this.data.fbResponse.additionalUserInfo.profile.id,
        customers_telephone:'+91' + this.data.phoneNum.toString(),
        customers_picture:this.data.fbData.picture
      }
    } else if(this.data.googleResponse){
      body = {
        customers_firstname:this.data.googleResponse.additionalUserInfo.profile.given_name,
        customers_lastname:this.data.googleResponse.additionalUserInfo.profile.family_name,
        customers_email_address:this.data.googleResponse.additionalUserInfo.profile.email,
        customers_password:this.data.googleResponse.additionalUserInfo.profile.id,
        customers_telephone:'+91' + this.data.phoneNum.toString(),
        customers_picture:this.data.googleResponse.additionalUserInfo.profile.picture
      }
    }
    if(this.data.referralCode && this.data.referralCode.trim()){
      body['refree_string'] = this.data.referralCode;
    }
    body['customers_referral_code']=this.randomString(6).toUpperCase();
    console.log(body);
    this.data.isProcessing = true;
    this.api.post('processRegistration', body).subscribe((res:any)=>{
      console.log(res);
      this.data.isProcessing = false;
      if(res.data && res.data.length){
        this.showToast(res.message);
        this.data.userInfo = res.data[0];
        this.getUserBalance();
        this.saveToDb('user', this.data.userInfo);
        this.data.isNewUser = false;
        this.data.otpToSend = '';
        this.data.receivedOtp = '';
        this.data.qParams && this.data.qParams.next ? this.router.navigateByUrl(this.data.qParams.next) : this.router.navigate(['/']);
      }
    }, (err)=>{
      this.data.isProcessing = false;
      console.log(err);
    })
  }

  randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  goBackToSocial(){
    this.data.isNewUser = false;
    this.data.otpToSend = '';
    this.data.receivedOtp = '';
    this.data.phoneNum = '';
  }

  goBackToPhoneNumber(){
    this.data.receivedOtp = '';
    this.data.otpToSend = '';
    this.data.isNewUser = true;
  }

  trueCallerLogin(){
    self.location.href = `truecallersdk://truesdk/web_verify?requestNonce=RL8YZ41FQMt5Jiak2sc_Ys0OgQA=&partnerKey=Jd0Pd755da6debe584c09b261e164a7af7ac68&partnerName=Planoutx&lang=en&title=Planoutxs`;

    setTimeout(()=>{

      if( document.hasFocus() ){
        // Truecaller app not present on the device and you redirect the user 
        // to your alternate verification page
        this.showToast('Seems that true caller is not present on your device. Please install truecaller or try different verification method.');
      }else{
        // Truecaller app present on the device and the profile overlay opens
        // The user clicks on verify & you'll receive the user's access token to fetch the profile on your 
        // callback URL - post which, you can refresh the session at your frontend and complete the user  verification
        console.log('App Present');
      }
    }, 600);
  }

  selectTab(index){
    this.data.selectedTab = index;
  }

  doRefresh(event) {
    this.getCatalog().then(()=>{
      event.target.complete();
    })
  }

  selectDeliveryType(e){
    let deliveryType = e.target.value;
    let day = this.data.selectedDay.name;
    this.data.selectedDeliveryType.type = deliveryType;
    this.createSlots(day, deliveryType);
  }

  createSlots(day,deliveryType){
    console.log(day);
    if(day == 'today' && deliveryType == 'stdDel'){
      this.manageSlots('today', '49', 4);
    } else if(day == 'today' && deliveryType == 'freedel'){
      this.manageSlots('today','0', 7);
    } else if(day == 'today' && deliveryType == 'fixDel'){
      this.manageSlots('today','99', 1);
    } else if(day == 'today' && deliveryType == 'midnightDel'){
      this.setStaticSlots('149', 23,24);
    } else if((day == 'tomorrow' || day=='later') && deliveryType == 'stdDel'){
      this.manageSlots('tomorrow','49', 4);
    } else if((day == 'tomorrow' || day=='later') && deliveryType == 'freedel'){
      this.manageSlots('tomorrow','0', 7);
    } else if((day == 'tomorrow' || day=='later') && deliveryType == 'fixDel'){
      this.manageSlots('tomorrow','99', 1);
    } else if((day == 'tomorrow' || day=='later') && deliveryType == 'midnightDel'){
      this.setStaticSlots('149',23, 24);
    }
  }

  setStaticSlots(shipping_cost, from, to){
    this.data.selectedProduct.shipping_cost = shipping_cost;
    let slotsArray = [];
    let currentHour = new Date().getHours();
    slotsArray.push({
      from:from,
      to:to 
    });
    this.data.selectedProduct.availableSlots = slotsArray;
    this.data.selectedDeliveryType.slot = 0;
    this.data.selectedProduct.shipping_time = slotsArray[0];
  }

  manageSlots(day,shipping_cost, slotsGap){
    console.log(day,shipping_cost, slotsGap);
    this.data.selectedProduct.shipping_cost = shipping_cost;
    let from = this.data.deliveryHours.from;
    let to = this.data.deliveryHours.to;
    let currentHour = new Date().getHours();
    let slotsArray = [];
    var i = from;
    if((i+slotsGap) != from){
      for(i = from; i < to; i+=slotsGap){
        console.log(currentHour, i);
        if(day=='today' && i > currentHour){
          slotsArray.push({
            from:i,
            to:(i+slotsGap) < to ? i+slotsGap : to 
          });
        }
        else if((day=='tomorrow') || day=='later'){
          slotsArray.push({
            from:i,
            to:(i+slotsGap) < to ? i+slotsGap : to 
          });
        }
      }
    }
    console.log(slotsArray);
    this.data.selectedProduct.availableSlots = slotsArray;
    this.data.selectedDeliveryType.slot = 0;
    this.data.selectedProduct.shipping_time = slotsArray[0];
    console.log(this.data.selectedProduct);
  }

  selectSlot(slot, index){
    this.data.selectedProduct.shipping_time = slot;
    this.data.selectedDeliveryType.slot = index;
  }

  changeDeliveryOpts(day){
    this.data.selectedDay.name = day;
    let stdDel:any = document.querySelectorAll('[value="stdDel"]');
    let freeDel:any = document.querySelectorAll('[value="freedel"]');
    if(stdDel.length){
      stdDel[0].click();
    } else if(freeDel.length){
      freeDel[0].click();
    }
    switch(day){
      case 'today' :
        this.data.selectedDay.date = Date.now();
        this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
        if(this.data.selectedProduct.delivery_option_ids != '4'){
          this.data.selectedDeliveryType.type=='stdDel';
          this.createSlots('today', 'stdDel');
        } else {
          this.data.selectedDeliveryType.type=='freedel';
          this.createSlots('today', 'freedel');
        }
        break;
      case 'tomorrow' :
        this.data.selectedDay.date = Date.now() + 24 * 60 * 60 * 1000;
        this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
        if(this.data.selectedProduct.delivery_option_ids != '4'){
          this.data.selectedDeliveryType.type=='stdDel';
          this.createSlots('tomorrow', 'stdDel');
        } else {
          this.data.selectedDeliveryType.type=='freedel';
          this.createSlots('tomorrow', 'freedel');
        }
        break;
      case 'later' :
        this.router.navigate(['/calendar']);
    }
  }

  closeSearch(){
    this.data.filteredSearch.products = [];
    this.data.filteredSearch.occasions = [];
    this.data.filteredSearch.subOccasions = [];
    this.data.filteredSearch.categories = [];
    this.data.filteredSearch.subCategories = [];
    this.data.filteredSearch.subSubCategories = [];
    this.data.filterInput = '';
    this.noSubHeader();
    this.data.allFiltered = {};
  }

  noSubHeader(){
    this.data.isSubHeaderOpened = false;
    document.body.classList.remove('searchOpened');
  }

  _get_all_categories(){
    return new Promise((resolve,reject)=>{
      let body = {
        language_id:1
      }
      this.data.isFetching = true;
      this.api.post('allCategories', body).subscribe((res:any)=>{
        console.log(res);
        this.data.isFetching = false;
        if(res.success=='1'){
          this.data.categories = res.data;
          resolve(res.data);
          // this.setHeaderCats();
          // this.setSubCats();
        }
      },(err)=>{
        console.log(err);
        this.data.isFetching = false;
      });
    });
  }

  getAllSubSubCats(){
    let subCats = [];
    this.data.allSubCats = [];
    this.data.fullCatalog.forEach((cat)=>{
      if(cat.subcategory && cat.subcategory.length){
        cat.subcategory.forEach((subCat)=>{
          subCats.push(subCat);
        });
      }
    });
    this.data.allSubCats = subCats;
  }

  getAllSubCats(){
    let subSubCats = [];
    this.data.allSubSubCats = [];
    this.data.fullCatalog.forEach((cat)=>{
      if(cat.subcategory && cat.subcategory.length){
        cat.subcategory.forEach((subCat)=>{
          if(subCat.subsubcategory && subCat.subsubcategory.length){
            subCat.subsubcategory.forEach((subSubCat)=>{
              subSubCats.push(subSubCat);
            })
          }
        });
      }
    });
    this.data.allSubSubCats = subSubCats;
  }

  getAllProducts(){
    this.data.allProducts = [];
    let products = [];
    if(this.data.fullCatalog && this.data.fullCatalog.length){
      this.data.fullCatalog.forEach((cat)=>{
        if(cat.products && cat.products.length){
          cat.products.forEach((mainProd)=>{
            products.push(mainProd);
          });
        }
        if(cat.subcategory && cat.subcategory.length){
          cat.subcategory.forEach((subCat)=>{
            if(subCat.products && subCat.products.length){
              subCat.products.forEach((subProd)=>{
                products.push(subProd);
              });
            }
            if(subCat.subsubcategory && subCat.subsubcategory.length){
              subCat.subsubcategory.forEach((subsubCat)=>{
                if(subsubCat.products && subsubCat.products.length){
                  subsubCat.products.forEach((subsubProd)=>{
                    products.push(subsubProd);
                  })
                }
              })
            }
          });
        }
      });
      this.data.allProducts = products;
      console.log(this.data.allProducts);
      this.getTopSellingProducts();
    }
  }

  setSlots(gap){
    let obj = {
      from:this.data.selectedProduct.from,
      fromTimeMeridian:this.data.selectedProduct.from_am,
      to:this.data.selectedProduct.to,
      toTimeMeridian:this.data.selectedProduct.to_am
    }
    this.data.selectedProduct.slots = this.getSlotRanges(obj, gap);
    console.log(this.data.selectedProduct);
  }

  getSlotRanges(slotObj, gap){
    let slots = [];
    let fromTime = +slotObj.from;
    let fromTimeMeridian = slotObj.fromTimeMeridian;
    if(fromTimeMeridian=="pm"){
      fromTime+=12;
    }
    let toTime = +slotObj.to;
    let toTimeMeridian = slotObj.toTimeMeridian;
    if(toTimeMeridian=="pm"){
      toTime+=12;
    }
    for(var i=fromTime; i<toTime+1; i+=gap ){
      if(i<toTime){
        slots.push({
          from:i,
          to:i+gap
        });
      }
    }
    return slots;
  }
  
  getCatalog(){
    this.data.catalogApiCalled++
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
          if(!this.data.allProducts.length && this.data.catalogApiCalled <= 1){
            this.api.get('getCatalog').subscribe((res:any)=>{
              this.data.isProcessing = false;
              if(res.success=='1' && res.product_data){
                this.data.categories = res.product_data.categories;
                this.data.allProducts = res.product_data.products;
                this.sortVariants();
                this.sortReviews();
                this.sortVideos();
                this.setAddonsProds();
                this.setShippingRates(res.product_data);
                this.getUpsellProducts();
                // this.generateProductsSitemapXml();
                // this.generateCategoriesSitemapXml();
                this.data.occasions = res.product_data.occasionCategories;
                resolve(res.product_data);
              }
            }, (err)=>{
              this.data.isProcessing = false;
              console.log(err);
              reject(err);
            });
          }
          else{
            this.data.isProcessing = false;
            resolve(this.data.categories);
          }
      });
  }

  getUpsellProducts(){
    this.data.upsell_products = [];
    this.data.allProducts.forEach((prod:any) => {
      if(prod.up_sell == 1){
        this.data.upsell_products.push(prod);
      }
    })
  }

  setShippingRates(catData){
    if(catData.setting && catData.setting.length){
      this.data.shippingRates = catData.setting[0].standard_rates;
      console.log(this.data.shippingRates);
    }
  }

  setAddonsProds(){
    this.data.allProducts.forEach((prod:any) => {
      prod.category_ids.split(',').forEach((catId) => {
        this.data.categories.forEach((cat) => {
          if(cat.id == catId){
            if(cat.addon_products.length){
              prod.addon_products = cat.addon_products.split(',');
            }
          }
        })
      })
    });
    console.log(this.data.allProducts);
  }

  sortVideos(){
    this.data.allProducts.forEach((product:any)=>{
      if(product.products_videos){
        let videos = product.products_videos.split(',');
        let videosUrl = [];
        let videosId = [];
        videos.forEach((video)=>{
          videosId.push(video);
          video = this.san.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+video+'?autoplay=1&controls=0&showinfo=0&modestbranding=1');
          videosUrl.push(video);
        });
        product.products_videos = videosUrl;
        product.videosId = videosId;
      }
    });
  }

  sortVariants(){
    this.data.allProducts.forEach((product:any)=>{
      if(product.products_variant && product.products_variant.names && product.products_variant.price){
        let namesArray = JSON.parse(product.products_variant.names);
        let priceArray = JSON.parse(product.products_variant.price);
        product.products_variant = [];
        namesArray.forEach((varName, i)=>{
            product.products_variant.push({
              name:varName,
              price:priceArray[i]
            });
        });
      }
    });
  }

  sortReviews(){
    this.data.allProducts.forEach((prod:any)=>{
      let totalratings = 0;
      let ratingsLength = 0;
      let averageRating = 0;
      if(prod.reviews && prod.reviews.length){
        prod.reviews.forEach((review)=>{
          totalratings += +review.reviews_rating;
        });
        ratingsLength = prod.reviews.length;
        averageRating = totalratings/ratingsLength;
        prod.allRatings = averageRating;
      }
    });
    console.log(this.data.allProducts);
  }

  getBanners(){
    return new Promise((resolve,reject)=>{
      if(!this.data.offers.length){
        this.data.isProcessing = true;
        this.api.get('getBanners').subscribe((res:any)=>{
          this.data.isProcessing = false;
          console.log(res);
          if(res.success=='1' && res.data){
            this.data.offers = res.data;
            resolve(res.data);
          }
        }, (err)=>{
          console.log(err);
          this.data.isProcessing = false;
          reject(err);
        });
      }
    });
  }

  goFromOffer(offer){
    console.log(offer)
    this.router.navigateByUrl(offer.url);
  }

  getTopSellingProducts(){
    let topSelling = [];
    this.data.allProducts.forEach((prod:any)=>{
      if(prod.i_display_type=='1'){
        topSelling.push(prod);
      }
    });
    this.data.bestProducts = topSelling;
  }

  getCategoryById(id){
    let category;
    this.data.fullCatalog.forEach((cat)=>{
      if(cat.i_pki_id==id){
        category = cat;
      }
      if(cat.subcategory && cat.subcategory.length){
        cat.subcategory.forEach((subCat)=>{
          if(subCat.i_pki_id==id){
            category = subCat;
          }
          if(subCat.subsubcategory && subCat.subsubcategory.length){
            subCat.subsubcategory.forEach((subsubCat)=>{
              if(subsubCat.i_pki_id==id){
                category = subsubCat;
              }
            })
          }
        });
      }
    });
    return category;
  }

  getUserRartings(){
    this.data.isFetching = true;
    let params = {
      user_id:'1'
    }
    this.api.get('cakes_api/ratings.php', params).subscribe((res:any)=>{
      console.log(res);
      this.data.isFetching = false
      if(res.data && res.data.length){
        this.data.ratings = res.data;
      }
    }, (err)=>{
      console.log(err);
      this.data.isFetching = false
    });
  }

  getOffers(){
    this.data.isFetching = true;
    let params = {
      user_id:'1'
    }
    this.api.get('cakes_api/offers.php', params).subscribe((res:any)=>{
      console.log(res);
      this.data.isFetching = false
      if(res.data && res.data.length){
        this.data.offersCatalog = res.data;
        this.getAllOffers();
      }
    }, (err)=>{
      console.log(err);
      this.data.isFetching = false
    })
  }

  getOccasions(){
    this.data.isFetching = true;
    let params = {
      user_id:'1'
    }
    this.api.get('cakes_api/occasions.php', params).subscribe((res:any)=>{
      console.log(res);
      this.data.isFetching = false
      this.getAllOccasions(res.data);
    }, (err)=>{
      this.data.isFetching = false
      console.log(err);
    })
  }

  getMorePosts(){
    this.data.blogPageNum +=1;
    this.getAllPosts(this.data.blogPageNum);
  }

  setVideoUrl(vidId){
    this.data.selVidId = vidId;
    this.data.currVideoId = this.san.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.data.selVidId+'?controls=1&autoplay=1&cc_load_policy=1&showinfo=0');
  }

  getAllPosts(pageNum){
    return new Promise((resolve,reject)=>{
      this.data.isFetching = true;
      this.data.isProcessing = true;
      let body = {
        page_number:pageNum
      }
      this.api.post('getAllNews', body).subscribe((news:any)=>{
        console.log(news);
        if(news.news_data && news.news_data.length){
          this.data.totalBlogs = news.total_record;
          news.news_data.forEach((news)=>{
            this.data.blogPosts.push(news);
          });
        }
        this.data.isProcessing = false;
        this.data.isFetching = false;
      }, (err) => {
        console.log(err);
        this.data.isProcessing = false;
        this.data.isFetching = false;
      });
    });
  }

  getImageByPostId(id){
    return new Promise((resolve,reject)=>{
      let image:any;
      this.api.getFromRoot('http://partymaker.ancorathemes.com/wp-json/wp/v2/media?parent='+id).subscribe((res:any)=>{
        this.data.isFetching = false;
        if(res && res.length){
          res.forEach((media)=>{
            image = media.source_url;
            resolve(image);
          })
        }
        else{
          reject('error');
        }
      }, (err)=>{
        this.data.isFetching = false;
        reject(err);
      });
    });
  }

  getRecipients(){
    this.data.isFetching = true;
    let params = {
      user_id:'1'
    }
    this.api.get('cakes_api/recipents.php', params).subscribe((res:any)=>{
      console.log(res);
      this.data.isFetching = false
      this.data.recipients = res.data;
    }, (err)=>{
      this.data.isFetching = false
      console.log(err);
    })
  }

  goToCategory(mainIndex, subIndex){
    this.router.navigate(['/products'], {queryParams:{'catIndex':mainIndex, 'subIndex':subIndex}});
  }

  getProductById(id){
    let currentDate = new Date();
    let currentTimeHour = new Date().getHours();
    this.getCatalog().then(()=>{
      console.log(this.data.allProducts);
      this.data.isProcessing = false;
      this.data.allProducts.forEach((prod:any)=>{
        if(prod.products_id==id){
          console.log(prod);
          this.data.selectedProduct = prod;
          this.checkIfWishlisted(prod);
          this.checkIfProductEligibleForPassport();
          if(this.data.selectedProduct.delivery_option_ids!='3'){
            if(currentTimeHour < (this.data.deliveryHours.to-3)){
              this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
              this.data.selectedDeliveryType.type = 'stdDel';
              this.createSlots('today', 'stdDel');
            }
            else{
              this.data.selectedDay.name = 'tomorrow';
              this.data.selectedDay.date = Date.now() + 24 * 60 * 60 * 1000;
              this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
              this.data.selectedDeliveryType.type = 'stdDel';
              this.createSlots('tomorrow', 'stdDel');
            }
          }
          else{
            this.data.selectedProduct.shipping_date = currentDate.setDate(currentDate.getDate()+5);
            this.data.selectedDeliveryType.type = 'Third Party Shipping';
            this.data.selectedProduct.shipping_time = {
              from:this.data.deliveryHours.from,
              to:this.data.deliveryHours.to
            };
            this.data.selectedProduct.shipping_cost = '149';
          }
          this.getRecommendedProductsByCatId(prod.categories_id);
          if(this.data.selectedProduct.products_variant && this.data.selectedProduct.products_variant.length){
            this.data.selectedProduct.products_variant.forEach((prodVar)=>{
              if(!this.data.selectedProduct.specials_new_products_price){
                if(+prodVar.price == +this.data.selectedProduct.products_price){
                  this.data.selectedProduct['selectedVariant'] = prodVar;
                }
              }
              else{
                if(+prodVar.price == +this.data.selectedProduct.specials_new_products_price){
                  this.data.selectedProduct['selectedVariant'] = prodVar;
                }
              }
            });
          }
          if(this.data.selectedProduct.attributes && this.data.selectedProduct.attributes.length){
            this.data.selectedProduct.attributes.forEach((attr)=>{
              attr.selectedValue = attr.values[0];
              this.data.selectedProduct.products_price = (+this.data.selectedProduct.products_price + +attr.selectedValue.price).toFixed(2);
            });
          }
        }
      });
      this.getFromDb('recentProds').then((recentFromLocal:any)=>{
        this.data.recentlyViewed = recentFromLocal!=null ? recentFromLocal : [];
        let uniqueArray:any;
        console.log(recentFromLocal);
        if(this.data.recentlyViewed.length){
          this.data.recentlyViewed.push(this.data.selectedProduct);
          console.log(this.data.recentlyViewed);
          uniqueArray = this.data.recentlyViewed.filter((set => f => !set.has(f.products_id) && set.add(f.products_id))(new Set));
          console.log(uniqueArray);
          this.data.recentlyViewed = uniqueArray.reverse();
        }
        else{
          this.data.recentlyViewed.push(this.data.selectedProduct);
        }
        this.saveToDb('recentProds', this.data.recentlyViewed);
      });
    });
  }

  getProductByName(name){
    return new Promise((resolve,reject)=>{
    let currentDate = new Date();
    let currentTimeHour = new Date().getHours();
    this.data.isProcessing = true;
    this.getCatalog().then(()=>{
      console.log(this.data.allProducts);
      this.data.isProcessing = false;
      this.data.allProducts.forEach((prod:any)=>{
        let slugPipe = new UrlSlugPipe();
        let nameOfThisProd = slugPipe.transform(prod.products_name);
        if(nameOfThisProd==name){
          console.log(prod);
          this.data.selectedProduct = prod;
          resolve(this.data.selectedProduct);
          this.fetchUserLocationFromDb();
          this.checkIfWishlisted(prod);
          this.checkIfProductEligibleForPassport();
          if(!this.data.selectedProduct.category_ids.includes('167')){
            if(this.data.selectedProduct.delivery_option_ids!='3'){
              if(currentTimeHour < (this.data.deliveryHours.to - 3)){
                this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
                this.data.selectedDeliveryType.type = 'stdDel';
                this.createSlots('today', 'stdDel');
              }
              else{
                this.data.selectedDay.name = 'tomorrow';
                this.data.selectedDay.date = Date.now() + 24 * 60 * 60 * 1000;
                this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
                this.data.selectedDeliveryType.type = 'stdDel';
                this.createSlots('tomorrow', 'stdDel');
              }
            }
            else{
              this.data.selectedProduct.shipping_date = currentDate.setDate(currentDate.getDate()+5);
              this.data.selectedDeliveryType.type = 'Third Party Shipping';
              this.data.selectedProduct.shipping_time = {
                from:this.data.deliveryHours.from,
                to:this.data.deliveryHours.to
              };
              this.data.selectedProduct.shipping_cost = '149';
            }
          }
          else{
            this.data.selectedProduct.shipping_date = currentDate.setHours(currentDate.getHours()+16);
            this.data.selectedDeliveryType.type = 'Free Shipping';
            this.data.selectedProduct.shipping_time = {
              from:currentDate.getHours(),
              to:24 - (24 - currentDate.getHours()+16)
            };
            this.data.selectedProduct.shipping_cost = '0';
          }
          this.getRecommendedProductsByCatId(prod.categories_id);
          if(this.data.selectedProduct.products_variant && this.data.selectedProduct.products_variant.length){
            this.data.selectedProduct.products_variant.forEach((prodVar)=>{
              if(!this.data.selectedProduct.specials_new_products_price){
                if(+prodVar.price == +this.data.selectedProduct.products_price){
                  this.data.selectedProduct['selectedVariant'] = prodVar;
                }
              }
              else{
                if(+prodVar.price == +this.data.selectedProduct.specials_new_products_price){
                  this.data.selectedProduct['selectedVariant'] = prodVar;
                }
              }
            });
          }
          if(this.data.selectedProduct.attributes && this.data.selectedProduct.attributes.length){
            this.data.selectedProduct.attributes.forEach((attr)=>{
              attr.selectedValue = attr.values[0];
              this.data.selectedProduct.products_price = (+this.data.selectedProduct.products_price + +attr.selectedValue.price).toFixed(2);
            });
          }
        }
      });
      this.getFromDb('recentProds').then((recentFromLocal:any)=>{
        this.data.recentlyViewed = recentFromLocal!=null ? recentFromLocal : [];
        let uniqueArray:any;
        console.log(recentFromLocal);
        if(this.data.recentlyViewed.length){
          this.data.recentlyViewed.push(this.data.selectedProduct);
          console.log(this.data.recentlyViewed);
          uniqueArray = this.data.recentlyViewed.filter((set => f => !set.has(f.products_id) && set.add(f.products_id))(new Set));
          console.log(uniqueArray);
          this.data.recentlyViewed = uniqueArray.reverse();
        }
        else{
          this.data.recentlyViewed.push(this.data.selectedProduct);
        }
        this.saveToDb('recentProds', this.data.recentlyViewed);
      });
    });
  });
  }

  addReview(prod, ratings, description){
    this.checkIfLoggedIn().then((usr)=>{
      let body = {
        customers_id:this.data.userInfo.customers_id,
        customers_name:this.data.userInfo.customers_firstname + ' ' + this.data.userInfo.customers_lastname,
        customers_email:this.data.userInfo.customers_email_address,
        reviews_text:description,
        reviews_rating:ratings,
        products_id:prod.products_id
      }
      console.log(body);
      this.data.isProcessing = false;
      this.api.get('addReview', body).subscribe((res:any)=>{
        console.log(res);
        this.showToast('Your review submitted successfully');
        this.data.isProcessing = false;
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      })
    }).catch((err)=>{
      this.showToast('Please log in first');
      this.router.navigate(['/auth']);
    })
  }

  getRecommendedProductsByCatId(catId){
    this.data.recommendedProducts = [];
    this.data.allProducts.forEach((prod:any)=>{
      if(prod.categories_id == catId){
        this.data.recommendedProducts.push(prod);
      }
    });
  }

  getFromDb(key){
    return new Promise((resolve,reject)=>{
      let result:any;
      if(this.platform.is('cordova')){
        this.nativeStorage.getItem(key).then((res)=>{
          console.log(res);
          resolve(res);
        }).catch((err)=>{
          reject(err);
          console.log(err);
        });
      }
      else{
        result = JSON.parse(localStorage.getItem(key));
        resolve(result);
      }
    });
  }

  saveToDb(key, value){
    if(this.platform.is('cordova')){
      this.nativeStorage.setItem(key, value).then((res)=>{
        console.log('saved', JSON.stringify(res));
      });
    }
    else{
      localStorage.setItem(key,JSON.stringify(value));
    }
  }
  
  selectVariant(variant){
    this.data.selectedProduct.products_variant.forEach((variantEach:any)=>{
      if(variantEach.name==variant.name){
        this.data.selectedProduct.selectedVariant = variantEach;
        if(!this.data.selectedProduct.specials_new_products_price){
          this.data.selectedProduct.products_price = (+variantEach.price).toFixed(2);
        }
        else{
          this.data.selectedProduct.specials_new_products_price = (+variantEach.price).toFixed(2);
        }
      }
    });
    this.data.isVariantsOpened = false;
  }

  selectAttribute(selectedattr, selectedoption, showMessage?:any){
    if(!this.data.selectedProduct.specials_new_products_price){
      let originalrice = +this.data.selectedProduct.products_price - +selectedattr.selectedValue.price;
      let finalProductPrice = 0;
      if(this.data.selectedProduct.attributes && this.data.selectedProduct.attributes.length){
        this.data.selectedProduct.attributes.forEach((attr)=>{
          if(attr.option.id==selectedattr.option.id){
            attr.values.forEach((value)=>{
              if(value.id==selectedoption.id){
                attr.selectedValue = value;
              }
            });
          }
        });
        finalProductPrice = (+originalrice + +selectedattr.selectedValue.price);
        this.data.selectedProduct.products_price = finalProductPrice.toFixed(2);
      }
    }
    else{
      let originalrice = +this.data.selectedProduct.specials_new_products_price - +selectedattr.selectedValue.price;
      let originalMrp = +this.data.selectedProduct.products_price - +selectedattr.selectedValue.price;
      let finalProductPrice = 0;
      let finalProductMrp = 0;
      if(this.data.selectedProduct.attributes && this.data.selectedProduct.attributes.length){
        this.data.selectedProduct.attributes.forEach((attr)=>{
          if(attr.option.id==selectedattr.option.id){
            attr.values.forEach((value)=>{
              if(value.id==selectedoption.id){
                attr.selectedValue = value;
              }
            });
          }
        });
        finalProductPrice = (+originalrice + +selectedattr.selectedValue.price);
        this.data.selectedProduct.specials_new_products_price = finalProductPrice.toFixed(2);
        finalProductMrp = (+originalMrp + +selectedattr.selectedValue.price);
        this.data.selectedProduct.products_price = finalProductMrp.toFixed(2);
      }
    }
    if(showMessage){
      this.showToast(`₹ ${selectedattr.selectedValue.price} added to product price.`);
    }
  }

  quickSearch(){
    this.router.navigate(['/eveyrthing'], {queryParams:this.data.quickSearch});
  }

  clearSearch(){
    let empty = '';
    this.data.quickSearch.category = this.data.quickSearch.location = this.data.quickSearch.occasion = this.data.quickSearch.recipient = empty;
    console.log(this.data.quickSearch);
  }

  filterEverything(params){
    return new Promise((resolve,reject)=>{
      let paramsPar  = params;
      console.log(this.data.selectedFilters);
      let filtered = {
        selectedCategory:{},
        selectedOccasion:{},
        selectedSubOccasion:{},
        selectedSubCategory:{},
        selectedSubSubCategory:{},
        occasions:[],
        categories:[],
        subcategories:[],
        subsubcategories:[],
        subOccasions:[],
        products:[]
      }

      if(paramsPar.occasion && !params.subOccasion && !params.category){
        if(this.data.occasions.length){
          this.data.occasions.forEach((occ:any)=>{
            if(occ.nid==paramsPar.occasion){
              filtered.selectedOccasion = occ;
              filtered.categories = this.getCatsByOccId(occ);
              filtered.products = this.getSomeProductsFromCategories(4, filtered.categories);
              filtered.subOccasions = occ.sub_sub_occasion_categories;
            }
          });
          resolve(filtered);
        } 
        else{
          this.getCatalog().then((catalog)=>{
            this.data.occasions.forEach((occ:any)=>{
              if(occ.nid==paramsPar.occasion){
                filtered.selectedOccasion = occ;
                filtered.categories = this.getCatsByOccId(occ);
                filtered.products = this.getSomeProductsFromCategories(4, filtered.categories);
                filtered.subOccasions = occ.sub_sub_occasion_categories;
              }
            });
            resolve(filtered);
          });
        }
      }

      if(paramsPar.occasion && paramsPar.subOccasion && !params.category){
        if(this.data.occasions.length){
          this.data.occasions.forEach((occ:any)=>{
            if(occ.nid==paramsPar.occasion){
              filtered.selectedOccasion = occ;
              if(occ.sub_sub_occasion_categories && occ.sub_sub_occasion_categories.length){
                occ.sub_sub_occasion_categories.forEach((subOcc)=>{
                  if(subOcc.id == paramsPar.subOccasion){
                    filtered.selectedSubOccasion = subOcc;
                    filtered.categories = this.getCatsByOccId(subOcc);
                    
                    if(this.data.selectedFilters.price){
                      filtered.products = this.getSomeProductsFromCategories(4, filtered.categories, this.data.selectedFilters.price);
                      return false;
                    }
                    if(this.data.selectedFilters.flavours && this.data.selectedFilters.flavours.length){
                      filtered.products = this.getSomeProductsFromCategories(4, filtered.categories, this.data.selectedFilters.flavours);
                      return false;
                    }
                    filtered.products = this.getSomeProductsFromCategories(4, filtered.categories);
                    // filtered.subcategories = this.getSubCatsByOcc(subOcc);
                  }
                })
              }
            }
          });
          resolve(filtered);
        } 
        else{
          this.getCatalog().then((catalog)=>{
            this.data.occasions.forEach((occ:any)=>{
              if(occ.nid==paramsPar.occasion){
                filtered.selectedOccasion = occ;
                if(occ.sub_sub_occasion_categories && occ.sub_sub_occasion_categories.length){
                  occ.sub_sub_occasion_categories.forEach((subOcc)=>{
                    if(subOcc.id == paramsPar.subOccasion){
                      filtered.selectedSubOccasion = subOcc;
                      filtered.categories = this.getCatsByOccId(subOcc);
                      // filtered.subcategories = this.getSubCatsByOcc(subOcc);
                    }
                  })
                }
              }
            });
            resolve(filtered);
          });
        }
      }

      if(paramsPar.category && paramsPar.occasion && !paramsPar.subOccasion){
        if(this.data.occasions.length){
          this.data.occasions.forEach((occ:any)=>{
            if(occ.nid == paramsPar.occasion){
              filtered.selectedOccasion = occ;
              if(occ.categories_ids){
                let mainCatsFromOcc = JSON.parse(occ.categories_ids);
                let subCatsFromOcc = occ.sub_categories_ids.split(',');
                console.log(subCatsFromOcc);
                this.data.categories.forEach((cat)=>{
                  mainCatsFromOcc.forEach((mainCatFromOcc) => {
                    if(mainCatFromOcc == cat.id && mainCatFromOcc == paramsPar.category){
                      filtered.selectedCategory = cat;
                      if(cat.sub_categories && cat.sub_categories.length){
                        cat.sub_categories.forEach((subCat)=>{
                          subCatsFromOcc.forEach((subCatFromOcc) => {
                            if(subCatFromOcc == subCat.id){
                              filtered.subcategories.push(subCat);
                              filtered.products = this.getProductsByCategory(cat);
                            }
                          });
                        });
                      }
                    }
                  });
                });
              }
            }
          });
          resolve(filtered);
        }
      }

      if(paramsPar.category && paramsPar.subOccasion && paramsPar.occasion){
        if(this.data.occasions.length){
          this.data.occasions.forEach((occ:any)=>{
            if(occ.nid == paramsPar.occasion){
              filtered.selectedOccasion = occ;
              if(occ.sub_sub_occasion_categories && occ.sub_sub_occasion_categories.length){
                occ.sub_sub_occasion_categories.forEach((subOcc)=>{
                  if(subOcc.id == paramsPar.subOccasion){
                    filtered.selectedSubOccasion = subOcc;
                    let subCatsFromOcc = subOcc.sub_categories_ids.split(',');
                      this.data.categories.forEach((cat)=>{
                        if(cat.id == paramsPar.category){
                          filtered.selectedCategory = cat;
                          filtered.products = this.getProductsByCategory(cat);
                          if(cat.sub_categories && cat.sub_categories.length){
                            cat.sub_categories.forEach((subCat)=>{
                              subCatsFromOcc.forEach((subCatFromOcc)=>{
                                if(subCatFromOcc == subCat.id){
                                  filtered.subcategories.push(subCat);
                                }
                              });
                            });
                          }
                        }
                      });
                  }
                })
              }
            }
          });
          resolve(filtered);
        }
        else{
          this.getCatalog().then((catalog)=>{
            this.filterEverything(paramsPar);
          });
        }
      }

      if(paramsPar.category && !paramsPar.subcategory && !paramsPar.subsubcategory && !params.occasion && !params.subOccasion){
        if(this.data.categories.length){
          this.data.categories.forEach((cat)=>{
            if(cat.id==paramsPar.category){
              filtered.selectedCategory = cat;
              filtered.subcategories = cat.sub_categories;
              this.generateMetaDetails('category', cat.id);
              if(this.data.selectedFilters.price){
                console.log('yes price filter there');
                filtered.products = this.getProductsByCategory(cat, this.data.selectedFilters.price);
                return false;
              }
              if(this.data.selectedFilters.flavours && this.data.selectedFilters.flavours.length){
                filtered.products = this.getProductsByCategory(cat, this.data.selectedFilters.flavours);
                return false;
              }
              filtered.products = this.getProductsByCategory(cat);
            }
          });
        }
        resolve(filtered);
      }

      if(paramsPar.subcategory && !paramsPar.subsubcategory && !paramsPar.category){
        if(this.data.categories.length){
          this.data.categories.forEach((cat)=>{
            if(cat.sub_categories && cat.sub_categories.length){
              cat.sub_categories.forEach((subCat)=>{
                if(subCat.id == paramsPar.subcategory){
                  filtered.selectedSubCategory = subCat;
                  this.generateMetaDetails('subcategory', subCat.id);
                  filtered.subsubcategories = subCat.sub_sub_categories;
                  filtered.products = this.getProductsBySubCategory(subCat);
                }
              });
            }
          });
        }
        resolve(filtered);
      }

      if(!paramsPar.subcategory && paramsPar.subsubcategory && !paramsPar.category){
        if(this.data.categories.length){
          this.data.categories.forEach((cat)=>{
            if(cat.sub_categories && cat.sub_categories.length){
              cat.sub_categories.forEach((subCat)=>{
                if(subCat.sub_sub_categories && subCat.sub_sub_categories.length){
                  subCat.sub_sub_categories.forEach((subSubCat)=>{
                    if(subSubCat.id == paramsPar.subsubcategory){
                      filtered.selectedSubSubCategory = subSubCat;
                      filtered.products = this.getProductsBySubSubCategory(subSubCat);
                    }
                  })
                }
              });
            }
          });
        }
        resolve(filtered);
      }

      if(paramsPar.category && paramsPar.subcategory && !paramsPar.subsubcategory){
        if(this.data.categories.length){
          this.data.categories.forEach((cat)=>{
            if(cat.id==paramsPar.category){
              filtered.selectedCategory = cat;
              // filtered.subcategories = cat.sub_categories;
              // filtered.products = this.getProductsByCategory(cat);
              if(cat.sub_categories && cat.sub_categories.length){
                cat.sub_categories.forEach((subCat)=>{
                  if(subCat.id == paramsPar.subcategory){
                    filtered.selectedSubCategory = subCat;
                    filtered.subsubcategories = subCat.sub_sub_categories;
                    this.generateMetaDetails('subcategory', subCat.id);
                    if(this.data.selectedFilters.price){
                      filtered.products = this.getProductsBySubCategory(subCat, this.data.selectedFilters.price);
                      return false;
                    }
                    if(this.data.selectedFilters.flavours && this.data.selectedFilters.flavours.length){
                      filtered.products = this.getProductsBySubCategory(subCat, this.data.selectedFilters.flavours);
                      return false;
                    }
                    filtered.products = this.getProductsBySubCategory(subCat);
                  }
                })
              }
            }
          });
        }
        resolve(filtered);
      }

      if(paramsPar.category && paramsPar.subcategory && paramsPar.subsubcategory){
        if(this.data.categories.length){
          this.data.categories.forEach((cat)=>{
            if(cat.id==paramsPar.category){
              filtered.selectedCategory = cat;
              // filtered.subcategories = cat.sub_categories;
              // filtered.products = this.getProductsByCategory(cat);
              if(cat.sub_categories && cat.sub_categories.length){
                cat.sub_categories.forEach((subCat)=>{
                  if(subCat.id == paramsPar.subcategory){
                    filtered.selectedSubCategory = subCat;
                    // filtered.subsubcategories = subCat.sub_sub_categories;
                    // filtered.products = this.getProductsBySubCategory(subCat);
                    if(subCat.sub_sub_categories && subCat.sub_sub_categories.length){
                      subCat.sub_sub_categories.forEach((subSubCat)=>{
                        if(subSubCat.id == paramsPar.subsubcategory){
                          filtered.selectedSubSubCategory = subSubCat;
                          filtered.products = this.getProductsBySubSubCategory(subSubCat);
                        }
                      });
                    }
                  }
                })
              }
            }
          });
        }
        resolve(filtered);
      }
      console.log(filtered);
      this.data.allFiltered = filtered;
    });
  }


  filterEverythingByNames(params){
    return new Promise((resolve,reject)=>{
      let paramsPar  = params;
      let filtered = {
        selectedCategory:{},
        selectedOccasion:{},
        selectedSubOccasion:{},
        selectedSubCategory:{},
        selectedSubSubCategory:{},
        occasions:[],
        categories:[],
        subcategories:[],
        subsubcategories:[],
        subOccasions:[],
        products:[]
      }
      if(paramsPar.category && !paramsPar.subcategory){
        this.getCategoryByName(paramsPar.category).then((cat:any)=>{
          console.log(cat);
          this.generateMetaDetails('category', cat.id);
          filtered.selectedCategory = cat;
          filtered.subcategories = cat.sub_categories;
          if(this.data.selectedFilters.price){
            filtered.products = this.getProductsByCategory(cat, this.data.selectedFilters.price);
            resolve(filtered);
            return false;
          }
          if(this.data.selectedFilters.flavours && this.data.selectedFilters.flavours.length){
            filtered.products = this.getProductsByCategory(cat, this.data.selectedFilters.flavours);
            resolve(filtered);
            return false;
          }
          filtered.products = this.getProductsByCategory(cat);
          resolve(filtered);
        });
      }

      if(paramsPar.category && paramsPar.subcategory){
        this.getSubCategoryByName(paramsPar.category, paramsPar.subcategory).then((dat:any)=>{
          filtered.selectedCategory = dat.category;
          filtered.selectedSubCategory = dat.subCategory;
          this.generateMetaDetails('subcategory', dat.subCategory.id);
          if(this.data.selectedFilters.price){
            filtered.products = this.getProductsBySubCategory(dat.subCategory, this.data.selectedFilters.price);
            resolve(filtered);
            return false;
          }
          if(this.data.selectedFilters.flavours && this.data.selectedFilters.flavours.length){
            filtered.products = this.getProductsBySubCategory(dat.subCategory, this.data.selectedFilters.flavours);
            resolve(filtered);
            return false;
          }
          filtered.products = this.getProductsBySubCategory(dat.subCategory);
          resolve(filtered);
        });
      }
      console.log(filtered);
      this.data.allFiltered = filtered;
    });
  }

  getCategoryByName(name){
    return new Promise((resolve,reject)=>{
      let category:any;
      this.data.categories.forEach((cat)=>{
        let catName = cat.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        if(name == catName){
          category = cat;
        }
      });
      if(category){
        resolve(category);
      }
      else{
        reject(null);
      }
    });
  }

  getSubCategoryByName(mainCat, subCat){
    return new Promise((resolve,reject)=>{
      let data = {
        category:{},
        subCategory:{}
      }
      this.data.categories.forEach((cat)=>{
        let catName = cat.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        if(mainCat == catName){
          data.category = cat;
          if(cat.sub_categories && cat.sub_categories.length){
            cat.sub_categories.forEach((subC)=>{
              let subCatName = subC.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
              if(subCatName == subCat){
                data.subCategory = subC;
              }
            });
          }
        }
      });
      if(data.category && data.subCategory){
        resolve(data);
      }
      else{
        reject(null);
      }
    });
  }

  toggleWishList(product){
    this.checkIfLoggedIn().then((usr)=>{
      if(!product.isWishlisted){
        let body = {
          liked_customers_id:this.data.userInfo.customers_id,
          liked_products_id:product.products_id
        }
        this.data.isProcessing = true;
        this.api.post('likeProduct', body).subscribe((res:any)=>{
          console.log(res);
          if(res.success == '1'){
            this.showToast('Product successfully added to the Wishlist.');
          }
          this.checkIfWishlisted(product);
          this.data.isProcessing = false;
        }, (err)=>{
          console.log(err);
          this.data.isProcessing = false;
        });
      }
      else{
        let body = {
          liked_customers_id:this.data.userInfo.customers_id,
          liked_products_id:product.products_id
        }
        this.data.isProcessing = true;
        this.api.post('removeFromWishList', body).subscribe((res:any)=>{
          console.log(res);
          if(res.success == '1'){
            this.showToast('Product successfully removed from the Wishlist.');
            this.data.selectedProduct.isWishlisted = false;
          }
          this.checkIfWishlisted(product);
          this.data.isProcessing = false;
        }, (err)=>{
          console.log(err);
          this.data.isProcessing = false;
        });
      }
    }).catch((err)=>{
      this.showToast('Please login first!');
      this.router.navigateByUrl('/login?next=/product/'+product.products_id);
    });
  }

  removeFromWishList(prod){
    return new Promise((resolve, reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        let body = {
          liked_customers_id:this.data.userInfo.customers_id,
          liked_products_id:prod.products_id
        }
        this.data.isProcessing = true;
        this.api.post('removeFromWishList', body).subscribe((res:any)=>{
          console.log(res);
          if(res.success == '1'){
            resolve(res);
            this.showToast('Product successfully removed from the Wishlist.');
          }
          this.data.isProcessing = false;
        }, (err)=>{
          console.log(err);
          this.data.isProcessing = false;
        });
      }).catch((err)=>{
        this.showToast('Please login first!');
        this.router.navigateByUrl('/login?next=/profile/wishlist');
      });
    });
  }

  getSomeProductsFromCategories(count, catsArray, filter?){
    let filProducts = [];
    catsArray.forEach((cat, j)=>{
      if(!filter){
        this.data.allProducts.forEach((prod:any, i)=>{
          if(cat.id == prod.categories_id){
            filProducts.push(prod);
          }
          else if(cat.id == prod.sub_categories_id){
            filProducts.push(prod);
          }
          else if(cat.id == prod.sub_sub_categories_id){
            filProducts.push(prod);
          }
        });
      }
      else{
        if(filter.indexOf('+')!=-1){
          let filterAmount = parseInt(filter.split(' +').shift().split('₹ ').pop());
          this.data.allProducts.forEach((prod:any)=>{
            if(cat.id == prod.categories_id && +prod.products_price > filterAmount){
              filProducts.push(prod);
            }
            else if(cat.id == prod.sub_categories_id && +prod.products_price > filterAmount){
              filProducts.push(prod);
            }
            else if(cat.id == prod.sub_sub_categories_id && +prod.products_price > filterAmount){
              filProducts.push(prod);
            }
          });
        }
        if(filter.indexOf('Below') != -1){
          let filterAmount = parseInt(filter.split('₹ ').pop());
          this.data.allProducts.forEach((prod:any)=>{
            if(cat.id == prod.categories_id && +prod.products_price <= filterAmount){
              filProducts.push(prod);
            }
            else if(cat.id == prod.sub_categories_id && +prod.products_price <= filterAmount){
              filProducts.push(prod);
            }
            else if(cat.id == prod.sub_sub_categories_id && +prod.products_price <= filterAmount){
              filProducts.push(prod);
            }
          });
        }
        if(filter.indexOf('Above') != -1){
          let filterAmount = parseInt(filter.split(' And').shift().split('₹ ').pop());
          this.data.allProducts.forEach((prod:any)=>{
            if(cat.id == prod.categories_id && +prod.products_price > filterAmount){
              filProducts.push(prod);
            }
            else if(cat.id == prod.sub_categories_id && +prod.products_price > filterAmount){
              filProducts.push(prod);
            }
            else if(cat.id == prod.sub_sub_categories_id && +prod.products_price > filterAmount){
              filProducts.push(prod);
            }
          });
        }
      }
    });
    return filProducts;
  }

  getPostById(id){
    return new Promise((resolve,reject)=>{
    let body = {
      news_id:id
    }
    this.data.isProcessing = true;
    this.api.post('getAllNews', body).subscribe((res:any)=>{
      if(res.news_data && res.news_data.length){
        this.data.selectedBlog = res.news_data[0];
        resolve(res.news_data[0]);
      }
      this.data.isProcessing = false;
    }, (err)=>{
      this.data.isProcessing = false;
    });
  });
  }

  getProductsByCategory(cat, filter?){
    let filtered = [];
    console.log(filter);
    if(this.data.allProducts.length && !filter){
      this.data.allProducts.forEach((prod:any)=>{
        prod.category_ids.toString().split(',').forEach((mul_cat) => {
          if(mul_cat == cat.id.toString()){
            filtered.push(prod);
          }
        });
      });
    } else if(this.data.allProducts.length && filter){
      if(filter.indexOf('+')!=-1){
        let filterAmount = parseInt(filter.split(' +').shift().split('₹ ').pop());
        this.data.allProducts.forEach((prod:any)=>{
          if(prod.categories_id == cat.id && +prod.products_price > filterAmount){
            filtered.push(prod);
          }
        });
      }
      if(filter.indexOf('Below') != -1){
        let filterAmount = parseInt(filter.split('₹ ').pop());
        console.log(filterAmount);
        this.data.allProducts.forEach((prod:any)=>{
          if(prod.categories_id == cat.id && +prod.products_price <= filterAmount){
            filtered.push(prod);
          }
        });
      }
      if(filter.indexOf('Above') != -1){
        let filterAmount = parseInt(filter.split(' And').shift().split('₹ ').pop());
        this.data.allProducts.forEach((prod:any)=>{
          if(prod.categories_id == cat.id && +prod.products_price > filterAmount){
            filtered.push(prod);
          }
        });
      }
      if(typeof filter == 'object'){
        filter.forEach((filter)=>{
          this.data.allProducts.forEach((prod:any)=>{
              if(prod.categories_id == cat.id && prod.attributes && prod.attributes.length){
                prod.attributes.forEach((attr)=>{
                  if(attr.option.name == 'Flavours'){
                    attr.values.forEach((value)=>{
                      if(value.value === filter){
                        filtered.push(prod);
                      }
                    });
                  }
                })
              }
          });
        });
      }
    }
    console.log(filtered);
    return filtered;
  }

  getProductsByCategoryId(catId){
    let filtered = [];
    if(this.data.allProducts.length){
      this.data.allProducts.forEach((prod:any)=>{
        if(prod.categories_id == catId){
          filtered.push(prod);
        }
      });
    }
    return filtered;
  }

  getSubCatsByOcc(occ){
    let filtered = [];
    let subCatsArray = occ.sub_categories_ids.split(',');
    if(occ.sub_categories_ids){
      this.data.categories.forEach((cat)=>{
        if(cat.sub_categories && cat.sub_categories.length){
          subCatsArray.forEach((subCatFromOcc)=>{
            cat.sub_categories.forEach((subCat)=>{
              if(subCatFromOcc == subCat.id){
                filtered.push(subCat);
              }
            });
        });
        }
      });
    }
    return filtered;
  }

  getProductsBySubCategory(subcat, filter?){
    let filtered = [];
    if(this.data.allProducts.length && !filter){
      this.data.allProducts.forEach((prod:any)=>{
        prod.sub_categories_id.split(',').forEach((subCatProd)=>{
          if(subCatProd == subcat.id){
            filtered.push(prod);
          }
        });
      });
    } else if(this.data.allProducts.length && filter){
      if(filter.indexOf('+')!=-1){
        let filterAmount = parseInt(filter.split(' +').shift().split('₹ ').pop());
        this.data.allProducts.forEach((prod:any)=>{
          prod.sub_categories_id.split(',').forEach((subCatProd)=>{
            if(subCatProd == subcat.id && +prod.products_price > filterAmount){
              filtered.push(prod);
            }
          });
        });
      }
      if(filter.indexOf('Below') != -1){
        let filterAmount = parseInt(filter.split(' +').shift().split('₹ ').pop());
        this.data.allProducts.forEach((prod:any)=>{
          prod.sub_categories_id.split(',').forEach((subCatProd)=>{
            if(subCatProd == subcat.id && +prod.products_price <= filterAmount){
              filtered.push(prod);
            }
          });
        });
      }
      if(filter.indexOf('Above') != -1){
        let filterAmount = parseInt(filter.split(' +').shift().split('₹ ').pop());
        this.data.allProducts.forEach((prod:any)=>{
          prod.sub_categories_id.split(',').forEach((subCatProd)=>{
            if(subCatProd == subcat.id && +prod.products_price > filterAmount){
              filtered.push(prod);
            }
          });
        });
      }
      if(typeof filter == 'object'){
        filter.forEach((filter)=>{
          this.data.allProducts.forEach((prod:any)=>{
            prod.sub_categories_id.split(',').forEach((subCatProd)=>{
              if(subCatProd == subcat.id && prod.attributes && prod.attributes.length){
                prod.attributes.forEach((attr)=>{
                  if(attr.option.name == 'Flavours'){
                    attr.values.forEach((value)=>{
                      if(value.value === filter){
                        filtered.push(prod);
                      }
                    });
                  }
                })
              }
            });
          });
        });
      }
    }
    return filtered;
  }

  getProductsBySubSubCategory(subsubcat){
    let filtered = [];
    if(this.data.allProducts.length){
      this.data.allProducts.forEach((prod:any)=>{
        if(prod.sub_sub_categories_id.indexOf(subsubcat.id) != -1){
          filtered.push(prod);
        }
      });
    }
    return filtered;
  }

  getCatsByOccId(occ){
    let categoriesFromOcc = JSON.parse(occ.categories_ids);
    let filtered = [];
    if(categoriesFromOcc && categoriesFromOcc.length){
      categoriesFromOcc.forEach((catFromOcc)=>{
        this.data.categories.forEach((cat)=>{
          if(catFromOcc === cat.id.toString()){
            filtered.push(cat);
          }
        });
      });
    }
    return filtered;
  }


  getSubCatsByOccId(occ){
    let categoriesFromOcc = occ.sub_categories_ids.split(',');
    console.log(categoriesFromOcc);
    let filtered = [];
    this.data.categories.forEach((cat)=>{
      if(cat.sub_categories && cat.sub_categories.length){
        cat.sub_categories.forEach((subCat) => {
          categoriesFromOcc.forEach((catFromOcc)=>{
            if(catFromOcc === subCat.id){
              filtered.push(subCat);
            }
          });
          if(subCat.sub_sub_categories && subCat.sub_sub_categories.length){
            subCat.sub_sub_categories.forEach((subSubCat)=>{
              categoriesFromOcc.forEach((catFromOcc)=>{
                if(catFromOcc === subSubCat.id){
                  filtered.push(subSubCat);
                }
              });
            });
          }
        });
      }
    });
    return filtered;
  }

  getSubSubCatsByOccId(occ){
    let categoriesFromOcc = occ.sub_sub_categories_ids;
    console.log(categoriesFromOcc);
    let filtered = [];
    this.data.categories.forEach((cat)=>{
      if(cat.sub_categories && cat.sub_categories.length){
        cat.sub_categories.forEach((subCat) => {
          if(subCat.sub_sub_categories && subCat.sub_sub_categories.length){
            subCat.sub_sub_categories.forEach((subSubCat)=>{
              categoriesFromOcc.forEach((catFromOcc)=>{
                if(catFromOcc === subSubCat.id){
                  filtered.push(subSubCat);
                }
              });
            });
          }
        });
      }
    });
    return filtered;
  }
  

  showAll(index){
    this.data.selectedCat = this.data.fullCatalog[index];
    this.router.navigate(['/products'], {queryParams:{'mainCatIndex':index}});
    this.closeSearch();
  }
  getSubCatByMainCat(index){
    this.data.selectedCat = this.data.fullCatalog[index];
  }
  getSubSubCatBySubCat(mainindex, subindex){
    this.data.selectedSubCat = this.data.fullCatalog[mainindex].subcategory[subindex];
  }
  removeProduct(index){
    this.showConfirm('Confirm Deletion!', 'Are you sure you want to remove '+this.data.cart[index]['name'] + ' from your cart?', '', null, ()=>{this.data.cart.splice(index, 1);});
  }


  async showConfirm(header?:any, message?:any, subheader?:any, handlerNo?:any, handlerYes?:any, buttonTextNo?:any, buttonTextYes?:any){
    const alert = await this.alertController.create({
      header: header ? header : '',
      subHeader:subheader ? subheader : '',
      message: message ? message : '',
      buttons: [{
        text:buttonTextNo ? buttonTextNo : 'No',
        handler: handlerNo ? handlerNo : (()=>{

        })
      },
      {
        text:buttonTextYes ? buttonTextYes : 'Yes',
        handler:handlerYes ? handlerYes : (()=>{

        })
      }
    ]
    });
    await alert.present();
  }

  getAllOccasions(allOcc){
    this.data.catalogWithOcc = allOcc;
    console.log(this.data.catalogWithOcc);
    let occasions = [];
    if(allOcc && allOcc.length){
      allOcc.forEach((cat)=>{
        if(cat.occasions && cat.occasions.length){
          cat.occasions.forEach((occ)=>{
            occasions.push(occ);
          })
        }
        if(cat.subcategory && cat.subcategory.length){
          cat.subcategory.forEach((subCat)=>{
            if(subCat.occasions && subCat.occasions.length){
              subCat.occasions.forEach((subOcc)=>{
                occasions.push(subOcc);
              })
            }
            if(subCat.subsubcategory && subCat.subsubcategory.length){
              subCat.subsubcategory.forEach((subSubCat)=>{
                if(subSubCat.occasions && subSubCat.occasions.length){
                  subSubCat.occasions.forEach((subSubOcc)=>{
                    occasions.push(subSubOcc);
                  });
                }
              })
            }
          })
        }
      });
    }
    this.data.ocassions = occasions;
    console.log(this.data.ocassions);
  }

  getOccNew(){
    return new Promise((resolve,reject)=>{
      let body = {
        language_id:1
      }
      this.data.isProcessing = true;
      this.api.post('getOccasionCategories', body).subscribe((res:any)=>{
        this.data.isProcessing = false;
        console.log(res);
        if(res){
          this.data.occasions = res;
          resolve(res);
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  getAllOffers(){
    let offers = [];
    this.data.offersMain = [];
    if(this.data.offersCatalog.length){
      this.data.offersCatalog.forEach((mainCat)=>{
        if(mainCat.offers.length){
          mainCat.offers.forEach((offer)=>{
            offers.push(offer);
          })
        }
        if(mainCat.subcategory && mainCat.subcategory.length){
          mainCat.subcategory.forEach((subCat)=>{
            if(subCat.offers.length){
              subCat.offers.forEach((subOffer)=>{
                offers.push(subOffer);
              })
            }
            if(subCat.subsubcategory && subCat.subsubcategory.length){
              subCat.subsubcategory.forEach((subsubCat)=>{
                if(subsubCat.offers.length){
                  subsubCat.offers.forEach((subsubOffer)=>{
                    offers.push(subsubOffer);
                  })
                }
              })
            }
          })
        }
      })
    }
    console.log(offers);
    this.data.offersMain = offers;
    this.getHomePageOffers();
  }

  checkIfLoggedIn(){
    return new Promise((resolve,reject)=>{
      if(this.platform.is('cordova')){
        this.nativeStorage.getItem('user').then((user)=>{
          if(user){
            this.data.userInfo = user;
            // this.data.selectedLocation = user.location ? user.location : this.router.navigate(['/locations']);
            resolve(user);
          }
          else{
            reject('Not a user');
          }
        })
      }
      else {
        //here browser check
        if(window.localStorage){
          let user = JSON.parse(localStorage.getItem('user'));
          if(user){
            this.data.userInfo = user;
            // this.data.selectedLocation = user.location ? user.location : this.router.navigate(['/locations']);
            resolve(user);
          }
          else{
            reject('Not a user');
          }
        }
      }
    });
  }

  logout(){
    this.router.navigate(['/']).then(()=>{
      this.menu.close('sideMenu');
      this.nativeStorage.remove('user');
      this.data.userInfo = '';
      this.data.selectedLocation = '';
      if(window.localStorage){
        localStorage.removeItem('user');
      }
      this.data.cart = [];
      this.showToast('Logged out successfully');
    });
  }

  selectLocation(location){
    console.log(location);
    this.data.selectedLocation = location;
    this.data.userInfo['location'] = this.data.selectedLocation;
    //get big fb picture
    if(this.data.userInfo.vc_oauth_provider=='fb'){
      this.api.getFromRoot('https://graph.facebook.com/v4.0/me?access_token='+this.data.fbData.accessToken+'&fields=id,name,picture.width(800).height(800)').subscribe((res:any)=>{
        console.log(res);
        if(res.picture){
          this.data.userInfo.bigPic = res.picture.data.url;
        }
        this.nativeStorage.setItem('user', this.data.userInfo).then(()=>{
          console.log('seted');
        }).catch((err)=>{
          console.log(err);
          //here perform browser login
          if(window.localStorage){
            localStorage.setItem('user', JSON.stringify(this.data.userInfo));
          }
        });
        this.initAll();
        this.router.navigate(['/home']);
      }, (err)=>{
        console.log(err);
      });
    }
    else{
      //google handling
      this.nativeStorage.setItem('user', this.data.userInfo).then(()=>{
        console.log('seted');
      }).catch((err)=>{
        console.log(err);
        //here perform browser login
        if(window.localStorage){
          localStorage.setItem('user', JSON.stringify(this.data.userInfo));
        }
      });
      this.router.navigate(['/home']);
    }
  }

  getLocations(){
    this.data.isFetching = true;
    let params = {
      user_id:'1'
    }
    this.api.get('cakes_api/location.php', params).subscribe((res:any)=>{
      console.log(res);
      this.data.isFetching = false
      if(res.status=='200'){
        this.data.locations = res.data;
      }
    }, (err)=>{
      this.data.isFetching = false
      console.log(err);
    });
  }

  getHomePageOffers(){
    let offers = [];
    this.data.homePageOffers = [];
    this.data.offersMain.forEach((offer:any)=>{
      if(offer.i_display_type=='1'){
        offers.push(offer);
      }
    });
    this.data.homePageOffers = offers;
  }

  signInPlanout(platform, result, param){
    this.data.isFetching = true;
    console.log(result);
        let params = param;
        console.log(params);
        this.api.get('cakes_api/auth_api.php', params).subscribe((response:any)=>{
          console.log(response);
          this.data.isFetching = false;

          if(response.isUser=='1'){
            // this.router.navigate(['/home']);
            this.router.navigate(['/locations']);
            // this.data.isAskNum = true;
            this.data.userInfo = response.data;
          }
          else{
            this.showToast('Please enter your mobile Number to continue');
            // this.data.isAskNum = true;
            this.verifyRequest();
          }
        });
  }

  signInGoogle(){
    this.data.fbData = undefined;
    this.data.fbResponse = undefined;
    if(!this.platform.is('cordova')){
      this.data.isFetching = true;

      firebase.auth().signOut().then(()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
      firebase.auth().signInWithPopup(provider).then((result:any)=>{
        this.data.isFetching = false;
        console.log(result);
        this.data.googleResponse = result;
        let params={
          accessToken:result.credential.accessToken,
          userID:result.additionalUserInfo.profile.id,
          platform:'google',
          email:result.additionalUserInfo.profile.email,
          picture:result.additionalUserInfo.profile.picture
        }
        this.data.googleData = params;
        // this.showToast('You have been logged in successfully!');
        this.signInPlanoutNew(params);
      }).catch((err)=>{
        console.log(err);
      });
      });
      
    }
    else{
      this.data.isFetching = true;

      (<any>window).AccountKitPlugin.logout();
      this.googlePlus.login({}).then((res)=>{
        console.log(res);
        let params={
          accessToken:res.accessToken,
          userID:res.userId,
          platform:'google'
        }
        this.data.googleData = params;
        this.data.isFetching = false;
        this.showToast('You have been logged in successfully!');
        this.signInPlanout('google', res, params);
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  setValue(key, val){
    this.data[key] = val;
  }

  verifyRequest(){
    if(!this.platform.is('cordova')){
      this.data.isFetching = true;

      let countryCode = '+91';
      let phoneNumber = this.data.mobileNum;
      AccountKit.login(
        'PHONE', 
        {countryCode: countryCode, phoneNumber: phoneNumber}, (res)=>{
          console.log(res);
          this.data.isFetching = false;

          if(res.status=="PARTIALLY_AUTHENTICATED"){
            // here we will call the next api
            this.verifyCode(res);
          }
          // this.showToast(JSON.stringify(res));
        });
      }
      else{
        (<any>window).AccountKitPlugin.loginWithPhoneNumber({
          useAccessToken: false,
          defaultCountryCode: "IN",
          facebookNotificationsEnabled: true,
        }, (data)=>{
          console.log(data);
          this.data.isFetching = false;

          this.verifyCode(data);
          (<any>window).AccountKitPlugin.getAccount((info)=>{
            console.log(info);
            // this.router.navigate(['/home']);
            // this.showToast(JSON.stringify(info));
          })
        }, (err)=>{
          alert(err);
        })
      }
    // this.data.isAskNum = false;
    // this.data.isOtpSent = true;
    // this.showToast('An otp has been sent to your mobile number. Please enter it to verify your mobile number');
  }

  verifyCode(accKitRes){
    let params = {
      code:accKitRes.code
    }
    if(this.data.fbData){
      params['fbId'] = this.data.fbData.userID;
      // params['access_token'] = this.data.fbData.accessToken;
    }
    console.log(params);
    if(this.data.googleData){
      params['google_id'] = this.data.googleData.userID;
      // params['access_token'] = this.data.googleData.accessToken;
    }
    this.api.get('cakes_api/signup.php', params).subscribe((resulted:any)=>{
      console.log(resulted);
      if(resulted.status=='200'){
        this.showToast('Welcome '+resulted.data.vc_name+ '! You have been signed up successfully');
        this.signInPlanout(resulted.data.vc_oauth_provider, resulted, resulted.data.vc_oauth_provider=='fb' ? this.data.fbData : this.data.googleData);
      }
    }, (err)=>{
      console.log(err);
    })
  }

  closePopup(){
    document.getElementById('planoutPass').style.animation = "none";
  }

  validateOtp(){
    if(!this.data.otp){
      this.showToast('Please enter otp to continue');
      return false;
    }
    this.data.isAskNum = false;
    this.data.isOtpSent = false;
    this.router.navigate(['/home']);
    this.showToast('You have been signed up successfully');
    // this.nativeStorage.setItem('user', this.data.userInfo).then(()=>{});
  }

  convertToArray(num){
    let array = [];
    while(num){
      num--;
      array.push(num);
    }
    return array;
  }

  convertGeoCode(){
    this.data.isFetching = true;
    this.getUserLocation().then((loc:any)=>{
      console.log(loc);
      if(this.platform.is('cordova')){
        let options:NativeGeocoderOptions = {
          useLocale:true,
          maxResults:10
        }
    
        this.nativeGeocoder.reverseGeocode(loc.latitude, loc.longitude, options)
        .then((result: NativeGeocoderResult[]) => {
          console.log(result);
          if(result && result.length){
            if(!this.data.selectedProduct.category_ids.includes('167')){
              this.getZones().then((states:any)=>{
                let hasPostalCode = false;
                this.data.isEligibleLocation = false;
                if(result[0] && result[0].postalCode){
                  hasPostalCode = true;
                  states.forEach((state)=>{
                    if(state.zone_code == result[0].postalCode){
                      this.data.isEligibleLocation = true;
                    }
                  });
                  if(hasPostalCode){
                    this.saveToDb('userLocation', result[0]);
                    this.data.userGeoLocation = result[0].subLocality + ', ' + result[0].administrativeArea + '-' + result[0].postalCode;
                  }
                  else{
                    this.showToast('Sorry. We can not fetch your pincode. Please try again');
                  }
                }
              });
            }
            else{
              this.saveToDb('userLocation', result[0]);
              this.data.userGeoLocation = result[0].subLocality + ', ' + result[0].administrativeArea + '-' + result[0].postalCode;
              this.data.isEligibleLocation = true;
            }
          }
        }).catch((error: any) => console.log(error));
      }
      else{
        let params = {
          latlng:loc.latitude+','+loc.longitude,
          sensor:true,
          key:this.data.google_api_key
        }
        this.api.getFromRoot('https://maps.googleapis.com/maps/api/geocode/json', params).subscribe((res:any)=>{
          console.log(res);
          if(res.status=="OK"){
            // this.showToast(res.error_message);
            if(!this.data.selectedProduct.category_ids.includes('167') && this.data.selectedProduct.category_ids !== '2' && !this.data.selectedProduct.category_ids.includes('33')){
              this.getZones().then((states:any)=>{
                let hasPostalCode = false;
                this.data.isEligibleLocation = false;
                if(res.results[0] && res.results[0].address_components && res.results[0].address_components.length){
                  res.results[0].address_components.forEach((addr)=>{
                    if(addr.types.length && addr.types.includes('postal_code')){
                      hasPostalCode = true;
                      states.forEach((state)=>{
                        if(state.zone_code == addr.long_name){
                          this.data.isEligibleLocation = true;
                        }
                      });
                    }
                  });
                  if(hasPostalCode){
                    this.data.userGeoLocation = res.results[0].formatted_address;
                    this.saveToDb('userLocation', res.results[0]);
                  }
                  else{
                    this.showToast('Sorry. We can not fetch your pincode. Please try again');
                  }
                }
              });
            }
            else{
              this.data.userGeoLocation = res.results[0].formatted_address;
              this.saveToDb('userLocation', res.results[0]);
              this.data.isEligibleLocation = true;
            }
          }
        }, (err)=>{
          console.log(err);
        })
      }
      this.data.isFetching = false;
    }).catch((err)=>{
      this.showToast(err);
      this.data.isFetching = false;
    });
  }

  fetchUserLocationFromDb(){
    return new Promise((resolve,reject)=>{
      this.getFromDb('userLocation').then((dat:any)=>{
        console.log(dat);
        dat ? this.data.userGeoLocation = dat.formatted_address : null;
        if(this.data.selectedProduct && !this.data.selectedProduct.category_ids.includes('167')){
          this.getZones().then((states:any)=>{
            if(dat && dat.address_components && dat.address_components.length){
              dat.address_components.forEach((addr)=>{
                if(addr.types.length && addr.types.includes('postal_code')){
                  states.forEach((state)=>{
                    if(state.zone_code == addr.long_name){
                      console.log('yes eligible');
                      this.data.isEligibleLocation = true;
                    }
                  });
                }
              });
            }
          });
        }
        else{
          this.data.isEligibleLocation = true;
        }
        resolve(dat);
      }).catch((err)=>{
        console.log(err);
        reject(err);
      })
    })
  }

  openPinCodeScreen(){
    this.router.navigate(['/enterpincode'], {queryParams:{next:location.pathname,categoryname:this.data.selectedProduct.category_ids}});
  }

  async openOptions(){
    const acSht = await this.actionSheetController.create({
      header:'Choose your delivery location',
      subHeader:'Select a delivery location to see product availability and delivery options',
      buttons:[
        {
          text:'Select location',
          icon:'pin',
          handler:(()=>{
            this.openPinCodeScreen();
          })
        },
        {
          text:'Use my Current location',
          icon:'locate',
          handler:(()=>{
           this.convertGeoCode()
          })
        }
      ]
    });
    await acSht.present();
  }

  selectTrending(num){
    this.router.navigate(['/trending']);
    this.data.selectedTrending = num;
  }

  shareFeed(index){
    let feed:any = this.data.feeds[index];
    this.socialSharing.share(feed.title, feed.title, feed.image ? feed.image : 'https://www.youtube.com/watch?v='+feed.video, 'https://play.google.com/store?hl=en').then(()=>{
      this.showToast('Shared Successfully');
    }).catch((err)=>{
      this.showToast(err);
    })
  }

  followUser(index){
    let user:any = this.data.feeds[index];
    user.user.follow ? user.user.follow = false : user.user.follow = true;
    user.user.follow ? this.showToast('You are now following '+user.user.name) : this.showToast('You unfollowed '+user.user.name);
  }

  savePost(e, i){
    this.data.userInfo.savedPosts = this.data.blogPosts[i];
    this.showToast('Post Saved to your account.');
  }


  sharePost(e, id){
    this.getPostById(id).then((selPost:any)=>{
      if(this.platform.is('cordova')){
        this.socialSharing.share(null, selPost.news_name, selPost.news_image ? selPost.news_image : 'https://www.tambawaras.id/wp-content/uploads/2018/05/noimage-portfolio-2000x1125.png', location.origin + '/blogDetails/'+id).then(()=>{
        this.showToast('Shared Successfully');
        }).catch((err)=>{
          this.showToast(err);
        });
      }
      else{
        let nav:any = navigator;
        if(nav.share){
          nav.share({
            title:selPost.news_name,
            text:'Read this beautiful post by Planoutx to plan your occasions.',
            url:location.origin + '/blogDetails/'+id
          }).then(()=>{
            this.showToast('Shared Successfully');
          }).catch((err)=>{
            this.showToast(err);
          });
        }
        else{
          this.showToast('Sharing not supported by your device.');
        }
      }
    });
    
  }

  shareVideo(video){
    console.log(video);
    this.socialSharing.share(null, video.snippet.title, null, 'https://youtu.be/'+video.id.videoId).then(()=>{
      this.showToast('Shared Successfully');
    }).catch((err)=>{
      this.showToast(err);
    })
  }

  checkTimer(){
    let fromTimeHour = 10;
    let toTimeHour = 17;
    let s = setInterval(()=>{
      let nowHour = new Date().getHours();
      if(nowHour >= fromTimeHour && nowHour <= toTimeHour){
        let nowMinutes = new Date().getMinutes();
        let nowSeconds = new Date().getSeconds();
        let hoursLeft = toTimeHour - nowHour; 
        let minutesLeft = 59 - nowMinutes;
        let secondsLeft = 59 - nowSeconds;
        this.data.liveTimer.hour = hoursLeft;
        this.data.liveTimer.min = minutesLeft;
        this.data.liveTimer.sec = secondsLeft;
      }
      else{
        this.data.liveTimer.hour = this.data.liveTimer.min = this.data.liveTimer.sec = 0;
        clearInterval(s);
      }
    },1000);
  }

  getPassportPlans(){
    return new Promise((resolve,reject)=>{
      let body = {};
      this.data.isProcessing = true;
      this.api.post('getAllPlans', body).subscribe((res:any)=>{
        console.log(res);
        if(res.pages_data){
          resolve(res.pages_data);
        }
        this.data.isProcessing = false;
      }, (err)=>{
        console.log(err);
      });
    });
  }

  getAllPages(){
    return new Promise((resolve,reject)=>{
      let body = {};
      this.data.isProcessing = true;
      this.api.post('getAllPages', body).subscribe((res:any)=>{
        this.data.isProcessing = false;
        console.log(res);
        if(res.success == '1'){
          this.data.allPages = res.pages_data;
          resolve(res.pages_data);
        }
        
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  getAllOffersNew(){
    return new Promise((resolve,reject)=>{
      let body = {};
      this.data.isProcessing = true;
      this.api.get('getOffers', body).subscribe((res:any)=>{
        if(res.data){
          this.data.passOffers = res.data;
          this.checkForTempBanner();
          resolve(res.data);
        }
        this.data.isProcessing = false;
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  checkForTempBanner(){
    this.data.passOffers.forEach((off)=>{
      if(off.banners_url == 'temporary'){
        this.data.hasTempBanner = true;
      }
    })
  }

  getSubOccasions(){
    return new Promise((resolve,reject)=>{
      let body = {};
      this.data.isProcessing = true;
      this.api.post('getOccasionSubCategories', body).subscribe((res:any)=>{
        console.log(res);
        this.data.isProcessing = false;
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  getPageByName(pageName){
    return new Promise((resolve,reject) => {
    let pipe = new UrlSlugPipe();
      this.data.allPages.forEach((page)=>{
        if(pipe.transform(page.name) == pageName){
          resolve(page);
        }
      });
    });
  }

  getAllReviews(){
    return new Promise((resolve,reject)=>{
      let body = {};
      this.data.isProcessing = true;
      this.api.post('getReviewsAll', body).subscribe((res:any)=>{
        console.log(res);
        this.data.isProcessing = false;
        if(res.data && res.data.length){
          this.data.ratings = res.data;
          resolve(res.data);
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      })
    });
  }

  getUserBalance(){
    return new Promise((resolve,reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        let body = {
          customers_id:this.data.userInfo.customers_id,
          language_id:'1'
        }
        this.data.isProcessing = true;
        this.api.post('getUserBalance', body).subscribe((res:any)=>{
          console.log(res);
          this.data.isProcessing = false;
          if(res.success=='1'){
            let amount = 0;
            res.data.forEach((wallet)=>{
              amount = amount + +wallet.amount;
              this.data.userInfo.amount = amount.toString();
              //this.data.userWalletBalance = amount.toString();
            });
            this.data.userWalletBalance = res.user_balance;
            resolve(res.data);
          }
        }, (err)=>{
          console.log(err);
          this.data.isProcessing = false;
        });
      }).catch((err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  getWishList(){
    return new Promise((resolve,reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        let body = {
          liked_customers_id:this.data.userInfo.customers_id,
          language_id:'1'
        }
        this.data.isProcessing = true;
        this.api.post('getWishList', body).subscribe((res:any)=>{
          this.data.isProcessing = false;
          console.log(res);
          this.data.wishList = res.product_data;
          resolve(res);
        }, (err)=>{
          this.data.isProcessing = false;
          console.log(err);
        });
      }).catch((err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  checkIfWishlisted(prod){
    this.getWishList().then((wish)=>{
      if(this.data.wishList.length){
        this.data.wishList.forEach((wishProd)=>{
          if(wishProd.liked_products_id == prod.products_id){
            this.data.selectedProduct.isWishlisted = true;
          }
        });
      }
      else{
        this.data.selectedProduct.isWishlisted = false;
      }
      console.log(this.data.selectedProduct);
    });
  }

  getUserAddresses(){
    return new Promise((resolve,reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        let body = {
          customers_id:this.data.userInfo.customers_id,
          language_id:'1'
        }
        this.data.isProcessing = true;
        this.api.post('getAllAddress', body).subscribe((res:any)=>{
          this.data.isProcessing = false;
          console.log(res);
          if(res.data){
            this.data.userInfo.addresses = res.data;
            this.data.savedAddresses = res.data;
            resolve(res.data);
          }
          console.log(this.data.userInfo);
        }, (err)=>{
          this.data.isProcessing = false;
        })
      }).catch((err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  getUserAddressByAddressId(id){
    let addrId = id;
    return new Promise((resolve,reject)=>{
      this.getUserAddresses().then((addresses)=>{
        this.data.savedAddresses.forEach((addr)=>{
          if(addr.address_id==addrId){
            resolve(addr);
          }
        });
      });
    });
  }

  getOrders(){
    return new Promise((resolve,reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        let body = {
          customers_id:this.data.userInfo.customers_id,
          language_id:'1',
          order_type:'3'
        }
        this.data.isProcessing = true;
        this.api.post('getOrders', body).subscribe((res:any)=>{
          this.data.isProcessing = false;
          console.log(res);
          if(res.success=='1'){
            resolve(res.data);
            this.data.allOrders = res.data;
          }
        }, (err)=>{
          this.data.isProcessing = false;
        });
      }).catch((err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    });
  }

  getCart(){
    return new Promise((resolve, reject)=>{
      this.checkIfLoggedIn().then((user)=>{
        this.data.cartHasCake = false;
        let body = {
          customers_id:this.data.userInfo.customers_id
        }
        // this.spinMe('show', 'Please wait...');
        this.data.isProcessing = true;
        this.api.post('getCart', body).subscribe((res:any)=>{
          this.data.isProcessing = false;
          if(res.success=='1' && res.data){
            this.data.cart = res.data.reverse();
            let shipping = 0;
            let cartSubTotal = 0;
            this.data.cart.forEach((cartItem:any)=>{
              cartItem.addonSubProducts = [];
              if(cartItem.shipping_cost){
                shipping+= +cartItem.shipping_cost;
              }
              if(cartItem.shipping_time && cartItem.shipping_time !== 'undefined'){
                cartItem.shipping_time = JSON.parse(cartItem.shipping_time);
              }
              let id = cartItem.products_id;
              let cartProductId = cartItem.categories_product_id.split(',');
              let cartCategoryId = cartItem.categories_product_id.split(',');
              cartCategoryId.forEach((catId) => {
                if(catId == '1'){
                  this.data.cartHasCake = true;
                }
              })
              let products = [];
              if(this.data.allProducts.length != 0){
                this.data.categories.forEach((cat:any)=>{
                  cartProductId.forEach((catId) => {
                    if(cat.id == catId){
                      cat.addon_products.split(',').forEach((addonProd)=>{
                        this.data.allProducts.forEach((prodNew:any)=>{
                          if(prodNew.products_id == +addonProd){
                            products.push(prodNew);
                          }
                        })
                      });
                    }
                  });
                });
                // this.data.allProducts.forEach((prod:any)=>{
                //   if(prod.products_id == id){
                //     if(prod.addon_products){
                //       prod.addon_products.split(',').forEach((addonProd)=>{
                //         this.data.allProducts.forEach((prodNew:any)=>{
                //           if(prodNew.products_id == addonProd){
                //             products.push(prodNew);
                //           }
                //         })
                //       });
                //     }
                //     if(prod.categories_id=='1'){
                //       this.data.cartHasCake = true;
                //     }
                //   }
                // });
                cartItem.addonProducts = products;
              }
              else if(this.data.allProducts.length == 0){
                this.getCatalog().then(()=>{
                  this.getCart();
                });
              }
              if(cartItem.applied_coupons.length){
                this.data.appliedCoupon = cartItem.applied_coupons[0]; 
              }
              if(+cartItem.final_price > 0){
                cartSubTotal += cartItem.special_price ? +cartItem.special_price : +cartItem.price;
              }
            });
            this.data.cartSubTotal = cartSubTotal;
            this.setSubTotalIfAddons();
            this.data.cartShippingTotal = shipping;
            this.data.cartTotal = this.data.cartShippingTotal + this.data.cartSubTotal;
            this.setCartDiscount();
            this.setCartAddons();
            this.checkIfUpsellAdded();
            resolve(res.data);
          }
          else{
            this.data.cart = [];
          }
        }, (err)=>{
          console.log(err);
          this.data.isProcessing = false;
        });
      }).catch((err)=>{
        this.data.isProcessing = false;
      });
    });
  }

  checkIfUpsellAdded(){
    this.data.allProducts.forEach((catProd:any) => {
      this.data.cart.forEach((prod:any) => {
        if(prod.products_id == catProd.products_id && prod.product_parent == 'upsell'){
          catProd.isUpsellAdded = true;
          catProd.customers_basket_id = prod.customers_basket_id;
        }
      });
    });
  }

  setCartAddons(){
    this.data.cart.forEach((prod:any) => {
      if(prod.type == 'addon'){
        let parentProduct = JSON.parse(prod.product_parent);
        console.log(parentProduct);
        this.data.cart.forEach((prodSub:any) => {
          if(prodSub.customers_basket_id == parentProduct.basket_id){
            prodSub.addonSubProducts.push(prod);
          }
        });
      }
    });
    console.log(this.data.cart);
  }

  setSubTotalIfAddons(){
    let addonsTotal = 0;
    if(this.data.cart.length){
      this.data.cart.forEach((prod:any) => {
        if(prod.attributes && prod.attributes.length){
          prod.attributes.forEach((attr:any) => {
            addonsTotal += +attr.options_values_price;
          });
        }
      });
      console.log(addonsTotal);
      this.data.cartSubTotal += addonsTotal;
    }
  }

  setCartDiscount(){
    let cartDiscount = 0;
    if(this.data.cart.length){
      this.data.cart.forEach((itm:any)=>{
        if(itm.applied_coupon_data && itm.applied_coupon_data.length){
          cartDiscount += +itm.applied_coupons[0].coupon_amount;
          this.data.appliedCouponData = itm.applied_coupon_data[0];
        }
      });
      this.data.cartDiscount = cartDiscount;
      this.data.cartTotal = this.data.cartSubTotal - this.data.cartDiscount + this.data.cartShippingTotal;
    }
  }

  getProductsByName(prodName){
    let name = prodName;
    return new Promise((resolve,reject)=>{
      if(this.data.allProducts.length){
        this.data.allProducts.forEach((prod:any)=>{
          if(prod.products_name == name){
            resolve(prod);
          }
        });
      }
      else{
        this.getCatalog().then((catl)=>{
          this.getProductsByName(name).then((prod)=>{
            resolve(prod);
          });
        });
      }
    });
  }

  getAddonsByProductId(prodId){
    return new Promise((resolve,reject)=>{
      
    });
  }

  addAddon(parentProduct, product,qty){
    return new Promise((resolve, reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        if(qty <= +product.products_quantity){
          this.data.isProcessing = true;
          let parentProd = {
            id:parentProduct.products_id,
            basket_id:parentProduct.basket_id
          }
          let body = new FormData();
          body.append('customers_id', this.data.userInfo.customers_id);
          body.append('products_id', product.products_id);
          body.append('shipping_date', parentProduct.shipping_date);
          body.append('shipping_time', JSON.stringify(parentProduct.shipping_time));
          body.append('shipping_cost', '0');
          body.append('type', 'addon');
          body.append('product_parent', JSON.stringify(parentProd));
          body.append('customers_basket_quantity', qty);
          body.append('final_price', product.specials_new_products_price ? (+product.specials_new_products_price * +qty).toString() : (+product.products_price * +qty).toString());
          this.api.post('addToCart', body).subscribe((res)=>{
            console.log(res);
            this.data.isProcessing = false;
            this.showToast(body.get('customers_basket_quantity') + ' quantity of ' + product.products_name + 'is added to your cart');
            this.getCart();
            resolve(res);
          }, (err)=>{
            this.data.isProcessing = false;
            console.log(err);
          });
        }
        else{
          this.showToast('Please add quantity less than available quantity of the product i.e. ' + product.products_quantity);
        }
      }).catch((err)=>{
        this.data.isProcessing = false;
        this.showToast('You are not logged in!');
        reject(err);
      });
    });
  }

  addUpsell(product,qty){
    return new Promise((resolve, reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        if(qty <= +product.products_quantity){
          this.data.isProcessing = true;
          let body = new FormData();
          body.append('customers_id', this.data.userInfo.customers_id);
          body.append('products_id', product.products_id);
          body.append('shipping_date', product.shipping_date);
          body.append('shipping_time', JSON.stringify(product.shipping_time));
          body.append('shipping_cost', '0');
          body.append('type', 'none');
          body.append('product_parent', 'upsell');
          body.append('customers_basket_quantity', qty);
          body.append('final_price', product.specials_new_products_price ? (+product.specials_new_products_price * +qty).toString() : (+product.products_price * +qty).toString());
          this.api.post('addToCart', body).subscribe((res)=>{
            console.log(res);
            this.data.isProcessing = false;
            this.showToast(body.get('customers_basket_quantity') + ' quantity of ' + product.products_name + 'is added to your cart');
            this.getCart();
            resolve(res);
          }, (err)=>{
            this.data.isProcessing = false;
            console.log(err);
          });
        }
        else{
          this.showToast('Please add quantity less than available quantity of the product i.e. ' + product.products_quantity);
        }
      }).catch((err)=>{
        this.data.isProcessing = false;
        this.showToast('You are not logged in!');
        reject(err);
      });
    });
  }

  addToCart(product, qty){
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
      this.checkIfLoggedIn().then((user)=>{
        if(+qty <= +product.products_quantity){
          let body = new FormData();
          body.append('customers_id', this.data.userInfo.customers_id);
          body.append('products_id', product.products_id);
          body.append('shipping_date', this.data.selectedProduct.shipping_date);
          body.append('shipping_time', JSON.stringify(this.data.selectedProduct.shipping_time));
          body.append('shipping_cost', this.data.selectedProduct.shipping_cost);
          body.append('customers_basket_quantity', qty);
          body.append('final_price', product.specials_new_products_price ? (+product.specials_new_products_price * +qty).toString() : (+product.products_price * +qty).toString());

          if(product.attributes && product.attributes.length){
            //if attributes
            let allArray = [];
            product.attributes.forEach((attr, i)=>{
              if(attr.selectedValue && attr.selectedValue!='0'){
                allArray.push(attr);
                body.append("attribute["+i+"][products_options_id]", attr.option.id);
                body.append("attribute["+i+"][products_options_values_id]", attr.selectedValue.id);
              }
            });
            console.log(allArray);
            if(allArray && allArray.length==this.data.selectedProduct.attributes.length){
              console.log(body);
              this.api.post('addToCart', body).subscribe((res)=>{
                this.data.isProcessing = false;
                console.log(res);
                this.showToast(body.get('customers_basket_quantity') + ' quantity of ' + product.products_name + 'is added to your cart');
                this.getCart().then((cartData)=>{
                  resolve('added');
                });
              }, (err)=>{
                this.data.isProcessing = false;
                console.log(err);
                reject(err);
              });
            }
            else{
              this.data.isProcessing = false;
              this.showToast('Please select all the options available to proceed for cart!');
            }
          }
          else{
            //if no attributes
            this.api.post('addToCart', body).subscribe((res)=>{
              console.log(res);
              this.data.isProcessing = false;
              this.showToast(body.get('customers_basket_quantity') + ' quantity of ' + product.products_name + 'is added to your cart');
              this.getCart();
              resolve('added');
            }, (err)=>{
              this.data.isProcessing = false;
              console.log(err);
              reject(err);
            });
          }
        }
        else{
          this.data.isProcessing = false;
          this.showToast('Please add quantity less than available quantity of the product i.e. ' + product.products_quantity);
        }
      }).catch((err)=>{
        this.showToast('Please log in First');
        this.data.isProcessing = false;
        this.router.navigate(['/login']);
      });
    });
  }

  addPassportProductToCart(product, qty){
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
      this.checkIfLoggedIn().then((user)=>{
        if(+qty <= +product.products_quantity){
          let body = new FormData();
          body.append('customers_id', this.data.userInfo.customers_id);
          body.append('products_id', product.products_id);
          body.append('shipping_date', this.data.selectedProduct.shipping_date);
          body.append('shipping_time', JSON.stringify(this.data.selectedProduct.shipping_time));
          body.append('shipping_cost', this.data.selectedProduct.shipping_cost);
          body.append('customers_basket_quantity', qty);
          body.append('final_price', '0');

          if(product.attributes && product.attributes.length){
            //if attributes
            let allArray = [];
            product.attributes.forEach((attr, i)=>{
              if(attr.selectedValue && attr.selectedValue!='0'){
                allArray.push(attr);
                body.append("attribute["+i+"][products_options_id]", attr.option.id);
                body.append("attribute["+i+"][products_options_values_id]", attr.selectedValue.id);
              }
            });
            console.log(allArray);
            if(allArray && allArray.length==this.data.selectedProduct.attributes.length){
              console.log(body);
              this.api.post('addToCart', body).subscribe((res)=>{
                this.data.isProcessing = false;
                console.log(res);
                this.showToast(body.get('customers_basket_quantity') + ' quantity of ' + product.products_name + 'is added to your cart');
                this.getCart();
                resolve('added');
              }, (err)=>{
                this.data.isProcessing = false;
                console.log(err);
                reject(err);
              });
            }
            else{
              this.data.isProcessing = false;
              this.showToast('Please select all the options available to proceed for cart!');
            }
          }
          else{
            //if no attributes
            this.api.post('addToCart', body).subscribe((res)=>{
              console.log(res);
              this.data.isProcessing = false;
              this.showToast(body.get('customers_basket_quantity') + ' quantity of ' + product.products_name + 'is added to your cart');
              this.getCart();
              resolve('added');
            }, (err)=>{
              this.data.isProcessing = false;
              console.log(err);
              reject(err);
            });
          }
        }
        else{
          this.data.isProcessing = false;
          this.showToast('Please add quantity less than available quantity of the product i.e. ' + product.products_quantity);
        }
      }).catch((err)=>{
        this.showToast('Please log in First');
        this.data.isProcessing = false;
        this.router.navigate(['/login']);
      });
    });
  }

  removeFromCart(product, alert?){
    this.checkIfLoggedIn().then((user)=>{
      let body = {
        customers_id:this.data.userInfo.customers_id,
        products_id:product.products_id,
        customers_basket_id:product.customers_basket_id
      }
      this.data.isProcessing = true;
      this.api.post('deleteFromCart', body).subscribe((res:any)=>{
        this.data.isProcessing = false;
        console.log(res);
        if(res.success=='1'){
          if(!alert){
            this.showToast('1 Quantity of ' + product.products_name + 'has been removed from the cart successfully');
          }
          this.getCart().then((cart)=>{
            this.removeCoupon();
            this.data.appliedCoupon = undefined;
            this.data.appliedCouponData = undefined;
            this.data.couponFormOpened = false;
          });
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });

      //remove addons if any
      if(product.addonSubProducts && product.addonSubProducts.length){
        product.addonSubProducts.forEach((prod) => {
          let bodyAddon = {
            customers_id:this.data.userInfo.customers_id,
            products_id:prod.products_id,
            customers_basket_id:prod.customers_basket_id
          }

          this.data.isProcessing = true;
          this.api.post('deleteFromCart', bodyAddon).subscribe((res:any)=>{
            this.data.isProcessing = false;
            console.log(res);
            if(res.success=='1'){
              if(!alert){
                this.showToast('1 Quantity of ' + product.products_name + 'has been removed from the cart successfully');
              }
              this.getCart().then((cart)=>{
                this.removeCoupon();
                this.data.appliedCoupon = undefined;
                this.data.appliedCouponData = undefined;
                this.data.couponFormOpened = false;
              });
            }
          }, (err)=>{
            this.data.isProcessing = false;
            console.log(err);
          });


        });
      }
    }).catch((err)=>{
      console.log(err);
      this.data.isProcessing = false;
      this.showToast('Please Log in First');
      this.router.navigate(['/login']);
    })
  }

  shareProduct(){
    let nav:any = navigator;
    if(nav.share){
      nav.share({
        title:this.data.selectedProduct.products_name,
        text:'Look at this beautiful Product by Planoutx',
        url:location.origin + '/product/'+this.data.selectedProduct.products_id
      }).then(()=>{
        this.showToast('Shared Successfully');
      }).catch((err)=>{
        this.showToast(err);
      });
    }
    else{
      this.showToast('Sharing not supported by your device.');
    }
  }

  copyInviteCode(){
    let nav:any = navigator;
    nav.clipboard.writeText(this.data.userInfo.refree_id).then(()=>{
      this.showToast('Code copied. '+this.data.userInfo.refree_id);
    });
  }

  shareInviteCode(){
    this.checkIfLoggedIn().then((usr)=>{
      let nav:any = navigator;
      if(nav.share){
        nav.share({
          text:'Hey! I’ve unlocked exclusive referral bonus on the Planoutx app! Use my referral code & get Rs. 200 when you sign up on Planoutx! '+location.origin+'/login?referral_id='+this.data.userInfo.refree_id
        }).then((res)=>{
          this.showToast('Shared Successfully');
        }).catch((err)=>{
          this.showToast(err);
        });
      }
      else{
        this.showToast('Sharing not supported by your device.');
      }
    });
  }

  saveAddress(address){
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
      this.checkIfLoggedIn().then((usr:any)=>{
        if(usr){
          let body = {
            customers_id:usr.customers_id,
            entry_firstname:address.username.split(' ').shift(),
            entry_lastname:address.username.split(' ').pop(),
            entry_street_address:address.address,
            entry_suburb:address.country,
            entry_postcode:address.pincode,
            entry_city:address.city,
            entry_state:address.city,
            entry_country_id:address.country,
            entry_country_name:address.country,
            entry_zone_id:'',
            entry_gender:usr.customers_gender == '0' ? 'M' : 'F',
            entry_company:'',
            customers_default_address_id:'1'
          }
          this.api.post('addShippingAddress', body).subscribe((res:any)=>{
            this.data.isProcessing = false;
            if(res.success){
              this.getUserAddresses();
              resolve('success');
            }
          }, (err)=>{
            this.data.isProcessing = false;
            console.log(err);
          })
        }
      });
    });
  }

  editAddress(address){
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
      this.checkIfLoggedIn().then((usr:any)=>{
        if(usr){
          let body = {
            customers_id:usr.customers_id,
            entry_firstname:address.username.split(' ').shift(),
            entry_lastname:address.username.split(' ').pop(),
            entry_street_address:address.address,
            entry_suburb:address.country,
            entry_postcode:address.pincode,
            entry_city:address.city,
            entry_country_id:address.country,
            entry_country_name:address.country,
            entry_zone_id:'',
            entry_gender:usr.customers_gender == '0' ? 'M' : 'F',
            entry_company:'',
            address_id:address.id
          }
          this.api.post('updateShippingAddress', body).subscribe((res:any)=>{
            this.data.isProcessing = false;
            if(res.success){
              this.showToast(res.message);
              this.getUserAddresses();
              this.router.navigate(['/profile/savedaddresses']);
              resolve('success');
            }
          }, (err)=>{
            this.data.isProcessing = false;
            console.log(err);
          })
        }
      });
    });
  }

  deleteAddress(addressid){
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
      this.checkIfLoggedIn().then((usr:any)=>{
        if(usr){
          let body = {
            address_book_id:addressid,
            customers_id:usr.customers_id
          }
          this.api.post('deleteShippingAddress', body).subscribe((res:any)=>{
            this.data.isProcessing = false;
            if(res.success){
              this.getUserAddresses();
              this.showToast('Address deleted successfully');
              resolve('success');
            }
          }, (err)=>{
            this.data.isProcessing = false;
            console.log(err);
          })
        }
      });
    })
  }

  placeOrder(orderType, walletAmount?){
    console.log('Order method called');
    this.data.Order={
      billing_city:this.data.deliveryAddress.city,
      billing_country:this.data.deliveryAddress.suburb ? this.data.deliveryAddress.suburb : 'India',
      billing_firstname:this.data.deliveryAddress.firstname,
      billing_lastname:this.data.deliveryAddress.lastname,
      billing_postcode:this.data.deliveryAddress.postcode,
      billing_street_address:this.data.deliveryAddress.street,
      billing_suburb:this.data.deliveryAddress.suburb ? this.data.deliveryAddress.suburb : 'India',
      billing_zone:'',
      comments:this.data.cakeMessage ? this.data.cakeMessage : '',
      currency_value:'₹',
      customers_email_address:this.data.userInfo.customers_email_address,
      customers_id:this.data.userInfo.customers_id,
      customers_telephone:this.data.userInfo.customers_telephone,
      delivery_city:this.data.deliveryAddress.city,
      delivery_country:this.data.deliveryAddress.suburb ? this.data.deliveryAddress.suburb : 'India',
      delivery_firstname:this.data.deliveryAddress.firstname,
      delivery_lastname:this.data.deliveryAddress.lastname,
      delivery_postcode:this.data.deliveryAddress.postcode,
      delivery_street_address:this.data.deliveryAddress.street,
      delivery_suburb:this.data.deliveryAddress.suburb ? this.data.deliveryAddress.suburb : 'India',
      delivery_zone:'',
      language_id:'1',
      payment_method:orderType == 'cod' ? 'cod' : orderType == 'wallet' ? 'wallet' : 'paytm',
      products_tax:'0',
      shipping_cost:this.data.cartShippingTotal,
      shipping_method:'SameDay',
      totalPrice:this.data.cartSubTotal,
      total_tax:'0',
      order_type:'3',
      cashback_amount:'0',
      coupon_data:[]
    };
    this.getProductsFromCart();
    if(orderType == 'paytm' || orderType == 'online' || orderType == 'cod'){
      console.log(this.data.cartSubTotal);
      this.data.Order['totalPrice'] = +this.data.cartSubTotal > 0 ? (((+this.data.cartSubTotal - +this.data.cartDiscount) + this.data.cartShippingTotal)).toFixed(2) : this.data.cartShippingTotal;
    }
    if(orderType == 'wallet' && walletAmount){
      this.data.Order['is_partial'] = '1';
      this.data.Order['deductable_amount'] = (walletAmount).toFixed(2);
      this.data.Order['totalPrice'] = +this.data.cartSubTotal > 0 ? (((+this.data.cartSubTotal - +this.data.cartDiscount) +this.data.cartShippingTotal) - walletAmount).toFixed(2) : (this.data.cartShippingTotal - walletAmount).toFixed(2);
    }
    this.data.Order.coupon_data = this.data.appliedCouponData || [];
    console.log(this.data.Order);
    const newBody = new FormData();
    for ( var key in this.data.Order ) {
      newBody.append(key, this.data.Order[key]);
    }
    newBody.append('callback_url', location.origin+'/thankyou');
    console.log(this.data.Order);
    this.data.isProcessing = true;
    this.api.post('addToOrder', newBody).subscribe((res:any)=>{
      console.log(res);
      this.data.isProcessing = false;
      if(res.success=='1'){
        if(this.data.Order.payment_method=='cod'){
          this.showToast(res.message);
          this.router.navigate(['/thankyou/summary', res.data.orders_id]);
          this.data.cart && this.data.cart.length ? this.data.cart.forEach((item)=>{
            this.removeFromCart(item, 'noalert');
          }) : null;
        } 
        else if(this.data.Order.payment_method=='wallet' && walletAmount){
          // this.showToast(res.message);
          // this.router.navigate(['/thankyou/summary', res.data.orders_id]);
          // this.data.cart && this.data.cart.length ? this.data.cart.forEach((item)=>{
          //   this.removeFromCart(item, 'noalert');
          // }) : null;
          if(this.data.passportProductsinOrder.length){
            console.log(this.data.passportProductsinOrder);
            this.availBenefitFromOrder().then((prodsAvailed)=>{
              console.log(prodsAvailed);
              this.processLogin().then((user)=>{
                console.log(user);
                self.location.href=this.data.apiUrlNew+'payme/'+res.data.orders_id;
                // self.location.href=this.data.apiUrlNew+'payStatus/'+res.data.orders_id;
              });
            });
          }
          else{
            self.location.href=this.data.apiUrlNew+'payme/'+res.data.orders_id;
            // self.location.href=this.data.apiUrlNew+'payStatus/'+res.data.orders_id;
          }
        }
        else if(this.data.Order.payment_method=='paytm'){
          if(this.data.passportProductsinOrder.length){
            console.log(this.data.passportProductsinOrder);
            this.availBenefitFromOrder().then((prodsAvailed)=>{
              console.log(prodsAvailed);
              this.processLogin().then((user)=>{
                console.log(user);
                self.location.href=this.data.apiUrlNew+'payme/'+res.data.orders_id;
                // self.location.href=this.data.apiUrlNew+'payStatus/'+res.data.orders_id;
              });
            });
          }
          else{
            self.location.href=this.data.apiUrlNew+'payme/'+res.data.orders_id;
            // self.location.href=this.data.apiUrlNew+'payStatus/'+res.data.orders_id;
          }
        }
      }
    }, (err)=>{
      this.data.isProcessing = false;
      console.log(err);
      this.showToast('There is some error placing your order. Please try again.');
    })
  }

  availBenefitFromOrder(){
    return new Promise((resolve,reject)=>{
      let availedProducts = [];
      this.data.passportProductsinOrder.forEach((passItem)=>{
        let body = {
          customers_id:this.data.userInfo.customers_id,
          subscription_id:this.data.userInfo.membership[0].id,
          plan_id:this.data.userInfo.membership[0].plan_id,
          avail_type:this.getAvailTypeByCartProduct(passItem)
        }
        this.data.isProcessing = true;
        this.api.post('availBenefit', body).subscribe((res:any)=>{
          this.data.isProcessing = false;
          console.log(res);
          if(res.success == '200'){
            this.showToast(passItem.products_name+' is successfully availed by you. Taking you to gateway to pay the rest...', 5000);
            availedProducts.push(passItem);
            if(availedProducts.length == this.data.passportProductsinOrder.length){
              resolve(availedProducts);
            }
          }
        }, (err)=>{
          this.data.isProcessing = false;
          console.log(err);
        });
      });
    });
  }

  getAvailTypeByCartProduct(passItem){
    let availType:any;
    //check for poker
    if(passItem.categories_product_id == '2' && passItem.products_id == '348'){
      availType = '4';
    }
    //check for cake
    else if(passItem.categories_product_id == '1'){
      availType = '1';
    }
    return availType;
  }

  getProductsFromCart(){
    let cashback = 0; 
    this.data.passportProductsinOrder = [];
    this.data.cart.forEach((item:any, i)=>{
      this.data.Order['products['+i+'][products_id]'] = item.products_id;
      this.data.Order['products['+i+'][products_name]'] = item.products_name,
      this.data.Order['products['+i+'][price]'] = item.price,
      this.data.Order['products['+i+'][final_price]'] = item.final_price,
      this.data.Order['products['+i+'][customers_basket_quantity]'] = item.customers_basket_quantity;
      this.data.Order['products['+i+'][variant_chosen]'] = item.variant_chosen;
    //set attributes if any
      item.attributes.forEach((attr, j)=>{
        this.data.Order['products['+i+'][attributes]['+j+'][products_options_id]'] = attr.options_id;
        this.data.Order['products['+i+'][attributes]['+j+'][products_options_values_id]'] = attr.options_values_id;
        this.data.Order['products['+i+'][attributes]['+j+'][options_values_price]'] = attr.options_values_price;
        this.data.Order['products['+i+'][attributes]['+j+'][price_prefix]'] = attr.price_prefix;
      });
      if(item.products_cashback){
        if(item.products_cashback.indexOf('FLAT') != -1){
          cashback+=+item.products_cashback.split('FLAT ').pop();
        }
        else{
          cashback+=(+item.products_cashback/100)*+item.final_price;
        }
      }
      if(+item.final_price==0){
        this.data.passportProductsinOrder.push(item);
      }
    });
    this.data.Order['cashback_amount'] = cashback.toFixed(2);
    console.log(cashback);
  }

  assignNextUrl(){
    this.route.queryParams.subscribe((params)=>{
      console.log(params);
      if(params.next){
        this.data.nextUrl = params.next;
      }
    });
  }

  findElementsByName(inpString){
    let value = inpString.target && inpString.target.value ? inpString.target.value.toLowerCase() : inpString;
    if(value.length && value.trim() && this.data.allProducts && this.data.allProducts.length){
      this.data.filteredSearch.products = this.data.allProducts.filter((prod:any)=>{
        let nameOfProduct = prod.products_name.toLowerCase();
        let productTags = prod.products_tags.toLowerCase();
        return nameOfProduct.indexOf(value) != -1 || productTags.indexOf(value) != -1;
      });
      this.data.filteredSearch.categories = this.data.categories.filter((cat:any)=>{
        let nameOfCategory = cat.name.toLowerCase();
        return nameOfCategory.indexOf(value) != -1;
      });
      this.data.filteredSearch.occasions = this.data.occasions.filter((occ:any)=>{
        let nameOfOccasion = occ.categories_name.toLowerCase();
        return nameOfOccasion.indexOf(value) != -1;
      });
    }
    else{
      this.data.filteredSearch.products = [];
      this.data.filteredSearch.categories = [];
      this.data.filteredSearch.occasions = [];
    }
  }

  getOrderById(id){
    return new Promise((resolve,reject)=>{
      this.checkIfLoggedIn().then((user)=>{
        this.data.isProcessing = true;
        let body = {
          customers_id:this.data.userInfo.customers_id,
          language_id:'1',
          orders_id:id
        }
        this.api.post('getOrderById', body).subscribe((res:any)=>{
          this.hideLoading()
          if(res.data && res.data.length){
            this.data.cart && this.data.cart.length ? this.data.cart.forEach((item)=>{
              this.removeFromCart(item, 'noalert');
            }) : null;
            resolve(res.data[0]);
          }
        }, (err)=>{
          this.hideLoading()
          console.log(err);
        })
      });
    })
  }

  getOrderFromListById(id, cb){
      let orderId = id;
      let obj = cb;
      let order:any;
      this.checkIfLoggedIn().then((usr)=>{
        if(!this.data.allOrders.length){
          this.getOrders().then((ordrs)=>{
            this.getOrderFromListById(orderId, obj);
          });
        }
        else{
          this.data.allOrders.forEach((ordr)=>{
            if(ordr.orders_id == orderId){
              order = ordr;
            }
          });
          cb(order);
        }
      });
  }

  cancelProductFromOrder(order,product){
    this.checkIfLoggedIn().then((usr)=>{
      let body = {
        order_id:order.orders_id,
        product_id:product.orders_products_id,
        product_cost:product.final_price,
        product_name:product.products_name,
        order_price:order.order_price,
        customer_id:this.data.userInfo.customers_id
      }
      this.data.isProcessing = true;
      this.api.post('cancelProductFromOrder', body).subscribe((res:any)=>{
        console.log(res);
        this.data.isProcessing = false;
        if(res.success=='1'){
          this.showToast(res.message);
          this.getOrders();
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    }).catch((err)=>{

    });
  }

  async showLoading(){
    this.data.loading = await this.loadingController.create({
      message:'Please wait....',
      backdropDismiss:false,
      id:'loadingPlanout',
      duration:5000
    });
    await this.data.loading.present();
  }
  
  async hideLoading(){
    if(this.data.loading){
      await this.data.loading.dismiss();
    }
  }

  getAllCoupons(){
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
      this.api.get('getAllCoupons').subscribe((res:any)=>{
        this.data.isProcessing = false;
        console.log(res);
        if(res.data){
          this.data.allCoupons = res.data;
          console.log(this.data.allCoupons);
          resolve(this.data.allCoupons);
        }
      }, (err)=>{
        console.log(err);
        this.data.isProcessing = false;
      });
    });
  }

  applyCoupon(coupon){
    this.checkIfLoggedIn().then((usr)=>{
      let body = {
        code:coupon.toUpperCase(),
        order_amount:this.data.cartTotal,
        email_restrictions:this.data.userInfo.customers_email_address,
        customer_id:this.data.userInfo.customers_id
      }
      this.data.isProcessing = true;
      this.api.post('getCoupon', body).subscribe((res:any)=>{
        console.log(res);
        if((!res.data) || (res.data && !res.data.length)){
          this.showToast(res.message);
          this.data.isProcessing = false;
        } else if(res.data && res.data.length && res.data[0].free_product > 0){
          //free product case
          console.log('free product');
          this.applyCouponForFreeProduct(res.data[0]);
          this.data.isProcessing = false;
        } else{
          //coupon valid
          this.validateAllCasesOfCoupon(res.data[0]).then((valid)=>{
            this.data.isProcessing = true;
            let couponType = res.data[0].discount_type;
            let bodyOFValidCouopon= {
              coupon_code:coupon.toUpperCase(),
              coupon_amount:couponType == 'percent' || couponType == 'wallet' || couponType == 'membership_coupon' ? this.data.cartSubTotal*(+res.data[0].amount/100) : res.data[0].amount,
              customer_id:this.data.userInfo.customers_id,
              customers_basket_id:this.data.cart[0]['customers_basket_id']
            }
            this.api.post('applyCoupon', bodyOFValidCouopon).subscribe((coup:any)=>{
              this.data.isProcessing = false;
              console.log(coup);
              if(coup.data && coup.data.coupon_data){
                this.data.appliedCoupon = coup.data.coupon_data;
                this.getCart().then((cart)=>{
                  this.showToast(coup.message);
                });
              }
            }, (err)=>{
              this.showToast('Coupon not applied. Please try again');
              this.data.isProcessing = false;
            });
          }).catch((notValid)=>{
            this.showToast('Coupon not valid for this order');
            console.log('Coupon not Valid');
            this.data.appliedCoupon = undefined;
            this.data.appliedCouponData = undefined;
            this.data.isProcessing = false;
          });
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
        this.showToast('Code not valid. Please try again');
      })
    }).catch((err)=>{
      this.showToast('You are not logged in!');
      this.data.isProcessing = false;
      console.log(err);
    });
  }

  validateAllCasesOfCoupon(coupon){
    let eligibleItem:any = undefined;
    return new Promise((resolve,reject)=>{
      let couponProductCategories = coupon.product_categories.split(',');
      this.data.cart.forEach((cartItem:any)=>{
        couponProductCategories.forEach((coupCat)=>{
          if(cartItem.categories_product_id.includes(coupCat)){
            eligibleItem = cartItem;
          }
        });
      });
      console.log(eligibleItem);
      if(!coupon.product_free_ids && !eligibleItem){
        resolve(true);
      } else if(coupon.product_free_ids && eligibleItem){
        resolve(true);
      } else{
        reject(false);
      }
      //reject(false);
    });
  }

  applyCouponForFreeProduct(coupon){
    this.data.couponDetails = coupon;
    let eligibleCats = coupon.product_categories.split(',');
    let cartTotal = +this.data.cartSubTotal;
    let eligibleTotal = +coupon.minimum_amount;
    let isCatEligible = false;
    if(cartTotal >= eligibleTotal){
      this.data.cart.forEach((prod:any) => {
        if(eligibleCats.includes(prod.categories_product_id)){
          isCatEligible = true;
        }
      });
      if(!isCatEligible){
        this.showToast('Cart is not eligible to apply this coupon');
      } else {
        this.data.isFreeProductEligible = true;
        let maxProductsAmount = +coupon.free_product_amount;
        let prodCategory = coupon.product_free_categories;
        this.data.freeProducts = [];
        this.data.allProducts.forEach((prod:any) => {
          prod.category_ids.split(',').forEach((cat) => {
            if(cat == prodCategory && +prod.products_price <= maxProductsAmount){
              this.data.freeProducts.push(prod);
            }
          });
        });
      }
    } else {
      this.showToast('Order amount is less than ₹'+eligibleTotal.toFixed(2)+'.');
    }
  }

  applyFreeProductCoupon(product){
    this.data.isProcessing = true;
    let couponType = this.data.couponDetails.discount_type;
    let bodyOFValidCouopon= {
      coupon_code:this.data.couponDetails.code.toUpperCase(),
      coupon_amount:couponType == 'percent' || couponType == 'wallet' || couponType == 'membership_coupon' ? this.data.cartSubTotal*(+this.data.couponDetails.amount/100) : this.data.couponDetails.amount,
      customer_id:this.data.userInfo.customers_id,
      customers_basket_id:this.data.cart[0]['customers_basket_id'],
      free_product:product.products_id
    }
    this.api.post('applyCoupon', bodyOFValidCouopon).subscribe((coup:any)=>{
      this.data.isProcessing = false;
      console.log(coup);
      if(coup.data && coup.data.coupon_data){
        this.data.appliedCoupon = coup.data.coupon_data;
        this.data.freeProducts = [];
        this.data.isFreeProductEligible = false;
        this.getCart().then((cart)=>{
          this.showToast(coup.message);
        });
      }
    });
  }

  removeCoupon(){
    if(this.data.appliedCoupon){
      this.data.isProcessing = true;
      let body = {
        customers_basket_id:this.data.appliedCoupon.order_id,
        apply_coupon_id:this.data.appliedCoupon.id,
        customers_id:this.data.userInfo.customers_id
      }
      this.api.post('removeCoupon', body).subscribe((res:any)=>{
        console.log(res);
        this.data.isProcessing = false;
        if(res.success == '1'){
          this.data.appliedCoupon = undefined;
          this.data.appliedCouponData = undefined;
          this.data.couponFormOpened = false;
          this.getCart().then((cart)=>{
            this.showToast(res.message);
          });
        }
      }, (err)=>{
        console.log(err);
        this.data.isProcessing = false;
      });
    }
  }

  sendForm(details){
    return new Promise((resolve,reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        let body = {
          customers_id:this.data.userInfo.customers_id,
          feedback_or_query_customers_name:details.name ? details.name : this.data.userInfo.customers_name,
          feedback_or_query_customers_email:details.email ? details.email : this.data.userInfo.customers_email_address,
          feedback_or_query_feedback:details.feedback
        }
        this.data.isProcessing = true;
        this.api.post('addQuery', body).subscribe((res:any)=>{
          this.data.isProcessing = false;
          console.log(res);
          if(res.success=='1' && res.query_data){
            resolve(res);
            this.showToast(details.responseMessage ? details.responseMessage : 'We have received your request and will revert you shortly.');
          }
        }, (err)=>{
          this.data.isProcessing = false;
          console.log(err);
        })
      }).catch((err)=>{
        this.showToast('Please login first');
        this.router.navigate(['/login']);
        console.log(err);
      });
    });
  }

  addMembership(plan){
    this.checkIfLoggedIn().then((usr)=>{
      this.data.Order={
        billing_city:'',
        billing_country:'',
        billing_firstname:'',
        billing_lastname:'',
        billing_postcode:'',
        billing_street_address:'',
        billing_suburb:'',
        billing_zone:'',
        comments:[],
        currency_value:'₹',
        customers_email_address:this.data.userInfo.customers_email_address,
        customers_id:this.data.userInfo.customers_id,
        customers_telephone:this.data.userInfo.customers_telephone,
        delivery_city:'',
        delivery_country:'',
        delivery_firstname:'',
        delivery_lastname:'',
        delivery_postcode:'',
        delivery_street_address:'',
        delivery_suburb:'',
        delivery_zone:'',
        language_id:'1',
        payment_method:'paytm',
        products_tax:'0',
        shipping_cost:'0',
        shipping_method:'SameDay',
        totalPrice:plan.amount,
        total_tax:'0',
        order_type:'2',
        cashback_amount:'0',
        coupon_data:[]
      };
      console.log(this.data.Order);
      const newBody = new FormData();
      for ( var key in this.data.Order ) {
        newBody.append(key, this.data.Order[key]);
      }
      newBody.append('callback_url', location.origin+'/membershipdetails');
      newBody.append('plan_id', plan.id);
      newBody.append('orders_product_type', '2');
      newBody.append('plan_name', plan.plan_name);
      newBody.append('plan_price', plan.amount);
      newBody.append('products_quantity', '1');
      newBody.append('final_price', plan.amount);
      this.data.isProcessing = true;
      this.api.post('addToOrderMembership', newBody).subscribe((res:any)=>{
        console.log(res);
        this.data.isProcessing = false;
        if(res.success=='1'){
          if(this.data.Order.payment_method=='paytm'){
            self.location.href=this.data.apiUrlNew+'paymembership/'+res.data.orders_id;
          }
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
        this.showToast('There is some error placing your order. Please try again.');
      });
    }).catch((err)=>{
      this.router.navigate(['/login'], {queryParams:{'next':'/passport'}});
      this.showToast('Please login to purchase membership!');
    console.log(err);
    });
  }

  processLogin(){
    return new Promise((resolve, reject)=>{
      this.checkIfLoggedIn().then((usr)=>{
        let body = {
          customers_id:this.data.userInfo.customers_id,
          customers_email_address:this.data.userInfo.customers_email_address,
          // customers_password:"admin"
        }
        this.data.isProcessing = true;
        this.api.post('processLogin', body).subscribe((res:any)=>{
          if(res.data && res.data.length){
            let userPic = this.data.userInfo.customers_picture;
            let newData = res.data[0];
            newData.customers_picture = userPic;
            this.data.userInfo = newData;
            resolve(newData);
            this.saveToDb('user', this.data.userInfo);
          }
          console.log(res);
          this.data.isProcessing = false;
        }, (err)=>{
          console.log(err);
          this.data.isProcessing = false;
        })
      });
    });
  }

  getAppSettings(){
    this.data.isProcessing = true;
    this.api.get('refSettings').subscribe((res:any)=>{
      this.data.isProcessing = false;
      if(res.data && res.data.length){
        this.data.signUpPoints = res.data[0].sign_up_points;
        this.data.referEarnPoints = res.data[0].refer_earn;
      }
      console.log(res);
    }, (err)=>{
      console.log(err);
    });
  }

  checkIfProductEligibleForPassport(){
    this.data.isEligibleForPassport = false;
    this.checkIfLoggedIn().then(()=>{
      if(this.data.userInfo){
        this.data.isProcessing = true;
          if(this.data.userInfo.membership && this.data.userInfo.membership.length){
            //check if product is cake
            this.processLogin().then((usr:any)=>{
            if(this.data.selectedProduct && this.data.selectedProduct.categories_name == 'CAKES' && usr.membership[0].plan_cashback_cakes_count && usr.membership[0].plan_cashback_cakes_count_left > 0){
              //plan eligible for free cakes
              let availableCakesOnPlan = usr.membership[0].plan_cashback_cakes_count_left;
              let freeCakesMinimumPrice = +usr.membership[0].plan_cashback_cakes_base_value;
              let productPrice = !this.data.selectedProduct.specials_new_products_price ? +this.data.selectedProduct.products_price : +this.data.selectedProduct.specials_new_products_price;
              if(availableCakesOnPlan >= 1 && productPrice <= freeCakesMinimumPrice){
                //product is eligible for a free cake
                this.data.isEligibleForPassport = true;
                //check if free poker is already in cart
                this.data.cart.forEach((cartItem:any)=>{
                  if(cartItem.categories_product_id == '1' && cartItem.final_price == 0){
                    this.data.isEligibleForPassport = false;
                  }
                });
              }
            }
            //check if product is poker
            if(this.data.selectedProduct && this.data.selectedProduct.products_id == '348' && usr.membership[0].plan_cashback_poker_count && usr.membership[0].plan_cashback_poker_count_left > 0){
              let availablePokerOnPlan = usr.membership[0].plan_cashback_poker_count_left;
              let decorationOnPlans = +usr.membership[0].plan_cashback_decorations_count || 0;
              if(availablePokerOnPlan >= 1){
                //product is eligible for a free Poker
                this.data.isEligibleForPassport = true;
                //check if free poker is already in cart
                this.data.cart.forEach((cartItem:any)=>{
                  if(cartItem.products_id == '348' && cartItem.final_price == 0 || (decorationOnPlans >= 1 && cartItem.categories_product_id == '32' && cartItem.final_price == 0)){
                    this.data.isEligibleForPassport = false;
                  }
                });
              }
            }

            //check if product is decoration
            if(this.data.selectedProduct && this.data.selectedProduct.categories_name == 'DECORATION' && usr.membership[0].plan_cashback_decorations_count && usr.membership[0].plan_cashback_decorations_count_left > 0){
              let availableDecorOnPlan = usr.membership[0].plan_cashback_decorations_count_left;
              let freeCakesMinimumPrice = 2000;
              let productPrice = !this.data.selectedProduct.specials_new_products_price ? +this.data.selectedProduct.products_price : +this.data.selectedProduct.specials_new_products_price;
              let pokerOnPlans = +usr.membership[0].plan_cashback_poker_count || 0;
              if(availableDecorOnPlan >= 1 && productPrice <= freeCakesMinimumPrice){
                //product is eligible for a free Decoration
                this.data.isEligibleForPassport = true;
                //check if free decoration is already in cart
                this.data.cart.forEach((cartItem:any)=>{
                  if(cartItem.categories_product_id == '32' && cartItem.final_price == 0 || (pokerOnPlans >= 1 && cartItem.products_id == '348' && cartItem.final_price == 0)){
                    this.data.isEligibleForPassport = false;
                  }
                });
              }
            }
          });
          }
      }
    });
  }

  getZones(){
    return new Promise((resolve,reject)=>{
      this.data.isProcessing = true;
      let body = {
        language_id:'1',
        zone_country_id:'99'
      }
      this.api.post('getZones', body).subscribe((res:any)=>{
        this.data.isProcessing = false;
        console.log(res);
        if(res.data && res.data.length){
          resolve(res.data);
        }
        else{
          reject('No State')
        }
      }, (err)=>{
        this.data.isProcessing = false;
        console.log(err);
      });
    })
  }

  checkIfMobile(){
  if (
    window.matchMedia('(min-width:1024px)').matches
    ) {
      this.data.isMobile = false;
    }
    else{
      this.data.isMobile = true;
    }
  }

  playVideo(videoId){
    this.data.isProductVideoPlaying ? this.data.isProductVideoPlaying = false : this.data.isProductVideoPlaying = true;
    this.data.currentVideoUrl = this.san.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+videoId+'?autoplay=1&controls=0&showinfo=0&modestbranding=1');
  }

  generateProductsSitemapXml(){
    let xmlProducts = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    this.data.allProducts.forEach((prod:any)=>{
      let pipe = new UrlSlugPipe();
      let name = pipe.transform(prod.products_name);
      let prodFullName = prod.products_name.replace(/&/g, '&amp;');
      let prodModified = prod.products_last_modified ? prod.products_last_modified.split(' ').shift() : new Date();
      xmlProducts += '<url><changefreq>daily</changefreq><lastmod>'+prodModified+'</lastmod><loc>https://www.planoutx.com/product/'+name+'</loc>';
      xmlProducts += '<priority>0.75</priority>';
      xmlProducts += '<image:image><image:caption>'+prodFullName+'</image:caption><image:loc>'+this.data.apiUrlNew + prod.products_image+'</image:loc><image:title>'+prodFullName+'</image:title></image:image>';
      if(prod.images && prod.images.length){
        prod.images.forEach((img)=>{
          xmlProducts += '<image:image><image:caption>'+prodFullName+'</image:caption><image:loc>'+this.data.apiUrlNew + img.image+'</image:loc><image:title>'+prodFullName+'</image:title></image:image>';
        })
      }
      xmlProducts += '</url>';
    });
    xmlProducts += '</urlset>';
    console.log(xmlProducts);
  }

  generateCategoriesSitemapXml(){
    let xmlCategories = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    this.data.categories.forEach((cat:any)=>{
      let pipe = new UrlSlugPipe();
      let name = pipe.transform(cat.name);
      xmlCategories += '<url><changefreq>daily</changefreq><lastmod>'+cat.date_added+'</lastmod><loc>https://www.planoutx.com/shop/'+name+'</loc>';
      xmlCategories += '<priority>1</priority>';
      xmlCategories += '</url>';
      if(cat.sub_categories && cat.sub_categories.length){
        cat.sub_categories.forEach((subCat)=>{
          let subCatName = pipe.transform(subCat.name);
          xmlCategories += '<url><changefreq>daily</changefreq><lastmod>'+subCat.last_modified+'</lastmod><loc>https://www.planoutx.com/shop/'+name+'/'+subCatName+'</loc>';
          xmlCategories += '<priority>0.9</priority>';
          xmlCategories += '</url>';
        })
      }
    });
    xmlCategories += '</urlset>';
  }
  
  generateMetaDetails(pageType, typeId){
    if(pageType == 'category'){
      this.data.categories.forEach((cat)=>{
        if(cat.id == typeId){
          console.log(cat);
          //generate category meta here
          if(cat.name == 'CAKES'){
            this.setMetaTags('Buy Cake Online | Online Cake Delivery in Noida, Delhi NCR - Planoutx', 'Best party supplies online store for special events. Planout X provides party supplies items, special gifts, cake, decorations items at best prices. Visit and shop now!');
          } else if(cat.name == 'DECORATION'){
            this.setMetaTags('Buy Party Decorations Items online at Best Price - Planoutx', 'Shop Decorations Items online: Plan Out X offers party decorations items like: cups, candles, balloons, gifts combo Sets, invitations, &amp; much more.');
          } else if(cat.name == 'PARTY SUPPLIES'){
            this.setMetaTags('Buy Party Supplies Online in Delhi NCR at Best Price - Planoutx', 'Party Supplies: Shop party supplies online at lowest rates on Planoutx.com. Explore a huge collection of party supplies items and shop now.');
          } else if(cat.name == 'GIFTS'){
            this.setMetaTags('Shop Birthday gift for Girlfriend | Gift for Boyfriend - Planoutx', 'Buy Gifts Online: Send birthday gifts online for girlfriend or boyfriend from Planoutx.com. Select from a wide range of Gifts at best prices.');
          } else if(cat.name == 'SURPRISES'){
            this.setMetaTags('Surprise Gift for Wife, Husband | Best Surprise Gifts Online - Planoutx', 'Shop the finest surprise gifts online in Delhi NCR, India on the special occasion. Buy best surprise gifts at lowest cost from Planoutx.com.');
          } else if(cat.name == 'COMBOS'){
            this.setMetaTags('Send Combo Gifts | Gifts Combos Online | Combo for Couples - Planoutx', 'Planoutx.com provides modern collection of best gift combos for him, her online. Shop combo gifts for boyfriend, girlfriend husband, wife online at best price.');
          } else {
            this.setMetaTags(`${cat.name} - Buy ${cat.name} Online At Best Price - Planoutx.com`, `Buy ${cat.name} online at Planoutx.com. Browse the huge collection of ${cat.name} through the online platform and shop it now at the best affordable prices. Get the discounts and offer on order onlin. Get instant delivery at your door.`);
          }
        }
      });
    } else if(pageType == 'subcategory'){
      this.data.categories.forEach((cat)=>{
        if(cat.sub_categories && cat.sub_categories.length){
          cat.sub_categories.forEach((subCat)=>{
            if(typeId == subCat.id){
              //generate subcategory meta here
              if(subCat.name == 'ANNIVERSARY DECORATION'){
                this.setMetaTags('Anniverysary Decoration at Home | Anniversary Decorations Services - Planoutx', 'Get best anniversary decoration services at home in Delhi NCR. Shop and Inquiry now for marriage anniversary room decoration ideas and items.');
              } else if(subCat.name == 'BIRTHDAY DECORATION'){
                this.setMetaTags('Birthday Party Decorations at Home | Birthday Room Decoration - Planoutx', 'Birthday Party Decoration Services: Shop room decoration items for Birthday party at home in Delhi NCR.');
              } else if(subCat.name == 'BESTSELLER GIFTS'){
                this.setMetaTags('Buy Best Gift For Girlfriend, Wife, Boyfriend &amp; Best Friend - Planoutx', 'Best gift for Boyfriend: Send gifts for wife, best friend online from Planoutx.com. Shop for attentive gifts for your best friend, girlfriend &amp; boyfriend.');
              } else if(subCat.name == 'HANDMADE GIFTS'){
                this.setMetaTags('Buy Handmade Birthday Gifts Online at Best Price - Planoutx', 'Handmade Gifts Online: Shop handmade gifts online for boyfriend, girlfriend, husband, wife, kids &amp; best friend from Planoutx.com.');
              } else if(subCat.name == 'PERSONALISED'){
                this.setMetaTags('Personalized Gifts for Girlfriend, Boyfriend | Gifts for Him - Planoutx', 'Personalized Gifts for Him: Buy customized gifts for girlfriend, boyfriend online in Delhi NCR. Browse the huge collection of personalized gifts and send now!');
              } else {
                this.setMetaTags(`${subCat.name} - Buy ${subCat.name} Online At Best Price - Planoutx.com`, `Buy ${subCat.name} online at Planoutx.com. Browse the huge collection of ${subCat.name} through the online platform and shop it now at the best affordable prices. Get the discounts and offer on order online. Get instant delivery at your door.`);
              }
            }
          });
        }
      });
    } else if(pageType == 'product'){
      this.data.allProducts.forEach((prod:any)=>{
        if(prod.products_id == typeId){
          //generate product meta here
          this.setMetaTags(`Buy ${prod.products_name} Online - Planoutx.com`, `Buy ${prod.products_name} online at Planoutx.com. Browse the huge collection of ${prod.products_name} through the online platform and shop it now at the best affordable prices. Get the discounts and offer on instant delivery.`);
        }
      })
    }
  }

  setMetaTags(title, description){
    this.titleService.setTitle(title);
    this.metaService.updateTag({name:'title', content:title});
    this.metaService.updateTag({name:'description', content:description});
  }

  checkIfPopupSeen(){
    let popupSeen = sessionStorage.getItem('tempPopup');
    if(popupSeen != null){
      this.data.isPopupSeen = true;
    }
    else{
      this.data.isPopupSeen = false;
    }
  }

  closeTempPopup(){
    sessionStorage.setItem('tempPopup', 'true');
    this.data.isPopupSeen = true;
  }

  generateCanonical(){
    let path = location.pathname;
    document.getElementById('canonical').setAttribute('href', 'https://www.planoutx.com'+path);
  }

  updateAppIfAvailable(){
    if(!this.sw.isEnabled){
      return;
    }
    this.sw.available.subscribe((event) => {
      console.log('current', event.current, 'available', event.available);
      this.sw.activateUpdate().then(() => {
        this.showToast('Update available for the app, reloading the page', 5000);
        setTimeout(() => {
          location.reload();
        }, 5000);
      });
    });

    this.sw.activated.subscribe((event) => {
      console.log('current', event.previous, 'available', event.current);
    });
  }
}

