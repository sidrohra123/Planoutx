import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addnewaddress',
  templateUrl: './addnewaddress.page.html',
  styleUrls: ['./addnewaddress.page.scss'],
})
export class AddnewaddressPage implements OnInit {
  userFullLoc:any;
  public address = {
    username:'',
    address:'',
    landmark:'',
    pincode:'',
    city:'',
    country:'',
    countrycode:'+91 IND',
    mobilenum:'',
    email:''
  }
  public qParams:any;
  constructor(public data:DataService, public methods:MethodsService, public route:ActivatedRoute, public router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((qParams)=>{
      this.qParams = qParams;
    });
    this.methods.fetchUserLocationFromDb().then((dat:any)=>{
      this.userFullLoc = dat;
      dat.address_components.forEach((comp)=>{
        if(comp.types && comp.types.length){
          comp.types.forEach((type)=>{
            if(type == 'administrative_area_level_1'){
              this.address.city = comp.long_name;
            }
            if(type=='country'){
              this.address.country = comp.long_name;
            }
            if(type=='postal_code'){
              this.address.pincode = comp.long_name;
            }
          })
        }
      });
      this.address.address = this.userFullLoc.formatted_address;
      this.fetchAddress();
    });
  }

  fetchAddress(){
    this.methods.checkIfLoggedIn().then((usr:any)=>{
      if(usr){
        this.address.username = usr.customers_firstname + ' ' + usr.customers_lastname;
        this.address.mobilenum = usr.customers_telephone;
        this.address.email = usr.customers_email_address;
      }
    });
  }

  useAddress(){
    if(!this.address.username){
      this.methods.showToast('Please enter name');
      return false;
    } else if(!this.address.address){
      this.methods.showToast('Please enter address');
      return false;
    } else if(!this.address.mobilenum){
      this.methods.showToast('Please enter Mobile number');
      return false;
    }
    this.methods.saveAddress(this.address).then((addr)=>{
      this.data.deliveryAddress = addr;
      this.router.navigate([this.qParams.next]);
    });
  }

}
