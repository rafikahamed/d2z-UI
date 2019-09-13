import { Component, OnInit, Compiler } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})

export class UpdateClientComponent implements OnInit{
      typeOneFlag: boolean;
      typeTwoFlag: boolean;
      typeThreeFlag: boolean;
      typeFourFlag: boolean;
      typeFiveFlag: boolean;
      typeSixFlag: boolean;
      typeSevenFlag: boolean;
      typeEightFlag: boolean;
      typeSubOneFlag: boolean;
      typeSubTwoFlag: boolean;
      typeSubThreeFlag: boolean;
      typeSubFourFlag: boolean;
      typeSubFiveFlag: boolean;
      typeSubSixFlag: boolean;
      typeSubSevenFlag: boolean;
 flag:boolean;
      oneCheckFlag: boolean;
      twoCheckFlag: boolean;
      threeCheckFlag: boolean;
      fourCheckFlag: boolean;
      fiveCheckFlag: boolean;
      sixCheckFlag: boolean;
      sevenCheckFlag: boolean;
      eightCheckFlag: boolean;
      subOneCheckFlag: boolean;
      subTwoCheckFlag: boolean;
      subThreeCheckFlag: boolean;
      subFourCheckFlag: boolean;
      subFiveCheckFlag: boolean;
      subSixCheckFlag: boolean;
      subSevenCheckFlag: boolean;
      errorMsg: string;
      successMsg: String;
      companyName: String;
      brokerAddClientForm: FormGroup;
      serviceTypeArray: any[];
      categories=[];
    servicecategories=[];
      serviceTypeDeletedArray: any[];
      companyDropdown: dropdownTemplate[]; 
      show: Boolean;
      directCategories : City[];
      originCategories: City[];
      userName: String;
      role_id: String;
      system: String;
      constructor(
         public trackingDataService : TrackingDataService,
         private spinner: NgxSpinnerService,
         public consignmenrServices: ConsigmentUploadService,
         private _compiler: Compiler
      ){
        this.companyDropdown = [];
        this.show = false;
        this._compiler.clearCache();
        this.serviceTypeArray = [];
        this.directCategories =[];
        this.originCategories = [];
        this.serviceTypeDeletedArray = [];
        this.categories = [];
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
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
    this.spinner.show();
    this.trackingDataService.companyList(this.consignmenrServices.userMessage.user_id, (resp) => {
      this.spinner.hide();
      this.companyDropdown = resp;
      this.companyName = this.companyDropdown[0] ? this.companyDropdown[0].value:'';
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    });
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

        this.categories.push({
                         "checked" : false,
                         "name":service_type,
                         "value":service_type
                       
                       });
        
     
    };
   
    this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  };

  onCompanyDropdownchange(event){
    this.companyName = event.value ? event.value.value: '';
  };

  companySearch(){
    this.spinner.show();
    this.servicecategories = [];
    this.trackingDataService.fetchClientDetails(this.companyName, this.role_id, (resp) => {
      this.brokerAddClientForm.controls['companyName'].setValue(resp.companyName);
      this.brokerAddClientForm.controls['addressLine1'].setValue(resp.address);
      this.brokerAddClientForm.controls['country'].setValue(resp.country);
      this.brokerAddClientForm.controls['email'].setValue(resp.emailAddress);
      this.brokerAddClientForm.controls['postcode'].setValue(resp.postCode);
      this.brokerAddClientForm.controls['state'].setValue(resp.state);
      this.brokerAddClientForm.controls['SubUrb'].setValue(resp.suburb);
      this.brokerAddClientForm.controls['userName'].setValue(resp.userName);
      this.brokerAddClientForm.controls['password'].setValue(resp.password);
      this.brokerAddClientForm.controls['PhoneNumber'].setValue(resp.contactPhoneNumber);
      this.brokerAddClientForm.controls['eBayToken'].setValue(resp.eBayToken);
      
      this.serviceTypeArray = resp.serviceType;

       for (var item in this.categories)
             {
               var Obj = this.categories[item];

              
this.flag =  resp.serviceType.includes(Obj.name) ? true : false;
 var ob = 'false';

 if(this.flag)
{
ob = 'true';
 
}
this.servicecategories.push({

                         'checked' : ob,
                         'name':Obj.name,
                         'value':Obj.value,
                       
                       });
               };
               this.categories = this.servicecategories;
      this.spinner.hide();
      setTimeout(() => {this.spinner.hide()}, 5000);
    })
  }

  updateClient(){
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
      let deletedServiceTypes = 'deletedServiceTypes';
      let contactPhoneNumber = 'contactPhoneNumber';
      let role_Id = 'role_Id';
      let eBayToken = 'eBayToken';
      let clientBroker = 'clientBroker';
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
        importObj[role_Id]= 3, importObj,
        importObj[contactPhoneNumber]= this.brokerAddClientForm.value.PhoneNumber, importObj,
        importObj[eBayToken]= this.brokerAddClientForm.value.eBayToken ? this.brokerAddClientForm.value.eBayToken: '', importObj,
        importObj[clientBroker]= this.consignmenrServices.userMessage.user_id ? this.consignmenrServices.userMessage.user_id: '', importObj
    );
     this.spinner.show();
     this.trackingDataService.updateClient(importObj, (resp) => {
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
 console.log(serviceType+"::"+isChecked);
        if(isChecked) {

         if(this.serviceTypeArray.indexOf(serviceType) == -1){
        this.serviceTypeArray.push(serviceType)
        let index = this.serviceTypeDeletedArray.indexOf(serviceType);
        this.serviceTypeDeletedArray.splice(index,1);
      }else{
        
      }    
    }
          
        
        else {
          let index = this.serviceTypeArray.indexOf(serviceType);
          this.serviceTypeArray.splice(index,1);

        
      console.log(index);
     
console.log(this.serviceTypeArray);
      this.serviceTypeDeletedArray.push(serviceType);
        }
    }

  
}

interface dropdownTemplate {
  name: string;
  value: string;
};

interface City {
name: string;
value: string;
};