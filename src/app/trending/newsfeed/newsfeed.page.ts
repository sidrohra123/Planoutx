import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MethodsService } from 'src/app/methods.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage implements OnInit {

  constructor(public data:DataService, public methods:MethodsService, public sanitize:DomSanitizer) {
    sanitize.bypassSecurityTrustResourceUrl
   }

  ngOnInit() {
  }

}
