import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { BrokerService } from 'app/d2z/service/broker/broker.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
declare var $: any;

interface dropdownTemplate {
    name: string;
    value: string;
}

@Component({
  selector: 'hms-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})

export class SuperUserUpdateClientComponent implements OnInit{
    childmenu: boolean;
    childmenuTwo:boolean;
    childmenuThree:boolean;
    childmenuFour:boolean;
    childmenuFive:boolean;
    oneFlag: boolean;
    twoFlag: boolean;
    threeFlag: boolean;
    fourFlag: boolean;
    fiveFlag: boolean;
    sixFlag: boolean;
      errorMsg: string;
      successMsg: String;
      companyName: String;
      brokerAddClientForm: FormGroup;
      serviceTypeArray: any[];
      directCategories: any[];
      serviceTypeDeletedArray: any[];
      companyDropdown: dropdownTemplate[];  
      selectedCompany: dropdownTemplate;
      show: Boolean;
      categories: any[];
      constructor(
         public brokerService: BrokerService,
         public trackingDataService : TrackingDataService,
         private spinner: NgxSpinnerService
      ){
        this.companyDropdown = [];
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
    this.childmenuTwo = false;
    this.childmenuThree = false;
    this.childmenuFour  = false;
    this.childmenuFive = false;
    this.spinner.show();
    this.trackingDataService.brokerCompanyList( (resp) => {
      this.spinner.hide();
      this.companyDropdown = resp;
      if(this.companyDropdown.length > 0)
        this.companyName = this.companyDropdown[0].value;
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    });
    this.categories = [];
    this.directCategories = [];
  }

  onCompanyDropdownchange(event){
    this.companyName = event.value.value;
  };

  companySearch(){
    this.spinner.show();
    this.trackingDataService.fetchBrokerDetails(this.companyName, (resp) => {
      console.log(resp.serviceType)
      this.categories = resp.serviceType;
      this.serviceTypeArray = resp.serviceType;
      this.oneFlag = resp.serviceType.includes('1PA') ? true : false;
      this.twoFlag = resp.serviceType.includes('2PA') ? true : false;
      this.threeFlag = resp.serviceType.includes('3PA') ? true : false;
      this.fourFlag = resp.serviceType.includes('4PA') ? true : false;
      this.fiveFlag = resp.serviceType.includes('5PA') ? true : false;
      this.sixFlag = resp.serviceType.includes('UnTracked') ? true : false;

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
      this.spinner.hide();
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);
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
        importObj[contactPhoneNumber]= this.brokerAddClientForm.value.PhoneNumber, importObj
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

  onChange(e) {
    console.log(e.target.checked)
    console.log(e.target.value)
    if(e.target.checked) {
      this.serviceTypeArray.push(e.target.value)
    } else {
      let index = this.serviceTypeArray.indexOf(e.target.value);
      this.serviceTypeArray.splice(index,1);
      this.serviceTypeDeletedArray.push(e.target.value);
    }
    console.log(this.serviceTypeArray);
    console.log(this.serviceTypeDeletedArray);
  }
  
}

