import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.page.html',
  styleUrls: ['./sitemap.page.scss'],
})
export class SitemapPage implements OnInit {

  constructor(public data:DataService, public methods:MethodsService) { }

  ngOnInit() {
    if(!this.data.allProducts.length){
      this.methods.getCatalog();
    }
  }

}
