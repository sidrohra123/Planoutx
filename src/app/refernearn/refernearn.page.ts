import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-refernearn',
  templateUrl: './refernearn.page.html',
  styleUrls: ['./refernearn.page.scss'],
})
export class RefernearnPage implements OnInit {

  constructor(public data:DataService, public methods:MethodsService) { }

  ngOnInit() {
  }

}
