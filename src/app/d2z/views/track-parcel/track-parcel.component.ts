import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'hms-track-parcel',
  templateUrl: './track-parcel.component.html',
  styleUrls: ['./track-parcel.component.css']
})
export class TrackParcelComponent implements OnInit {
  trackParcelForm: FormGroup;
  errorMsg: string;
  successMsg: String;
  trackEvents: track_event[];
  trackData: track_data;
  trackFalg: Boolean;
  refernceNumber: String;
  constructor(
    private spinner: NgxSpinnerService,
    public trackingDataService : TrackingDataService
  ){
    this.trackParcelForm = new FormGroup({
      referenceNumber: new FormControl()
    });
    this.trackFalg= false;
  };

  ngOnInit(){};

  trackSearch(){
    if(this.trackParcelForm.value.referenceNumber != null){
      this.spinner.show();
      var trackingData = this.trackParcelForm.value.referenceNumber.split("\n");
      var result = trackingData.join(',');
      this.trackingDataService.trackPracel(result, (resp) => {
        this.spinner.hide();
        this.trackData = resp;
        if(resp){
          this.trackFalg = true;
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      })
    }else{
      this.errorMsg = '*Please enter the reference number to track the status of the parcel';
    }
  }

}

export interface track_data {
  barcodelabelNumber: string;
  referenceNumber: string;
  track_event: track_event[];
};

export interface track_event {
  eventDetails: string;
  trackEventDateOccured: string;
};
