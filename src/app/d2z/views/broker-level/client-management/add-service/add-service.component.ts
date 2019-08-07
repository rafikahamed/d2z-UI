import { Component,ElementRef,ViewChild, OnInit } from '@angular/core';
import { NgForm,FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

interface City {
    name: string;
    value: string;
}

@Component({
  selector: 'hms-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})

export class BrokerAddServiceComponent implements OnInit{
@ViewChild('myForm') myForm: NgForm;
      errorMsg: string;
      successMsg: String;
       system: String;
       show: Boolean;
      brokerAddServiceForm: FormGroup;
     
      constructor(
        public trackingDataService : TrackingDataService,
        private spinner: NgxSpinnerService,
        public consignmenrServices: ConsigmentUploadService
      ){
       
        this.errorMsg = null;
        this.show = false;
        this.brokerAddServiceForm = new FormGroup({
            userName: new FormControl(),
            serviceType: new FormControl()
            
      });
    }

    ngOnInit(){
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      
     
    };

   
resetService()
{

this.myForm.resetForm();
  
}
    addService(){
   if(this.brokerAddServiceForm.value.userName != null && this.brokerAddServiceForm.value.serviceType !=null )
{
this.spinner.show();

 
 this.consignmenrServices.adduserService(this.brokerAddServiceForm.value, (resp) => {
         this.spinner.hide();
        if(!resp.error){
          this.successMsg = resp.message;
          this.show = false;
          $('#addClientModal').modal('show');
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      })
      }
      else
      {
      this.errorMsg ="All fields are required";
      }


      }

   
  
}


