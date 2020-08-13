import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  
  footerOffersOpts = {
    slidesPerView: 1,
    spaceBetween: 0,
    freeMode:false,
    centeredSlides: false,
    autoplay: {
      delay: 100,
    },
    loop:true,
    noSwiping: true,
    onlyExternal: false
  }
  constructor(public router:Router, public data:DataService) {
   }

  ngOnInit() {}

}
