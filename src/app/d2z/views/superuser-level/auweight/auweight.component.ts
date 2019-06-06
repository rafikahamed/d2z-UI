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
  selector: 'hms-superuser-level-auweight',
  templateUrl: './auweight.component.html',
  styleUrls: ['./auweight.component.css']
})

export class AUweightComponent implements OnInit {
  userName: String;
  role_id: String;
  errorMsg: string;
 
  successMsg: String;
 public ArticleList = [];
 AddList= [];
  system: String;
  file:File;
 arrayBuffer:any;
  serviceListMainData = [];

  serviceDropdownValue = [];
  serviceTypeDropdown: dropdownTemplate[];  
  serviceTypeDeleteDropdown: dropdownTemplate[];
  serviceDeleteDropdownValue = [];
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
   
   
  


    
  }

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
incomingfile(event) {
    
    this.file = event.target.files[0]; 
    this.importArticleID();
  }

   importArticleID(){
    var worksheet;
    this.errorMsg = null;
    let fileReader = new FileReader();
  this.ArticleList = [];
    fileReader.readAsArrayBuffer(this.file);
  let ArticleID   ='ArticleID';        
  


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
                importObj[ArticleID]= dataObj['Article ID'] != undefined ? dataObj['Article ID'] : '', importObj
              
              );
            this.ArticleList.push(importObj)
            
            }
        }
      }
  };

  downloadweight(){
    console.log("in Download");
     this.errorMsg = null;
    this.successMsg = null;
     if(this.ArticleList.length == 0)
      {
        this.errorMsg = "Please Upload File";

      }
      if(this.errorMsg == null){
      console.log(this.ArticleList);
      this.spinner.show();
       var invoiceDownloadFinalList = [];
     this.consigmentUploadService.downloadauweight(this.ArticleList,  (resp) => {
          this.spinner.hide();
           console.log(resp);
          var downloadInvoiceData = resp;
          let articleID = 'articleID';
          let cubicWeight = 'cubicWeight';
          
         
         
          
         if(downloadInvoiceData.length > 0)
         {
           for(var downloadInvoice in downloadInvoiceData){
              var invoiceData = downloadInvoiceData[downloadInvoice];
              var invoiceObj = (
                invoiceObj={}, 
                invoiceObj[articleID]= invoiceData.articleID != null ? invoiceData.articleID : '' , invoiceObj,
                invoiceObj[cubicWeight]= invoiceData.cubicWeight != null ? invoiceData.cubicWeight : '', invoiceObj
                
              );
              invoiceDownloadFinalList.push(invoiceObj);
           }
           var currentTime = new Date();
           var fileName = '';
           fileName = "AU_Weight"+"_"+currentTime.toLocaleDateString();
           var options = { 
             fieldSeparator: ',',
             quoteStrings: '"',
             decimalseparator: '.',
             showLabels: true, 
             useBom: true,
             headers: [ 'Article ID', 'Postweight']
             };
             new Angular2Csv(invoiceDownloadFinalList, fileName, options);   
           }

        })
        }
        else{
$('#invoice').modal('show');  
      }
        
   
  };




}


