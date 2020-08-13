import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-savedaddressesprofile',
  templateUrl: './savedaddressesprofile.page.html',
  styleUrls: ['./savedaddressesprofile.page.scss'],
})
export class SavedaddressesprofilePage implements OnInit {
  selectedAddressId:any;
  constructor(public data:DataService, public methods:MethodsService, public route:ActivatedRoute, public router:Router) { }

  ngOnInit() {
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
    this.selectedAddressId = e.detail.value;
  }

  editAddress(){
    if(!this.selectedAddressId){
      this.methods.showToast('Please choose any address to edit');
      return false;
    }
    this.router.navigate(['/profile/editaddress'], {queryParams:{'id':this.selectedAddressId}});
  }

  deleteAddress(){
    if(!this.selectedAddressId){
      this.methods.showToast('No address selected to delete! Please choose one from above.');
      return false;
    }
    this.methods.deleteAddress(this.selectedAddressId);
  }

}
