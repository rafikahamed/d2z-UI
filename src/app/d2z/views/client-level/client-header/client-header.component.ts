import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;
declare const require: any;

@Component({
  selector: 'client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css']
})
export class ClientHeaderComponent implements OnInit {
  
  childmenuOne: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  englishFlag:boolean;
  chinessFlag:boolean;
  userName: String;

  constructor(
    public consigmentUploadService: ConsigmentUploadService
  ){}

  ngOnInit() {
    this.childmenuOne = false;
    this.childmenuTwo = false;
    this.childmenuThree = false;
    this.childmenuFour  = false;
    this.childmenuFive = false;
    this.userName =  this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName : '';
    var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
    this.englishFlag = lanObject.englishFlag;
    this.chinessFlag = lanObject.chinessFlag;
  }

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

  englishVer(){
    var lanFlag = "english";
    this.englishFlag = true;
    this.chinessFlag = false;
    var englishObj = { "englishFlag":true, "chinessFlag":false }
    this.consigmentUploadService.versionFlag(englishObj);
  }

  chinessVer(){
    var lanFlag = "chiness";
    this.chinessFlag = true;
    this.englishFlag = false;
    var chinessObj = { "englishFlag":false, "chinessFlag":true }
    this.consigmentUploadService.versionFlag(chinessObj);
  }

}

