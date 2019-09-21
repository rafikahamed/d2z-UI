import { Component, ElementRef, ViewChild, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';

declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
};

@Component({
  selector: 'hms-download-shipment',
  templateUrl: './download-shipment.component.html',
  styleUrls: ['./download-shipment.component.css']
})
export class DownloadShipmentComponent implements OnInit{
@ViewChild('myInput') myInputVariable: ElementRef;
  shipmentNumber: string;
  templateType: String;
  templateType1: String;
  errorMsg: string;
  successMsg: String;
  errorMsg1: string;
  successMsg1: String;
  template1: Boolean;
  template2: Boolean;
  template11: Boolean;
  template21: Boolean;
  userName: String;
  role_id: String;
  userId: String;
  system: String;
  private gridOptions: GridOptions;
  private gridOptionsTemplate1: GridOptions;
   private gridOptions1: GridOptions;
  private gridOptionsTemplate11: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private rowData1: any[];
  private defaultColDef;
  ShipmentArray: dropdownTemplate[];  
  templateArray: dropdownTemplate[];
  templateArray1: dropdownTemplate[];
  selectedTemplate: dropdownTemplate;
  selectedTemplate1: dropdownTemplate;
  selectedType: dropdownTemplate;
  TypeDropdown: dropdownTemplate[];  
  articleData = [];
  barcodeData=[];
  refData=[];
  outputData  =[];
  public importList1 = [];
  arrayBuffer:any;
  file:File;
  Type1: String;

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();
    this.ShipmentArray = [];
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };


    this.gridOptions.columnDefs = [

      {
        headerName: "Reference number",
        field: "referenceNumber",
        width: 180,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "CONNOTE NO",
        field: "con_no",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 150
      },
      {
        headerName: "Consignee Name",
        field: "consigneeName",
        width: 200
      },
    /** {
        headerName: "Consignee  Company",
        field: "consigneeCompany",
        width: 100
      },*/
      {
        headerName: "Consignee Phone",
        field: "consigneePhone",
        width: 100
      },
      {
        headerName: "Consignee Address",
        field: "consigneeAddress",
        width: 100
      },
      {
        headerName: "Consignee Suburb",
        field: "consigneeSuburb",
        width: 150
      },
      {
        headerName: "Consignee State",
        field: "consigneeState",
        width: 160
      },
      {
        headerName: "Consignee Postcode",
        field: "consigneePostcode",
        width: 100
      },
      {
        headerName: "destination",
        field: "destination",
        width: 150
      },
      {
        headerName: "quantity",
        field: "quantity",
        width: 100
      },
      {
        headerName: "commodity",
        field: "commodity",
        width: 100
      },
      {
        headerName: "value",
        field: "value",
        width: 100
      },
      {
        headerName: "cmeter",
        field: "cmeter",
        width: 100
      },
      {
        headerName: "shipperName",
        field: "shipperName",
        width: 100
      },
      {
        headerName: "shipperAddress",
        field: "shipperAddress",
        width: 140
      },
    /** {
        headerName: "shipperCity",
        field: "shipperCity",
        width: 140
      },*/
      {
        headerName: "shipperState",
        field: "shipperState",
        width: 140
      },
      {
        headerName: "shipperPostcode",
        field: "shipperPostcode",
        width: 140
      },
      {
        headerName: "shipperCountry",
        field: "shipperCountry",
        width: 140
      },
      {
        headerName: "shipperContact",
        field: "shipperContact",
        width: 140
      },
     /** {
        headerName: "insurance",
        field: "insurance",
        width: 140
      },
      {
        headerName: "clear",
        field: "clear",
        width: 140
      },
      {
        headerName: "invoiceRef",
        field: "invoiceRef",
        width: 250
      },
      {
        headerName: "importerAbn",
        field: "importerAbn",
        width: 250
      },
      {
        headerName: "vendorId",
        field: "vendorId",
        width: 250
      },
      {
        headerName: "consignorTin",
        field: "consignorTin",
        width: 250
      },
      {
        headerName: "fbapo",
        field: "fbapo",
        width: 250
      },
      {
        headerName: "fbashipmentID",
        field: "fbashipmentID",
        width: 250
      }*/
    ];

 this.gridOptions1 = <GridOptions>{ rowSelection: "multiple" };
    

    this.gridOptions1.columnDefs =   this.gridOptions.columnDefs ;
    this.gridOptionsTemplate1 = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsTemplate1.columnDefs = [
      {
        headerName: "Reference number",
        field: "reference_number",
        width: 180,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "CONNOTE NO",
        field: "barcodelabelNumber",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 150
      },
      {
        headerName: "Consignee Name",
        field: "consignee_name",
        width: 200
      },
      {
        headerName: "Consignee Phone",
        field: "consignee_Phone",
        width: 100
      },
      {
        headerName: "Consignee Address",
        field: "consignee_addr1",
        width: 100
      },
      {
        headerName: "Consignee Suburb",
        field: "consignee_Suburb",
        width: 150
      },
      {
        headerName: "Consignee State",
        field: "consignee_State",
        width: 160
      },
      {
        headerName: "Consignee Postcode",
        field: "consignee_Postcode",
        width: 100
      },
      {
        headerName: "Consignee  Company",
        field: "consigneeCompany",
        width: 100
      },
      {
        headerName: "destination",
        field: "destination",
        width: 150
      },
      {
        headerName: "quantity",
        field: "shippedQuantity",
        width: 100
      },
      {
        headerName: "commodity",
        field: "product_Description",
        width: 100
      },
      {
        headerName: "value",
        field: "value",
        width: 100
      },
      {
        headerName: "cmeter",
        field: "cmeter",
        width: 100
      },
      {
        headerName: "shipperName",
        field: "shipper_Name",
        width: 100
      },
      {
        headerName: "shipperAddress",
        field: "shipper_Addr1",
        width: 140
      },
      {
        headerName: "shipperCity",
        field: "shipper_City",
        width: 140
      },
      {
        headerName: "shipperState",
        field: "shipper_State",
        width: 140
      },
      {
        headerName: "shipperPostcode",
        field: "shipper_Postcode",
        width: 140
      },
      {
        headerName: "shipperCountry",
        field: "shipper_Country",
        width: 140
      },
      {
        headerName: "shipperContact",
        field: "airwayBill",
        width: 140
      },
      {
        headerName: "insurance",
        field: "insurance",
        width: 140
      },
      {
        headerName: "clear",
        field: "clear",
        width: 140
      },
      {
        headerName: "invoiceRef",
        field: "invoiceRef",
        width: 250
      },
      {
        headerName: "importerAbn",
        field: "importerAbn",
        width: 250
      },
      {
        headerName: "vendorId",
        field: "vendorId",
        width: 250
      },
      {
        headerName: "consignorTin",
        field: "consignorTin",
        width: 250
      },
      {
        headerName: "fbapo",
        field: "fbapo",
        width: 250
      },
      {
        headerName: "fbashipmentID",
        field: "fbashipmentID",
        width: 25
      }
    ];

      this.gridOptionsTemplate11 = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsTemplate11.columnDefs = [
      {
        headerName: "Reference number",
        field: "reference_number",
        width: 180,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "CONNOTE NO",
        field: "barcodelabelNumber",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 150
      },
      {
        headerName: "Consignee Name",
        field: "consignee_name",
        width: 200
      },
      {
        headerName: "Consignee Phone",
        field: "consignee_Phone",
        width: 100
      },
      {
        headerName: "Consignee Address",
        field: "consignee_addr1",
        width: 100
      },
      {
        headerName: "Consignee Suburb",
        field: "consignee_Suburb",
        width: 150
      },
      {
        headerName: "Consignee State",
        field: "consignee_State",
        width: 160
      },
      {
        headerName: "Consignee Postcode",
        field: "consignee_Postcode",
        width: 100
      },
      {
        headerName: "Consignee  Company",
        field: "consigneeCompany",
        width: 100
      },
      {
        headerName: "destination",
        field: "destination",
        width: 150
      },
      {
        headerName: "quantity",
        field: "shippedQuantity",
        width: 100
      },
      {
        headerName: "commodity",
        field: "product_Description",
        width: 100
      },
      {
        headerName: "value",
        field: "value",
        width: 100
      },
      {
        headerName: "cmeter",
        field: "cmeter",
        width: 100
      },
      {
        headerName: "shipperName",
        field: "shipper_Name",
        width: 100
      },
      {
        headerName: "shipperAddress",
        field: "shipper_Addr1",
        width: 140
      },
      {
        headerName: "shipperCity",
        field: "shipper_City",
        width: 140
      },
      {
        headerName: "shipperState",
        field: "shipper_State",
        width: 140
      },
      {
        headerName: "shipperPostcode",
        field: "shipper_Postcode",
        width: 140
      },
      {
        headerName: "shipperCountry",
        field: "shipper_Country",
        width: 140
      },
      {
        headerName: "shipperContact",
        field: "airwayBill",
        width: 140
      },
      {
        headerName: "insurance",
        field: "insurance",
        width: 140
      },
      {
        headerName: "clear",
        field: "clear",
        width: 140
      },
      {
        headerName: "invoiceRef",
        field: "invoiceRef",
        width: 250
      },
      {
        headerName: "importerAbn",
        field: "importerAbn",
        width: 250
      },
      {
        headerName: "vendorId",
        field: "vendorId",
        width: 250
      },
      {
        headerName: "consignorTin",
        field: "consignorTin",
        width: 250
      },
      {
        headerName: "fbapo",
        field: "fbapo",
        width: 250
      },
      {
        headerName: "fbashipmentID",
        field: "fbashipmentID",
        width: 25
      }
    ];
  }

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.spinner.show();
      this.template1 = true;
      this.template11 = true;
      this.getLoginDetails();
      this.userId = this.consigmentUploadService.userMessage.user_id;
      this.templateArray = [
        { "name": "Export Template 1", "value": "export-template-1" },
        { "name": "Export Template 2", "value": "export-template-2" }
      ];
      this.selectedTemplate = this.templateArray[0];
       this.templateArray1 = [
        { "name": "Export Template 1", "value": "export-template-1" },
        { "name": "Export Template 2", "value": "export-template-2" }
      ];
      this.selectedTemplate1 = this.templateArray1[0];
      this.templateType = this.templateArray[0].value;
      this.templateType1 = this.templateArray1[0].value;

       this.TypeDropdown = [
        { "name": "Article ID", "value": "articleid" },
        { "name": "Barcode Label", "value": "barcodelabel" },
        { "name": "Reference Number", "value": "referencenumber" 
        }
      ];
      this.selectedType = this.TypeDropdown[0];
       this.Type1 = this.TypeDropdown[0].value;
      this.trackingDataService.shipmentList(this.userId, (resp) => {
        this.spinner.hide();
        this.ShipmentArray = resp;
        this.shipmentNumber = this.ShipmentArray[0] ? this.ShipmentArray[0].value: '';
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
  
  onShipmentChange(event){
    this.shipmentNumber = event.value ? event.value.value:'';
  };

   onTypeChange(event){
 
       this.Type1 = event.value.value;
      this.myInputVariable.nativeElement.value = null;
    this.file = null;
     this.articleData = [];
    this.refData = [];
    this.barcodeData = [];
    this.rowData1 = [];
   
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
          console.log(dataObj);
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

  onTemplateChange(event){
    this.templateType = event.value.value;
    if(event.value.value == 'export-template-2'){
      this.template1 = false;
      this.template2 = true;
      this.rowData = null;
    }else if(event.value.value == 'export-template-1'){
      this.template1 = true;
      this.template2 = false;
      this.rowData = null;
    } 
  }
onTemplateChange1(event){
    this.templateType1 = event.value.value;
    if(event.value.value == 'export-template-2'){
      this.template11 = false;
      this.template21 = true;
      this.rowData1 = null;
    }else if(event.value.value == 'export-template-1'){
      this.template11 = true;
      this.template21 = false;
      this.rowData1 = null;
    } 
  }
  downLoadSearch(){
    this.rowData=null;
    if(this.templateType == 'export-template-1'){
      this.spinner.show();
      this.trackingDataService.fetchShipmentDetails(this.shipmentNumber, this.userId, (resp) => {
        this.spinner.hide();
        this.rowData = resp;
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      });
    }else if(this.templateType == 'export-template-2'){
      this.spinner.show();
      this.trackingDataService.fetchShipmentDetailsTempalte2(this.shipmentNumber, this.userId,(resp) => {
        this.spinner.hide();
        this.rowData = resp;
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      });
    }
  }


 downLoadSearch1(){
    this.rowData1=null;
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
    if(this.errorMsg1 == null && this.templateType1 == 'export-template-1'){
      this.spinner.show();
      this.trackingDataService.fetchShipmentDetailsType(this.outputData, this.userId,this.Type1, (resp) => {
        this.spinner.hide();
        this.rowData1 = resp;
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      });
    }
    else if(this.errorMsg1 == null && this.templateType1 == 'export-template-2'){
      this.spinner.show();
      this.trackingDataService.fetchShipmentDetailsTempalte2Type(this.outputData ,this.userId,this.Type1,(resp) => {
        this.spinner.hide();
        this.rowData1 = resp;
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      });
    }
  };

  downloadShipmentDetails(Type){
    this.errorMsg = null;
    if(this.template1 || this.template2){
 var selectedRowsTemplate1;
     if(Type==="fil")
  {
selectedRowsTemplate1  = this.gridOptions1.api.getSelectedRows();
  }
  else
  {
  selectedRowsTemplate1  = this.gridOptions.api.getSelectedRows();
  }
      
      if(selectedRowsTemplate1.length > 0){
        var currentTime = new Date();
        var shipmentList = [];
        var fileName = '';
            fileName = "Shipment_Details_Template1"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ "TYPE" , "CONNOTE NO.", "WEIGHT", "CNEE", "TEL","ADDRESS","SUBURB","STATE","P/C","DESTINATION","DESTINATION1",
            "PCS","COMMODITY","INNER ITEMS","UNIT VALUE","TTL VALUE","CMETER","SHIPPER","SHIPPER ADD","SHIPPER STATE","SHIPPER PC",
            "SHIPPER COUNTRY CODE","SHIPPER CONTACT","SAC" ]
          };
          let TYPE = 'TYPE';
        
          let CONNOTE_NO = 'CONNOTE_NO';
          let WEIGHT = 'WEIGHT';
          let CNEE = 'CNEE';
         
          let TEL = 'TEL';
          let ADDRESS = 'ADDRESS';
          let SUBURB = 'SUBURB';
          let STATE = 'STATE';
          let PC = 'PC';
          let DESTINATION = 'DESTINATION';
           let DESTINATION1 = 'DESTINATION1';
          let PCS = 'PCS';
          let COMMODITY = 'COMMODITY';
          let INNER_ITEMS = 'INNER ITEMS';
          let UNIT_VALUE = 'UNIT_VALUE';
          let TTL_VALUE = 'TTL_VALUE';
          let CMETER = 'CMETER';
          let SHIPPER = 'SHIPPER';
          let SHIPPER_ADD = 'SHIPPER_ADD';
         
          let SHIPPER_STATE = 'SHIPPER_STATE';
          let SHIPPER_PC = 'SHIPPER_PC';
          let SHIPPER_COUNTRY_CODE = 'SHIPPER_COUNTRY_CODE';
          let SHIPPER_CONTACT = 'SHIPPER_CONTACT';
          let SAC = 'SAC';
      
          for (var importVal in selectedRowsTemplate1) {

              var adminObj = selectedRowsTemplate1[importVal];
              console.log(adminObj.destination);
              var importObj = (
                  importObj={}, 
                  importObj[TYPE] = 'Parcel',importObj,
                 
                  importObj[CONNOTE_NO]= adminObj.con_no != null ? adminObj.con_no : '', importObj,
                  importObj[WEIGHT]= adminObj.weight != null ? adminObj.weight : '', importObj,
                  importObj[CNEE]= adminObj.consigneeName != null ? adminObj.consigneeName : '', importObj,
                
                  importObj[TEL]= adminObj.consigneePhone != null ? adminObj.consigneePhone : '', importObj,
                  importObj[ADDRESS]= adminObj.consigneeAddress != null ? adminObj.consigneeAddress : '', importObj,
                  importObj[SUBURB]= adminObj.consigneeSuburb != null ? adminObj.consigneeSuburb : '', importObj,
                  importObj[STATE]= adminObj.consigneeState != null ? adminObj.consigneeState : '', importObj,
                  importObj[PC]= adminObj.consigneePostcode != null ? adminObj.consigneePostcode : '',  importObj,
                  importObj[DESTINATION]= adminObj.destination != null ? adminObj.destination : '', importObj,
                    importObj[DESTINATION1]= 'AUSTRALIA', importObj,
                  importObj[PCS]= adminObj.quantity != null ? adminObj.quantity : '', importObj,
                  importObj[COMMODITY]= adminObj.commodity != null ? adminObj.commodity : '', importObj,
                  importObj[INNER_ITEMS]= '1', importObj,
                  importObj[UNIT_VALUE] = adminObj.value != null ? adminObj.value : '', importObj,
                  importObj[TTL_VALUE]= adminObj.value != null ? adminObj.value : '', importObj,
                  importObj[CMETER]= '0.02', importObj,
                  importObj[SHIPPER]= adminObj.shipperName != null ? adminObj.shipperName : '', importObj,
                  importObj[SHIPPER_ADD]= adminObj.shipperAddress != null ? adminObj.shipperAddress : '', importObj,
                  importObj[SHIPPER_STATE]= adminObj.shipperState != null ? adminObj.shipperState : '', importObj,
                  importObj[SHIPPER_PC]= adminObj.shipperPostcode != null ? adminObj.shipperPostcode : '', importObj,
                  importObj[SHIPPER_COUNTRY_CODE]= 'MY', importObj,
                  //importObj[SHIPPER_COUNTRY_CODE]= adminObj.shipperCountry != null ? adminObj.shipperCountry : '', importObj,
                  importObj[SHIPPER_CONTACT]= adminObj.shipperContact != null ? adminObj.shipperContact : '', importObj

                );
                console.log(importObj);
              shipmentList.push(importObj)
          }
        new Angular2Csv(shipmentList, fileName, options); 
        }else{
             this.errorMsg = "**Please select the below records to download the Shipment details";
        };
      };
    
    //Template 2 File Download
    if(this.template2 || this.template21){
     var selectedRowsTemplate2 ;
     if(Type==="fil")
  {
selectedRowsTemplate2    = this.gridOptionsTemplate11.api.getSelectedRows();
  }
  else
  {
  selectedRowsTemplate2    = this.gridOptionsTemplate1.api.getSelectedRows();
  }
      
        if(selectedRowsTemplate2.length > 0){
          var currentTime = new Date();
          var shipmentTemplateList = [];
          var fileName = '';
              fileName = "Shipment_Details_Template2"+"-"+currentTime.toLocaleDateString();
            var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: ["Level Number", "HAWB Number", "Mawb Reference", "Debtor Code",  "Shipper", 
                "Shipper Address 1", "Shipper Address 2", "Shipper City", "Shipper State", "Shipper Country",
                "Shipper Postcode",  "Inco Term",  "Yes/No Question",  "Consignee", "Consignee Address 1","Consignee Address 2",
                "Consignee Suburb", "Consignee  Postcode", "Consignee State",  "Consignee Country",  "Consignee Contact",  "Consignee Phone",  "Consignee Email",  "Load Port", "Discharge",    
                "Weight",  "UW", "Outer Pack", "Outer Pack Type", "HAWB Reference", 
                "Alternate Reference",  "Description of Goods", "Goods Value",  "Goods Value Currency",
                "Clearance Reference",  "Length", "Width",  "Height", "Cubic Measure",  "Cubic Measure Unit", "Cubic Weight","Weight Measure",
                "COD Amount", "COD Amount Currency",  "Origin Station", "Origin Member",  "Bag Number",
                "Notes",  "Shipper Address Location", "Shipper Address State",  "Shipper Address Postcode", "Shipper Address Country",
                "Shipper Phone", "Shipper Email", "Consignee Address Location", "Consignee Address State", "Consignee Address Postcode",
                "Consignee Address Country",  "Vendor code", "Importer ID"]
            };
            let Level_Number = 'Level_Number';
            let Airwaybill_Number = 'Airwaybill_Number';
            let Mawb_Reference = 'Mawb_Reference';
            let Debtor_Code = 'Debtor_Code';
            let Shipper = 'Shipper';
            let Shipper_Address_1 = 'Shipper_Address_1';
            let Shipper_Address_2 = 'Shipper_Address_2';
            let City = 'City';
            let UNLOCODE = 'UNLOCODE';
            let Country = 'Country';
            let Shipper_Address_4 = 'Shipper_Address_4';
            let Shipper_Address_5 = 'Shipper Address 5';
            let Shipper_Contact = 'Shipper_Contact';
            let Consignee_Name = 'Consignee_Name';
            let Consignee_Address_1 = 'Consignee_Address_1';
            let Consignee_Address_2 = 'Consignee_Address_2';
            let Suburb = 'Suburb';
            let POSTCODE = 'POSTCODE';
            let STATE = 'STATE';
            let COUNTRY = 'COUNTRY';
            let Consignee_Contact = 'Consignee_Contact';
            let Consignee_Phone = 'Consignee_Phone';
            let Consignee_Email = 'Consignee_Email';
            let Origin = 'Origin';
            let Destination = 'Destination';
            let Actual_Weight = 'Actual_Weight';
            let UW = 'UW';
            let Number_of_Pieces = 'Number_of_Pieces';
            let Service_Type = 'Service_Type';
            let HAWB_Reference = 'HAWB_Reference';
            let Alternate_Reference = 'Alternate_Reference';
            let Description_of_Goods = 'Description_of_Goods';
            let Customs_Value = 'Customs_Value';
            let Customs_Value_Currency = 'Customs_Value_Currency';
            let Clearance_Reference = 'Clearance_Reference';
            let Length = 'Length';
            let Width = 'Width';
            let Height = 'Height';
            let Cubic_Measure = 'Cubic_Measure';
            let Cubic_Measure_Unit = 'Cubic_Measure_Unit';
            let Cubic_Weight = 'Cubic_Weight';
            let Weight_Measure = 'Weight_Measure';
            let COD_Amount = 'COD_Amount';
            let COD_Amount_Currency = 'COD_Amount_Currency';
            let Origin_Station = 'Origin_Station';
            let Origin_Member = 'Origin_Member';
            let Bag_Number = 'Bag_Number';
            let Notes = 'Notes';
            let Shipper_Address_Location = 'Shipper_Address_Location';
            let Shipper_Address_State = 'Shipper_Address_State';
            let Shipper_Address_Postcode = 'Shipper_Address_Postcode';
            let Shipper_Address_Country = 'Shipper_Address_Country';
            let Shipper_Phone = 'Shipper_Phone';
            let Shipper_Email = 'Shipper_Email';
            let Consignee_Address_Location = 'Consignee_Address_Location';
            let Consignee_Address_State = 'Consignee_Address_State';
            let Consignee_Address_Postcode = 'Consignee_Address_Postcode';
            let Consignee_Address_Country = 'Consignee_Address_Country';
            let Vendor_ID = 'Vendor_ID';
            let Importer_ID = 'Importer_ID';

            for (var importVal in selectedRowsTemplate2) {
              var adminObj = selectedRowsTemplate2[importVal];
              var importObj = (
                  importObj={}, 
                  //importObj[Level_Number]= adminObj.level_Number != null ? adminObj.level_Number: 2, importObj,
                  importObj[Level_Number]= 1, importObj,
                  importObj[Airwaybill_Number]= adminObj.barcodelabelNumber != null ? adminObj.barcodelabelNumber.substring(18, 30) : '', importObj,
                  importObj[Mawb_Reference]= adminObj.airwayBill != null ? adminObj.airwayBill : '', importObj,
                  importObj[Debtor_Code]= adminObj.debtor_Code != null ? adminObj.debtor_Code : 1, importObj,
                  importObj[Shipper] = adminObj.shipper_Name != null ? adminObj.shipper_Name : '', importObj,
                  importObj[Shipper_Address_1]= adminObj.shipper_Addr1 != null ? adminObj.shipper_Addr1 : '', importObj,
                  importObj[Shipper_Address_2]= adminObj.shipper_Addr2 != null ? adminObj.shipper_Addr2 : '', importObj,
                  importObj[City]= adminObj.shipper_City != null ? adminObj.shipper_City : '', importObj,
                  importObj[UNLOCODE]= adminObj.shipper_State != null ? adminObj.shipper_State : '', importObj,
                  importObj[Country]= adminObj.shipper_Country != null ? adminObj.shipper_Country : '',  importObj,
                  importObj[Shipper_Address_4]= adminObj.shipper_Postcode != null ? adminObj.shipper_Postcode : '', importObj,
                  importObj[Shipper_Address_5]= 'FOB', importObj,
                  importObj[Shipper_Contact]= 'Y', importObj,
                  importObj[Consignee_Name]= adminObj.consignee_name != null ? adminObj.consignee_name : '', importObj,
                  importObj[Consignee_Address_1] = adminObj.consignee_addr1 != null ? adminObj.consignee_addr1 : '', importObj,
                  importObj[Consignee_Address_2] = adminObj.consignee_addr2 != null ? adminObj.consignee_addr2 : '', importObj,
                  importObj[Suburb]= adminObj.consignee_Suburb != null ? adminObj.consignee_Suburb : '', importObj,
                  importObj[POSTCODE]= adminObj.consignee_Postcode != null ? adminObj.consignee_Postcode: '', importObj,
                  importObj[STATE]= adminObj.consignee_State != null ? adminObj.consignee_State : '', importObj,
                  importObj[COUNTRY]= 'Australia', importObj,
                  importObj[Consignee_Contact]= adminObj.consignee_name != null ? adminObj.consignee_name : '',  importObj,
                  importObj[Consignee_Phone]= adminObj.consignee_Phone != null ? adminObj.consignee_Phone : '', importObj,
                  importObj[Consignee_Email]= adminObj.consignee_Email != null ? adminObj.consignee_Email : '', importObj,
                  importObj[Origin]= 'CNHGH', importObj,
                  importObj[Destination]= 'AUSYD', importObj,
                  importObj[Actual_Weight] = adminObj.weight != null ? adminObj.weight*1000 : '', importObj,
                  importObj[UW]= 'G', importObj,
                  importObj[Number_of_Pieces]= adminObj.shippedQuantity != null ? adminObj.shippedQuantity : '', importObj,
                  importObj[Service_Type]=  'PKG', importObj,
                  importObj[HAWB_Reference]= adminObj.barcodelabelNumber != null ? adminObj.barcodelabelNumber.substring(18, 30) : '', importObj,
                  importObj[Alternate_Reference]= adminObj.reference_number != null ? adminObj.reference_number : '',  importObj,
                  importObj[Description_of_Goods]= adminObj.product_Description != null ? adminObj.product_Description.substring(0, 35) : '', adminObj,
                  importObj[Customs_Value]= adminObj.value != null ? adminObj.value : '', importObj,
                  importObj[Customs_Value_Currency]= adminObj.currency !=null ? adminObj.currency :'', importObj,
                  importObj[Clearance_Reference]= adminObj.clearance_reference != null ? adminObj.clearance_reference : '', importObj,
                  importObj[Length] = 1, importObj,
                  importObj[Width]= 1, importObj,
                  importObj[Height]= 1, importObj,
                  importObj[Cubic_Measure]= 1, importObj,
                  importObj[Cubic_Measure_Unit]= 'CC', importObj,
                  importObj[Cubic_Weight]=  1,  importObj,
				  importObj[Weight_Measure]= '', importObj,
                  importObj[COD_Amount]= adminObj.COD_Amount != null ? adminObj.COD_Amount : '', importObj,
                  importObj[COD_Amount_Currency]= adminObj.COD_Amount_Currency != null ? adminObj.COD_Amount_Currency : '', importObj,
                  importObj[Origin_Station]= adminObj.Origin_Station != null ? adminObj.Origin_Station : '', importObj,
                  importObj[Origin_Member]= adminObj.Origin_Member != null ? adminObj.Origin_Member : '', importObj,
                  importObj[Bag_Number] = '', importObj,
                  importObj[Notes]= adminObj.Notes != null ? adminObj.Notes : '', importObj,
                  importObj[Shipper_Address_Location]= '', importObj,
                  importObj[Shipper_Address_State]= adminObj.Shipper_Address_State != null ? adminObj.Shipper_Address_State : '', importObj,
                  importObj[Shipper_Address_Postcode]= adminObj.Shipper_Address_Postcode != null ? adminObj.Shipper_Address_Postcode : '',  importObj,
                  importObj[Shipper_Address_Country]= adminObj.Shipper_Address_Country != null ? adminObj.Shipper_Address_Country : '', importObj,
                  importObj[Shipper_Phone]= adminObj.Shipper_Phone != null ? adminObj.Shipper_Phone : '', importObj,
                  importObj[Shipper_Email]= adminObj.Shipper_Email !=null ? adminObj.Shipper_Email :'', importObj,
                  importObj[Consignee_Address_Location]= adminObj.Consignee_Address_Location != null ? adminObj.Consignee_Address_Location : '', importObj,
                  importObj[Consignee_Address_State]= adminObj.Consignee_Address_State != null ? adminObj.Consignee_Address_State : '', importObj,
                  importObj[Consignee_Address_Postcode]= adminObj.Consignee_Address_Postcode != null ? adminObj.Consignee_Address_Postcode : '',  importObj,
                  importObj[Consignee_Address_Country]= adminObj.Consignee_Address_Country != null ? adminObj.Consignee_Address_Country : '', importObj,
                  importObj[Vendor_ID]= adminObj.Vendor_ID != null ? adminObj.Vendor_ID : '', importObj,
                  importObj[Importer_ID]= adminObj.Importer_ID !=null ? adminObj.Importer_ID :'', importObj
              );
              shipmentTemplateList.push(importObj)
          };
          new Angular2Csv(shipmentTemplateList, fileName, options); 
        }else{
          this.errorMsg = "**Please select the below records to download the Shipment details";
        };
      };
  }

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  };

  onSelectionTemplateChange(){
    var selectedRows = this.gridOptionsTemplate1.api.getSelectedRows();
    this.errorMsg = null;
  };
 
}


