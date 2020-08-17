import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  prodSlide = {
    initialSlide: 0,
    slidesPerView:2,
    spaceBetween:10,
    freeMode:true,
    speed: 400,
    pagination:false
  };
  constructor(public data:DataService, public methods:MethodsService) { }

  ngOnInit() {
    this.methods.getFromDb('recentProds').then((recentFromLocal:any)=>{
      this.data.recentlyViewed = recentFromLocal!=null ? recentFromLocal : [];
      console.log(recentFromLocal);
    });
  }

}
