import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'super-user-header',
  templateUrl: './super-user-header.component.html',
  styleUrls: ['./super-user-header.component.css']
})
export class SuperUserHeaderComponent implements OnInit {
  
  englishFlag:boolean;
  chinessFlag:boolean;
  childmenuSuperOne: boolean;
  childmenuSuperTwo: boolean;
  childmenuSuperThree: boolean;
  childmenuSuperFour: boolean;
  childmenuSuperFive: boolean;
  childmenuSuperSix:boolean;
  childmenuSuperSeven:boolean;
  childmenuSuperEight:boolean;
  childmenuSuperNine:boolean;

   childmenuSuperTwelve:boolean;

  childmenuSuperTen:boolean;
  childmenuSuperEleven: boolean;

  client: boolean;
  mlid:boolean;
  incomingJob:boolean;
  addShipment :boolean;
  outstandingShipment:boolean;
  incomingShipment:boolean;
  releaseparcel:boolean;
  heldparcel:boolean;
  updateparcel:boolean;

  auweight:boolean;
  clientAdd: boolean;
  clientUpdate: Boolean;
  tracking: boolean;
  trackingUpload: boolean;
  trackingArrival: boolean;
  rates: boolean;
  ratesAdd: boolean;
  ratesUpdate: boolean;
  ratesD2z: boolean;
  invoices: boolean;
  invoicePending: boolean;
  invoiceReconcile: boolean;
  invoiceNotBilled: boolean;
  invoiceNonD2z: boolean;
  reports: boolean;
  reportShipment: boolean;
  reportLog: boolean;
  reportZone: boolean;
  reportDelivery: boolean;
  labels: boolean;
  enquiry: boolean;
  returns: boolean;
  scanReturns: boolean;
  outstandingReturns: boolean;
  actionReturns: boolean;
  openEnquiry: boolean;
  completedEnquiry: boolean;
  zebraPrint: boolean;
  zebraPdf: boolean;
  superUserHome: boolean;
  superUserHomeInfo: boolean;
  userName: String;
  pageSwitch: String;

  constructor(
    public consigmentUploadService: ConsigmentUploadService
  ){}

  ngOnInit() {
    this.pageSwitch = document.location.hostname.includes("speedcouriers.com.au") == true ? "/login" :"/home";
    this.userName =  this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName : '';
    var menuSelection  = this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    this.childmenuSuperOne = menuSelection.childmenuSuperOne;
    this.childmenuSuperTwo = menuSelection.childmenuSuperTwo;
    this.childmenuSuperThree = menuSelection.childmenuSuperThree;
    this.childmenuSuperFour = menuSelection.childmenuSuperFour;
    this.childmenuSuperFive = menuSelection.childmenuSuperFive;
    this.childmenuSuperSix = menuSelection.childmenuSuperSix;
    this.childmenuSuperSeven = menuSelection.childmenuSuperSeven;
    this.childmenuSuperEight = menuSelection.childmenuSuperEight;
    this.childmenuSuperNine = menuSelection.childmenuSuperNine;

    this.childmenuSuperTen = menuSelection.childmenuSuperTen;
    this.childmenuSuperEleven = menuSelection.childmenuSuperEleven;
    this.childmenuSuperTwelve = menuSelection.childmenuSuperTwelve;

    var role = this.consigmentUploadService.userMessage.role_Id;
    if(role == 1){
      this.superUserHome = true;
      this.superUserHomeInfo = true;
      this.client = true;
      this.clientAdd = true;
      this.mlid = true;
      this.auweight = false;
      this.clientUpdate = true;
      this.tracking = false;
      this.trackingUpload = true;
      this.trackingArrival = true;
      this.rates= true;
      this.ratesAdd= true;
      this.ratesUpdate= true;
      this.ratesD2z= true;
      this.invoices= true;
      this.invoicePending= true;
      this.invoiceReconcile= true;
      this.invoiceNotBilled= true;
      this.invoiceNonD2z= false;
      this.reports= true;
      this.reportShipment= true;
      this.reportLog= true;
      this.reportZone= true;
      this.reportDelivery = true;
      this.labels= true;
      this.zebraPrint= true;
      this.zebraPdf= true;

      this.incomingJob = true;
      this.addShipment = true;
      this.incomingShipment = true;
      this.outstandingShipment = true;
      this.releaseparcel=true;
      this.heldparcel=true;
      this.updateparcel=true;

      this.enquiry= true;
      this.openEnquiry= true;
      this.completedEnquiry= true;
      this.returns = true;
      this.scanReturns = true;
      this.outstandingReturns = true;
      this.actionReturns = true;
    }else if(role == 4){
      this.superUserHome = true;
      this.superUserHomeInfo = true;
      this.tracking = false;
      this.trackingArrival = false;
      this.reports= true;
      this.reportShipment = true;
      this.auweight = false;
      this.labels= true;
      this.zebraPrint= true;
      this.zebraPdf= true;
      this.enquiry= true;
      this.openEnquiry= true;
      this.completedEnquiry= true;
      this.returns = true;
      this.scanReturns = true;
      this.outstandingReturns = true;
      this.actionReturns = true;
      this.incomingJob = true;
      this.addShipment = true;
      this.incomingShipment = true;
      this.outstandingShipment = true;
      this.releaseparcel=true;
      this.heldparcel=true;
      this.updateparcel=true;
    }else if(role == 5){
      this.superUserHome = false;
      this.superUserHomeInfo = false;
      this.returns = true;
      this.scanReturns = true;
      this.outstandingReturns = false;
      this.actionReturns = true;
    }
  }

  super_user(arrow) {
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperOne = !this.childmenuSuperOne;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperOne = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperOnes;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }
super_user_incomingJob(arrow) {
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperTwelve = !this.childmenuSuperTwelve;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperTwelve= this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperTwelve;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }
  super_user_zebra(arrow) {
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperTwo = !this.childmenuSuperTwo;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperTwo = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperTwo;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  super_user_utils(arrow) {
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperThree = !this.childmenuSuperThree;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperThree = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperThree;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  super_user_rates(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperFour = !this.childmenuSuperFour;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperFour = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperFour;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }
super_user_mlid(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperSeven = !this.childmenuSuperSeven;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperSeven = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperSeven;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }
super_user_auweight(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperNine = !this.childmenuSuperNine;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperNine = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperNine;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }
  super_user_invoices(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperFive = !this.childmenuSuperFive;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperFive = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperFive;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }
 super_user_reports(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperSix = !this.childmenuSuperSix;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperSix = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperSix;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  super_user_labels(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperEight = !this.childmenuSuperEight;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperEight = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperEight;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  super_user_enquiry(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperTen = !this.childmenuSuperTen;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperTen = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperTen;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  super_user_returns(arrow){
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperEleven = !this.childmenuSuperEleven;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperEleven = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperEleven;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

}

