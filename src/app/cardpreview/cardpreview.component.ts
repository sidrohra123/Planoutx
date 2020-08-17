import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cardpreview',
  templateUrl: './cardpreview.component.html',
  styleUrls: ['./cardpreview.component.scss'],
})
export class CardpreviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    (function() {
      function $(id) {
        return document.getElementById(id);
      }
    
      var card = $('card'),
          openB = $('open'),
          closeB = $('close'),
          timer = null;
      console.log('wat', card);
      openB.addEventListener('click', function () {
        card.setAttribute('class', 'open-half');
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          card.setAttribute('class', 'open-fully');
          timer = null;
        }, 400);
      });
    
      closeB.addEventListener('click', function () {
        card.setAttribute('class', 'close-half');
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          card.setAttribute('class', '');
          timer = null;
        }, 400);
      });
    
    }());    
  }

}
