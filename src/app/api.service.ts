import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient, private data:DataService, private platform:Platform) { }

  get(endPoint, params?:any, headers?:any){
    return this.http.get(`${this.data.apiUrlNew}${endPoint}`, {params:params ? params : '', headers:headers?headers:''});
  }
  getFromRoot(url, params?:any, headers?:any){
    return this.http.get(url, {params:params ? params : '', headers:headers?headers:''});
  }
  post(endPoint, body?:any, headers?:any){
    return this.http.post(`${this.data.apiUrlNew}${endPoint}`, body ? body : '', {headers:headers?headers:''});
  }
  postToRoot(url, body?:any, headers?:any){
    return this.http.post(url, body ? body : '', {headers:headers?headers:''});
  }
}
