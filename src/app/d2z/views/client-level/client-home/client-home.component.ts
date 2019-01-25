import { Component, AfterContentChecked, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import 'rxjs/add/operator/filter';
import { LoginService } from 'app/d2z/service/login.service';
declare var $: any;
declare const require: any;

@Component({
  selector: 'client-main',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {
  childmenuOne: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  englishFlag:boolean;
  chinessFlag:boolean;

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    private spinner: NgxSpinnerService
  ){}

  ngOnInit() {
    this.childmenuOne = false;
    this.childmenuTwo = false;
    this.childmenuThree = false;
    this.childmenuFour  = false;
    this.childmenuFive = false;
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

}

