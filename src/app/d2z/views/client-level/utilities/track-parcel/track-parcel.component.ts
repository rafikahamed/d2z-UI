import { Component, ElementRef, ViewChild, OnInit, ViewEncapsulation, Compiler} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from 'app/d2z/service/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {AccordionModule} from 'primeng/accordion';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-track-parcel',
  templateUrl: './track-parcel.component.html',
  styleUrls: ['./track-parcel.component.css']
})
export class UtilitiesTrackParcel implements OnInit{
    trackParcelForm: FormGroup;
    showEvents:boolean;
    errorMsg: string;
    successMsg: String;
    trackEvents:TrackEvent[];
    englishFlag:boolean;
    chinessFlag:boolean;
    constructor(
      private spinner: NgxSpinnerService,
      public trackingDataService : TrackingDataService,
      public consigmentUploadService: ConsigmentUploadService,
      private router: Router,
      private _compiler: Compiler
    ) {
      this._compiler.clearCache();
      this.trackParcelForm = new FormGroup({
        trackingNumber: new FormControl()
      });
    }
  
    ngOnInit() {
      this.showEvents = true;
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
    };

    trackParcel(){
      this.errorMsg= null;
      this.successMsg= null;
      if($("#trackId").val().length >1){
        this.spinner.show();
        var trackingData = this.trackParcelForm.value.trackingNumber.split("\n");
        var result = trackingData.join(',');
        this.trackingDataService.trackPracel(result, (resp) => {
          this.spinner.hide();
          this.trackEvents = resp;
          this.showEvents = this.trackEvents[0].referenceNumber ? true : false;
          setTimeout(() => {this.spinner.hide()}, 5000);
        })
      }else{
        this.errorMsg = this.englishFlag ? '*Please enter the reference number to track the status of the parcel' : '请输入参考编号来追踪包裹的状态';
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
