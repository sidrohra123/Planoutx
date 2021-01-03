import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';
import { IonSlides, Platform, MenuController, IonContent } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MethodsService } from '../methods.service';
import { Router } from '@angular/router';
import { UrlSlugPipe } from '../url-slug.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  @ViewChild('catSlides') catSlides:IonSlides;
  @ViewChild('offSlides') offSlides:IonSlides;
  @ViewChild('prodSlides') prodSlides:IonSlides;
  @ViewChild('ratingSlides') ratingSlides:IonSlides;
  @ViewChild('homeContent', { static: true }) homContent:IonContent;

  catSlide = {
    initialSlide: 0,
    slidesPerView:4,
    spaceBetween:35,
    freeMode:true,
    speed: 200,
    pagination:false
  };
  eventSlideOpts = {
    slidesPerView: 2,
    spaceBetween: 10,
    freeMode:true,
    centeredSlides: true,
  }
  prodSlideOpts = {
    slidesPerView: 2.1,
    spaceBetween: 10,
    freeMode:true,
    centeredSlides: false,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 2.1
      },
      // when window width is >= 480px
      768: {
        slidesPerView: 2.1,
      },
      // when window width is >= 640px
      769: {
        slidesPerView: 6,
      }
    }
  }
  offerSlides = {
    initialSlide: 0,
    slidesPerView:1,
    speed: 400,
    spaceBetween:10,
    loop:false,
    autoplay: {
      delay: 5000,
    }
  }
  ratingSlideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween:30,
    slidesPerView:4,
    freeMode:false,
    centeredSlides:false,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 2,
        freeMode:true,
        centeredSlides:true,
        spaceBetween: 10
      },
      // when window width is >= 480px
      768: {
        slidesPerView: 2,
        freeMode:true,
        centeredSlides:false,
        spaceBetween: 10
      },
      // when window width is >= 640px
      769: {
        slidesPerView: 4,
        freeMode:false,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
        centeredSlides:false,
        spaceBetween: 30
      }
    }
  }
  index:number=0;
  appSub:any;
  offerIndex:number = 0;
  isSliding:boolean = false;
  occasionOptions = {
    header: 'Select Occasion',
    translucent: true
  }
  giftsOptions = {
    header: 'Select Gifts Type',
    translucent: false
  }
  recipientOptions = {
    header: 'Select Recipient',
    translucent: false
  }
  cityOptions = {
    header: 'Select City',
    translucent: false
  }
  constructor(public data:DataService, public _sanitize: DomSanitizer, public methods: MethodsService, private platform:Platform, private menu:MenuController, private router:Router) { 
  }

  ngAfterViewInit(){
    
  }
  

  ngOnInit() {
    // this.methods.manageLoading(3000);
    this.menu.enable(true, 'sideMenu');
    if(!this.data.allProducts.length){
      this.methods.getCatalog().then((catalog)=>{
        console.log(catalog);
        setTimeout(()=>{
          this.catSlides ? this.catSlides.update() : '';
        },200);
        // this.methods.intro();
      });
    } else{
      setTimeout(()=>{
        this.catSlides ? this.catSlides.update() : '';
      },200);
    }
    if(!this.data.offers.length){
      this.methods.getBanners().then((banners)=>{});
    }
    if(!this.data.passOffers.length){
      //this.methods.getAllOffersNew().then((offers) => {});
    }
    if(!this.data.ratings.length){
      this.methods.getAllReviews().then((reviews) => {});
    }
    this.methods.checkTimer();
  }

  changed(){
    this.catSlides.getActiveIndex().then((n)=>{
      this.index = n;
    });
  }

  onSlideDrag(){
    this.isSliding = true;
  }


  onSlideDragged(){
    this.isSliding = false;
  }
  onSlideTouched(){
    this.isSliding = false;
  }

  onSlideChange(e){
    this.offSlides.getActiveIndex().then((n)=>{
      this.offerIndex = n;
    });
  }

  slideTo(position){
    position=='right' ? this.catSlides.slideNext().then(()=>{
      
    }) : this.catSlides.slidePrev().then(()=>{
      
    });
  }

  ionViewDidEnter(){
    this.appSub = this.platform.backButton.subscribe(()=>{
      navigator['app'].exitApp();
    });
    setTimeout(()=>{
      this.catSlides ? this.catSlides.update() : '';
      this.offSlides ? this.offSlides.update() : '';
      this.prodSlides ? this.prodSlides.update() : '';
      this.ratingSlides ? this.ratingSlides.update() : '';
    },200);
    this.methods.setMetaTags('India\'s First Party Planning Platform | Party Supplies Online – Planoutx', 'One stop shop for all party planning needs. Starting from cakes, decorations, party supplies, personalized gifts and surprises.');
    this.data.allFiltered = {};
  }

  ionViewWillLeave(){
    this.appSub.unsubscribe();
  }

  goToProduct(product){
    let slugPipe = new UrlSlugPipe();
    let name = slugPipe.transform(product.products_name);
    this.router.navigate(['/product', name]);
  }

  checkScrolling(e){
    let isInteracted = sessionStorage.getItem('planningInteracted');
    if(isInteracted == null){
      if(this.data.allProducts.length){
        let scrollTop = e.detail.scrollTop;
        let whtplannig:HTMLElement = document.querySelector('#step4');
        let whtTop = whtplannig.offsetTop-50;
        let whtHeight = whtplannig.offsetHeight;
        if(scrollTop > whtTop && scrollTop < whtHeight){
          this.homContent.scrollToPoint(undefined, whtTop+5);
          document.body.classList.add('stopHere');
        } else {
          document.body.classList.remove('stopHere');
        }
      }
    }
  }

  goToOccasion(){
    let whtplannig:HTMLElement = document.querySelector('#step4');
    let whtTop = whtplannig.offsetTop-50;
    this.homContent.scrollToPoint(undefined, whtTop);
    document.body.classList.remove('stopHere');
    // sessionStorage.setItem('planningInteracted', 'true');
  }

  skipToContent(){
    document.body.classList.remove('stopHere');
    sessionStorage.setItem('planningInteracted', 'true');
    this.homContent.scrollToTop(0);
  }

}
