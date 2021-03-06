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
  selector: 'hms-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})

export class SuperUserAddClientComponent implements OnInit{
@ViewChild('myForm') myForm: NgForm;
      errorMsg: string;
      successMsg: String;
      brokerAddClientForm: FormGroup;
      serviceTypeArray: any[];
      originServiceTypeArray: any[];
      serviceTypeDeletedArray: any[];
      cities2: City[];  
      show: Boolean;
      categories: any[];
      directCategories: any[];
      userName: String;
      role_id: String;
      system: String;
      constructor(
        public trackingDataService : TrackingDataService,
        private spinner: NgxSpinnerService,
        public consignmenrServices: ConsigmentUploadService
      ){
        this.cities2 = [];
        this.show = false;
        this.serviceTypeArray = [];
        this.serviceTypeDeletedArray = [];
        this.errorMsg = null;
        this.brokerAddClientForm = new FormGroup({
            companyName: new FormControl(),
            addressLine1: new FormControl(),
            addressLine2: new FormControl(),
            city: new FormControl(),
            SubUrb: new FormControl(),
            state: new FormControl(),
            postcode: new FormControl(),
            country: new FormControl(),
            email: new FormControl(),
            userName: new FormControl(),
            password: new FormControl(),
            PhoneNumber: new FormControl()
      });
    }

    ngOnInit(){
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.consignmenrServices.mlidList( (resp) => {
        this.spinner.hide();
        this.categories = resp;
      })
      // this.categories = [
      //     {name: '1PS', value: '1PS'},
      //     {name: '2PS', value: '2PS'},
      //     {name: '3PS', value: '3PS'},
      //     {name: '4PS', value: '4PS'},
      //     {name: '5PS', value: '5PS'},
      //     {name: '1PM', value: '1PM'},
      //     {name: '1PME', value: '1PME'},
      //     {name: '1PM3', value: '1PM3'},
      //     {name: '1PP', value: '1PP'},
      //     {name: '1PS2', value: '1PS2'},
      //     {name: 'FWS', value: 'FWS'},
      //     {name: 'STS', value: 'STS'}
      // ];
      this.getLoginDetails();
    };

    getLoginDetails(){
      if(this.consignmenrServices.userMessage != undefined){
        this.userName = this.consignmenrServices.userMessage.userName;
        this.role_id = this.consignmenrServices.userMessage.role_Id;
      }
    };
resetClient()
{

this.myForm.resetForm();
  
}
    addClient(){
      let companyName = 'companyName';
      let contactName = 'contactName';
      let address = 'address';
      let suburb = 'suburb';
      let state = 'state';
      let postCode = 'postCode';
      let country = 'country';
      let emailAddress = 'emailAddress';
      let userName = 'userName';
      let password = 'password';
      let serviceType = 'serviceType';
      let PhoneNumber = 'PhoneNumber';
      let deletedServiceTypes = 'deletedServiceTypes';
      let contactPhoneNumber = 'contactPhoneNumber';
      let role_Id = 'role_Id';
      var importObj = (
        importObj={}, 
        importObj[companyName]= this.brokerAddClientForm.value.companyName != undefined ? this.brokerAddClientForm.value.companyName : '', importObj,
        importObj[contactName]= this.brokerAddClientForm.value.contactName != undefined ? this.brokerAddClientForm.value.contactName : '', importObj,
        importObj[address]= this.brokerAddClientForm.value.addressLine1 != undefined ?  
                        this.brokerAddClientForm.value.addressLine1 + ',' +this.brokerAddClientForm.value.addressLine2: '', importObj,
        importObj[suburb]= this.brokerAddClientForm.value.SubUrb != undefined ? this.brokerAddClientForm.value.SubUrb : '', importObj,
        importObj[state]= this.brokerAddClientForm.value.state != undefined ? this.brokerAddClientForm.value.state : '',  importObj,
        importObj[country]= this.brokerAddClientForm.value.country != undefined ? this.brokerAddClientForm.value.country : '', importObj,
        importObj[postCode]= this.brokerAddClientForm.value.postcode != undefined ? this.brokerAddClientForm.value.postcode : '', importObj,
        importObj[emailAddress]= this.brokerAddClientForm.value.email != undefined ? this.brokerAddClientForm.value.email : '',  importObj,
        importObj[userName]= this.brokerAddClientForm.value.userName != undefined ? this.brokerAddClientForm.value.userName : '', importObj,
        importObj[password]= this.brokerAddClientForm.value.password != undefined ? this.brokerAddClientForm.value.password : '', importObj,
        importObj[serviceType]= this.serviceTypeArray, importObj,
        importObj[deletedServiceTypes]= this.serviceTypeDeletedArray, importObj,
        importObj[contactPhoneNumber]= this.brokerAddClientForm.value.PhoneNumber, importObj,
        importObj[role_Id]= 2, importObj
    );
    this.spinner.show();
    this.trackingDataService.clientCreation(importObj, (resp) => {
        this.spinner.hide();
        if(!resp.error){
          this.successMsg = resp.message;
          this.show = false;
          $('#addClientModal').modal('show');
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      });
    }

    onChange(serviceType:string, isChecked: boolean) {
        if(isChecked) {
          this.serviceTypeArray.push(serviceType)
        } 
        else {
          let index = this.serviceTypeArray.indexOf(serviceType);
          this.serviceTypeArray.splice(index,1);
        }
    }
  
}


