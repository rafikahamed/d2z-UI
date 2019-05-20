import { Component, AfterContentChecked, OnInit, Compiler } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  system: String;

  constructor(
    public consignmenrServices: ConsigmentUploadService,
    private _compiler: Compiler
  ){
    this._compiler.clearCache();
  }

  ngOnInit() {
    this.getLoginDetails();
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
  };

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  }

}

