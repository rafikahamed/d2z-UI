import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { BrokerService } from 'app/d2z/service/broker/broker.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
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
      constructor(
        public brokerService: BrokerService,
        public trackingDataService : TrackingDataService,
        private spinner: NgxSpinnerService
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
      this.categories = [
          {name: '1PA', value: '1PA'},
          {name: '2PA', value: '2PA'},
          {name: '3PA', value: '3PA'},
          {name: '4PA', value: '4PA'},
          {name: '5PA', value: '5PA'}
      ];
      this.directCategories = [
        {name: 'UnTracked', value: 'unTracked'}
      ];
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
        } else {
          let index = this.serviceTypeArray.indexOf(serviceType);
          this.serviceTypeArray.splice(index,1);
          this.serviceTypeDeletedArray.push(serviceType);
        }
    };

    // onOriginChange(originServiceType:string, isChecked: boolean){
    //     if(isChecked) {
    //       this.originServiceTypeArray.push(originServiceType);
    //     } else {
    //       let index = this.originServiceTypeArray.indexOf(originServiceType);
    //       this.originServiceTypeArray.splice(index,1);
    //       this.serviceTypeDeletedArray.push(originServiceType);
    //     }
    // }
  
}


