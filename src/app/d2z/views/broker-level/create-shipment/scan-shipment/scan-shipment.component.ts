import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { BrokerService } from 'app/d2z/service/broker/broker.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-scan-shipment',
  templateUrl: './scan-shipment.component.html',
  styleUrls: ['./scan-shipment.component.css']
})
export class ScanShipmentComponent implements OnInit{
  shipmentScanForm: FormGroup;
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  manifestNumber: string;
  errorMsg: string;
  successMsg: String;
  show: Boolean;
  userName: String;
  role_id: String;
  ManifestArray: dropdownTemplate[];  
  selectedManifest: dropdownTemplate;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public brokerService: BrokerService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService
  ) {
    this.show = false;
    this.shipmentScanForm = new FormGroup({
      referenceNumber: new FormControl(),
      shipmentNumber: new FormControl()
    });
  }

  ngOnInit() {
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };

  scanShipment(){
    this.errorMsg = null;
    this.successMsg = '';
    if(this.shipmentScanForm.value.shipmentNumber == null || this.shipmentScanForm.value.shipmentNumber == ''){
      this.errorMsg = "**Please Enter the Shipment Number";
    }
    if(this.shipmentScanForm.value.referenceNumber == null || this.shipmentScanForm.value.referenceNumber == ''){
      this.errorMsg = "**Please Enter the Reference Number";
    }
    if(this.errorMsg == null ){
      var referenceNumberData = this.shipmentScanForm.value.referenceNumber.split("\n");
      var refrenceNumList = referenceNumberData.join(',');
        this.spinner.show();
        this.trackingDataService.shipmentAllocation(refrenceNumList, this.shipmentScanForm.value.shipmentNumber, (resp) => {
          this.spinner.hide();
          this.successMsg = resp.message;
          $('#scanShipmentModal').modal('show');
          if(!resp){
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
  }

  toggle(arrow) {
    this.childmenu = !this.childmenu;
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
    this.childmenu = !this.childmenu;
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


