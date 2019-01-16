import { Component, ElementRef, ViewChild, OnInit, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'app/d2z/service/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {AccordionModule} from 'primeng/accordion';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
declare var $: any;

@Component({
  selector: 'hms-track-parcel',
  templateUrl: './track-parcel.component.html',
  styleUrls: ['./track-parcel.component.css']
})
export class UtilitiesTrackParcel implements OnInit{
  
    trackParcelForm: FormGroup;
    childmenuOne: boolean;
    childmenuTwo:boolean;
    childmenuThree:boolean;
    childmenuFour:boolean;
    childmenuFive:boolean;
    errorMsg: string;
    successMsg: String;
    trackEvents:TrackEvent[];
    constructor(
      private spinner: NgxSpinnerService,
      public trackingDataService : TrackingDataService
    ) {
      this.trackParcelForm = new FormGroup({
        trackingNumber: new FormControl()
      });
    }
  
    ngOnInit() {
      this.childmenuOne = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
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
  
    sidebartoggle(arrow) {
      this.childmenuOne = !this.childmenuOne;
      if (arrow.className === 'nav-md') {
        arrow.className = '';
        arrow.className = 'nav-sm';
      }
      else {
        arrow.className = '';
        arrow.className = 'nav-md';
      }
    }

    trackParcel(){
      if(this.trackParcelForm.value.trackingNumber != null){
        this.spinner.show();
        var trackingData = this.trackParcelForm.value.trackingNumber.split("\n");
        var result = trackingData.join(',');
        this.trackingDataService.trackPracel(result, (resp) => {
          this.spinner.hide();
          this.trackEvents = resp;
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        })
      }else{
        this.errorMsg = '*Please enter the reference number to track the status of the parcel';
      }
    }
 
}

export interface TrackEvent {
  referenceNumber: string;
  barcodelabelNumber: string;
  consignmentCreated: String;
  shipmentCreated: String;
  heldByCustoms:String;
  clearedCustoms: String;
  received: String;
  processedByFacility:string;
  inTransit:string;
  delivered:string;
}

export interface TrackEventDetails {
  trackEventDetails: string;
  trackEventDateOccured: string;
}
