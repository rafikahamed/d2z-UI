import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

const hostname = document.location.hostname;
const apiName = document.location.hostname.includes("speedcouriers.com.au") == true ? "speedcouriers" : "d2z";
const baseUrl = "https://"+hostname+"/v1/d2z";
//const baseUrl = "http://"+hostname+":8080/v1/"+apiName;
 //const baseUrl = "http://18.220.140.225:8080/v1/d2z";
// const baseUrl = "http://52.65.135.232:8080/v1/d2z";
//const baseUrl = "http://54.252.222.216:5000/v1/d2z"; 
//const baseUrl = "https://"+hostname+"/v1/"+apiName;
//const baseUrl = "https://www.d2z.com.au"+"/v1/"+apiName;
//const baseUrl = "http://localhost:8080/v1/d2z";
//const baseUrl = "http://18.220.140.225:8080/v1/d2z";
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
