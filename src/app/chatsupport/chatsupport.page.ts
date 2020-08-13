import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chatsupport',
  templateUrl: './chatsupport.page.html',
  styleUrls: ['./chatsupport.page.scss'],
})
export class ChatsupportPage implements OnInit {
  public query = {
    name:'',
    email:'',
    feedback:''
  }
  constructor(public methods:MethodsService, public data:DataService) { }

  ngOnInit() {
    // this.methods.initZenDesk();
  }

  sendQuery(){
    if(!this.query.name.trim()){
      this.methods.showToast('Please enter your name first');
      return false;
    }
    if(!this.query.email.trim()){
      this.methods.showToast('Please enter your email first');
      return false;
    }
    if(!this.query.feedback.trim()){
      this.methods.showToast('Please enter atleast a few words to describe your query');
      return false;
    }
    this.methods.sendForm(this.query).then((dat)=>{
      this.query.name = '';
      this.query.email = '';
      this.query.feedback = '';
    });
  }

}
