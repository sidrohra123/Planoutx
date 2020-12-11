import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-orderfailed',
  templateUrl: './orderfailed.page.html',
  styleUrls: ['./orderfailed.page.scss'],
})
export class OrderfailedPage implements OnInit {
  public summary;
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  constructor(public methods:MethodsService, public data:DataService, public route:ActivatedRoute, public router:Router) {
    this.lottieConfig = {
      path: 'assets/loading/16305-payment-failed.json',
      autoplay: true,
      loop: false
    };
   }

  ngOnInit() {
    this.methods.getCatalog();
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.methods.getOrderById(params.id).then((summ:any)=>{
          console.log(summ);
          // this.anim.play();
          if(summ.data && summ.data.length){
            this.summary = summ;
          }
        });
      }
    });

    window.onbeforeunload = ((e)=>{
      self.location.href="/";
    });
  }

  handleAnimation(e){
    console.log(e);
    this.anim = e;
  }

  retryOrder(){
    self.location.href=this.data.apiUrlNew+'payStatus/'+this.summary.order[0].orders_id;
  }

}
