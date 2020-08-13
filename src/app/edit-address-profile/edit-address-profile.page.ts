import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-address-profile',
  templateUrl: './edit-address-profile.page.html',
  styleUrls: ['./edit-address-profile.page.scss'],
})
export class EditAddressProfilePage implements OnInit {
  selectedLocation:any;
  public address = {
    username:'',
    address:'',
    landmark:'',
    pincode:'',
    city:'',
    country:'',
    mobilenum:'',
    email:'',
    id:''
  }
  qParams:any;
  constructor(public methods:MethodsService, public data:DataService, public route:ActivatedRoute, public router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((qPars)=>{
      this.qParams = qPars;
      if(qPars.id){
        this.methods.getUserAddressByAddressId(qPars.id).then((addr:any)=>{
          console.log(addr);
          this.selectedLocation = addr;
          this.address.username = addr.firstname + ' ' + addr.lastname;
          this.address.address = addr.street;
          this.address.country = addr.suburb;
          this.address.landmark = '';
          this.address.pincode = addr.postcode;
          this.address.city = addr.city;
          this.address.mobilenum = this.data.userInfo.customers_telephone;
          this.address.email = this.data.userInfo.customers_email_address;
          this.address.id = addr.address_id
        });
      }
    });
  }

  confirmEdit(){
    this.methods.editAddress(this.address).then((addr)=>{
      if(this.qParams && this.qParams.next){
        this.router.navigate([this.qParams.next]);
      }
    });
  }

}
