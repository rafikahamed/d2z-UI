import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';

import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'hms-superuser-level-auweight',
  templateUrl: './auweight.component.html',
  styleUrls: ['./auweight.component.css']
})

export class AUweightComponent implements OnInit {
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  public importList = [];
 
  manifestNumber: string;
  arrayBuffer:any;
  file:File;
  errorMsg: string;
  show: Boolean;
  successMsg: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  userName: String;
  system: String;
  role_id: String;
  shipmentAllocateForm: FormGroup;
  constructor(
   
    private spinner: NgxSpinnerService,
    public consigmentUploadService: ConsigmentUploadService
  ) {
    this.show = false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
    });
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Article ID",
        field: "Article ID",
        width: 300,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      }
      
    ];
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };
  }

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.getLoginDetails();
  }

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage  != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
  
  incomingfile(event) {
    this.rowData = [];
    this.file = event.target.files[0]; 
    this.uploadArticleID();
  }

  uploadArticleID(){
    var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
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
              this.importList.push(importObj)
              this.rowData = this.importList;
              }
          }
        }
  }


downloadauweight(){
    console.log("in Download");
     this.errorMsg = null;
    this.successMsg = null;
     var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length == 0){
      this.errorMsg = "**Please select the below records to upload the tracking details";
    }
      if(this.errorMsg == null  && selectedRows.length > 0){
      console.log(selectedRows);
      this.spinner.show();
       var invoiceDownloadFinalList = [];
     this.consigmentUploadService.downloadauweight(selectedRows,  (resp) => {
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
           else
           {
           this.successMsg = "No record Found";
 $('#allocateShipmentModal').modal('show');
          setTimeout(() => {
            this.spinner.hide();
          }, 5000); 
           }

        })
        }
       
        
   
  };


  

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


