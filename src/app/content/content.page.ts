import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
})
export class ContentPage implements OnInit {
  pageDetails:any;
  constructor(public data:DataService, public methods:MethodsService, public route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params)=>{
      console.log(params);
      if(params.pageId && this.data.allPages.length){
        this.methods.getPageByName(params.pageId).then((page)=>{
          this.pageDetails = page;
        });
      }
      else{
        this.methods.getAllPages().then((pages)=>{
          this.methods.getPageByName(params.pageId).then((page)=>{
            this.pageDetails = page;
          });
        });
      }
    })
  }

}
