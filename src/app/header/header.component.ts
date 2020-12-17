import { Component, OnInit, ViewChild } from '@angular/core';
import { MethodsService } from '../methods.service';
import { DataService } from '../data.service';
import { IonSearchbar } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('headerSearch') headerS:IonSearchbar
  recognition:any;
  isRecording:boolean = false;
  constructor(public methods:MethodsService, public data:DataService, public router:Router) { }

  ngOnInit() {
    this.methods.checkIfPopupSeen();
    this.initSpeech();
  }

  initSpeech(){
    let wind:any = window;
    try {
      var SpeechRecognition = wind.SpeechRecognition || wind.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
    }
    catch(e) {
      console.error(e);
    }

    let noteContent = '';

    this.recognition.continuous = true;
    this.recognition.onresult = (event) => {
      var current = event.resultIndex;
      var transcript = event.results[current][0].transcript;
      var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
      if(!mobileRepeatBug) {
        noteContent = transcript;
        this.data.filterInput = noteContent;
        this.methods.findElementsByName(noteContent);
      }
    };

    this.recognition.onstart = () => { 
      this.methods.showToast('Voice recognition activated. Try speaking into the microphone.');
    }
    
    this.recognition.onspeechend = () => {
      // this.methods.showToast('You were quiet for a while so voice recognition turned itself off.');
    }
    
    this.recognition.onerror = (event) => {
      if(event.error == 'no-speech') {
        this.methods.showToast('No speech was detected. Try again.');  
      };
    }
  }

  toggleSearch(){
    this.data.isSubHeaderOpened = !this.data.isSubHeaderOpened;
    this.data.isSubHeaderOpened ? document.body.classList.add('searchOpened') : document.body.classList.remove('searchOpened');
    this.data.isSubHeaderOpened ? this.headerS.setFocus() : document.querySelector<any>('.searchbar-input').blur();
  }

  startSpeech(){
    this.data.filterInput = '';
    this.recognition.start();
    this.isRecording = true;
  }

  stopSpeech(){
    this.recognition.stop();
    this.data.filterInput = '';
    this.methods.showToast('Voice recognition Stopped.');
    this.isRecording = false;
  }

}
