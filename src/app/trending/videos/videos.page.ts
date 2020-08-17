import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MethodsService } from 'src/app/methods.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {

  constructor(public data:DataService, public methods:MethodsService) { }

  ngOnInit() {
    
  }

}
