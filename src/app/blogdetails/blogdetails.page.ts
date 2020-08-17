import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blogdetails',
  templateUrl: './blogdetails.page.html',
  styleUrls: ['./blogdetails.page.scss'],
})
export class BlogdetailsPage implements OnInit {

  constructor(public data:DataService, public methods:MethodsService, private route:ActivatedRoute, public sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.route.params.subscribe((param)=>{
      if(param.id){
        this.methods.getPostById(param.id);
      }
    })
  }

}
