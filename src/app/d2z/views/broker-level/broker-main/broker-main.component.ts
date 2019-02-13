import { Component, AfterContentChecked, OnInit, Compiler } from '@angular/core';
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
  userName: String;
  role_id: String;
  constructor(
    public consignmenrServices: ConsigmentUploadService,
    private _compiler: Compiler
  ){
    this._compiler.clearCache();
  }

  ngOnInit() {
    this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  }

}

