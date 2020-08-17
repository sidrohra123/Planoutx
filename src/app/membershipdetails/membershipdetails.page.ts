import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-membershipdetails',
  templateUrl: './membershipdetails.page.html',
  styleUrls: ['./membershipdetails.page.scss'],
})
export class MembershipdetailsPage implements OnInit {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  constructor(public data:DataService, public methods:MethodsService, public router:Router) {
    this.lottieConfig = {
      path: 'assets/433-checked-done.json',
      autoplay: true,
      loop: false
    };
   }

  ngOnInit() {
    this.methods.processLogin().then((usr)=>{
      this.anim ? this.anim.play() : null;
    });

  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    self.location.href="/";
  }

  handleAnimation(e){
    console.log(e);
    this.anim = e;
  }

}
