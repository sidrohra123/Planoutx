import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage implements OnInit {
  public userInfo = {
    first_name:'',
    last_name:'',
    countrycode:'+91 IND',
    mobilenum:'',
    email:'',
    dob:'',
    gender:''
  }
  constructor(public methods:MethodsService, public data:DataService) { }

  ngOnInit() {
    this.populateUserInfo();
  }

  ionViewEnter(){
    this.populateUserInfo();
  }

  changeDOB(e){
    console.log(e);
    if(e){
      this.userInfo.dob = e.detail.value;
    }
  }

  changeGender(e){
    console.log(e);
    if(e){
      this.userInfo.gender = e.detail.value;
    }
  }

  populateUserInfo(){
    this.methods.checkIfLoggedIn().then((usr)=>{
      this.userInfo.first_name = this.data.userInfo.customers_firstname;
      this.userInfo.last_name = this.data.userInfo.customers_lastname;
      this.userInfo.mobilenum = this.data.userInfo.customers_telephone;
      this.userInfo.email = this.data.userInfo.customers_email_address;
      this.userInfo.dob = this.data.userInfo.customers_dob;
      this.userInfo.gender = this.data.userInfo.customers_gender;
    });
  }

  SaveProfile(){
    if(!this.userInfo.first_name.trim()){
      this.methods.showToast('Please enter first name');
      return false;
    }
    if(!this.userInfo.mobilenum.trim()){
      this.methods.showToast('Please enter mobile number');
      return false;
    }
    if(!this.userInfo.first_name.trim()){
      this.methods.showToast('Please enter first name');
      return false;
    }
    if(!this.userInfo.email.trim()){
      this.methods.showToast('Please enter email');
      return false;
    }
    this.methods.updateProfileInfo(this.userInfo);
  }

}
