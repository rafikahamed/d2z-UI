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
  templateUrl: './non-d2z.component.html',
  styleUrls: ['./non-d2z.component.css']
})

export class SuperUserNonD2zClientComponent implements OnInit {

  
  arrayBuffer:any;
  userName: String;
  role_id: String;
  errorMsg:String;
  supplierType: String;
  show: Boolean;
  suplier1Flag: Boolean;
  suplier2Flag: Boolean;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private defaultColDef;
  private gridOptionsSuplier1: GridOptions;
  private gridOptionsSuplier2: GridOptions;
  supplierTypeDropdown: dropdownTemplate[];
  private nonD2zClientData: any[];
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
        headerName: "Tracking Number",
        field: "trackingNumber",
        width: 250,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Reference Number",
        field: "referenceNumber",
        width: 250
      },
      {
        headerName: "Consignee Name",
        field: "consigneeName",
        width: 250
      },
      {
        headerName: "Address",
        field: "address",
        width: 250
      },
      {
        headerName: "Suburb",
        field: "subUrb",
        width: 200
      },
      {
        headerName: "Postcode",
        field: "postCode",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 150
      },
      {
        headerName: "Service Type",
        field: "serviceType",
        width: 200
      }
    ];
  };
 
  ngOnInit() {
    this.getLoginDetails();
    this.suplier1Flag =true;
    this.suplier2Flag =false;
    this.supplierTypeDropdown = [
      { "name": "Supplier Template-1", "value": "supplierTemplate1" },
      { "name": "Supplier Template-2", "value": "supplierTemplate2" }
    ];
    this.supplierType = this.supplierTypeDropdown[0].value;
  };

  incomingfile(event) {
    this.nonD2zClientData = [];
    this.file = event.target.files[0]; 
    this.reconcileData();
  };

  reconcileData(){
    var worksheet;
    this.errorMsg = null;
    let fileReader = new FileReader();
      this.supplierOneList= [];
      this.nonD2zClientData = [];
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
                  reconcileObj[supplierType]= 'supplierOne', reconcileObj
                );
              this.supplierOneList.push(reconcileObj)
              this.nonD2zClientData = this.supplierOneList;
              }
          }
        }
    
 
  };

  onSuplierTypeChange(event){
    this.supplierType = event.value ? event.value.value : '';
    if(this.supplierType == 'supplierTemplate1'){
      this.suplier2Flag = false;
      this.suplier1Flag = true;
    }else if(this.supplierType == 'supplierTemplate2'){
      this.suplier1Flag = false;
      this.suplier2Flag = true;
    }
  };

  supplierClear(){
      $("#reconcileCntrl").val('');
      this.nonD2zClientData = [];
      this.errorMsg = null;
  };

  uploadNonD2zData(){
    this.errorMsg = null;
    var supplier1Data = [];
    supplier1Data = this.gridOptionsSuplier1.api.getSelectedRows();
    if(supplier1Data.length > 0){
      this.spinner.show();
      this.consigmentUploadService.reconcileData(supplier1Data, (resp) => {
          this.spinner.hide();
          this.downloadReconcileReport(resp);
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
        headers: [ 'Customer', 'Shipment Number', 'Article ID', 'Reference Number', 'Supplier Charge', 'D2Z Cost',
        'Cost Difference', 'Supplier Weight', 'D2Z Weight', 'Weight Difference', 'Invoiced Amount',  'Correct Amount', 'Charge Difference' ]
      };
    new Angular2Csv(reconcileObjList, fileName, options);      
  };

  onSupplier1Change(){

  };

  onSupplier2Change(){

  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
}


