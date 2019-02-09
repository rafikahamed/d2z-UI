import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;
declare const require: any;

@Component({
  selector: 'broker-header',
  templateUrl: './broker-header.component.html',
  styleUrls: ['./broker-header.component.css']
})
export class BrokerHeaderComponent implements OnInit {
  
  childmenubrkOne: boolean;
  childmenubrkTwo:boolean;
  childmenubrkThree:boolean;
  childmenubrkFour:boolean;
  childmenubrkFive:boolean;
  englishFlag:boolean;
  chinessFlag:boolean;
  userName: String;

  constructor(
    public consigmentUploadService: ConsigmentUploadService
  ){}

  ngOnInit() {
    this.userName =  this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName : '';
    var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
    this.englishFlag = lanObject.englishFlag;
    this.chinessFlag = lanObject.chinessFlag;
    var menuSelection  = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    this.childmenubrkOne = menuSelection.childmenubrkOne;
    this.childmenubrkTwo = menuSelection.childmenubrkTwo;
    this.childmenubrkThree = menuSelection.childmenubrkThree;
    this.childmenubrkFour = menuSelection.childmenubrkFour;
    this.childmenubrkFive = menuSelection.childmenubrkFive;
  }

  broker_main(arrow) {
    var menubrkObj= this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    menubrkObj.childmenubrkOne = !this.childmenubrkOne;
    this.consigmentUploadService.menuBrokerSelection(menubrkObj);
    this.childmenubrkOne = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'].childmenubrkOne;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  broker_client(arrow) {
    var menubrkObj= this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    menubrkObj.childmenubrkTwo = !this.childmenubrkTwo;
    this.consigmentUploadService.menuBrokerSelection(menubrkObj);
    this.childmenubrkTwo = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'].childmenubrkTwo;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  broker_label(arrow) {
    
    var menubrkObj= this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    menubrkObj.childmenubrkThree = !this.childmenubrkThree;
    this.consigmentUploadService.menuBrokerSelection(menubrkObj);
    this.childmenubrkThree = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'].childmenubrkThree;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  broker_shipment(arrow){
    var menubrkObj= this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    menubrkObj.childmenubrkFour = !this.childmenubrkFour;
    this.consigmentUploadService.menuBrokerSelection(menubrkObj);
    this.childmenubrkFour = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'].childmenubrkFour;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  broker_api(arrow){
    var menubrkObj= this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    menubrkObj.childmenubrkFive = !this.childmenubrkFive;
    this.consigmentUploadService.menuBrokerSelection(menubrkObj);
    this.childmenubrkFive = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'].childmenubrkFive;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

}

