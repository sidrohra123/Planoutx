import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { MethodsService } from '../methods.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.page.html',
  styleUrls: ['./tutorials.page.scss'],
})
export class TutorialsPage implements OnInit {
  @ViewChild('swiperInst', { static: true }) public swiperWrapper: any;
  public config:any;
  constructor(public methods:MethodsService, public router:Router) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.methods.checkIfLoggedIn().then((result)=>{
      if(result){
        this.router.navigate(['/home']);
      }
    }).catch((err)=>{
      console.log(err);
      // this.router.navigate(['/']);
    });
    setTimeout(()=>{
      // this.tuts.update();\
      this.config = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : false,
        },
      }
    },200);
  }

}
