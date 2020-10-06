import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ApiService } from '../api.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-enterpincode',
  templateUrl: './enterpincode.page.html',
  styleUrls: ['./enterpincode.page.scss'],
})
export class EnterpincodePage implements OnInit {
  address:Address;
  numReg = /^\d+$/;
  hasError:boolean = false;
  public qParams:any;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options = {
    componentRestrictions: {country: 'IN'}
  };
  constructor(public data:DataService, public methods:MethodsService, public api:ApiService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((qParams)=>{
      console.log(qParams);
      this.qParams = qParams;
    })
  }

  handleAddressChange(address: Address){
    console.log(address);
    this.data.isEligibleLocation = false;
    if(this.qParams.categoryname && !this.qParams.categoryname.includes('167') && this.qParams.categoryname !== '2' && !this.qParams.categoryname.includes('33')){
      this.methods.getZones().then((states:any)=>{
        let hasPostalCode = false;
        if(address && address.address_components && address.address_components.length){
          address.address_components.forEach((addr)=>{
            if(addr.types.length && addr.types.includes('postal_code')){
              hasPostalCode = true;
              this.address = address;
              states.forEach((state)=>{
                if(state.zone_code == addr.long_name){
                  this.data.isEligibleLocation = true;
                }
              });
            }
          });
          if(!hasPostalCode){
            this.methods.showToast('Please enter postal code for more visibility', 5000);
          }
        }
      });
    }
    else{
      this.address = address;
      this.data.isEligibleLocation = true;
      this.methods.saveToDb('userLocation', this.address);
    }
  }

  toContinue(){
    if(this.address){
      this.data.userGeoLocation = this.address.formatted_address;
      this.router.navigate([this.qParams.next.indexOf('lite') != -1 ? this.qParams.next.split('/lite').pop() : this.qParams.next]);
      this.data.isSelectedLocation = true;
    }
  }

}
