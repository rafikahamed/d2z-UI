import { Component, AfterContentChecked, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
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
  userId: String;
  consignmentsCreated: String;
  consignmentsManifested: String;
  consignmentsNumberManifests: String;
  consignmentsDeleted: String;
  consignmentsDelivered: String;

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
    this.userId =  this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id : '';
    this.spinner.show();
    this.consigmentUploadService.clientHome(this.userId, (resp) => {
      this.spinner.hide();
      this.consignmentsCreated = resp.consignmentsCreated;
      this.consignmentsManifested = resp.consignmentsManifested;
      this.consignmentsNumberManifests = resp.consignmentsManifests;
      this.consignmentsDeleted = resp.consignmentsDeleted;
      this.consignmentsDelivered = resp.consignmentDelivered;
    });
  };

}

