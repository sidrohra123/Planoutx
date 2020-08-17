import { Component, OnInit, OnDestroy, ViewChild, Input, Output } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SortProductsComponent } from './sort-products/sort-products.component';
import { PopoverController, ModalController, ActionSheetController } from '@ionic/angular';
import { FilterProductsComponent } from '../filter-products/filter-products.component';
import { UrlSlugPipe } from '../url-slug.pipe';

@Component({
  selector: 'app-eveyrthing',
  templateUrl: './eveyrthing.page.html',
  styleUrls: ['./eveyrthing.page.scss'],
})
export class EveyrthingPage implements OnInit,OnDestroy {
  perPage = 10;
  @ViewChild('products') productsEl:any;
  contentTop = 0;
  hasScrolled = false;
  qParams;
  pParams;
  isScrolledUp:boolean = false;
  isLoading:boolean = false;
  constructor(public data:DataService, public methods:MethodsService, private route:ActivatedRoute, public router:Router, public popoverController: PopoverController, public modalController: ModalController, public aS:ActionSheetController) { }

  ngOnInit(){

  }

  keepGettingProducts(cb){
    let d = setInterval(()=>{
      if(this.data.allProducts.length){
        cb(this.data.allProducts);
        clearInterval(d);
      }
    },100);
  }

  ionViewDidEnter() {
    this.perPage = 10;
    this.contentTop = 0;
    this.data.allFiltered = undefined;
    this.isLoading = true;
    this.keepGettingProducts((catalog)=>{
      this.route.params.subscribe((pars)=>{
        console.log(this.data.filterParams);
        if(pars){
          this.data.filterParams = pars;
          this.pParams = pars;
          this.methods.filterEverythingByNames(pars).then((allFiltered)=>{
            this.data.allFiltered = allFiltered;
            console.log(this.data.allFiltered);
            if(this.data.allFiltered.selectedOccasion.occasion_categories_id || this.data.allFiltered.selectedSubOccasion.occasion_categories_id){
              this.sortProductsBy('new');
            }
          });
        }
      });

      this.route.queryParams.subscribe((params:any)=>{
        console.log(params);
        this.qParams = params;
        if(params){
          this.data.filterParams = params;
          this.methods.filterEverything(params).then((allFiltered)=>{
            this.data.allFiltered = allFiltered;
            if(this.data.allFiltered.selectedOccasion.occasion_categories_id || this.data.allFiltered.selectedSubOccasion.occasion_categories_id){
              this.sortProductsBy('new');
            }
            console.log(this.data.allFiltered);
          });
        }
      });
      this.isLoading = false;
    });
  }

  getMainCatParams(cat){
    var objReturn;
    if(this.qParams){
      if(this.qParams.occasion && !this.qParams.subOccasion){
        objReturn = {'category':cat.id, 'occasion' : this.qParams.occasion};
      }
      else if(this.qParams.occasion && this.qParams.subOccasion){
        objReturn = {'category':cat.id, 'occasion' : this.qParams.occasion, 'subOccasion': this.qParams.subOccasion};
      }
    }
    return objReturn;
  }

  ngOnDestroy(){
    // this.methods.clearSearch();
    //this.data.selectedFilters.price = '';
  }

  // ionViewWillLeave(){
  //   this.data.selectedFilters.price = '';
  // }

  scrollMe(e){
    this.contentTop = e.detail.scrollTop;
    if(e.detail.deltaY <= 0 ){
      this.isScrolledUp = false;
    }
    else{
      this.isScrolledUp = true;
    }
  }

  increment(e){
    var c;
    if(this.data.allFiltered && this.perPage >= this.data.allFiltered.products.length){
      if(c) clearTimeout(c);
      return false;
    }
    var targetEl = window.innerHeight + this.productsEl.nativeElement.scrollHeight - this.productsEl.nativeElement.offsetTop;
    this.hasScrolled = true;
    c = setTimeout(()=>{
      this.perPage += 10;
      this.hasScrolled = false;
    },1500);
  }

  goToProduct(product){
    let slugPipe = new UrlSlugPipe();
    let name = slugPipe.transform(product.products_name);
    this.router.navigate(['/product', name]);
  }

  async openSortPopup(ev){
    const acSht = await this.aS.create({
      cssClass:'sortPop',
      mode:'md',
      header:'Choose sorting options',
      buttons:[
        {
          text:'Recommended',
          cssClass:this.data.selectedSortBy == 'recommended' ? 'active' : '',
          handler:(()=>{
            this.sortProductsBy('recommended');
          })
        },
        {
          text:'New',
          cssClass:this.data.selectedSortBy == 'new' ? 'active' : '',
          handler:(()=>{
            this.sortProductsBy('new');
          })
        },
        {
          text:'Price Low to High',
          cssClass:this.data.selectedSortBy == 'pltoh' ? 'active' : '',
          handler:(()=>{
            this.sortProductsBy('pltoh');
          })
        },
        {
          text:'Price High to Low',
          cssClass:this.data.selectedSortBy == 'phtol' ? 'active' : '',
          handler:(()=>{
            this.sortProductsBy('phtol');
          })
        }
      ]
    });
    await acSht.present();
  }

  openFilterModal() {
    this.router.navigate(['/filter'], {queryParams:{'next':location.pathname}});
  }

  sortProductsBy(type){
    this.data.selectedSortBy = type;
    this.sortProducts(type);
  }
  

  sortProducts(type){
    console.log(type);
    if(type=='new'){
      this.data.allFiltered.products.sort((a,b)=>{
        if(new Date(a.products_date_added) > new Date(b.products_date_added)){
          return -1;
        }
        else{
          return 1;
        }
      });
    }
    if(type=='recommended'){
      this.methods.filterEverythingByNames(this.pParams).then((allFiltered)=>{
        this.data.allFiltered = allFiltered;
        console.log(this.data.allFiltered);
      });
    }
    if(type=='pltoh'){
      this.data.allFiltered.products.sort((a,b)=>{
        if(+a.products_price < +b.products_price){
          return -1;
        }
        else{
          return 1;
        }
        return 0;
      });
    }
    if(type=='phtol'){
      this.data.allFiltered.products.sort((a,b)=>{
        if(+a.products_price > +b.products_price){
          return -1;
        }
        else{
          return 1;
        }
        return 0;
      });
    }
  }

}
