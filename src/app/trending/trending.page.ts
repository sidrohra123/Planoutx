import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.page.html',
  styleUrls: ['./trending.page.scss'],
})
export class TrendingPage implements OnInit {
  public topVideos = {
    slidesPerView:1.5,
    spaceBetween: 10,
    freeMode:true,
    centeredSlides: false,
  }
  constructor(public data:DataService, public methods:MethodsService, public sanitizer:DomSanitizer, public route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((par)=>{
      if(par.section && par.section=='blog'){
        this.data.selectedTrending=2;
      }
      else{
        // this.methods.getVideosByChannel();
      }
    })
  }

  changed(){

  }

  scrollingMe(e){
    console.log(e);
    var showMoreButton = document.getElementById('showMoreBtn');
    var blogContent = document.getElementsByClassName('videoCardSec');
    if(showMoreButton && blogContent){
      var contentHeight = blogContent[0].clientHeight - 530;
      console.log(contentHeight)
      if(e.detail.scrollTop >=  contentHeight){
        this.data.blogPageNum++;
        this.methods.getAllPosts(this.data.blogPageNum);
      }
    }
  }

}
