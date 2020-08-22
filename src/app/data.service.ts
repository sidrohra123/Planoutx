import { Injectable, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public isSelectedLocation:boolean = false;
  public journey:[] = [];
  public catalogApiCalled = 0;
  public catSlide = {
    initialSlide: 0,
    slidesPerView:4,
    spaceBetween:35,
    freeMode:true,
    speed: 200,
    pagination:false
  };
  shippingRates:any;
  google_api_key = 'AIzaSyD4rtsaqtVTtxtLpxF6DKWpjE2BYKOeOGM';
  public selectedDay = {
    date:Date.now(),
    name:'today'
  }
  public selectedDeliveryType = {
    type:'mornDel',
    slot:0
  };
  public cartShippingTotal = 0;
  public cartTotal = 0;
  public deliveryHours = {
    from:9,
    to:22
  };
  public isProcessing:boolean = false;
  public recentlyViewed:Array<any> = [];
  public fullCatalog:any=[];
  public subCategories:any=[];
  public subSubCategories:any=[];
  public selectedSubCat:any;
  public homePageOffers = [];
  public recipients = [];
  public blogPosts = [];
  public allProducts:Array<{}>=[];
  public selectedBlog:any;
  public selectedCat:any;
  public fbData:any;
  public googleData:any;
  public loader:any;
  public occasions:[] = [];
  public homeCats = {
    show_home:'1'
  }
  public homeSec1 = {
    show_home_section:'1'
  }
  public homeSec2 = {
    show_home_section:'2'
  }
  public homeSec3 = {
    show_home_section:'3'
  }
  public homeSec4 = {
    show_home_section:'4'
  }
  public orderType = {
    order_paid_type:'complete'
  }
  public occ = {
    i_pki_id:null
  }
  public filteredCatsByocc = [];
  public cart:Array<{}>=[
    // {prodId:1, image:"https://i.pinimg.com/originals/f9/62/8f/f9628fe466dbde785e709976000fe402.jpg", weight:'1/2 KG', qty:1, price:599, name:'Chocolate Cream Cake Half Kg', delivery_date:'FRI,AUG 09', delivery_time:'08:00 - 12:00 Hrs', delivery_type:'Standard Delivery', category:'Cakes'},
    // {prodId:2, image:"https://cdn.igp.com/f_auto,q_auto,t_prodm/products/p-assorted-chocolate-hamper-40883-m.jpg", weight:'', qty:1, price:450, name:'Assorted Chocolate Hamper', delivery_date:'FRI,AUG 09', delivery_time:'08:00 - 24:00 Hrs', delivery_type:'Standard Delivery', category:'Birthday'}
  ];
  public isFetching:boolean = false;
  public categories = [
    // {id:1, name:'Birthday', icon:'assets/images/icons/birthday.png'},
    // {id:2, name:'Cakes', icon:'assets/images/icons/cake.png'},
    // {id:3, name:'Decoration', icon:'assets/images/icons/decoration.png'},
    // {id:4, name:'Gifts', icon:'assets/images/icons/gifts.png'},
    // {id:5, name:'Surprises', icon:'assets/images/icons/surprises.png'},
    // {id:6, name:'Party Supplies', icon:'assets/images/icons/supplies.png'},
    // {id:7, name:'Same Day', icon:'assets/images/icons/sameday.png'}
  ];
  public offers = [];
  public events = [
    {id:1, title:'Rajat Chauhan Live', category:'concert', image:'https://lh3.googleusercontent.com/XcGkxogpJmybo8_PJSrZZHrrStuIYkb8Kz4Evj5rJasHH0gYwTC2ityv7h0B0fsE5aqOzMUzwdOMqU8Uz5aCsvQ=h170-l75' },
    {id:2, title:'Howdy Trip to McLodeganj - Triund', category:'nature', image:'https://lh3.googleusercontent.com/oZNmTmVVjH2A6qe2fw6mIwqIi4gYRwmE7yExzRpwgUWfDBjUNkcPXj6ZQMU1o1fCTOcpj-B46jF80MGgmqF0aX4=h170-l75' },
    {id:3, title:'Sufi Night ft. Manu Dev at the Circle Cafe and Bar', category:'Parties & Nightlife', image:'https://lh3.googleusercontent.com/XokA3s9Zx92yrTP4xgvNqsvYMOBll1J5kTtZ7i9K2AL_TuEX0GTgSsonZuF8V0yHIUWF3CVJWQ3qmeyiuYYiFtP4bQ=h170-l75' },
    {id:4, title:'Diwali Utsav Mela 2019', category:'Arts & Culture', image:'https://lh3.googleusercontent.com/9MCRnC81Q6g9AhwCDMpMmKJlHRPWd-HoA0ku2IM_-DFueoe3qGtqTdC3lixPsPJ-5HwAsKVK6RXpQ7PoTeCrD94Yug=h170-l75' },
  ]
  public searchFilterCats:any = {
    name:''
  }
  public searchFilterProds:any = {
    products_name:''
  }
  public bestProducts = [];
  public ocassions = [];
  public ratings = [
    
  ];
  public footerOffers = [
    {id:1, image:'https://pngriver.com/wp-content/uploads/2018/02/download-50-off-discount-offer-PNG-transparent-images-transparent-backgrounds-PNGRIVER-COM-50-Off-Discount-PNG.png'},
    {id:2, image:'http://www.transparentpng.com/thumb/wedding-cake/wonderful-wedding-cake-png-34.png'}
  ];
  public offersMain = [];
  public offersCatalog:any;
  public isContent:boolean = false;
  public apiUrl:string="http://choprapriyanka.com/";
  public apiUrlNew:string="https://deviantnestor.com/upcoming-ecommerce/";
  public sideMenuItems=[
    {name:'Home', icon:'home', link:'/'},
    // {name:'Offers', icon:'cafe', link:'/offers'},
    {name:'Refer and Earn', icon:'contacts', link:'/refernearn', auth:true},
    {name:'Planout Passport', icon:'appstore', link:'/passport', highlight:true},
    // {name:'Trending', icon:'trending-up', link:'/trending'},
    {name:'Party Ideas', icon:'bulb', link:'/trending'},
  ];
  public userInfo:any;
  public userInfoApp:any;
  public isAskNum:boolean = false;
  public mobileNum:any = '';
  public isOtpSent:boolean = false;
  public otp='';
  public selectedProduct:any;
  public isVariantsOpened:boolean = false;
  public selectedTab=1;
  public userGeoLocation:any;
  public locations:Array<{}>;
  public selectedLocation:any;
  public quickSearch = {
    occasion:'',
    recipient:'',
    category:'',
    location:''
  }
  public topSellFilter = {
    category_ids:'159'
  }
  public allSubCats:Array<{}>=[];
  public allSubSubCats:Array<{}>=[];
  public catalogWithOcc:Array<{}> = [];
  public topVideos:Array<{}> = [];
  public tags:Array<any>=[];
  public selectedTag:any;
  public resultedVideos:Array<any> = [];
  public selectedTrending:number = 1;
  public feeds:Array<any> = [
    {user:{name:'Kathie Satlon', follow:false, image:'https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2017/02/Avatar-Sizes-Custom-1.png', desc:'Frequent Poster'}, time:'Yesterday', title:'Another Life', type:'video', video:'https://www.youtube.com/embed/qAtBbgtMnZ8', likesCount:3, commentsCount:1, comments:[
      {user:'Clay', text:'This is never gonna happen'}
    ]},
    {user:{name:'John Doe', follow:false, image:'https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2017/02/Avatar-Sizes-Custom-1.png', desc:'New User'}, time:'11 mins ago', title:'My new Post', type:'image', image:'https://blog.samuel-windsor.co.uk/wp-content/uploads/2015/12/office-party-man.jpg', likesCount:5, commentsCount:2, comments:[
      {user:'Jammie Son', text:'This is my comment on this post'}
    ]},
    {user:{name:'Clay Jensen', follow:false, image:'https://i0.wp.com/myaeon.com.au/wp-content/uploads/2017/04/avatar-round-3-1.png?ssl=1', desc:'new post'}, time:'Yesterday', title:'My Second Post', type:'image', image:'https://image.freepik.com/free-photo/young-man-having-fun-party_23-2147991088.jpg', likesCount:2, commentsCount:2, comments:[
      {user:'David', text:'This is my first comment on this post'}
    ]},
    {user:{name:'Jessica Davis', follow:false, image:'https://media1.popsugar-assets.com/files/thumbor/EYOcEYbghNr9h9ezraSwYlMNk1w/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2019/07/28/744/n/44701584/b8eb5d65ecd8208a_GettyImages-1000813416/i/Alisha-Boe-Jessica-Davis.jpg', desc:'I was done with'}, time:'24 Jul 2019, 04:35:pm', title:'Who killed Bryce', type:'image', image:'https://images.popbuzz.com/images/70240?crop=16_9&width=660&relax=1&signature=GHC3WRqEuqNIeykcKHZPk4Oy3Ho=', likesCount:125, commentsCount:5, comments:[
      {user:'Bryce', text:'I was never killed'}
    ]}
  ]
  public blogPageNum = 0;
  public currVideoId:any;
  public selVidId:any;
  public liveTimer = {
    hour:0,
    min:0,
    sec:0
  }
  public passOffers = [];
  public plansList = [];
  public allPages = [];
  public selectedSortBy = 'recommended';
  public allFiltered:any = {};
  public filterParams:any;
  public cartSubTotal:any = '0';
  public shippingDate:any = new Date();
  public recommendedProducts = [];
  public cakeMessage:any = '';
  public deliveryAddress:any;
  public Order:{
    customers_id:string,
    customers_telephone:string,
    customers_email_address:string,
    delivery_firstname:string,
    delivery_lastname:string,
    delivery_street_address:string,
    delivery_suburb:string,
    delivery_city:string,
    delivery_postcode:string,
    delivery_zone:string,
    delivery_country:string,
    billing_firstname:string,
    billing_lastname:string,
    billing_street_address:string,
    billing_suburb:string,
    billing_city:string,
    billing_postcode:string,
    billing_zone:string,
    billing_country:string,
    payment_method:string,
    totalPrice:any,
    shipping_cost:any,
    shipping_method:string,
    comments:Array<{}>,
    currency_value:string,
    products_tax:string,
    total_tax:string,
    language_id:string,
    order_type:string,
    cashback_amount:string
  }
  public isNewUser:boolean = false;
  public phoneNum = '';
  public receivedOtp = '';
  public otpToSend = '';
  public fbResponse:any;
  public qParams:any;
  public numRegex = /^\d{10}$/;
  public filteredSearch = {
    products:[],
    categories:[],
    subCategories:[],
    occasions:[],
    subOccasions:[],
    subSubCategories:[]
  }
  public filterInput = '';
  public selectedFilters = {
    flavours:[],
    price:''
  };
  public nextUrl = '';
  public wishList = [];
  public googleResponse:any;
  public referralCode = '';
  public savedAddresses = [];
  public allOrders=[];
  public loading:any;
  public cartHasCake:boolean = false;
  public multilottieConfig: Object;
  public userWalletBalance:any;
  public loadingAnimPaths = ['assets/loading/13498-new-year-party.json'];
  public allCoupons= [];
  public appliedCoupon:any;
  public appliedCouponData:any;
  public signUpPoints:any;
  public referEarnPoints:any;
  public isEligibleForPassport:boolean = false;
  public cartDiscount = 0;
  public couponFormOpened:boolean = false;
  public passportProductsinOrder = [];
  public isEligibleLocation:boolean  = false;
  public mem_code = '';
  public isMobile:boolean = false;
  public otp_secondsLeft = 59;
  public isProductVideoPlaying:boolean = false;
  public currentVideoUrl:any = '';
  public isSubHeaderOpened:boolean = false;
  public isPopupSeen:boolean = false;
  public hasTempBanner:boolean = false;
  public totalBlogs:any;
  constructor(public sanitize:DomSanitizer) {
    this.feeds[0].video = this.sanitize.bypassSecurityTrustResourceUrl(this.feeds[0].video);
   }
}
