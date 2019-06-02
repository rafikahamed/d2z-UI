import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { GridOptions } from "ag-grid";
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import _ from 'lodash';
interface dropdownTemplate {
  name: string;
  value: string;
}
@Component({
  selector: 'hms-superuser-level-mlid',
  templateUrl: './mlid.component.html',
  styleUrls: ['./mlid.component.css']
})

export class MLIDComponent implements OnInit {
  userName: String;
  role_id: String;
  errorMsg: string;
 
  successMsg: String;
 public mildlist = [];
 AddList= [];
  system: String;
  file:File;
 arrayBuffer:any;
  serviceListMainData = [];

  serviceDropdownValue = [];
  serviceTypeDropdown: dropdownTemplate[];  
  selectedserviceType: dropdownTemplate;
  AddserviceType: String;
  DeleteserviceType:String;
  DownloadserviceType:String;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    private spinner: NgxSpinnerService
  ){
   
   
    this.successMsg = null;
  
   

  }

  ngOnInit() {
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
    this.getLoginDetails();
    this.spinner.show();
   
   
  
this.consigmentUploadService.mlidList( (resp) => {
      this.serviceListMainData = resp;
      
      var that = this;
      resp.forEach(function(entry) {
      console.log(entry.name);
        that.serviceDropdownValue.push(entry);
      })
      this.serviceTypeDropdown = this.serviceDropdownValue;
       console.log( this.serviceTypeDropdown);
    })
  }
onServiceTypeChangeAdd(event){
console.log( event);
    this.AddserviceType = event.value ? event.value.value: '';
  };
  onServiceTypeChangeDelete(event){
console.log( event);
    this.DeleteserviceType = event.value ? event.value.value: '';
  };
  onServiceTypeChangeDownload(event){
console.log( event);
    this.DownloadserviceType = event.value ? event.value.value: '';
  };
  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
incomingfile(event) {
    
    this.file = event.target.files[0]; 
    this.importMLID();
  }

   importMLID(){
    var worksheet;
    this.errorMsg = null;
    let fileReader = new FileReader();
  this.mildlist = [];
    fileReader.readAsArrayBuffer(this.file);
  let ServiceType   ='ServiceType';        
  let ZoneID ='ZoneID';
  let Minweight ='Minweight';
  let Maxweight ='Maxweight';
  let MLID ='MLID';
  let InjectionState ='InjectionState';
fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var exportData = XLSX.utils.sheet_to_json(worksheet);
          for (var importVal in exportData) {
            var dataObj = exportData[importVal];
            if(this.errorMsg == null){
              var importObj = (
                importObj={}, 
                importObj[ServiceType]= dataObj['ServiceType'] != undefined ? dataObj['ServiceType'] : '', importObj,
                importObj[ZoneID]= dataObj['ZoneID'] != undefined ? dataObj['ZoneID'] : '', importObj,
                importObj[Minweight]= dataObj['Minweight'] != undefined ? dataObj['Minweight'] : '', importObj,
                importObj[Maxweight]= dataObj['Maxweight'] != undefined ? dataObj['Maxweight'] : '', importObj,
                importObj[MLID]= dataObj['MLID'] != undefined ? dataObj['MLID'] : '', importObj,
                importObj[InjectionState]= dataObj['InjectionState'] != undefined ? dataObj['InjectionState'] : '', importObj
              );
            this.mildlist.push(importObj)
            
            }
        }
      }
  };

  downloadMLID(){
    console.log("in Download");
     this.errorMsg = null;
    this.successMsg = null;
    if(this.DownloadserviceType ==  undefined){
      this.errorMsg = "**Please select Service Type";
      }
      if(this.errorMsg == null){
      this.spinner.show();
       var invoiceDownloadFinalList = [];
      this.consigmentUploadService.downloadMlidData(this.DownloadserviceType,  (resp) => {
          this.spinner.hide();
           console.log(resp);
          var downloadInvoiceData = resp;
          let serviceType = 'serviceType';
          let zoneID = 'zoneID';
          let destinationzone = 'destinationzone';
          let minweight = 'minweight';
          let maxweight = 'maxweight';
          let mlid = 'mlid';
          let injectionState = 'injectionState';
          
         
           for(var downloadInvoice in downloadInvoiceData){
              var invoiceData = downloadInvoiceData[downloadInvoice];
              var invoiceObj = (
                invoiceObj={}, 
                invoiceObj[serviceType]= invoiceData.serviceType != null ? invoiceData.serviceType : '' , invoiceObj,
                invoiceObj[zoneID]= invoiceData.zoneID != null ? invoiceData.zoneID : '', invoiceObj,
                invoiceObj[destinationzone]= invoiceData.destinationzone != null ?  invoiceData.destinationzone : '', invoiceObj,
                invoiceObj[minweight]= invoiceData.minweight != null ? invoiceData.minweight : '', invoiceObj,
                invoiceObj[maxweight]= invoiceData.maxweight != null ? invoiceData.maxweight : '', invoiceObj,
                invoiceObj[mlid]= invoiceData.mlid != null ? invoiceData.mlid : '', invoiceObj,
                invoiceObj[injectionState]= invoiceData.injectionState != null ? invoiceData.injectionState : '', invoiceObj
              );
              invoiceDownloadFinalList.push(invoiceObj);
           }
           var currentTime = new Date();
           var fileName = '';
           fileName = "MLID_LIST"+"-"+currentTime.toLocaleDateString();
           var options = { 
             fieldSeparator: ',',
             quoteStrings: '"',
             decimalseparator: '.',
             showLabels: true, 
             useBom: true,
             headers: [ 'Service Type', 'ZoneID', 'Destination Zone', 'MinWeight', 'MaxWeight', 'MLID', 'Injection State']
             };
             new Angular2Csv(invoiceDownloadFinalList, fileName, options);   
           
        })
        }
        else{
$('#invoice').modal('show');  
      }
        
   
  };


deletemlid(){
   this.errorMsg = null;
    this.successMsg = null;
    if(this.DeleteserviceType ==  undefined){
      this.errorMsg = "**Please select Service Type";
      }
      if(this.errorMsg == null){
    this.spinner.show();
      this.consigmentUploadService.deleteMlid(this.DeleteserviceType, (resp) => {
      console.log(resp);
          this.spinner.hide();
          this.successMsg = resp.message;
          $('#invoice').modal('show');  
        setTimeout(() => { this.spinner.hide() }, 5000);
      });
      }
      else{
$('#invoice').modal('show');  
      }
          
    };
  

 addmlid(){
    this.spinner.show();

       this.errorMsg = null;
    this.successMsg = null;
    this.AddList =[];
   if(this.AddserviceType ==  undefined){
      this.errorMsg = "**Please select Service Type";
      }
      if(this.mildlist.length == 0)
      {
        this.errorMsg = "Please Upload File";

      }

       if(this.mildlist.length > 0 && this.errorMsg == null ){

      var that= this;
      that.mildlist.forEach(function(data) {
       
if(data.ServiceType == that.AddserviceType)
{
  data.ServiceType = that.AddserviceType;
      that.AddList.push(data);
}

      else
      {
       that.errorMsg = "Service Type Mismatch";
      
      }

      });


      }

      if(this.errorMsg == null)
      {
     console.log(that.AddList);
   this.consigmentUploadService.addMlid(that.AddList, (resp) => {
      console.log(resp);
          this.spinner.hide();
          this.successMsg = resp.message;
          $('#invoice').modal('show');  
        setTimeout(() => { this.spinner.hide() }, 5000);
      });

      }
      else{
$('#invoice').modal('show');  
      }
      
 

};

}


