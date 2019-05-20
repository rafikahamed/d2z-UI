import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;
declare const require: any;

@Component({
  selector: 'hms-super-main',
  templateUrl: './super-main.component.html',
  styleUrls: ['./super-main.component.css']
})

export class SuperUserMainComponent implements OnInit {

  userName: String;
  role_id: String;
  system: String;
  constructor(
    public consignmenrServices: ConsigmentUploadService
  ){
  }

  ngOnInit() {
    this.getLoginDetails();
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
  }

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  }

}


