import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(public methods:MethodsService, public data:DataService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.methods.getAllContacts();
    this.methods.checkQueryParams();
    this.methods.checkIfLoggedIn().then((result)=>{
      if(result){
        this.router.navigate(['/']);
      }
    }).catch((err)=>{
      console.log(err);
      // this.router.navigate(['/']);
    });
  }

}
