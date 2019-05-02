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
  client: boolean;
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
  reportDelivery: boolean;
  userName: String;

  constructor(
    public consigmentUploadService: ConsigmentUploadService
  ){}

  ngOnInit() {
    this.userName =  this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName : '';
    var menuSelection  = this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    this.childmenuSuperOne = menuSelection.childmenuSuperOne;
    this.childmenuSuperTwo = menuSelection.childmenuSuperTwo;
    this.childmenuSuperThree = menuSelection.childmenuSuperThree;
    this.childmenuSuperFour = menuSelection.childmenuSuperFour;
    this.childmenuSuperFive = menuSelection.childmenuSuperFive;
    this.childmenuSuperSix = menuSelection.childmenuSuperSix;
    var role = this.consigmentUploadService.userMessage.role_Id;
    if(role == 1){
      this.client = true;
      this.clientAdd = true;
      this.clientUpdate = true;
      this.tracking = true;
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
      this.invoiceNonD2z= true;
      this.reports= true;
      this.reportShipment= true;
      this.reportLog= true;
      this.reportDelivery = true;
    }else if(role == 4){
      this.tracking = true;
      this.trackingArrival = true;
      this.invoices= true;
      this.invoicePending= true;
      this.invoiceNonD2z= true;
      this.reports= true;
      this.reportDelivery = true;
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
}

