import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';

// const baseUrl = "http://localhost:8080/v1/d2z";
// const baseUrl = "http://18.220.140.225:8080/v1/d2z";
const baseUrl = "https://www.d2z.com.au/v1/d2z";

@Injectable()
export class UserService {
  
  userMessage: userMessage;
  arnRegister: ArnRegister;
  constructor(private http: HttpClient, private router: Router) {}
  
  arnRegistration( arnObject, fileName, callback): any {
   var array = [];
    console.log(arnObject)
    array.push(arnObject)
    this.http.post(baseUrl+'/arnRegistration',array
    ).subscribe((resp:ArnRegister) => {
      callback(resp);
      if (resp) {
        this.arnRegister = resp;
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

export interface ArnRegister {
  businessType: string;
  legalName: string;
  authrorizedConatct: string;
  phoneNumber: string;
  postalAddress: string;
  emailAddress: string;
  subUrb: string;
  postCode: string;
  country: string;
  websiteName: string;
  tanNumber: string;
  message: String;
}
