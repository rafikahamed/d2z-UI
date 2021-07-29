import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'hms-track-parcel',
  templateUrl: './track-parcel.component.html',
  styleUrls: ['./track-parcel.component.css']
})
export class TrackParcelComponent implements OnInit {
  trackParcelForm: FormGroup;
  errorMsg: string;
  successMsg: String;
  userMessage: userMessage;
  loginForm: FormGroup;
  trackEvents: track_event[];
  trackData: track_data;
  trackFalg: Boolean;
  refernceNumber: String;
  constructor(
    private spinner: NgxSpinnerService,
    public trackingDataService : TrackingDataService,
    public consigmentUploadService: ConsigmentUploadService,
    private router: Router
  ){
    this.trackParcelForm = new FormGroup({
      referenceNumber: new FormControl()
    });
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      passWord: new FormControl('', Validators.required)
    });
    this.trackFalg= false;
  };

  ngOnInit(){};

  trackSearch(){
    if(this.trackParcelForm.value.referenceNumber != null){
      this.spinner.show();
      var trackingData = this.trackParcelForm.value.referenceNumber.split("\n");
      var result = trackingData.join(',');
      this.trackingDataService.trackPracels(trackingData, (resp) => {
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
  };

  validateForm(){
    var input = $('.validate-input .input100');
    $('.validate-form').on('submit',function(){
        var check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        return check;
    });

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }
  }

  login() {
    this.validateForm();
    if(this.loginForm.status == 'VALID'){
      this.spinner.show();
      this.consigmentUploadService.authenticate(this.loginForm.value, (resp) => {
        this.userMessage = resp;
        this.spinner.hide();
        if(resp.role_Id == 3){
            this.router.navigate(['/main/']);
            this.consigmentUploadService.getLoginDetails(this.userMessage);
        }else if(resp.role_Id == 2){
            this.router.navigate(['/broker-main/']);
            this.consigmentUploadService.getLoginDetails(this.userMessage);
        }else if(resp.role_Id == 1 || resp.role_Id == 4 || resp.role_Id == 5){
            this.router.navigate(['/superuser-main/']);
            this.consigmentUploadService.getLoginDetails(this.userMessage);
        }
        this.userMessage = resp;
        setTimeout(() => {
        }, 5000);
      })
    }else{
      this.errorMsg = "Form is invalid";
    }
    $('#myModal').modal('toggle');
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

export interface userMessage {
  contactName,
  address,
  suburb,
  state,
  postCode,
  country,
  emailAddress,
  userName,
  serviceType,
  contactPhoneNumber,
  role_Id,
  companyName
}