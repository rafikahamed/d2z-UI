import { Component, ElementRef, ViewChild, OnInit, ViewEncapsulation, Compiler} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from 'app/d2z/service/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {AccordionModule} from 'primeng/accordion';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-brokertrack-parcel',
  templateUrl: './track-parcel.component.html',
  styleUrls: ['./track-parcel.component.css']
})
export class BrokerTrackParcelComponent implements OnInit{
    trackParcelForm: FormGroup;
    showEvents:boolean;
    showDownload: boolean;
    errorMsg: string;
    successMsg: String;
    trackEvents:TrackEvent[];
  
    constructor(
      private spinner: NgxSpinnerService,
      public trackingDataService : TrackingDataService,
      public consigmentUploadService: ConsigmentUploadService,
      private router: Router,
      private _compiler: Compiler
    ) {
      this._compiler.clearCache();
      this.showEvents = false;
      this.trackParcelForm = new FormGroup({
        trackingNumber: new FormControl()
      });
    }
  
    ngOnInit() {
      this.showEvents = true;
      this.showDownload = false;
     
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
          console.log(this.trackEvents);
          this.showEvents = this.trackEvents[0].referenceNumber ? true : false;
          this.showDownload = this.trackEvents[0].referenceNumber ? true : false;
          setTimeout(() => {this.spinner.hide()}, 5000);
        })
      }else{
        this.errorMsg =  '*Please enter the reference number to track the status of the parcel';
      }
    }

    downloadTrackingDetails(){
        this.errorMsg= null;
        this.successMsg= null;
        var trackingList = [];
        let ReferenceNumber = 'Reference Number';
        let BarCodeLabelNumber='BarCode Label Number';
        let EventName = 'Event Name';
        let EventTime = 'Event Time';

        for (var importVal in this.trackEvents) {
          var adminObj = this.trackEvents[importVal];
            for(var i in adminObj.trackingEvents){
             if(JSON.stringify(i) == JSON.stringify("0")){
         
            var trackdata = adminObj.trackingEvents[i];
                var importObj = (
                importObj={}, 
                importObj[ReferenceNumber]= adminObj.referenceNumber != null ? adminObj.referenceNumber: '', importObj,
                importObj[BarCodeLabelNumber]= adminObj.barcodelabelNumber != null ? adminObj.barcodelabelNumber: '', importObj,
                importObj[EventTime]= trackdata.trackEventDateOccured != null ? "'"+trackdata.trackEventDateOccured+"'": '', importObj,
                importObj[EventName]= trackdata.eventDetails != null ? trackdata.eventDetails: '', importObj);
                trackingList.push(importObj)
                }
                }
            };

            var currentTime = new Date();
            var fileName = '';
                fileName = "Export_Tracking"+"-"+currentTime.toLocaleDateString();
              var options = { 
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true, 
                useBom: true,
                headers: [ 'Reference Number',  'Article Id' ,'Event Time','Event Name']
          };
          new Angular2Csv(trackingList, fileName, options);  
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
  trackingEvents: any[];

}

export interface TrackEventDetails {
  trackEventDetails: string;
  trackEventDateOccured: string;
}