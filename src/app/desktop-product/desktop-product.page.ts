import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-desktop-product',
  templateUrl: './desktop-product.page.html',
  styleUrls: ['./desktop-product.page.scss'],
})
export class DesktopProductPage implements OnInit {

  constructor(public methods:MethodsService, public data:DataService) { }

  ngOnInit() {
  }

}
