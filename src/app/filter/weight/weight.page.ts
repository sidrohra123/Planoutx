import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MethodsService } from 'src/app/methods.service';
import { DataService } from 'src/app/data.service';
import * as _ from "lodash";

@Component({
  selector: 'app-weight',
  templateUrl: './weight.page.html',
  styleUrls: ['./weight.page.scss'],
})
export class WeightPage implements OnInit {

  public clearedFilters = true;
  public flavours = ['Chocolate', 'Truffle', 'Black Forest', 'Butterscotch', 'Pineapple', 'Vanilla', 'Red Velvet', 'Fresh Fruit', 'Caramel', 'Oreo', 'Coffee', 'Strawberry', 'Walnut'];
  public selectedFlavours = [];
  constructor(private route:ActivatedRoute, private methods:MethodsService, private data:DataService, private router:Router) { }

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
    this.router.navigateByUrl(this.data.nextUrl);
  }

  selectFlavour(e){
    if(e.detail.checked){
      this.data.selectedFilters.flavours.push(e.detail.value);
    }
    else{
      this.data.selectedFilters.flavours.splice(this.data.selectedFilters.flavours.indexOf(e.detail.value), 1);
    }
    console.log(this.data.selectedFilters);
  }

  applyFlavours(){
    console.log(this.data.selectedFilters.flavours);
    this.router.navigateByUrl(this.data.nextUrl);
  }

}
