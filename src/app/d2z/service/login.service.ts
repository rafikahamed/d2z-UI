import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

// const baseUrl = "http://18.216.201.118:8080/v1/d2z";
const baseUrl = "https://www.d2z.com.au/v1/d2z";
// const baseUrl = "http://localhost:8080/v1/d2z";

@Injectable()
export class LoginService implements OnInit{

  userMessage: userMessage;
  constructor(
      private http: HttpClient, 
      private router: Router
  ){ }

  ngOnInit() {}
  
  authenticate( loginObject, callback): any {
    this.http.get(baseUrl+'/login', {
      params: { userName: loginObject.userName, passWord: loginObject.passWord  }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
        this.userMessage = resp;
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      console.error(error);
    });
  }
}

export interface userMessage {
  message,
  userName,
  access,
  companyName,
  userCode
}
