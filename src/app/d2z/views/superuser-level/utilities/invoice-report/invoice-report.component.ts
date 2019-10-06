import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  MatInput } from '@angular/material';
import 'rxjs/add/operator/filter';
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
  selector: 'hms-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.css']
})

export class SuperUserInvoiceComponent implements OnInit{
@ViewChild('frominput', {
  read: MatInput
}) frominput: MatInput;

@ViewChild('toinput', {
  read: MatInput
}) toinput: MatInput;
@ViewChild('myInput') myInputVariable: ElementRef;
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  childmenuSix:boolean;
  public importList = [];
  errorMsg: string;
  errorMsg1: string;
  show: Boolean;
  consignmentFlag: Boolean;
  deletedFlag: Boolean;
  shipmentFlag: Boolean;
  nonshipmentFlag: Boolean;
  consignmentFlag1: Boolean;
  shipmentFlag1: Boolean;
  mydate: Date;
  successMsg: String;
   successMsg1: String;
  fromDate: String;
  toDate: String;
  userName: String;
  role_id: String;
  private gridOptionsConsignment: GridOptions;
   private gridOptionsConsignment1: GridOptions;
  private gridOptionsDeleted: GridOptions;
  private gridOptionsShipment: GridOptions;
   private gridOptionsShipment1: GridOptions;
  private gridOptionsNonShipment:GridOptions;

  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowDataConsignment: any[];
  private rowDataDeleted: any[];
  private rowDataShipment: any[];
  private rowDataConsignment1: any[];
   private rowDataShipment1: any[];
  private defaultColDef;
  exportTypeDropdown: dropdownTemplate[]; 
   exportTypeDropdown1: dropdownTemplate[]; 
    TypeDropdown: dropdownTemplate[];  
  selectedExportType: dropdownTemplate;
   selectedExportType1: dropdownTemplate;
     selectedType: dropdownTemplate;
  shipmentAllocateForm: FormGroup;
  exportFileType: String;
  exportFileType1: String;
    articleData = [];
     barcodeData=[];
      refData=[];
      outputData  =[];
  file:File;
  public importList1 = [];
   arrayBuffer:any;
   Type1: String;
  system: String;
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consignmenrServices: ConsigmentUploadService
  ) {
    this.show = false;
    this.consignmentFlag = true;
    this.consignmentFlag1 = true;
    this.deletedFlag= false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
    });
   
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
    this.gridOptionsConsignment = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsConsignment.columnDefs = [
      {
        headerName: "Ref No.",
        field: "reference_number",
        width: 200,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Article ID",
        field: "barcodelabelNumber",
        width: 200
      },
      {
        headerName: "Address line 1",
        field: "consignee_addr1",
        width: 200
      },
      {
        headerName: "Recipient Name",
        field: "consignee_name",
        width: 200
      },
      {
        headerName: "Phone",
        field: "consignee_Phone",
        width: 150
      },
      {
        headerName: "Postcode",
        field: "consignee_Postcode",
        width: 150
      },
      {
        headerName: "State",
        field: "consignee_State",
        width: 200
      },
      {
        headerName: "City/Suburb",
        field: "consignee_Suburb",
        width: 200
      },
      {
        headerName: "Recipient Company",
        field: "consigneeCompany",
        width: 200
      },
      {
        headerName: "Invoice Currency",
        field: "currency",
        width: 200
      },
      {
        headerName: "Height",
        field: "dimensions_Height",
        width: 150
      },
      {
        headerName: "Length",
        field: "dimensions_Length",
        width: 150
      },
      {
        headerName: "Width",
        field: "dimensions_Width",
        width: 150
      },
      {
        headerName: "Goods Description",
        field: "product_Description",
        width: 400
      },
      {
        headerName: "Item Description",
        field: "product_Description",
        width: 400
      },
      {
        headerName: "Shipper Address Line1",
        field: "shipper_Addr1",
        width: 250
      },
      {
        headerName: "Shipper Address City",
        field: "shipper_City",
        width: 200
      },
      {
        headerName: "Shipper Address Country",
        field: "shipper_Country",
        width: 300
      },
      {
        headerName: "Shipper Name",
        field: "shipper_Name",
        width: 250
      },
      {
        headerName: "Shipper Address Postcode",
        field: "shipper_Postcode",
        width: 200
      },
      {
        headerName: "Shipper Address State",
        field: "shipper_State",
        width: 300
      },
      {
        headerName: "Invoice Value",
        field: "value",
        width: 200
      },
      {
        headerName: "Item Unit Value",
        field: "value",
        width: 200
      },
      {
        headerName: "Total weight",
        field: "weight",
        width: 200
      },
      {
        headerName: "Item Weight",
        field: "weight",
        width: 200
      },
      {
        headerName: "Country",
        field: "country",
        width: 100
      },
      {
        headerName: "Item No",
        field: "itemNo",
        width: 100
      },
	  {
        headerName: "Girth",
        field: "girth",
        width: 100
      },
      {
        headerName: "Item Count",
        field: "itemCount",
        width: 100
      },
      {
        headerName: "Item Currency",
        field: "itemCurrency",
        width: 100
      },
      {
        headerName: "Item Origin",
        field: "itemOrigin",
        width: 100
      },
      {
        headerName: "Total Weight Unit",
        field: "totalWeightUnit",
        width: 100
      },
      {
        headerName: "Dimension Unit",
        field: "dimension Unit",
        width: 200
      },
      {
        headerName: "Native Description",
        field: "nativeDescription",
        width: 200
      },
      {
        headerName: "Address line 2",
        field: "addressLine2",
        width: 200
      },
      {
        headerName: "Address line 3",
        field: "addressLine3",
        width: 200
      },
      {
        headerName: "Dimension Unit",
        field: "dimension Unit",
        width: 200
      },
      {
        headerName: "Native Description",
        field: "nativeDescription",
        width: 200
      },
      {
        headerName: "Address line 2",
        field: "addressLine2",
        width: 200
      },
      {
        headerName: "Address line 3",
        field: "addressLine3",
        width: 200
      },
      {
        headerName: "Email",
        field: "email",
        width: 200
      },
      {
        headerName: "SKU",
        field: "sku",
        width: 200
      },
      {
        headerName: "Service Option",
        field: "serviceOption",
        width: 200
      },
      {
        headerName: "Battery Packing",
        field: "batteryPacking",
        width: 200
      },
      {
        headerName: "Battery Type",
        field: "batteryType",
        width: 200
      },
      {
        headerName: "Shipper Facility/Origin",
        field: "shipperFacility",
        width: 200
      },
      {
        headerName: "Locker Service",
        field: "lockerService",
        width: 200
      },
      {
        headerName: "Incoterm",
        field: "Incoterm",
        width: 200
      },
      {
        headerName: "Recipient Tax ID",
        field: "recipientTaxID",
        width: 200
      },
      {
        headerName: "Return Option",
        field: "returnOption",
        width: 200
      },
      {
        headerName: "Shipping Instructions",
        field: "shippingInstructions",
        width: 200
      },
      {
        headerName: "Item Native Desc",
        field: "itemNativeDesc",
        width: 200
      },
      {
        headerName: "Item HSCode",
        field: "itemHSCode",
        width: 200
      },
      {
        headerName: "Item Product URL",
        field: "itemProductURL",
        width: 200
      },
      {
        headerName: "Insure",
        field: "insure",
        width: 200
      },
      {
        headerName: "Beneficiary",
        field: "beneficiary",
        width: 200
      },
      {
        headerName: "Insurance Amount",
        field: "insuranceAmount",
        width: 200
      },
      {
        headerName: "Insurance Currency",
        field: "insuranceCurrency",
        width: 200
      },
      {
        headerName: "Shipper Address Line2",
        field: "shipperAddressLine2",
        width: 200
      },
      {
        headerName: "Shipper Address Line3",
        field: "shipperAddressLine3",
        width: 200
      },
      {
        headerName: "Shipper Phone",
        field: "shipperPhone",
        width: 200
      },
       {
        headerName: "Date",
        field: "timestamp",
        width: 200
      }
    ];
//This grid for consignment File:
 this.gridOptionsConsignment1 = <GridOptions>{ rowSelection: "multiple" };
 this .gridOptionsConsignment1.columnDefs= this.gridOptionsConsignment.columnDefs;
   // This grid is for deleted Items
    this.gridOptionsDeleted = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsDeleted.columnDefs = [

    {
        headerName: "Broker Name",
        field: "brokername",
        width: 200,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      
      {
        headerName: "Ref No.",
        field: "reference_number",
        width: 300
      },
      
      {
        headerName: "Article ID",
        field: "barcodelabelNumber",
        width: 500
      },
       {
        headerName: "Date",
        field: "dat",
        width: 200
      },
     
    ];

    // This grid is for Shipment Items
    this.gridOptionsShipment = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsShipment.columnDefs = [
     {
        headerName: "Broker Name",
        field: "broker_name",
        width: 200,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Invoice Number",
        field: "reference_number",
        width: 200,
        
      },
      {
        headerName: "Value",
        field: "value",
        width: 100
      },
      {
        headerName: "Shipped Quantity",
        field: "shippedQuantity",
        width: 100
      },
      {
        headerName: "Del Name",
        field: "consignee_name",
        width: 150
      },
      {
        headerName: "Del Addr1",
        field: "consignee_addr1",
        width: 150
      },
      {
        headerName: "Del Addr2 (suburb)",
        field: "consignee_Suburb",
        width: 150
      },
      {
        headerName: "Del Addr3 (state)",
        field: "consignee_State",
        width: 150
      },
      {
        headerName: "deladdr4 (country)",
        field: "consignee_country",
        width: 100
      },
      {
        headerName: "Postcode",
        field: "consignee_Postcode",
        width: 100
      },
      {
        headerName: "Email",
        field: "email",
        width: 200
      },
      {
        headerName: "Telephone",
        field: "consignee_Phone",
        width: 200
      },
      {
        headerName: "Product Description",
        field: "product_Description",
        width: 300
      },
      {
        headerName: "Origin",
        field: "shipper_Country",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 100
      },
      {
        headerName: "Tracking Template",
        field: "tracking_template",
        width: 300
      },
      {
        headerName: "Tracking Number",
        field: "barcodelabelNumber",
        width: 300
      },
      {
        headerName: "Inventory Short Name",
        field: "articleID",
        width: 200
      },
      {
        headerName: "Supplier",
        field: "supplier",
        width: 100
      },
      {
        headerName: "Bill me",
        field: "bill_me",
        width: 300
      },
      {
        headerName: "ServiceType",
        field: "servicetype",
        width: 250
      },
      {
        headerName: "BagName",
        field: "bagName",
        width: 200
      },
      {
        headerName: "Length",
        field: "dimensions_Length",
        width: 200
      },
      {
        headerName: "Width",
        field: "dimensions_Width",
        width: 200
      },
      {
        headerName: "Height",
        field: "dimensions_Height",
        width: 200
      },
      {
        headerName: "Currency",
        field: "currency",
        width: 200
      },
      {
        headerName: "Cost_Freight",
        field: "Cost_Freight",
        width: 200
      },
      {
        headerName: "Cost_Insurance",
        field: "Cost_Insurance",
        width: 100
      },
      {
        headerName: "ABN_ARN Number",
        field: "ABN_ARN Number",
        width: 200
      },
      {
        headerName: "Date",
        field: "dat",
        width: 200
      },
      {
        headerName: "Manifest",
        field: "manifest",
        width: 200
      }
    ];
//This grid for Shipment File

 this.gridOptionsShipment1 = <GridOptions>{ rowSelection: "multiple" };
 this.gridOptionsShipment1.columnDefs = this.gridOptionsShipment.columnDefs;
      // This grid is for NonShipment Items
    this.gridOptionsNonShipment = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsNonShipment.columnDefs = [
     {
        headerName: "Broker Name",
        field: "broker_name",
        width: 200,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Invoice Number",
        field: "reference_number",
        width: 200,
        
      },
      {
        headerName: "Value",
        field: "value",
        width: 100
      },
      {
        headerName: "Shipped Quantity",
        field: "shippedQuantity",
        width: 100
      },
      {
        headerName: "Del Name",
        field: "consignee_name",
        width: 150
      },
      {
        headerName: "Del Addr1",
        field: "consignee_addr1",
        width: 150
      },
      {
        headerName: "Del Addr2 (suburb)",
        field: "consignee_Suburb",
        width: 150
      },
      {
        headerName: "Del Addr3 (state)",
        field: "consignee_State",
        width: 150
      },
      {
        headerName: "deladdr4 (country)",
        field: "consignee_country",
        width: 100
      },
      {
        headerName: "Postcode",
        field: "consignee_Postcode",
        width: 100
      },
      {
        headerName: "Email",
        field: "email",
        width: 200
      },
      {
        headerName: "Telephone",
        field: "consignee_Phone",
        width: 200
      },
      {
        headerName: "Product Description",
        field: "product_Description",
        width: 300
      },
      {
        headerName: "Origin",
        field: "shipper_Country",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 100
      },
      {
        headerName: "Tracking Template",
        field: "tracking_template",
        width: 300
      },
      {
        headerName: "Tracking Number",
        field: "barcodelabelNumber",
        width: 300
      },
      {
        headerName: "Inventory Short Name",
        field: "inventory_short_name",
        width: 200
      },
      {
        headerName: "Supplier",
        field: "supplier",
        width: 100
      },
      {
        headerName: "Bill me",
        field: "bill_me",
        width: 300
      },
      {
        headerName: "ServiceType",
        field: "servicetype",
        width: 250
      },
      {
        headerName: "BagName",
        field: "bagName",
        width: 200
      },
      {
        headerName: "Length",
        field: "dimensions_Length",
        width: 200
      },
      {
        headerName: "Width",
        field: "dimensions_Width",
        width: 200
      },
      {
        headerName: "Height",
        field: "dimensions_Height",
        width: 200
      },
      {
        headerName: "Currency",
        field: "currency",
        width: 200
      },
      {
        headerName: "Cost_Freight",
        field: "Cost_Freight",
        width: 200
      },
      {
        headerName: "Cost_Insurance",
        field: "Cost_Insurance",
        width: 100
      },
      {
        headerName: "ABN_ARN Number",
        field: "ABN_ARN Number",
        width: 200
      },
      {
        headerName: "Date",
        field: "dat",
        width: 200
      }
      ];
  
  }

  ngOnInit() {
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.childmenuSix= false;
      this.exportTypeDropdown = [
        { "name": "Export Consignment", "value": "export-consignment" },
        { "name": "Export Delete", "value": "export-delete" },
        { "name": "Export Shipment", "value": "export-shipment" 
        },
        { "name": "Export Non Shipment", "value": "export-nonshipment" 
        }
      ];
      this.selectedExportType = this.exportTypeDropdown[0];

       this.TypeDropdown = [
        { "name": "Article ID", "value": "articleid" },
        { "name": "Barcode Label", "value": "barcodelabel" },
        { "name": "Reference Number", "value": "referencenumber" 
        }
      ];
      this.selectedType = this.TypeDropdown[0];


        this.exportTypeDropdown1 = [
          { "name": "Export Consignment", "value": "export-consignment" },
        { "name": "Export Shipment", "value": "export-shipment" 
        }
       
      ];
      this.selectedExportType1 = this.exportTypeDropdown1[0];
      this.exportFileType = this.exportTypeDropdown[0].value;
       this.exportFileType1 = this.exportTypeDropdown1[0].value;
       this.Type1 = this.TypeDropdown[0].value;
      this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  };

  FromDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.fromDate = [ date.getFullYear(), mnth, day ].join("-");
  };

  ToDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.toDate = [ date.getFullYear(), mnth, day ].join("-");
  };

  onExportTypeChange(event){
    this.exportFileType = event.value.value;
    if(event.value.value === 'export-consignment'){
        this.consignmentFlag = true;
        this.deletedFlag = false;
        this.shipmentFlag = false;
        this.nonshipmentFlag = false;
    }else if(event.value.value === 'export-delete'){
        this.consignmentFlag = false;
        this.deletedFlag = true;
        this.shipmentFlag = false;
        this.nonshipmentFlag = false;
    }else if(event.value.value === 'export-shipment'){
        this.consignmentFlag = false;
        this.deletedFlag = false;
        this.shipmentFlag = true;
        this.nonshipmentFlag = false;
    }
    else if(event.value.value === 'export-nonshipment'){
        this.consignmentFlag = false;
        this.deletedFlag = false;
        this.shipmentFlag = false;
        this.nonshipmentFlag = true;
    }
  };

   onTypeChange(event){
 
       this.Type1 = event.value.value;
      this.myInputVariable.nativeElement.value = null;
    this.file = null;
     this.articleData = [];
    this.refData = [];
    this.barcodeData = [];
   
  };
onExportTypeChange1(event){
 
    this.exportFileType1 = event.value.value;
  
    if(event.value.value === 'export-consignment'){
        this.consignmentFlag1 = true;
      
        this.shipmentFlag1 = false;
       
    }else if(event.value.value === 'export-shipment'){
        this.consignmentFlag1 = false;
      
        this.shipmentFlag1 = true;
       
    }
  
 
  };

  incomingfile(event) {
    this.articleData = [];
    this.refData = [];
    this.barcodeData = [];
    this.file = event.target.files[0]; 
    if(this.Type1 === 'articleid')
    {
    this.uploadArticleID();

    }
    else if(this.Type1 === 'barcodelabel')
    {
this.uploadBarcodeLabel();
    }
    else if (this.Type1 === 'referencenumber')
    {
    this.uploadReferencenumber();
    }
  };

   uploadArticleID(){
    var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList1= [];
      fileReader.readAsArrayBuffer(this.file);
      let ArticleID   ='ArticleID';     
     this.articleData = [];
      

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
            var importObj = dataObj['Article ID'] != undefined ? dataObj['Article ID'] : '';
              
              this.importList1.push(importObj)
            
             
              }
          }
           this.articleData = this.importList1;
        }
  }
 uploadBarcodeLabel(){
    var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList1= [];
      fileReader.readAsArrayBuffer(this.file);
      let BarcodeLabel   ='BarcodeLabel';  
      this.barcodeData = [];   

      

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
              var importObj = dataObj['Barcode Label'] != undefined ? dataObj['Barcode Label'] : '';
              
              
              this.importList1.push(importObj)
              console.log(this.importList1);
             
              }
          }
           this.barcodeData = this.importList1;
        }
  }
 uploadReferencenumber(){
    var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList1= [];
      this.refData = [];
      fileReader.readAsArrayBuffer(this.file);
      let Referencenumber   ='Referencenumber';     

      

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
              var importObj = dataObj['Reference Number'] != undefined ? dataObj['Reference Number'] : '';
              
          
              this.importList1.push(importObj)
              console.log(this.importList1);
             
              }
          }
           this.refData = this.importList1;

        }
  }


  downloaExportedData(Type){
  console.log(Type);
   var consignmentSelectedRows;
  if(Type==="fil")
  {
consignmentSelectedRows = this.gridOptionsConsignment1.api.getSelectedRows();
  }
  else
  {
  console.log("in else");
consignmentSelectedRows = this.gridOptionsConsignment.api.getSelectedRows();
  }
   console.log(consignmentSelectedRows.length);
    if(consignmentSelectedRows.length > 0 ){
        var currentTime = new Date();
        var consignmentList = [];
        var fileName = '';
            fileName = "Export-Consignment"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 
              "Ref No.",
              "Article ID",
              "Recipient Name",
              "Recipient Company",
              "Address line 1",
              "Address line 2",
              "Address line 3",
              "City/Suburb",
              "State",
              "Postcode",
              "Country",
              "Phone",
              "Email",
              "Invoice Value",
              "Invoice Currency",
              "Native Description",
              "Goods Description",
              "Shipping Instructions",
              "Total weight",
              "Total Weight Unit",
              "Dimension Unit",
              "Length",
              "Width",
              "Height",
              "Girth",
              "SKU",
              "Service Option",
              "Battery Packing",
              "Battery Type",
              "Shipper Facility/Origin",
              "Locker Service",
              "Incoterm",
              "Recipient Tax ID",
              "Return Option",
              "Shipper Name",
              "Shipper Phone",
              "Shipper Address Line1",
              "Shipper Address Line2",
              "Shipper Address Line3",
              "Shipper Address City",
              "Shipper Address State",
              "Shipper Address Postcode",
              "Shipper Address Country",
              "Item No",
              "Item SKU",
              "Item Native Desc", 
              "Item Desc",
              "Item HSCode",
              "Item Origin",
              "Item Weight",
              "Item Unit Value",
              "Item Count",
              "Item Currency",
              "Item Product URL",
              "Insure",
              "Beneficiary",
              "Insurance Amount",
              "Insurance Currency",
              "Date"
            ]
          };
          let reference_No = 'reference_No';
          let article_Id = 'article_Id';
          let recipient_Name = 'recipient_Name';
          let recipient_Company = 'recipient_Company';
          let address_line_1  = 'address_line_1';
          let address_line_2 = 'address_line_2';
          let address_line_3 = 'address_line_3';
          let suburb = 'suburb';
          let state = 'state';
          let postCode = 'postCode';
          let country = 'country';
          let phone = 'phone';
          let email = 'email';
          let invoice_value = 'invoice_value';
          let invoice_Currency = 'invoice_Currency';
          let native_Description = 'native_Description';
          let goods_Description = 'goods_Description';
          let shipping_Instructions = 'shipping_Instructions';
          let total_Weight = 'total_Weight';
          let total_Weight_Unit = 'total_Weight_Unit';
          let dimension_Unit = 'dimension_Unit';
          let length = 'length';
          let width = 'width';
          let height = 'height';
          let girth = 'girth';
          let SKU = 'SKU';
          let service_Option = 'service_Option';
          let battery_Packing = 'battery_Packing';
          let battery_Type = 'battery_Type';
          let shipper_Facility = 'shipper_Facility';
          let locker_Service = 'locker_Service';
          let incoterm = 'incoterm';
          let recipient_Tax_ID = 'recipient_Tax_ID';
          let return_Option = 'return_Option';
          let shipper_Name = 'shipper_Name';
          let shipper_Phone = 'shipper_Phone';
          let shipper_Address_Line1 = 'shipper_Address_Line1';
          let shipper_Address_Line2 = 'shipper_Address_Line2';
          let shipper_Address_Line3 = 'shipper_Address_Line3';
          let shipper_Address_City = 'shipper_Address_City';
          let shipper_Address_State = 'shipper_Address_State';
          let shipper_Address_Postcode = 'shipper_Address_Postcode';
          let shipper_Address_Country = 'shipper_Address_Country';
          let item_No = 'item_No';
          let item_SKU = 'item_SKU';
          let item_Native_Desc = 'item_Native_Desc';
          let item_Desc = 'item_Desc';
          let item_HSCode = 'item_HSCode';
          let item_Origin = 'item_Origin';
          let item_Weight = 'item_Weight';
          let item_Unit_Value = 'item_Unit_Value';
          let item_Count = 'item_Count';
          let item_Currency = 'item_Currency';
          let item_Product_URL = 'item_Product_URL';
          let insure = 'insure';
          let beneficiary = 'beneficiary';
          let insurance_Amount = 'insurance_Amount';
          let insurance_Currency = 'insurance_Currency';
          let dat ='dat';


          for (var importVal in consignmentSelectedRows) {
              var adminObj = consignmentSelectedRows[importVal];
              var importObj = (
                  importObj={},
                  importObj[reference_No]= adminObj.reference_number != null ? adminObj.reference_number: '', importObj,
                  importObj[article_Id]= adminObj.barcodelabelNumber != null ? adminObj.barcodelabelNumber.substring(18, 41) : '', importObj,
                  importObj[recipient_Name]= adminObj.consignee_name != null ? adminObj.consignee_name : '', importObj,
                  importObj[recipient_Company]= adminObj.consigneeCompany != null ? adminObj.consigneeCompany : '', importObj,
                  importObj[address_line_1] = adminObj.consignee_addr1 != null ? adminObj.consignee_addr1 : '', importObj,
                  importObj[address_line_2]= adminObj.consigneePhone != null ? adminObj.consigneePhone : '', importObj,
                  importObj[address_line_3]= adminObj.consigneeAddress != null ? adminObj.consigneeAddress : '', importObj,
                  importObj[suburb]= adminObj.consignee_Suburb != null ? adminObj.consignee_Suburb : '', importObj,
                  importObj[state]= adminObj.consignee_State != null ? adminObj.consignee_State : '', importObj,
                  importObj[postCode]= adminObj.consignee_Postcode != null ? adminObj.consignee_Postcode : '',  importObj,
                  importObj[country]= adminObj.country != null ? adminObj.country : 'AU', importObj,
                  importObj[phone]= adminObj.consignee_Phone != null ? adminObj.consignee_Phone : '', importObj,
                  importObj[email]= adminObj.email != null ? adminObj.email : '', importObj,
                  importObj[invoice_value]= adminObj.value != null ? adminObj.value : '', importObj,
                  importObj[invoice_Currency] = adminObj.currency != null ? adminObj.currency : '', importObj,
                  importObj[native_Description]= adminObj.native_Description != null ? adminObj.native_Description : '', importObj,
                  importObj[goods_Description]= adminObj.product_Description != null ? adminObj.product_Description : '', importObj,
                  importObj[shipping_Instructions]= adminObj.shipping_Instructions != null ? adminObj.shipping_Instructions : '', importObj,
                  importObj[total_Weight]= adminObj.weight != null ? adminObj.weight : '', importObj,
                  importObj[total_Weight_Unit]= 'KG',  importObj,
                  importObj[dimension_Unit]=  'cm', importObj,
                  importObj[length]= adminObj.dimensions_Length != null ? adminObj.dimensions_Length : '', importObj,
                  importObj[width]= adminObj.dimensions_Width != null ? adminObj.dimensions_Width : '', importObj,
                  importObj[height]= adminObj.dimensions_Height != null ? adminObj.dimensions_Height : '', importObj,
                  importObj[girth] = '', importObj,
                  importObj[SKU] = '', importObj,
                  importObj[service_Option]= adminObj.service_Option != null ? adminObj.service_Option : '', importObj,
                  importObj[battery_Packing]= '', importObj,
                  importObj[battery_Type]= adminObj.battery_Type != null ? adminObj.battery_Type : '', importObj,
                  importObj[shipper_Facility]= adminObj.shipper_Facility != null ? adminObj.shipper_Facility : '',  importObj,
                  importObj[locker_Service]= adminObj.locker_Service != null ? adminObj.locker_Service : '', importObj,
                  importObj[incoterm]= adminObj.incoterm != null ? adminObj.incoterm : '', importObj,
                  importObj[recipient_Tax_ID]= adminObj.recipient_Tax_ID !=null ? adminObj.recipient_Tax_ID :'', importObj,
                  importObj[return_Option]= adminObj.return_Option != null ? adminObj.return_Option : '', importObj,
                  importObj[shipper_Name]= adminObj.shipper_Name != null ? adminObj.shipper_Name : '', importObj,
                  importObj[shipper_Phone]= adminObj.shipper_Phone != null ? adminObj.shipper_Phone : '', importObj,
                  importObj[shipper_Address_Line1] = adminObj.shipper_Addr1 != null ? adminObj.shipper_Addr1 : '', importObj,
                  importObj[shipper_Address_Line2]= adminObj.shipper_Address_Line2 != null ? adminObj.shipper_Address_Line2 : '', importObj,
                  importObj[shipper_Address_Line3]= adminObj.shipper_Address_Line3 != null ? adminObj.shipper_Address_Line3 : '', importObj,
                  importObj[shipper_Address_City]= adminObj.shipper_City != null ? adminObj.shipper_City : '',  importObj,
                  importObj[shipper_Address_State]= adminObj.shipper_State != null ? adminObj.shipper_State : '', importObj,
                  importObj[shipper_Address_Postcode]= adminObj.shipper_Postcode != null ? adminObj.shipper_Postcode : '', importObj,
                  importObj[shipper_Address_Country]= adminObj.shipper_Country !=null ? adminObj.shipper_Country :'', importObj,
                  importObj[item_No]= 1, importObj,
                  importObj[item_SKU]= 1, importObj,
                  importObj[item_Native_Desc]= adminObj.item_Native_Desc != null ? adminObj.item_Native_Desc : '', importObj,
                  importObj[item_Desc] = adminObj.product_Description != null ? adminObj.product_Description : '', importObj,
                  importObj[item_HSCode]= adminObj.item_HSCode != null ? adminObj.item_HSCode : '', importObj,
                  importObj[item_Origin]= 'AU', importObj,
                  importObj[item_Weight]= adminObj.weight != null ? adminObj.weight : '', importObj,
                  importObj[item_Unit_Value]= adminObj.value !=null ? adminObj.value :'', importObj,
                  importObj[item_Count]= 1, importObj,
                  importObj[item_Currency]= 'AUD', importObj,
                  importObj[item_Product_URL]= adminObj.item_Product_URL != null ? adminObj.item_Product_URL : '', importObj,
                  importObj[insure]= adminObj.insure != null ? adminObj.insure : '', importObj,
                  importObj[beneficiary] = adminObj.beneficiary != null ? adminObj.beneficiary : '', importObj,
                  importObj[insurance_Amount]= adminObj.insurance_Amount != null ? adminObj.insurance_Amount : '', importObj,
                  importObj[insurance_Currency]= adminObj.insurance_Currency != null ? adminObj.insurance_Currency : '', importObj,
                   importObj[dat]= adminObj.timestamp != null ? adminObj.timestamp : '', importObj
              );
              consignmentList.push(importObj)
          }
        new Angular2Csv(consignmentList, fileName, options);        
      }else{
       if(Type==="fil")
  {
  this.errorMsg1 = "**Please select the below records to download the Export Consignment details";
  }
  else{
        this.errorMsg = "**Please select the below records to download the Export Consignment details";
        }
      } 
  };

  downloadDeletedData(){
    var deletedSelectedRows = this.gridOptionsDeleted.api.getSelectedRows();
    if(deletedSelectedRows.length > 0 ){
        var currentTime = new Date();
        var deletedList = [];
        var fileName = '';
            fileName = "Deleted-Consignment"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ "Broker Name" ,"Ref No.", "Article ID","Date" ]
          };
          let reference_No = 'reference_No';
          let brokername ='brokername'
          let article_Id = 'article_Id';
          let dat = 'dat';
          for (var delketeVal in deletedSelectedRows) {
              var deleteObj = deletedSelectedRows[delketeVal];
              var deleteMainObj = (
                deleteMainObj={},
                  deleteMainObj[brokername]= deleteObj.brokername != null ? deleteObj.brokername: '', deleteMainObj,
                deleteMainObj[reference_No]= deleteObj.reference_number != null ? deleteObj.reference_number: '', deleteMainObj,
                deleteMainObj[article_Id]= deleteObj.barcodelabelNumber != null ? deleteObj.barcodelabelNumber.substring(18, 41) : '', deleteMainObj,
                  deleteMainObj[dat]= deleteObj.dat != null ? deleteObj.dat : '', deleteMainObj
              );
              deletedList.push(deleteMainObj);
          }
        new Angular2Csv(deletedList, fileName, options);        
      }else{
        this.errorMsg = "**Please select the below records to download the Deleted Consignment details";
      } 
  };

  downloadShipmentData(Type){

   console.log(Type);
   var shipmentSelectedRows;
  if(Type==="fil")
  {
shipmentSelectedRows =  this.gridOptionsShipment1.api.getSelectedRows();
  }
  else
  {
shipmentSelectedRows =  this.gridOptionsShipment.api.getSelectedRows();
  }
    
    if(shipmentSelectedRows.length > 0 ){
        var currentTime = new Date();
        var shipmentList = [];
        var fileName = '';
            fileName = "Shipment-Consignment"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ "Broker Name","Invoice Number", "value", "Shipped Quantity", "Del Name", "Del Addr1",  "Del Addr2 (suburb)", "Del Addr3 (state)",
              "Del Addr4 (country)", "PostCode",  "Email",  "Telephone",  "Product Description",  "Origin", "Weight",
              "Tracking Template",  "Tracking Number",  "Inventory short name", "Supplier", "Bill Me",  "ServiceType",  "BagName",
              "Length", "Width",  "Height", "Currency", "Cost Freight", "Cost Insurance", "ABN ARN Number" ,"Date","Manifest"]
          };
          let broker_name ='broker_name';
          let invoice_number = 'invoice_number';
          let value = 'value';
          let shipped_quantity = 'shipped_quantity';
          let delname = 'delname';
          let deladdr1 = 'deladdr1';
          let deladdr2 = 'deladdr2';
          let deladdr3 = 'deladdr3';
          let deladdr4 = 'deladdr4';
          let postcode = 'postcode';
          let email = 'email';
          let telephone = 'telephone';
          let product_description = 'product_description';
          let origin = 'origin';
          let weight = 'weight';
          let tracking_template = 'tracking_template';
          let tracking_number = 'tracking_number';
          let inventory_short_name = 'inventory_short_name';
          let supplier = 'supplier';
          let bill_me = 'bill_me';
          let ServiceType = 'ServiceType';
          let BagName = 'BagName';
          let Length = 'Length';
          let Width = 'Width';
          let Height = 'Height';
          let Currency = 'Currency';
          let Cost_Freight = 'Cost_Freight';
          let Cost_Insurance = 'Cost_Insurance';
          let ABN_ARN = 'ABN_ARN';
          let dat = 'dat';
          let manifest = 'manifest';

          for (var importVal in shipmentSelectedRows) {
              var shipmentObj = shipmentSelectedRows[importVal];
              var shipmentMainObj = (
                shipmentMainObj={},
                shipmentMainObj[broker_name]= shipmentObj.broker_name != null ? shipmentObj.broker_name: '',shipmentMainObj,
                shipmentMainObj[invoice_number]= shipmentObj.reference_number != null ? shipmentObj.reference_number: '', shipmentMainObj,
                shipmentMainObj[value]= shipmentObj.value != null ? shipmentObj.value: '', shipmentMainObj,
                shipmentMainObj[shipped_quantity]= shipmentObj.shippedQuantity != null ? shipmentObj.shippedQuantity: '', shipmentMainObj,
                shipmentMainObj[delname]= shipmentObj.consignee_name != null ? shipmentObj.consignee_name: '', shipmentMainObj,
                shipmentMainObj[deladdr1]= shipmentObj.consignee_addr1 != null ? shipmentObj.consignee_addr1: '', shipmentMainObj,
                shipmentMainObj[deladdr2]= shipmentObj.consignee_Suburb != null ? shipmentObj.consignee_Suburb: '', shipmentMainObj,
                shipmentMainObj[deladdr3]= shipmentObj.consignee_State != null ? shipmentObj.consignee_State: '', shipmentMainObj,
                shipmentMainObj[deladdr4]= shipmentObj.consignee_country != null ? shipmentObj.consignee_country: 'AU', shipmentMainObj,
                shipmentMainObj[postcode]= shipmentObj.consignee_Postcode != null ? shipmentObj.consignee_Postcode: '', shipmentMainObj,
                shipmentMainObj[email]= shipmentObj.email != null ? shipmentObj.email: '', shipmentMainObj,
                shipmentMainObj[telephone]= shipmentObj.consignee_Phone != null ? shipmentObj.consignee_Phone: '', shipmentMainObj,
                shipmentMainObj[product_description]= shipmentObj.product_Description != null ? shipmentObj.product_Description: '', shipmentMainObj,
                shipmentMainObj[origin]= shipmentObj.shipper_Country != null ? shipmentObj.shipper_Country: '', shipmentMainObj,
                shipmentMainObj[weight]= shipmentObj.weight != null ? shipmentObj.weight: '', shipmentMainObj,
                shipmentMainObj[tracking_template]= shipmentObj.tracking_template != null ? shipmentObj.tracking_template: '', shipmentMainObj,
                shipmentMainObj[tracking_number]= shipmentObj.barcodelabelNumber != null ? shipmentObj.barcodelabelNumber: '', shipmentMainObj,
                shipmentMainObj[inventory_short_name]= shipmentObj.articleID != null ? shipmentObj.articleID: '', shipmentMainObj,
                shipmentMainObj[supplier]= shipmentObj.supplier != null ? shipmentObj.supplier: '', shipmentMainObj,
                shipmentMainObj[bill_me]= shipmentObj.bill_me != null ? shipmentObj.bill_me: 1, shipmentMainObj,
                shipmentMainObj[ServiceType]= shipmentObj.servicetype != null ? shipmentObj.servicetype: '', shipmentMainObj,
                shipmentMainObj[BagName]= shipmentObj.BagName != null ? shipmentObj.BagName: 1, shipmentMainObj,
                shipmentMainObj[Length]= shipmentObj.dimensions_Length != null ? shipmentObj.dimensions_Length: '', shipmentMainObj,
                shipmentMainObj[Width]= shipmentObj.dimensions_Width != null ? shipmentObj.dimensions_Width: '', shipmentMainObj,
                shipmentMainObj[Height]= shipmentObj.dimensions_Height != null ? shipmentObj.dimensions_Height: '', shipmentMainObj,
                shipmentMainObj[Currency]= shipmentObj.currency != null ? shipmentObj.currency: '', shipmentMainObj,
                shipmentMainObj[Cost_Freight]= shipmentObj.Cost_Freight != null ? shipmentObj.Cost_Freight: '', shipmentMainObj,
                shipmentMainObj[Cost_Insurance]= shipmentObj.Cost_Insurance != null ? shipmentObj.Cost_Insurance: '', shipmentMainObj,
                shipmentMainObj[ABN_ARN]= shipmentObj.ABN_ARN != null ? shipmentObj.ABN_ARN: '', shipmentMainObj,
                 shipmentMainObj[dat]= shipmentObj.dat != null ? shipmentObj.dat: '', shipmentMainObj,
                  shipmentMainObj[manifest]= shipmentObj.manifest != null ? shipmentObj.manifest: '', shipmentMainObj
              );
              shipmentList.push(shipmentMainObj)
          }
        new Angular2Csv(shipmentList, fileName, options);        
      }else{
      if(Type==="fil")
  {
    this.errorMsg1 = "**Please select the below records to download the Shipment Consignment details";
  }
  else
  {
    this.errorMsg = "**Please select the below records to download the Shipment Consignment details";
  }
      
      } 
  };
downloadNonShipmentData(){
console.log("imhere");
 var nonshipmentSelectedRows = this.gridOptionsNonShipment.api.getSelectedRows();
    if(nonshipmentSelectedRows.length > 0 ){
 var currentTime = new Date();
        var NonshipmentList = [];
        var fileName = '';
            fileName = "NonShipment-Consignment"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ "Broker Name","Invoice Number", "value", "Shipped Quantity", "Del Name", "Del Addr1",  "Del Addr2 (suburb)", "Del Addr3 (state)",
              "Del Addr4 (country)", "PostCode",  "Email",  "Telephone",  "Product Description",  "Origin", "Weight",
              "Tracking Template",  "Tracking Number",  "Inventory short name", "Supplier", "Bill Me",  "ServiceType",  "BagName",
              "Length", "Width",  "Height", "Currency", "Cost Freight", "Cost Insurance", "ABN ARN Number" ,"Date"]
          };
          let broker_name ='broker_name';
          let invoice_number = 'invoice_number';
          let value = 'value';
          let shipped_quantity = 'shipped_quantity';
          let delname = 'delname';
          let deladdr1 = 'deladdr1';
          let deladdr2 = 'deladdr2';
          let deladdr3 = 'deladdr3';
          let deladdr4 = 'deladdr4';
          let postcode = 'postcode';
          let email = 'email';
          let telephone = 'telephone';
          let product_description = 'product_description';
          let origin = 'origin';
          let weight = 'weight';
          let tracking_template = 'tracking_template';
          let tracking_number = 'tracking_number';
          let inventory_short_name = 'inventory_short_name';
          let supplier = 'supplier';
          let bill_me = 'bill_me';
          let ServiceType = 'ServiceType';
          let BagName = 'BagName';
          let Length = 'Length';
          let Width = 'Width';
          let Height = 'Height';
          let Currency = 'Currency';
          let Cost_Freight = 'Cost_Freight';
          let Cost_Insurance = 'Cost_Insurance';
          let ABN_ARN = 'ABN_ARN';
          let dat = 'Dat';

          for (var importVal in nonshipmentSelectedRows) {
              var shipmentObj = nonshipmentSelectedRows[importVal];
              var shipmentMainObj = (
                shipmentMainObj={},
                shipmentMainObj[broker_name]= shipmentObj.broker_name != null ? shipmentObj.broker_name: '',shipmentMainObj,
                shipmentMainObj[invoice_number]= shipmentObj.reference_number != null ? shipmentObj.reference_number: '', shipmentMainObj,
                shipmentMainObj[value]= shipmentObj.value != null ? shipmentObj.value: '', shipmentMainObj,
                shipmentMainObj[shipped_quantity]= shipmentObj.shippedQuantity != null ? shipmentObj.shippedQuantity: '', shipmentMainObj,
                shipmentMainObj[delname]= shipmentObj.consignee_name != null ? shipmentObj.consignee_name: '', shipmentMainObj,
                shipmentMainObj[deladdr1]= shipmentObj.consignee_addr1 != null ? shipmentObj.consignee_addr1: '', shipmentMainObj,
                shipmentMainObj[deladdr2]= shipmentObj.consignee_Suburb != null ? shipmentObj.consignee_Suburb: '', shipmentMainObj,
                shipmentMainObj[deladdr3]= shipmentObj.consignee_State != null ? shipmentObj.consignee_State: '', shipmentMainObj,
                shipmentMainObj[deladdr4]= shipmentObj.consignee_country != null ? shipmentObj.consignee_country: 'AU', shipmentMainObj,
                shipmentMainObj[postcode]= shipmentObj.consignee_Postcode != null ? shipmentObj.consignee_Postcode: '', shipmentMainObj,
                shipmentMainObj[email]= shipmentObj.email != null ? shipmentObj.email: '', shipmentMainObj,
                shipmentMainObj[telephone]= shipmentObj.consignee_Phone != null ? shipmentObj.consignee_Phone: '', shipmentMainObj,
                shipmentMainObj[product_description]= shipmentObj.product_Description != null ? shipmentObj.product_Description: '', shipmentMainObj,
                shipmentMainObj[origin]= shipmentObj.shipper_Country != null ? shipmentObj.shipper_Country: '', shipmentMainObj,
                shipmentMainObj[weight]= shipmentObj.weight != null ? shipmentObj.weight: '', shipmentMainObj,
                shipmentMainObj[tracking_template]= shipmentObj.tracking_template != null ? shipmentObj.tracking_template: '', shipmentMainObj,
                shipmentMainObj[tracking_number]= shipmentObj.barcodelabelNumber != null ? shipmentObj.barcodelabelNumber: '', shipmentMainObj,
                shipmentMainObj[inventory_short_name]= shipmentObj.inventory_short_name != null ? shipmentObj.inventory_short_name: '', shipmentMainObj,
                shipmentMainObj[supplier]= shipmentObj.supplier != null ? shipmentObj.supplier: '', shipmentMainObj,
                shipmentMainObj[bill_me]= shipmentObj.bill_me != null ? shipmentObj.bill_me: 1, shipmentMainObj,
                shipmentMainObj[ServiceType]= shipmentObj.servicetype != null ? shipmentObj.servicetype: '', shipmentMainObj,
                shipmentMainObj[BagName]= shipmentObj.BagName != null ? shipmentObj.BagName: 1, shipmentMainObj,
                shipmentMainObj[Length]= shipmentObj.dimensions_Length != null ? shipmentObj.dimensions_Length: '', shipmentMainObj,
                shipmentMainObj[Width]= shipmentObj.dimensions_Width != null ? shipmentObj.dimensions_Width: '', shipmentMainObj,
                shipmentMainObj[Height]= shipmentObj.dimensions_Height != null ? shipmentObj.dimensions_Height: '', shipmentMainObj,
                shipmentMainObj[Currency]= shipmentObj.currency != null ? shipmentObj.currency: '', shipmentMainObj,
                shipmentMainObj[Cost_Freight]= shipmentObj.Cost_Freight != null ? shipmentObj.Cost_Freight: '', shipmentMainObj,
                shipmentMainObj[Cost_Insurance]= shipmentObj.Cost_Insurance != null ? shipmentObj.Cost_Insurance: '', shipmentMainObj,
                shipmentMainObj[ABN_ARN]= shipmentObj.ABN_ARN != null ? shipmentObj.ABN_ARN: '', shipmentMainObj,
                 shipmentMainObj[dat]= "'"+shipmentObj.dat != null ? shipmentObj.dat: ''+"'", shipmentMainObj
              );
              NonshipmentList.push(shipmentMainObj)
          }
        new Angular2Csv(NonshipmentList, fileName, options);        
      }else{
        this.errorMsg = "**Please select the below records to download the Shipment Consignment details";
      } 
  };

    clearDetails(){

    

        if(this.exportFileType === 'export-consignment'){
          this.rowDataConsignment = [];
        }else if(this.exportFileType === 'export-delete'){
          this.rowDataDeleted = [];
        }else if(this.exportFileType === 'export-shipment'){
          this.rowDataShipment = [];
        }else if(this.exportFileType === 'export-nonshipment'){
          this.rowDataShipment = [];
        }
       
  this.frominput.value = '';
  this.toinput.value = '';
    this.successMsg = null;
    this.errorMsg = null;
   
  };
 clearDetails1(){
   this.myInputVariable.nativeElement.value = '';
     this.articleData = [];
    this.refData = [];
    this.barcodeData = [];
    this.outputData = [];
 this.successMsg1 = null;
    this.errorMsg1 = null;
if(this.exportFileType1 === 'export-consignment'){
          this.rowDataConsignment1 = [];
        }else if(this.exportFileType1 === 'export-shipment'){
          this.rowDataShipment1 = [];
        }
    }

    exportSearch(){
    this.errorMsg = null;
    this.successMsg = '';
    if(this.errorMsg == null && this.exportFileType === 'export-consignment'){
        this.spinner.show();
        this.trackingDataService.exportConsignment(this.fromDate, this.toDate, (resp) => {
          this.spinner.hide();
          if(resp.status == 400 ){
            this.successMsg = resp.error.errorMessage;
          }
          if(resp.status == undefined ){
            this.rowDataConsignment = resp;
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }else if(this.errorMsg == null && this.exportFileType === 'export-delete'){
      this.spinner.show();
      this.trackingDataService.exportDelete(this.fromDate, this.toDate, (resp) => {
        this.spinner.hide();
        if(resp.status == 400 ){
          this.successMsg = resp.error.errorMessage;
        }
        if(resp.status == undefined ){
          this.rowDataDeleted = resp;
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
       });
     }else if(this.errorMsg == null && this.exportFileType === 'export-shipment'){
      this.spinner.show();
      this.trackingDataService.exportShipment(this.fromDate, this.toDate, (resp) => {
        this.spinner.hide();
        if(resp.status == 400 ){
          this.successMsg = resp.error.errorMessage;
        }
        if(resp.status == undefined ){
          this.rowDataShipment = resp;
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
       });
     }
     else if(this.errorMsg == null && this.exportFileType === 'export-nonshipment'){
      this.spinner.show();
      this.trackingDataService.exportNonShipment(this.fromDate, this.toDate, (resp) => {
        this.spinner.hide();
        if(resp.status == 400 ){
          this.successMsg = resp.error.errorMessage;
        }
        if(resp.status == undefined ){
          this.rowDataShipment = resp;
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
       });
     }
  };
 exportSearch1(){
    this.errorMsg1 = null;
    this.successMsg1 = '';
    this.outputData = [];
    
     if(this.Type1 === 'articleid' && this.articleData.length > 0)
    {
  this.outputData = this.articleData;

    }
    else if(this.Type1 === 'barcodelabel' && this.barcodeData.length > 0)
    {
this.outputData = this.barcodeData;
    }
    else if (this.Type1 === 'referencenumber' && this.refData.length > 0)
    {
    this.outputData = this.refData;
    }

    if(this.outputData.length == 0)
    {
    this.errorMsg1 = "Please Upload the Correct File";
    }
    if(this.errorMsg1 == null && this.exportFileType1 === 'export-consignment'){
        this.spinner.show();
        this.trackingDataService.exportConsignmentfile(this.Type1, this.outputData, (resp) => {
          this.spinner.hide();
          if(resp.status == 400 ){
            this.successMsg1 = resp.error.errorMessage;
          }
          if(resp.status == undefined ){
            this.rowDataConsignment1 = resp;
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }else if(this.errorMsg == null && this.exportFileType1 === 'export-shipment'){
      this.spinner.show();
      this.trackingDataService.exportShipmentfile(this.Type1, this.outputData, (resp) => {
        this.spinner.hide();
       
        if(resp.status == 400 ){
          this.successMsg1 = resp.error.errorMessage;
        }
        if(resp.status == undefined ){
          this.rowDataShipment1 = resp;
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
       });
     }
    
  };

  onConsignmentChange() {
    var consignmentSelectedRows = this.gridOptionsConsignment.api.getSelectedRows();
    this.errorMsg = null;
  };

  onDeletedChange(){
    var deletedSelectedRows = this.gridOptionsDeleted.api.getSelectedRows();
    this.errorMsg = null;
  }

  onShipmentChange(){
    var shipmentSelectedRows = this.gridOptionsShipment.api.getSelectedRows();
    this.errorMsg = null;
  }
 onNonShipmentChange(){
    var nonshipmentSelectedRows = this.gridOptionsNonShipment.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


