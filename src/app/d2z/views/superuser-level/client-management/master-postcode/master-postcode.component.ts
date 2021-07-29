import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import * as XLSX from 'xlsx';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
@Component({
  selector: 'd2z-master-postcode',
  templateUrl: './master-postcode.component.html',
  styleUrls: ['./master-postcode.component.css']
})
export class MasterPostcodeComponent implements OnInit {
  @ViewChild('userPhoto') userPhoto: ElementRef;
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  public importList = [];
  FileHeading = ['Postcode', 'Suburb', 'State', 'Zone','StateName','PFLZone','FastwayZone','TollZone','RCZone','MCSZone','VCZone','FDMRoute'];
  InvoiceFileHeading = ['Postcode', 'Suburb', 'State', 'MCS65UL','MCS3CNE','MCS5AMSC','MCSGSX','FDMVC1','RCINVZone','FDMZone','FastwayZoneId'];
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
  identifier: String;
  shipmentAllocateForm: FormGroup;
  form: NgForm;
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consignmenrServices: ConsigmentUploadService,

  ) {
    this.show = false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
    });
    
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
    this.spinner.show();
    this.rowData = [];
    this.file = event.target.files[0]; 
    this.upload();
  }

  upload(){
    var worksheet;
    this.errorMsg = null;
    let fileReader = new FileReader();
    this.importList= [];
    fileReader.readAsArrayBuffer(this.file);


    fileReader.onload = (e) => {
      console.log("file reader onload")
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
              if(this.identifier == "invoicing" && !this.InvoiceFileHeading.includes(keyVal)){
                this.errorMsg = "***Invalid file format"
              }
              if(this.identifier == "postcode" && !this.FileHeading.includes(keyVal)){
                this.errorMsg = "***Invalid file format"
              }
            }
            var importObj;
            if(this.errorMsg == null){
              if(this.identifier == "invoicing"){
             importObj = {
              postcode : dataObj['Postcode'].length<4?"0"+dataObj['Postcode']:dataObj['Postcode'],
              suburb: dataObj['Suburb'],
              state: dataObj['State'],
              mcs65ul: dataObj['MCS65UL'],
              mcs3cne: dataObj['MCS3CNE'],
              mcs5amsc: dataObj['MCS5AMSC'],
              mcsgsx: dataObj['MCSGSX'],
              fdmVc1: dataObj['FDMVC1'],
              rcInvZone:dataObj['RCINVZone'],
              fdmZone:dataObj['FDMZone'],
              fastwayZoneId:dataObj['FastwayZoneId'],
            }
          }
          if(this.identifier == 'postcode'){
             importObj = {
              postcode : dataObj['Postcode'].length<4?"0"+dataObj['Postcode']:dataObj['Postcode'],
              suburb: dataObj['Suburb'],
              state: dataObj['State'],
              zone: dataObj['Zone'],
              stateName: dataObj['StateName'],
              pflZone: (dataObj['PFLZone'] == '-' || dataObj['PFLZone'] == '' ||dataObj['PFLZone'] == 'NULL')?'0':dataObj['PFLzone'],
              fastwayZone: (dataObj['FastwayZone'] == '-' || dataObj['FastwayZone'] == '' ||dataObj['FastwayZone'] == 'NULL')?'0':dataObj['FastwayZone'],
              fdmRoute:(dataObj['FDMRoute'] == '-' || dataObj['FDMRoute'] == '' ||dataObj['FDMRoute'] == 'NULL')?'0':dataObj['FDMRoute'],
              tollZone:(dataObj['TollZone'] == '-' || dataObj['TollZone'] == '' ||dataObj['TollZone'] == 'NULL')?'0':dataObj['TollZone'],
              rcZone:(dataObj['RCZone'] == '-' || dataObj['RCZone'] == '' ||dataObj['RCZone'] == 'NULL')?'0':dataObj['RC2Zone'],
              mcsZone:(dataObj['MCSZone'] == '-' || dataObj['MCSZone'] == '' ||dataObj['MCSZone'] == 'NULL')?'0':dataObj['MCSZone'],
              vcZone: (dataObj['VCZone'] == '-' || dataObj['VCZone'] == '' ||dataObj['VCZone'] == 'NULL')?'0':dataObj['VCZone'],
            }
          }
            this.importList.push(importObj)
            this.rowData = this.importList;
        }
        this.spinner.hide();
      }
      }
  }
clearDetails(){

    this.rowData= [];
 this.userPhoto.nativeElement.value = null;
   
    this.successMsg = null;
    this.errorMsg = null;
   
  };
  uploadFile(){
   if(this.identifier == 'invoicing'){
        this.uploadMasterInvoicing();
   }else{
        this.uploadMasterPostcode();
   }
  }
  uploadMasterInvoicing(){
    this.errorMsg = null;
    this.successMsg = '';
   if(this.importList.length > 0 && this.errorMsg == null ){
        this.spinner.show();
        this.trackingDataService.superUserUploadMasterInvoicing(this.importList, (resp) => {
          this.spinner.hide();
          if(resp.status == 400 ){
            this.successMsg = resp.error.message;
          }else if(resp.status == 500 ){
            this.successMsg = resp.error.message;
          }else{
            this.successMsg = resp.message;
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
    
  }


  uploadMasterPostcode(){
    this.errorMsg = null;
    this.successMsg = '';
   console.log(this.importList)
   if(this.importList.length > 0 && this.errorMsg == null ){
        this.spinner.show();
        this.trackingDataService.superUserUploadMasterPostcode(this.importList, (resp) => {
          this.spinner.hide();
          if(resp.status == 400 ){
            this.successMsg = resp.error.message;
          }else if(resp.status == 500 ){
            this.successMsg = resp.error.message;
          }else{
            this.successMsg = resp.message;
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
    
  }



}


