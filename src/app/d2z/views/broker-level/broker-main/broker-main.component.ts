import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'app/d2z/service/login.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;
declare const require: any;

@Component({
  selector: 'hms-broker-main',
  templateUrl: './broker-main.component.html',
  styleUrls: ['./broker-main.component.css']
})

export class BrokerMainComponent implements OnInit {

  childmenuOne: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  userName: String;
  role_id: String;
  constructor(
    public consignmenrServices: ConsigmentUploadService
  ){}

  ngOnInit() {
    this.childmenuOne = false;
    this.childmenuTwo = false;
    this.childmenuThree = false;
    this.childmenuFour  = false;
    this.childmenuFive = false;
    this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  };

  toggle(arrow) {
    this.childmenuOne = !this.childmenuOne;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_zebra(arrow) {
    this.childmenuTwo = !this.childmenuTwo;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }


  toggle_pdf(arrow) {
    this.childmenuThree = !this.childmenuThree;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_utilities(arrow){
    this.childmenuFour = !this.childmenuFour;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_maniFest(arrow){
    this.childmenuFive = !this.childmenuFive;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  sidebartoggle(arrow) {
    this.childmenuOne = !this.childmenuOne;
    if (arrow.className === 'nav-md') {
      arrow.className = '';
      arrow.className = 'nav-sm';
    }
    else {
      arrow.className = '';
      arrow.className = 'nav-md';
    }
  }

}

