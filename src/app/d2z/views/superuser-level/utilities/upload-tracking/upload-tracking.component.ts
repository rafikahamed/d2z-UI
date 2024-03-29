import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import * as XLSX from 'xlsx';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare var $: any;

@Component({
  selector: 'hms-upload-tracking',
  templateUrl: './upload-tracking.component.html',
  styleUrls: ['./upload-tracking.component.css']
})

export class SuperUserUploadTrackingComponent implements OnInit{
@ViewChild('userPhoto') userPhoto: ElementRef;
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  public importList = [];
  FileHeading = ['Reference_number', 'ArticleID', 'TrackEventDetails', 'TrackEventDateOccurred','Location'];
  manifestNumber: string;
  arrayBuffer:any;
  file:File;
  errorMsg: string;
  show: Boolean;
  successMsg: String;
  public gridOptions: GridOptions;
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  public rowData: any[];
  public defaultColDef;
  userName: String;
  system: String;
  role_id: String;
  shipmentAllocateForm: FormGroup;
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consignmenrServices: ConsigmentUploadService
  ) {
    this.show = false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
    });
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Reference number",
        field: "referenceNumber",
        width: 300,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Article Id Number",
        field: "connoteNo",
        width: 300
      },
      {
        headerName: " Status",
        field: "trackEventDetails",
        width: 250
      },
      {
        headerName: "Status Time",
        field: "trackEventDateOccured",
        width: 200
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
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  };
  
  incomingfile(event) {
    this.rowData = [];
    this.file = event.target.files[0]; 
    this.uploadTracking();
  }

  uploadTracking(){
    var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      fileReader.readAsArrayBuffer(this.file);
      let referenceNumber = 'referenceNumber';
      let connoteNo = 'connoteNo';
      let trackEventDetails = 'trackEventDetails';
      let trackEventDateOccured = 'trackEventDateOccured';
      let fileName = 'fileName';
      let location = 'location';

      var today = new Date();
      var day = today.getDate() + "";
      var month = (today.getMonth() + 1) + "";
      var year = today.getFullYear() + "";
      var hour = today.getHours() + "";
      var minutes = today.getMinutes() + "";
      var seconds = today.getSeconds() + "";

      day = checkZero(day);
      month = checkZero(month);
      year = checkZero(year);
      hour = checkZero(hour);
      minutes = checkZero(minutes);
      seconds = checkZero(seconds);

      function checkZero(data){
          if(data.length == 1){
            data = "0" + data;
          }
          return data;
      }
      var dateString = year+'-'+month+'-'+day+"-"+hour+':'+minutes+':'+seconds;

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
              for(var keyVal in dataObj){
                var newLine = "\r\n"
                if(!this.FileHeading.includes(keyVal)){
                  this.errorMsg = "***Invalid file format, Please check the field in given files Reference number, allowed fields are ['Reference Number']"
                }
              }
              if(this.errorMsg == null){
                var importObj = (
                  importObj={}, 
                  importObj[referenceNumber]= dataObj['Reference_number'] != undefined ? dataObj['Reference_number'] : '', importObj,
                  importObj[connoteNo]= dataObj['ArticleID'] != undefined ? dataObj['ArticleID'] : '', importObj,
                  importObj[trackEventDetails]= dataObj['TrackEventDetails'] != undefined ? dataObj['TrackEventDetails'] : '', importObj,
                  importObj[trackEventDateOccured]= dataObj['TrackEventDateOccurred'] != undefined ? dataObj['TrackEventDateOccurred'] : '', importObj,
                  importObj['location']= dataObj['Location'] != undefined ? dataObj['Location'] : '', importObj,
                  importObj[fileName]= this.file.name+'-'+dateString, importObj
                );
              this.importList.push(importObj)
              this.rowData = this.importList;
              }
          }
        }
  }
clearDetails(){

    this.rowData= [];
 this.userPhoto.nativeElement.value = null;
   
    this.successMsg = null;
    this.errorMsg = null;
   
  };
  allocateTracking(){
    this.errorMsg = null;
    this.successMsg = '';
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length == 0){
      this.errorMsg = "**Please select the below records to upload the tracking details";
    }
    if(selectedRows.length > 0 && this.errorMsg == null ){
        this.spinner.show();
        this.trackingDataService.superUserUpoloadTracking(this.importList, (resp) => {
          this.spinner.hide();
          if(resp.status == 400 ){
            this.successMsg = resp.error.message;
          }else if(resp.status == 500 ){
            this.successMsg = resp.error.message;
          }else{
            this.successMsg = resp.message;
          }
          $('#allocateShipmentModal').modal('show');
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
  }

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
 downloadtracking(){
  let trackinglist = [];
  this.spinner.show();
    this.trackingDataService.downloadFDMTrackingNo((resp) => {
      for(var tracking in resp){
        var importObj = (
          importObj={}, 
          importObj['articleId']= resp[tracking].toString(), importObj
        )
      trackinglist.push(importObj);
      }
      this.spinner.hide();
        var currentTime = new Date();
        var fileName = "FDMTrackingList"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Article ID' ]
          };
        new Angular2Csv(trackinglist, fileName, options); 
    })
 }

 downloadPending(){
   
  let trackinglist = [];
  this.spinner.show();
    this.trackingDataService.downloadPendingTrackingNo((resp) => {
      console.log(resp)
      for(var tracking in resp){
        var importObj = (
          importObj={}, 
          importObj['articleId']= resp[tracking].articleId, importObj,
          importObj['date']= "'"+resp[tracking].date+"'", importObj
        )
      trackinglist.push(importObj);
      }
      this.spinner.hide();
        var currentTime = new Date();
        var fileName = "Pending"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Article ID','Event Date' ]
          };
        new Angular2Csv(trackinglist, fileName, options); 
    })
 }
}


