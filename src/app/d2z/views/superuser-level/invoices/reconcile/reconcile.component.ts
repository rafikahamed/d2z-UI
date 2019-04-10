import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import * as XLSX from 'xlsx';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-superuser-level-invoices',
  templateUrl: './reconcile.component.html',
  styleUrls: ['./reconcile.component.css']
})

export class SuperUserReconcileComponent implements OnInit {
  arrayBuffer:any;
  userName: String;
  role_id: String;
  errorMsg:String;
  supplierType: String;
  show: Boolean;
  downloadReconcile: Boolean;
  suplier1Flag: Boolean;
  suplier2Flag: Boolean;
  successMsg: String;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private defaultColDef;
  private gridOptionsSuplier1: GridOptions;
  private gridOptionsSuplier2: GridOptions;
  supplierTypeDropdown: dropdownTemplate[];
  private rowDataSupplier1: any[];
  private rowDataSupplier2: any[];
  file:File;
  public supplierOneList = [];
  public supplierTwoList = [];
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consigmentUploadService: ConsigmentUploadService
  ) {
    this.show = false;
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };

    // This grid is for Consignment Items
    this.gridOptionsSuplier1 = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsSuplier1.columnDefs = [
      {
        headerName: "Article No",
        field: "articleNo",
        width: 400,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Normal Rate/Parcel",
        field: "normalRateParcel",
        width: 400
      },
      {
        headerName: "Article Actual Weight",
        field: "articleActualWeight",
        width: 400
      }
    ];

    // This grid is for deleted Items
    this.gridOptionsSuplier2 = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsSuplier2.columnDefs = [
      {
        headerName: "Invoice Number",
        field: "refrenceNumber",
        width: 400,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Charged Weight",
        field: "chargedWeight",
        width: 400
      },
      {
        headerName: "Cost (AUD)",
        field: "cost",
        width: 300
      }
    ]

  };
 
  ngOnInit() {
    this.getLoginDetails();
    this.suplier1Flag =true;
    this.suplier2Flag =false;
    this.downloadReconcile = false;
    this.supplierTypeDropdown = [
      { "name": "UBI Template", "value": "UBITemplate" },
      { "name": "Freipost template", "value": "freipostTemplate" }
    ];
    this.supplierType = this.supplierTypeDropdown[0].value;
  };

  incomingfile(event) {
    this.rowDataSupplier1 = [];
    this.rowDataSupplier2 = [];
    this.file = event.target.files[0]; 
    this.reconcileData();
  };

  reconcileData(){
    var worksheet;
    this.errorMsg = null;
    let fileReader = new FileReader();
    if(this.supplierType == 'UBITemplate'){
      this.supplierOneList= [];
      this.rowDataSupplier1 = [];
      fileReader.readAsArrayBuffer(this.file);
      let articleNo = 'articleNo';
      let normalRateParcel = 'normalRateParcel';
      let articleActualWeight = 'articleActualWeight';
      let supplierType = 'supplierType';
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
              var reconcile = exportData[importVal];
              
              if(this.errorMsg == null){
                var reconcileObj = (
                  reconcileObj={}, 
                  reconcileObj[articleNo]= reconcile['Article No.'] != undefined ? reconcile['Article No.'] : '', reconcileObj,
                  reconcileObj[normalRateParcel]= reconcile['Normal Rate/Parcel'] != undefined ? reconcile['Normal Rate/Parcel'] : '', reconcileObj,
                  reconcileObj[articleActualWeight]= reconcile['Article Actual Weight'] != undefined ? reconcile['Article Actual Weight'] : '', reconcileObj,
                  reconcileObj[supplierType]= 'UBI', reconcileObj
                );
              this.supplierOneList.push(reconcileObj)
              this.rowDataSupplier1 = this.supplierOneList;
              }
          }
        }
    }else if(this.supplierType == 'freipostTemplate'){
      this.supplierTwoList= [];
      this.rowDataSupplier2  = [];
      fileReader.readAsArrayBuffer(this.file);
      let refrenceNumber = 'refrenceNumber';
      let chargedWeight = 'chargedWeight';
      let cost = 'cost';
      let supplierType = 'supplierType';
  
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
              var reconcile = exportData[importVal];
              
              if(this.errorMsg == null){
                var reconcileTwoObj = (
                  reconcileTwoObj={}, 
                  reconcileTwoObj[refrenceNumber]= reconcile['Invoice Number'] != undefined ? reconcile['Invoice Number'] : '', reconcileTwoObj,
                  reconcileTwoObj[chargedWeight]= reconcile['Charged Weight'] != undefined ? reconcile['Charged Weight'] : '', reconcileTwoObj,
                  reconcileTwoObj[cost]= reconcile['Cost (AUD)'] != undefined ? reconcile['Cost (AUD)'] : '', reconcileTwoObj,
                  reconcileTwoObj[supplierType]= 'freipost', reconcileTwoObj
                );
              this.supplierTwoList.push(reconcileTwoObj)
              this.rowDataSupplier2 = this.supplierTwoList;
              }
          }
        }
    }
  };

  onSuplierTypeChange(event){
    this.successMsg = null;
    this.downloadReconcile= false;
    this.supplierType = event.value ? event.value.value : '';
    if(this.supplierType == 'UBITemplate'){
      this.suplier2Flag = false;
      this.suplier1Flag = true;
    }else if(this.supplierType == 'freipostTemplate'){
      this.suplier1Flag = false;
      this.suplier2Flag = true;
    }
  };

  supplierClear(){
    $("#reconcileCntrl").val('');
      this.rowDataSupplier1 = [];
      this.rowDataSupplier2 = [];
      this.errorMsg = null;
  };

  uploadSupplier1Data(){
    this.errorMsg = null;
    var supplier1Data = [];
    supplier1Data = this.gridOptionsSuplier1.api.getSelectedRows();
    if(supplier1Data.length > 0){
      this.spinner.show();
      this.consigmentUploadService.reconcileData(supplier1Data, (resp) => {
          this.spinner.hide();
          //this.downloadReconcileReport(resp);
          this.successMsg = resp.message;
          $('#reconcileModal').modal('show');  
          this.downloadReconcile = true;
          setTimeout(() => { this.spinner.hide() }, 5000);
        })
    }else{
      this.errorMsg = '**Please select the below records to upload the reconcile data';
    }
  };

  uploadSupplier2Data(){
    this.errorMsg = null;
    var supplier2Data = [];
    supplier2Data = this.gridOptionsSuplier2.api.getSelectedRows();
    if(supplier2Data.length > 0 ){
      this.spinner.show();
      this.consigmentUploadService.reconcileData(supplier2Data, (resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        $('#reconcileModal').modal('show');  
        //this.downloadReconcileReport(resp);
        this.downloadReconcile = true;
        setTimeout(() => { this.spinner.hide() }, 5000);
      })
    }else{
      this.errorMsg = '**Please select the below records to upload the reconcile data';
    }
  };

  downloadReconcileReport(resp){
    var reconcileObjList = [];
    let airwaybill = 'airwaybill';
    let articleId = 'articleId';
    let brokerUserName = 'brokerUserName';
    let costDifference = 'costDifference';
    let d2ZCost = 'd2ZCost';
    let d2ZWeight = 'd2ZWeight';
    let reference_number = 'reference_number';
    let supplierCharge = 'supplierCharge';
    let supplierWeight = 'supplierWeight';
    let weightDifference = 'weightDifference';
    let invoicedAmount = 'invoicedAmount';
    let correctAmount = 'correctAmount';
    let chargeDifference = 'chargeDifference';

    var reconcileNumbers = [];
    if(this.supplierType == 'UBITemplate'){
     var supplier1Data = this.gridOptionsSuplier1.api.getSelectedRows();
        for (var supplierOne in supplier1Data) {
            var reconcile = supplier1Data[supplierOne];
            reconcileNumbers.push(reconcile.articleNo);
        }
    }else if(this.supplierType == 'freipostTemplate'){
     var supplier2Data = this.gridOptionsSuplier2.api.getSelectedRows();
        for (var supplierTwo in supplier2Data) {
            var reconcile = supplier2Data[supplierTwo];
            reconcileNumbers.push(reconcile.refrenceNumber);
        }
    }
    this.spinner.show();
    this.consigmentUploadService.downloadReconcile(reconcileNumbers, (resp) => {
      this.spinner.hide();
      for(var reconcileData in resp){
        var reconcile = resp[reconcileData];
        var reconcileObj = (
          reconcileObj={}, 
          reconcileObj[brokerUserName]= reconcile.brokerUserName != null ? reconcile.brokerUserName : '' , reconcileObj,
          reconcileObj[airwaybill]= reconcile.airwaybill != null ? reconcile.airwaybill : '', reconcileObj,
          reconcileObj[articleId]= reconcile.articleId != null ?  reconcile.articleId : '', reconcileObj,
          reconcileObj[reference_number]= reconcile.reference_number != null ? reconcile.reference_number : '', reconcileObj,
          reconcileObj[supplierCharge]= reconcile.supplierCharge != null ? reconcile.supplierCharge : '', reconcileObj,
          reconcileObj[d2ZCost]= reconcile.d2ZCost != null ? reconcile.d2ZCost : '', reconcileObj,
          reconcileObj[costDifference]= reconcile.costDifference != null ? reconcile.costDifference : '', reconcileObj,
          reconcileObj[supplierWeight]= reconcile.supplierWeight != null ? reconcile.supplierWeight : '', reconcileObj,
          reconcileObj[d2ZWeight]= reconcile.d2ZWeight != null ? reconcile.d2ZWeight : '', reconcileObj,
          reconcileObj[weightDifference]= reconcile.weightDifference != null ? reconcile.weightDifference : '', reconcileObj,
          reconcileObj[invoicedAmount]= reconcile.invoicedAmount != null ? reconcile.invoicedAmount : '', reconcileObj,
          reconcileObj[correctAmount]= reconcile.correctAmount != null ? reconcile.correctAmount : '', reconcileObj,
          reconcileObj[chargeDifference]= reconcile.chargeDifference != null ? reconcile.chargeDifference : '', reconcileObj
        );
        reconcileObjList.push(reconcileObj);
     };
        var currentTime = new Date();
        var fileName = '';
            fileName = "Reconcile"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Customer', 'Shipment Number', 'Article ID', 'Reference Number', 'Supplier Charge', 'D2Z postage',
            'Cost Difference', 'Supplier Weight', 'D2Z Weight', 'Weight Difference', 'Postage',  'Correct Amount', 'Charge Difference' ]
          };
        new Angular2Csv(reconcileObjList, fileName, options); 
    })
    
     
  };

  onSupplier1Change(){

  };

  onSupplier2Change(){
  };

  tabChanged(){

  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };

}


