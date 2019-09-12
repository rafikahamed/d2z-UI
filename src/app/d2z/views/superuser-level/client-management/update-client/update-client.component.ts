import { Component,ViewChild, OnInit } from '@angular/core';
import { NgForm,FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
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
@ViewChild('myForm') myForm: NgForm;
      childmenu: boolean;
      childmenuTwo:boolean;
      childmenuThree:boolean;
      childmenuFour:boolean;
      childmenuFive:boolean;
   flag:boolean;
      disableUpdate: boolean;
      errorMsg: string;
      userName: String;
      role_id: String;
      system: String;
      successMsg: String;
      companyName: String;
      brokerAddClientForm: FormGroup;
      serviceTypeArray: any[];
      directCategories = [];
      serviceTypeDeletedArray: any[];
      companyDropdown: dropdownTemplate[];  
      selectedCompany: dropdownTemplate;
      show: Boolean;
      categories=[];
      servicecategories=[];
      constructor(
         public trackingDataService : TrackingDataService,
         public consignmenrServices: ConsigmentUploadService, 
         private spinner: NgxSpinnerService
      ){
        this.companyDropdown = [];
        this.show = false;
        this.serviceTypeArray = [];
        this.serviceTypeDeletedArray = [];
        this.errorMsg = null;
        this.disableUpdate = true;
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
    this.childmenuTwo = false;
    this.childmenuThree = false;
    this.childmenuFour  = false;
    this.childmenuFive = false;
    this.spinner.show();
    this.getLoginDetails();
    this.trackingDataService.brokerCompanyList( (resp) => {
     
      this.companyDropdown = resp;
     
      

      if(this.companyDropdown.length > 0)
        this.selectedCompany = this.companyDropdown[0];
        this.companyName =  this.companyDropdown[0] ? this.companyDropdown[0].value : '';
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    });

     this.consignmenrServices.mlidList( (resp) => {
        this.spinner.hide();
       var that= this;

          resp.forEach(function(entry) {
     
   
      that.directCategories.push({
                         'checked' : false,
                         'name':entry.name,
                         'value':entry.value,
                       
                       });
        
      });


       
      });

   console.log(this.directCategories);
    this.categories = this.directCategories;

    
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
  
};
  onCompanyDropdownchange(event){
   if(event.value){
    this.companyName = event.value.value;
   }
  };

  companySearch(){
  this.servicecategories = [];

   
    this.spinner.show();
    this.trackingDataService.fetchBrokerDetails(this.companyName, (resp) => {
    
      this.serviceTypeArray = resp.serviceType;
      console.log(this.serviceTypeArray);

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


    
     
      this.disableUpdate = false;
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
    console.log(this.consignmenrServices.userMessage)
    console.log(this.serviceTypeDeletedArray);
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
        importObj[role_Id]= 2,
        importObj[deletedServiceTypes]= this.serviceTypeDeletedArray, importObj,
        importObj[contactPhoneNumber]= this.brokerAddClientForm.value.PhoneNumber, importObj
    );
    console.log(importObj)
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


