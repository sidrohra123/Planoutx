import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class RequestinterceptorService implements HttpInterceptor {

  constructor(public data:DataService) { }

  intercept(req:HttpRequest<any>, next:HttpHandler) : Observable<HttpEvent<any>>{
    this.data.multilottieConfig['path'] = this.data.loadingAnimPaths[Math.floor(Math.random()*this.data.loadingAnimPaths.length)];
    return next.handle(req);
  }
}
