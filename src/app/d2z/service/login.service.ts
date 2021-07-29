import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

const hostname = document.location.hostname;
const apiName = document.location.hostname.includes("speedcouriers.com.au") == true ? "speedcouriers" : "d2z";


//const baseUrl = "https://d2ztracking.com.au/v1/d2z"; 
const baseUrl = "https://"+hostname+"/v1/d2z";
//const baseUrl = "http://www.d2ztest.com.au:8080/v1/d2z"; 
//const baseUrl = "http://localhost:8080/v1/d2z"
@Injectable()
export class LoginService implements OnInit{

  userMessage: userMessage;
  constructor(
      private http: HttpClient, 
      private router: Router
  ){}

  ngOnInit() {}
  
  authenticate( loginObject, callback): any {
  console.log("in login");
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
