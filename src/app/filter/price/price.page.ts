import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MethodsService } from 'src/app/methods.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-price',
  templateUrl: './price.page.html',
  styleUrls: ['./price.page.scss'],
})
export class PricePage implements OnInit {

  public prices = ['Below ₹ 500', '₹ 500 +', '₹ 1000 +', '₹ 1500 +', 'Below ₹ 2000', '₹ 2000 +', '₹ 2500 And Above'];
  public clearedFilters = true;
  public qParams:any;

  constructor(public data:DataService, public methods:MethodsService, public route:ActivatedRoute, public router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      console.log(params);
      if(params.next){
        this.data.nextUrl = params.next;
      }
    });
  }

  selectPrice(e){
    console.log(e);
    this.data.selectedFilters.price = e.detail.value;
  }

  clearFilters(){
    this.data.selectedFilters.price = '';
    this.router.navigateByUrl(this.data.nextUrl);
  }

  applyPrice(){
    console.log(this.data.selectedFilters.price);
    this.router.navigateByUrl(this.data.nextUrl);
  }


}
