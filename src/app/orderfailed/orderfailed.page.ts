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
  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '100%',
    margin: '0 auto',
  };
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
          // this.anim.play();
          if(summ.data){
            this.summary = summ;
            if(this.summary.data.coupon_data){
              this.summary.data.coupon_data = JSON.parse(this.summary.data.coupon_data);
            }
            console.log(this.summary);
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
    //self.location.href=this.data.apiUrlNew+'payStatus/'+this.summary.data.orders_id;
    this.router.navigate(['/checkout'])
  }

}
