import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-saved-address',
  templateUrl: './saved-address.page.html',
  styleUrls: ['./saved-address.page.scss'],
})
export class SavedAddressPage implements OnInit {
  selected:any;
  qParams:any;
  constructor(public data:DataService, public methods:MethodsService, public route:ActivatedRoute, public router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((qParams)=>{
      this.qParams = qParams;
    });
  }

  ionViewDidEnter(){
    if(this.data.savedAddresses.length){

    }
    else{
      this.methods.getUserAddresses().then((addresses)=>{

      });
    }
  }

  chooseAddress(e){
    console.log(e);
    if(this.data.savedAddresses.length){
      this.data.savedAddresses.forEach((address)=>{
        if(address.address_id == e.detail.value){
          this.selected = address;
        }
      });
    }
  }

  continue(){
    if(this.selected){
      this.data.deliveryAddress = this.selected;
      this.router.navigate([this.qParams.next ? this.qParams.next : '/checkout']);
    }
    else{
      this.methods.showToast('Please choose address first');
    }
  }

  editAddress(){
    if(this.selected){
      this.router.navigate(['/profile/editaddress'], {queryParams:{'id':this.selected.address_id, 'next':'/saved-address'}});
    }
    else{
      this.methods.showToast('Please choose address first');
    }
  }

}
