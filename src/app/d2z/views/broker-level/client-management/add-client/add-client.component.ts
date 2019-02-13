import { Component, OnInit, Compiler } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})

export class AddClientComponent implements OnInit{
      errorMsg: string;
      successMsg: String;
      brokerAddClientForm: FormGroup;
      serviceTypeArray: any[];
      serviceTypeDeletedArray: any[];
      cities2: City[];  
      show: Boolean;
      userName: String;
      role_id: String;
      directCategories : City[];
      originCategories: City[];
      constructor(
         public trackingDataService : TrackingDataService,
         private spinner: NgxSpinnerService,
         public consignmenrServices: ConsigmentUploadService,
         private _compiler: Compiler
      ){
        this.cities2 = [];
        this._compiler.clearCache();
        this.directCategories =[];
        this.originCategories = [];
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
            PhoneNumber: new FormControl(),
            eBayToken: new FormControl()
       });
  }

  ngOnInit(){
    for (var i = 0; i < this.consignmenrServices.userMessage.serviceType.length; i++) {
      var service_type = this.consignmenrServices.userMessage.serviceType[i];
      if(service_type === 'UnTracked'){
        this.originCategories.push({
           "name" : service_type,"value"  : service_type
        })
      }else{
          this.directCategories.push({
            "name" : service_type, "value"  : service_type
          })
      }
    };
    this.cities2 = [
        {name: 'Australia', value: 'au'},
        {name: 'Austria', value: 'at'},
        {name: 'China', value: 'cn'},
        {name: 'United Arab Emirates', value: 'ae'},
        {name: 'United Kingdom', value: 'gb'},
        {name: 'United States', value: 'us'}
    ];
    this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  };

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
      let clientBroker = 'clientBroker';
      let role_Id = 'role_Id';
      let eBayToken = 'eBayToken';
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
        importObj[eBayToken]= this.brokerAddClientForm.value.eBayToken ? this.brokerAddClientForm.value.eBayToken: '', importObj,
        importObj[serviceType]= this.serviceTypeArray, importObj,
        importObj[deletedServiceTypes]= this.serviceTypeDeletedArray, importObj,
        importObj[contactPhoneNumber]= this.brokerAddClientForm.value.PhoneNumber, importObj,
        importObj[role_Id]= 3, importObj,
        importObj[clientBroker]= this.consignmenrServices.userMessage.user_id ? this.consignmenrServices.userMessage.user_id: '', importObj 
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
      })
  }

  onChange(serviceType:string, isChecked: boolean) {
    if(isChecked) {
      this.serviceTypeArray.push(serviceType)
    } else {
      let index = this.serviceTypeArray.indexOf(serviceType);
      this.serviceTypeArray.splice(index,1);
    }
  }
  
}

interface City {
  name: string;
  value: string;
}




