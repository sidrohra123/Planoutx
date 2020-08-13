import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(public methods:MethodsService, public data:DataService, public router:Router, public platform:Platform) { }

  ngOnInit() {
    // this.methods.getSideMenus();
    // this.methods.getAllPages().then((pages)=>{});
  }

}
