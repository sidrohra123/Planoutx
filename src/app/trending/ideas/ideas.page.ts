import { Component, OnInit } from '@angular/core';
import { MethodsService } from 'src/app/methods.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.page.html',
  styleUrls: ['./ideas.page.scss'],
})
export class IdeasPage implements OnInit {

  constructor(public methods:MethodsService, public  data:DataService) { }

  ngOnInit() {
    // this.methods.getAllPosts();
  }

}
