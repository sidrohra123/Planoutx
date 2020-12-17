import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { UrlSlugPipe } from '../url-slug.pipe';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  prodSlide = {
    initialSlide: 0,
    slidesPerView:2,
    spaceBetween:10,
    freeMode:true,
    speed: 400,
    pagination:false
  };
  prodDetailsSlides = {
    initialSlide: 0,
    autoPlay:true,
    autoHeight:true
  };
  ratingSlideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween:10,
    slidesPerView:2,
    freeMode:true,
    centeredSlides:true
  };
  public rateArray = [];
  public reviewTitle = '';
  public reviewDesc = '';
  public currentTimeHour = new Date().getHours();
  public isReviewOpened:boolean= false;
  isWishlisted:boolean = false;
  public shippingDelivery = new Date();
  public shippingDeliveryDigital = new Date();
  public shippingDeliverySurprises = new Date();
  public shippingPartySupplies = new Date();
  public shippingGifts = new Date();
  public topPos = 0;
  public getProducts:any;
  public currentVideo:any = '';
  constructor(public route:ActivatedRoute,public data:DataService, public methods:MethodsService, public cdref: ChangeDetectorRef, public router:Router, private san:DomSanitizer) { }

  playVideo(video){
    this.currentVideo = this.san.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+video+'?autoplay=1&controls=0&showinfo=0&modestbranding=1');
  }

  noVideo(){
    this.currentVideo = '';
  }

  ngAfterViewInit(){
    console.log('init');
    // this.cdref.detectChanges();
  }

  ionViewDidEnter(){
    this.currentVideo = '';
    this.data.currentVideoUrl = undefined;
    this.data.isProductVideoPlaying = false;
    if(!this.data.isSelectedLocation && !this.data.isSelectedLater){
      this.data.userGeoLocation = undefined;
    }
    // this.methods.fetchUserLocationFromDb();
  }

  ngOnInit() {
    // this.methods.getLocations();
    // this.methods.convertGeoCode();
    let currentDate = new Date();
    this.shippingDelivery.setDate(this.shippingDelivery.getDate()+5);
    this.shippingDeliveryDigital.setDate(this.shippingDeliveryDigital.getDate()+1);
    this.shippingDeliverySurprises.setDate(this.shippingDeliverySurprises.getDate()+3);
    this.shippingPartySupplies.setDate(this.shippingPartySupplies.getDate()+5);
    this.shippingGifts.setDate(this.shippingGifts.getDate()+5);
    this.isWishlisted = false;
    this.keepGettingProducts((prods)=>{
      this.route.params.subscribe((params)=>{
        if(params && params.name){
          if(this.data.allProducts.length){
            this.data.allProducts.forEach((prod:any)=>{
              let slugPipe = new UrlSlugPipe();
              let name = slugPipe.transform(prod.products_name);
              if(name==params.name){
                console.log(prod);
                this.data.selectedProduct = prod;
                if(this.data.selectedProduct.products_quantity == '0'){
                  this.notifyMe(false);
                }
                this.methods.generateMetaDetails('product', this.data.selectedProduct.products_id);
                this.slideChanged();
                //this.methods.fetchUserLocationFromDb();
                this.data.selectedProduct.isWishlisted = false;
                this.methods.checkIfWishlisted(prod);
                this.methods.checkIfProductEligibleForPassport();
                if(!this.data.isSelectedLater){
                if(!this.data.selectedProduct.category_ids.includes('167') && !this.data.selectedProduct.category_ids.includes('33') && !this.data.selectedProduct.category_ids.includes('32')){
                  if(this.data.selectedProduct.delivery_option_ids!='3'){
                    if(this.data.selectedProduct.delivery_option_ids != '4'){
                      if(this.currentTimeHour < (this.data.deliveryHours.to - 3)){
                        this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
                        this.data.selectedDeliveryType.type = 'stdDel';
                        !this.data.selectedProduct.availableSlots ? this.methods.createSlots('today', 'stdDel') : null;
                      }
                      else{
                        this.data.selectedDay.name = 'tomorrow';
                        this.data.selectedDay.date = Date.now() + 24 * 60 * 60 * 1000;
                        this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
                        this.data.selectedDeliveryType.type = 'stdDel';
                        !this.data.selectedProduct.availableSlots ? this.methods.createSlots('tomorrow', 'stdDel') : null;
                      }
                    } else {
                      if(!this.data.isSelectedLater){
                        if(this.currentTimeHour < (this.data.deliveryHours.to - 3)){
                          this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
                          this.data.selectedDeliveryType.type = 'freedel';
                          !this.data.selectedProduct.availableSlots ? this.methods.createSlots('today', 'freedel') : null;
                        }
                        else{
                          this.data.selectedDay.name = 'tomorrow';
                          this.data.selectedDay.date = Date.now() + 24 * 60 * 60 * 1000;
                          this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
                          this.data.selectedDeliveryType.type = 'freedel';
                          !this.data.selectedProduct.availableSlots ? this.methods.createSlots('tomorrow', 'freedel') : null;
                        }
                      } else {
                        if(this.data.selectedProduct.delivery_option_ids == '4'){
                          this.data.selectedDeliveryType.type = 'freedel';
                          this.methods.createSlots('tomorrow', 'freedel');
                        } else {
                          this.data.selectedDeliveryType.type = 'stdDel';
                          this.methods.createSlots('tomorrow', 'stdDel');
                        }
                      }
                    }
                  }
                  else{
                    this.data.selectedProduct.shipping_date = currentDate.setDate(currentDate.getDate()+5);
                    this.data.selectedDeliveryType.type = 'Third Party Shipping';
                    this.data.selectedProduct.shipping_time = {
                      from:this.data.deliveryHours.from,
                      to:this.data.deliveryHours.to
                    };
                    if(this.data.shippingRates.names){
                      let productWeight = +this.data.selectedProduct.products_weight;
                      this.data.shippingRates.names.forEach((name, i) => {
                        if(productWeight != 0){
                          let lowRange = +name.split('-').shift();
                          let highRange = +name.split('-').pop();
                          if(productWeight >= lowRange && productWeight <= highRange){
                            this.data.selectedProduct.shipping_cost = this.data.shippingRates.price[i];
                          }
                        } else {
                          this.data.selectedProduct.shipping_cost = '0';
                        }
                      });
                      console.log(this.data.selectedProduct.shipping_cost);
                    }
                  }
                }
                else{
                   if(this.data.selectedProduct.category_ids.includes(',2') || this.data.selectedProduct.category_ids.includes(',2,')){
                    this.data.selectedProduct.shipping_date = this.shippingPartySupplies;
                    this.data.selectedProduct.shipping_time = {
                      from:9,
                      to:22
                    };
                  } else if(this.data.selectedProduct.category_ids.includes('167')){
                    this.data.selectedProduct.shipping_date = this.shippingDeliveryDigital;
                    this.data.selectedProduct.shipping_time = {
                      from:18,
                      to:21
                    };
                  } else if(this.data.selectedProduct.category_ids.includes('33')){
                    this.data.selectedProduct.shipping_date = this.shippingGifts;
                    this.data.selectedProduct.shipping_time = {
                      from:9,
                      to:22
                    };
                  } else if(this.data.selectedProduct.category_ids.includes('32')){
                    this.data.selectedDay.name = 'tomorrow';
                    this.data.selectedDay.date = Date.now() + 24 * 60 * 60 * 1000;
                    this.data.selectedProduct.shipping_date = this.data.selectedDay.date;
                    this.data.selectedDeliveryType.type = 'freedel';
                    !this.data.selectedProduct.availableSlots ? this.methods.createSlots('tomorrow', 'stdDel') : null;
                  } else {
                    this.data.selectedProduct.shipping_date = currentDate.setHours(currentDate.getHours()+16);
                    // this.data.selectedProduct.shipping_time = {
                    //   from:currentDate.getHours(),
                    //   to:24 - (24 - currentDate.getHours()+16)
                    // };
                    this.data.selectedProduct.shipping_time = {
                      from:9,
                      to:22
                    };
                  }
                  this.data.selectedDeliveryType.type = 'Free Shipping';
                  this.data.selectedProduct.shipping_cost = '0';
                }
                } else {
                  if(this.data.selectedProduct.delivery_option_ids == '4'){
                    this.data.selectedDeliveryType.type = 'freedel';
                    this.methods.createSlots('tomorrow', 'freedel');
                  } else {
                    this.data.selectedDeliveryType.type = 'stdDel';
                    this.methods.createSlots('tomorrow', 'stdDel');
                  }
                }
                this.methods.getRecommendedProductsByCatId(prod.categories_id);
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
                    if(!attr.selectedValue){
                      attr.selectedValue = attr.values[0];
                      if(!this.data.selectedProduct.specials_new_products_price){
                        this.data.selectedProduct.products_price = (+this.data.selectedProduct.products_price + +attr.selectedValue.price).toFixed(2);
                      } else {
                        this.data.selectedProduct.specials_new_products_price = (+this.data.selectedProduct.specials_new_products_price + +attr.selectedValue.price).toFixed(2);
                      }
                      }
                  });
                }
              }
            });
            this.methods.getFromDb('recentProds').then((recentFromLocal:any)=>{
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
              this.methods.saveToDb('recentProds', this.data.recentlyViewed);
            });
          }
        }
      });
    });
  }

  keepGettingProducts(cb){
    let d = setInterval(()=>{
      if(this.data.allProducts.length){
        cb(this.data.allProducts);
        clearInterval(d);
      }
    },100);
  }

  openReview(){
    !this.isReviewOpened ? this.isReviewOpened = true : this.isReviewOpened = false; 
  }

  selectRatings(rate){
    let newArray = [];
    if(rate == 1){
      newArray.push(1);
    } else if(rate == 2){
      newArray.push(1,2);
    } else if(rate == 3){
      newArray.push(1,2,3)
    } else if(rate == 4){
      newArray.push(1,2,3,4)
    } else if(rate == 5){
      newArray.push(1,2,3,4,5)
    }
    this.rateArray = newArray;
  }

  slideChanged(){

  }

  toCart(){
    if(this.data.selectedProduct.shipping_time){
      this.methods.checkIfLoggedIn().then((usr)=>{
        if(this.data.userGeoLocation && this.data.isEligibleLocation){
          this.initCartAnimation();
          setTimeout(()=>{
            this.methods.addToCart(this.data.selectedProduct, 1).then((cart)=>{
              //this.router.navigate(['/cart']);
              if(this.data.selectedProduct.addon_products.length){
                this.router.navigate(['/addons', this.data.selectedProduct.products_id]);
              }
            });
          },800);
        }
        else{
          this.methods.openOptions();
          this.methods.showToast('Please choose your location first.');
        }
      }).catch((err)=>{
        let pipe = new UrlSlugPipe();
        this.methods.showToast('Please login first!');
        this.router.navigate(['/login'], {queryParams:{'next': '/product/'+pipe.transform(this.data.selectedProduct.products_name)}});
      });
    }
    else{
      this.methods.showToast('Please choose Shipping Slot first.');
    }
  }
  toCheckout(){
    if(this.data.selectedProduct.shipping_time){
      this.methods.checkIfLoggedIn().then((usr)=>{
        if(this.data.userGeoLocation && this.data.isEligibleLocation){
          this.methods.addToCart(this.data.selectedProduct, 1).then((cart)=>{
            this.router.navigate(['/checkout']);
          });
        }
        else{
          this.methods.showToast('Please choose your location first.');
        }
      }).catch((err)=>{
        this.methods.showToast('Please login first!');
        this.router.navigate(['/login'], {queryParams:{'next': '/product/'+this.data.selectedProduct.products_id}});
      });
    }
    else{
      this.methods.showToast('Please choose Shipping Slot first.');
    }
  }

  toPassportCart(){
    console.log(this.data.selectedProduct.shipping_time);
    if(this.data.selectedProduct.shipping_time){
      this.methods.checkIfLoggedIn().then((usr)=>{
        if(this.data.userGeoLocation){
          this.methods.showConfirm('!! Alert !!', 'Free Product can be added once in your cart. If you want to modify, then you have to remove free product from cart and add new free product.', '', ()=>{}, ()=>{
            this.methods.addPassportProductToCart(this.data.selectedProduct, 1).then((cart)=>{
              this.router.navigate(['/cart']);
            });
          }, 'Give me more time', 'Proceed');
        }
        else{
          this.methods.showToast('Please choose your location first.');
        }
      }).catch((err)=>{
        this.methods.showToast('Please login first!');
        this.router.navigate(['/login'], {queryParams:{'next': '/product/'+this.data.selectedProduct.products_id}});
      });
    }
    else{
      this.methods.showToast('Please choose Shipping Slot first.');
    }
  }

  addReview(){
    console.log(this.rateArray.length);
    if(!this.rateArray.length){
      this.methods.showToast('Please Rate the product from 1 to 5');
      return false;
    }
    if(!this.reviewDesc.trim()){
      this.methods.showToast('Please describe your review in few words');
      return false;
    }
    this.methods.addReview(this.data.selectedProduct, this.rateArray.length, this.reviewDesc);
    this.isReviewOpened = false;
  }

  initCartAnimation(){
    document.body.classList.add('animatingProduct');
    setTimeout(()=>{
      document.body.classList.remove('animatingProduct');
    },700);
  }

  notifyMe(isShow){
    let data = {
      name:'',
      email:'',
      feedback:''
    }
    this.methods.checkIfLoggedIn().then((usr)=>{
      data.name = this.data.userInfo.customers_firstname + ' ' + this.data.userInfo.customers_lastname;
      data.email = this.data.userInfo.customers_email_address;
      data.feedback = 'I want this product back in stock '+JSON.stringify(this.data.selectedProduct);
    });
    this.methods.sendForm(data, isShow).then((dat)=>{
      
    });
  }

  ionViewWillLeave(){
    this.data.isSelectedLocation = false;
    this.data.isSelectedLater = false;
    // this.data.selectedDay.name = undefined;
  }

  getMainCatParams(cat){
    var objReturn;
    if(this.data.allFiltered){
      if(this.data.allFiltered.selectedOccasion && !this.data.allFiltered.selectedSubOccasion){
        objReturn = {'category':cat.id, 'occasion' : this.data.allFiltered.selectedOccasion.nid};
      }
      else if(this.data.allFiltered.selectedOccasion && this.data.allFiltered.selectedSubOccasion){
        objReturn = {'category':cat.id, 'occasion' : this.data.allFiltered.selectedOccasion.nid, 'subOccasion': this.data.allFiltered.selectedSubOccasion.id};
      } else {
        objReturn = {'category':cat.id};
      }
    }
    return objReturn;
  }

  getsubCatParams(cat, subCat){
    var objReturn;
    if(this.data.allFiltered){
      if(this.data.allFiltered.selectedOccasion && !this.data.allFiltered.selectedSubOccasion){
        objReturn = {'category':cat.id, 'subcategory':subCat.id, 'occasion' : this.data.allFiltered.selectedOccasion.nid};
      }
      else if(this.data.allFiltered.selectedOccasion && this.data.allFiltered.selectedSubOccasion){
        objReturn = {'category':cat.id, 'subcategory':subCat.id, 'occasion' : this.data.allFiltered.selectedOccasion.nid, 'subOccasion': this.data.allFiltered.selectedSubOccasion.id};
      } else {
        objReturn = {'category':cat.id, 'subcategory':subCat.id};
      }
    }
    return objReturn;
  }
}
