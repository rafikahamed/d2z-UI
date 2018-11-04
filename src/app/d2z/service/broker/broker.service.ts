import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

// const baseUrl = "http://localhost:8080/v1/d2z";
const baseUrl = "https://www.d2z.com.au/v1/d2z";

@Injectable()
export class BrokerService implements OnInit{

  userMessage: userMessage;
  constructor(
      private http: HttpClient, 
      private router: Router
  ){ }

  ngOnInit(){}
  
}

export interface userMessage {
  message,
  userName,
  access,
  companyName,
  userCode
}
