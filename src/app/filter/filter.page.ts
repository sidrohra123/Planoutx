import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  constructor(public methods:MethodsService, public data:DataService, public route:ActivatedRoute, public router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      console.log(params);
      if(params.next){
        this.data.nextUrl = params.next;
      }
    });
  }

  clearFilters(){
    this.data.selectedFilters.flavours = [];
    this.data.selectedFilters.price = '';
    this.router.navigateByUrl(this.data.nextUrl);
  }

}
