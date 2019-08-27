import { Component, AfterContentChecked, OnInit, Compiler } from '@angular/core';
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
  childmenuSix:boolean;
  childmenuSeven:boolean;
  englishFlag:boolean;
  chinessFlag:boolean;
  userName: String;
  pageSwitch: String;

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    private _compiler: Compiler
  ){
    this._compiler.clearCache();
  }

  ngOnInit() {
    this.pageSwitch = document.location.hostname.includes("speedcouriers.com.au") == true ? "/login" :"/home";
    console.log(this.pageSwitch);
    this.userName =  this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName : '';
    var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
    this.englishFlag = lanObject.englishFlag;
    this.chinessFlag = lanObject.chinessFlag;
    var menuSelection  = this.consigmentUploadService.menuSourceSelection.source['_value'];
    this.childmenuOne = menuSelection.childmenuOne;
    this.childmenuTwo = menuSelection.childmenuTwo;
    this.childmenuThree = menuSelection.childmenuThree;
    this.childmenuFour = menuSelection.childmenuFour;
    this.childmenuFive = menuSelection.childmenuFive;
    this.childmenuSix = menuSelection.childmenuSix;
    this.childmenuSeven = menuSelection.childmenuSeven;

  }

  toggle(arrow) {
    var menuObj= this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuObj.childmenuOne = !this.childmenuOne;
    this.consigmentUploadService.menuSelection(menuObj);
    this.childmenuOne = this.consigmentUploadService.menuSourceSelection.source['_value'].childmenuOne;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_zebra(arrow) {
    var menuObj= this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuObj.childmenuTwo = !this.childmenuTwo;
    this.consigmentUploadService.menuSelection(menuObj);
    this.childmenuTwo = this.consigmentUploadService.menuSourceSelection.source['_value'].childmenuTwo;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_pdf(arrow) {
    var menuObj= this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuObj.childmenuThree = !this.childmenuThree;
    this.consigmentUploadService.menuSelection(menuObj);
    this.childmenuThree = this.consigmentUploadService.menuSourceSelection.source['_value'].childmenuThree;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_utilities(arrow){
    var menuObj= this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuObj.childmenuFour = !this.childmenuFour;
    this.consigmentUploadService.menuSelection(menuObj);
    this.childmenuFour = this.consigmentUploadService.menuSourceSelection.source['_value'].childmenuFour;
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
    var menuObj= this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuObj.childmenuFive = !this.childmenuFive;
    this.consigmentUploadService.menuSelection(menuObj);
    this.childmenuFive = this.consigmentUploadService.menuSourceSelection.source['_value'].childmenuFive;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_enquiry(arrow){
    var menuObj= this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuObj.childmenuSix = !this.childmenuSix;
    this.consigmentUploadService.menuSelection(menuObj);
    this.childmenuSix = this.consigmentUploadService.menuSourceSelection.source['_value'].childmenuSix;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_returns(arrow){
    var menuObj= this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuObj.childmenuSeven = !this.childmenuSeven;
    this.consigmentUploadService.menuSelection(menuObj);
    this.childmenuSeven = this.consigmentUploadService.menuSourceSelection.source['_value'].childmenuSeven;
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

