import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'app/d2z/service/login.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { Global } from 'app/d2z/service/Global';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-shipping-quote',
  templateUrl: './shipping-quote.component.html',
  styleUrls: ['./shipping-quote.component.css']
})

export class ShippingQuoteComponent implements OnInit {
  errorMsg: string;
    successMsg: String;
    shippingQuoteMode : String;
    showAir: boolean;
    showSea: boolean;
  loginForm: FormGroup;
  userMessage: userMessage;
  loginBut: boolean;
  companyDetails: FormGroup;
  quoteDetails: FormGroup;
departureArrivalType:dropdownTemplate[];
     packingType : dropdownTemplate[];
  answerOptions : dropdownTemplate[];
  constructor(
    public loginservice: LoginService,
    public consigmentUploadService: ConsigmentUploadService,
       public global: Global,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ){
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      passWord: new FormControl('', Validators.required)
    });
    this.companyDetails = new FormGroup({
            companyName: new FormControl('',[Validators.required, Validators.maxLength(100)]),
            name: new FormControl('',[Validators.required, Validators.maxLength(100)]),
            emailAddress: new FormControl('',[Validators.required, Validators.maxLength(100)])
            
       });
        this.quoteDetails = new FormGroup({
            departure: new FormControl('',Validators.required),
            selectedDepartureType: new FormControl(),
            arrival: new FormControl('',Validators.required),
            selectedArrivalType: new FormControl(),
            cargoDate: new FormControl(),
            commodity: new FormControl('',Validators.maxLength(100)),
            selectedPackingType: new FormControl(),
            shippingQuantity: new FormControl(),
            weight: new FormControl(),
            dimHeight: new FormControl(),
            dimWidth: new FormControl(),
            dimLength: new FormControl(),
            incoterms: new FormControl('',Validators.maxLength(100)),
            stackable: new FormControl(),
            hazardous: new FormControl(),
            insurance: new FormControl(),
            personalEffects: new FormControl()
       });
 
  }
 get name(){
 return this.companyDetails.get('name');
 }
  get companyName(){
 return this.companyDetails.get('companyName');
 }
  get emailAddress(){
 return this.companyDetails.get('emailAddress');
 }
 get commodity(){
 return this.quoteDetails.get('commodity');
 }
 get incoterms(){
 return this.quoteDetails.get('incoterms');
 }
 get departure(){
 return this.quoteDetails.get('departure');
 }
 get arrival(){
 return this.quoteDetails.get('arrival');
 } 

  ngOnInit(){
    console.log("inside the data");

   //this.shippingQuoteMode = this.global.getShippingQuote();
   this.shippingQuoteMode = this.activatedRoute.snapshot.paramMap.get('shippingMode');
   if(this.shippingQuoteMode === 'AIR'){
   this.showAir = true;
   this.showSea = false;
   }
   if(this.shippingQuoteMode === 'SEA'){
   this.showAir = false;
   this.showSea = true;
   }
   this.departureArrivalType = [
   {"name" : "Residential","value" : "Residential"},
   {"name" : "Commercial","value" : "Commercial"}
   ];
   this.packingType =[
   {"name" : "Box", "value" : "Box"},
   {"name" : "Carton","value" : "Carton"},
   {"name" : "Bag", "value" : "Bag"},
   {"name" : "Pallet", "value" : "Pallet"},
   {"name" : "Roll", "value" : "Roll"},
   {"name" : "Drum", "value" : "Drum"},
   {"name" : "Container", "value" : "Container"},
   {"name" : "Other","value" : "Other"}
   ];
   this.answerOptions = [
   {"name" : "Yes", "value" : "Yes"},
   {"name" : "No", "value" : "No"}];
 
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
   submit(){
      let companyName = 'companyName';
      let name = 'name';
      let emailAddress = 'emailAddress';
      let mode = 'mode';
      let departure = 'departure';
      let departureType = 'departureType';
      let arrival = 'arrival';
      let arrivalType = 'arrivalType';
      let cargoReadyDate = 'cargoReadyDate';
      let commodity = 'commodity';
      let packingType = 'packingType';
      let shippingQuantity = 'shippingQuantity';
      let totalWeight = 'totalWeight';
      let incoterms = 'incoterms';
      let dimHeight = 'dimHeight';
      let dimWidth = 'dimWidth';
      let dimLength = 'dimLength';
      let stackable = 'stackable';
      let hazardous = 'hazardous';
      let cargoInsurance = 'cargoInsurance';
      let personalEffects = 'personalEffects';
      console.log(this.companyDetails);
      console.log(this.shippingQuoteMode);
            var importObj = (
        importObj={}, 
        importObj[companyName]= this.companyDetails.value.companyName != undefined ? this.companyDetails.value.companyName : '', importObj,
        importObj[name]= this.companyDetails.value.name != undefined ? this.companyDetails.value.name : '', importObj,
        importObj[emailAddress]= this.companyDetails.value.emailAddress != undefined ?  
                       this.companyDetails.value.emailAddress : '', importObj,
        importObj[mode]= this.shippingQuoteMode, importObj,
        importObj[departure]= this.quoteDetails.value.departure != undefined ? this.quoteDetails.value.departure  : '',  importObj,
        importObj[departureType]= this.quoteDetails.value.selectedDepartureType.value != undefined ? this.quoteDetails.value.selectedDepartureType.value : '', importObj,
        importObj[arrival]= this.quoteDetails.value.arrival  != undefined ? this.quoteDetails.value.arrival : '', importObj,
        importObj[arrivalType]= this.quoteDetails.value.selectedArrivalType.value != undefined ? this.quoteDetails.value.selectedArrivalType.value : '',  importObj,
        importObj[cargoReadyDate]= this.quoteDetails.value.cargoDate != undefined ? this.quoteDetails.value.cargoDate : '', importObj,
        importObj[commodity]= this.quoteDetails.value.commodity != undefined ? this.quoteDetails.value.commodity : '', importObj,
         importObj[packingType]= this.quoteDetails.value.selectedPackingType.value != undefined ? this.quoteDetails.value.selectedPackingType.value : '', importObj,
        importObj[shippingQuantity]= this.quoteDetails.value.shippingQuantity != undefined ? this.quoteDetails.value.shippingQuantity : '', importObj,
        importObj[totalWeight]= this.quoteDetails.value.weight != undefined ? this.quoteDetails.value.weight : '',  importObj,
        importObj[incoterms]= this.quoteDetails.value.incoterms != undefined ? this.quoteDetails.value.incoterms : '', importObj,
        importObj[dimHeight]= this.quoteDetails.value.dimHeight != undefined ? this.quoteDetails.value.dimHeight : '', importObj,
        importObj[dimWidth]= this.quoteDetails.value.dimWidth != undefined ? this.quoteDetails.value.dimWidth : '', importObj,
        importObj[dimLength]= this.quoteDetails.value.dimLength != undefined ? this.quoteDetails.value.dimLength : '', importObj,
        importObj[stackable]= this.quoteDetails.value.stackable.value != undefined ? this.quoteDetails.value.stackable.value : '', importObj,
        importObj[hazardous]= this.quoteDetails.value.hazardous.value != undefined ? this.quoteDetails.value.hazardous.value : '', importObj,
        importObj[cargoInsurance]= this.quoteDetails.value.insurance.value != undefined ? this.quoteDetails.value.insurance.value : '',  importObj,
        importObj[personalEffects]= this.quoteDetails.value.personalEffects.value != undefined ? this.quoteDetails.value.personalEffects.value : '',  importObj

    );
    console.log(importObj);
    this.spinner.show();
    this.consigmentUploadService.shippingQuote(importObj, (resp) => {
        this.spinner.hide();
        if(!resp.error){
          this.successMsg = resp.message;
        }
        setTimeout(() => {
        this.spinner.hide();
        }, 5000);
      });
    }
}

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
