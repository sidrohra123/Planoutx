import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {

  constructor(public data:DataService, public methods:MethodsService, public sanitizer:DomSanitizer) {
    
   }

  ngOnInit() {
    this.methods.getAllPosts(this.data.blogPageNum);
  }

  loadMorePosts(){
    this.data.blogPageNum++;
    this.methods.getAllPosts(this.data.blogPageNum);
  }

  imageLoaded(e){
    console.log(e);
  }

}
