import { Component, ViewChild,OnInit} from '@angular/core';
import {  MatInput } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/add/operator/filter';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-log-report',
  templateUrl: './log-report.component.html',
  styleUrls: ['./log-report.component.css']
})

export class SuperUserLogReportComponent implements OnInit{
@ViewChild('frominput', {
  read: MatInput
}) frominput: MatInput;

@ViewChild('toinput', {
  read: MatInput
}) toinput: MatInput;

  public importList = [];
  
  errorMsg: string;
  show: Boolean;
  etowerFlag: Boolean;
  auPostFlag: Boolean;
  fdmFlag: Boolean;
  freipostFlag: Boolean;
  mydate: Date;
  successMsg: String;
  fromDate: String;
  toDate: String;
  userName: String;
  role_id: String;
  system: String;
  private gridOptionsEtower: GridOptions;
  private gridOptionsAupost: GridOptions;
  private gridOptionsFdm: GridOptions;
  private gridOptionsFreipost:GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowDataEtower: any[];
  private rowDataAUPost: any[];
  private rowDataFdm: any[];
  private rowDataFreipost: any[];
  private defaultColDef;
  clientDropdown: dropdownTemplate[];  
  selectedClientType: dropdownTemplate;
  shipmentAllocateForm: FormGroup;
  clientType: String;
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consignmenrServices: ConsigmentUploadService
  ) {
    this.show = false;
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
    this.gridOptionsEtower = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsEtower.columnDefs = [
      {
        headerName: "Tracking No",
        field: "trackingNo",
        width: 230,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Order ID",
        field: "orderId",
        width: 200
      },
      {
        headerName: "Reference Number",
        field: "referenceNumber",
        width: 200
      },
      {
        headerName: "API Name",
        field: "apiname",
        width: 150
      },
      {
        headerName: "Error Code",
        field: "errorCode",
        width: 100
      },
      {
        headerName: "Error Message",
        field: "errorMessage",
        width: 200
      },
      {
        headerName: "Timestamp",
        field: "timestamp",
        width: 200
      },
      {
        headerName: "Status",
        field: "status",
        width: 200
      }
    ];

    // This grid is for deleted Items
    this.gridOptionsAupost = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsAupost.columnDefs = [
      {
        headerName: "Article Id",
        field: "articleId",
        width: 250,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Cost",
        field: "cost",
        width: 100
      },
      {
        headerName: "GST",
        field: "gst",
        width: 100
      },
      {
        headerName: "FuelSurcharge",
        field: "fuelSurcharge",
        width: 150
      },
      {
        headerName: "ErrorCode",
        field: "errorCode",
        width: 150
      },
      {
        headerName: "Name",
        field: "name",
        width: 150
      },
      {
        headerName: "Message",
        field: "message",
        width: 200
      },
      {
        headerName: "Field",
        field: "field",
        width: 150
      },
      {
        headerName: "Timestamp",
        field: "timestamp",
        width: 220
      }
    ];

    // This grid is for Shipment Items
    this.gridOptionsFdm = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsFdm.columnDefs = [
     {
        headerName: "Reference Number",
        field: "referencenumber",
        width: 200,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Barcodelabel Number",
        field: "barcodelabelnumber",
        width: 300,
        
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 100
      },
      {
        headerName: "Message",
        field: "message",
        width: 100
      },
      {
        headerName: "Article Id",
        field: "articleid",
        width: 200
      },
      {
        headerName: "Supplier",
        field: "supplier",
        width: 100
      },
      {
        headerName: "Timestamp",
        field: "timestamp",
        width: 200
      },
      {
        headerName: "Response",
        field: "response",
        width: 100
      }
    ];

     // This grid is for NonShipment Items
    this.gridOptionsFreipost = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsFreipost.columnDefs = [
     {
        headerName: "Reference Number",
        field: "referencenumber",
        width: 220,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Barcodelabel Number",
        field: "barcodelabelnumber",
        width: 300,
        
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 100
      },
      {
        headerName: "Supplier",
        field: "supplier",
        width: 100
      },
      {
        headerName: "Timestamp",
        field: "timestamp",
        width: 200
      },
      {
        headerName: "Response",
        field: "response",
        width: 200
      }
     ]
  
  }

  ngOnInit(){
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.clientDropdown = [
        { "name": "eTower", "value": "etower" },
        { "name": "AU Post", "value": "auPost" },
        { "name": "FDM", "value": "fdm"},
        { "name": "Freipost", "value": "freiPost" 
        }
      ];
      this.selectedClientType = this.clientDropdown[0];
      this.clientType = this.clientDropdown[0].value;
      this.getLoginDetails();
      this.etowerFlag = true;
      this.auPostFlag = false;
      this.fdmFlag = false;
      this.freipostFlag = false;
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

  onClientTypeChange(event){
    this.clientType = event.value.value;
    if(event.value.value === 'etower'){
        this.etowerFlag = true;
        this.auPostFlag = false;
        this.fdmFlag = false;
        this.freipostFlag = false;
    }else if(event.value.value === 'auPost'){
        this.etowerFlag = false;
        this.auPostFlag = true;
        this.fdmFlag = false;
        this.freipostFlag = false;
    }else if(event.value.value === 'fdm'){
        this.etowerFlag = false;
        this.auPostFlag = false;
        this.fdmFlag = true;
        this.freipostFlag = false;
    }else if(event.value.value === 'freiPost'){
        this.etowerFlag = false;
        this.auPostFlag = false;
        this.fdmFlag = false;
        this.freipostFlag = true;
    }
  };

  downloadeTowerData(){
    var etowerSelectedRows = this.gridOptionsEtower.api.getSelectedRows();
    if(etowerSelectedRows.length > 0 ){
        var currentTime = new Date();
        var etowerResponseList = [];
        var fileName = '';
            fileName = "eTower Response"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ "API Name" ,"Reference Number", "Order Id", "Tracking No", "Error Code", "Error Message", "Timestamp", "Status" ]
          };

          let apiname = 'apiname';
          let referenceNumber ='referenceNumber'
          let orderId = 'orderId';
          let trackingNo = 'trackingNo';
          let errorCode ='errorCode'
          let errorMessage = 'errorMessage';
          let timestamp = 'timestamp';
          let status ='status';

          for (var etowerVal in etowerSelectedRows) {
              var etwoerObj = etowerSelectedRows[etowerVal];
              var etowerMainObj = (
                etowerMainObj={},
                etowerMainObj[apiname]= etwoerObj.apiname != null ? etwoerObj.apiname: '', etowerMainObj,
                etowerMainObj[referenceNumber]= etwoerObj.referenceNumber != null ? etwoerObj.referenceNumber: '', etowerMainObj,
                etowerMainObj[orderId]= etwoerObj.orderId != null ? etwoerObj.orderId: '', etowerMainObj,
                etowerMainObj[trackingNo]= etwoerObj.trackingNo != null ? etwoerObj.trackingNo: '', etowerMainObj,
                etowerMainObj[errorCode]= etwoerObj.errorCode != null ? etwoerObj.errorCode: '', etowerMainObj,
                etowerMainObj[errorMessage]= etwoerObj.errorMessage != null ? etwoerObj.errorMessage: '', etowerMainObj,
                etowerMainObj[timestamp]= etwoerObj.timestamp != null ? etwoerObj.timestamp: '', etowerMainObj,
                etowerMainObj[status]= etwoerObj.status != null ? etwoerObj.status: '', etowerMainObj
              );
              etowerResponseList.push(etowerMainObj)
          }
        new Angular2Csv(etowerResponseList, fileName, options);        
      }else{
        this.errorMsg = "**Please select the below records to download the eTower Response details";
      } 
  };

   clearDetails(){

    

        if(this.clientType === 'etower'){
          this.rowDataEtower = [];
        }else if(this.clientType === 'auPost'){
          this.rowDataAUPost = [];
        }else if(this.clientType === 'fdm'){
          this.rowDataFdm = [];
        }else if(this.clientType === 'freiPost'){
          this.rowDataFreipost = [];
        }
       
  this.frominput.value = '';
  this.toinput.value = '';
    this.successMsg = null;
    this.errorMsg = null;
   
  };

  downloadAuPostData(){
    var auPostSelectedRows = this.gridOptionsAupost.api.getSelectedRows();
    if(auPostSelectedRows.length > 0 ){
        var currentTime = new Date();
        var auPostResponseList = [];
        var fileName = '';
            fileName = "AU Post Response"+"-"+currentTime.toLocaleDateString();
            var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: [ "Article Id" ,"Cost", "GST", "FuelSurcharge", "Error Code", "Name", "Message", "Field", "Timestamp" ]
            };

          let articleId = 'articleId';
          let cost ='cost'
          let gst = 'gst';
          let fuelSurcharge = 'fuelSurcharge';
          let errorCode ='errorCode'
          let name = 'name';
          let message = 'message';
          let field ='field';
          let timestamp ='timestamp';

          for (var auPostVal in auPostSelectedRows) {
              var auPostObj = auPostSelectedRows[auPostVal];
              var auPostMainObj = (
                auPostMainObj={},
                auPostMainObj[articleId]= auPostObj.articleId != null ? auPostObj.articleId: '', auPostMainObj,
                auPostMainObj[cost]= auPostObj.cost != null ? auPostObj.cost: '', auPostMainObj,
                auPostMainObj[gst]= auPostObj.gst != null ? auPostObj.gst: '', auPostMainObj,
                auPostMainObj[fuelSurcharge]= auPostObj.fuelSurcharge != null ? auPostObj.fuelSurcharge: '', auPostMainObj,
                auPostMainObj[errorCode]= auPostObj.errorCode != null ? auPostObj.errorCode: '', auPostMainObj,
                auPostMainObj[name]= auPostObj.name != null ? auPostObj.name: '', auPostMainObj,
                auPostMainObj[message]= auPostObj.message != null ? auPostObj.message: '', auPostMainObj,
                auPostMainObj[field]= auPostObj.field != null ? auPostObj.field: '', auPostMainObj,
                auPostMainObj[timestamp]= auPostObj.timestamp != null ? auPostObj.timestamp: '', auPostMainObj
              );
              auPostResponseList.push(auPostMainObj)
          }
        new Angular2Csv(auPostResponseList, fileName, options);        
      }else{
        this.errorMsg = "**Please select the below records to download the AU Post Response details";
      } 
  }

  downloadFdmData(){
    var fdmSelectedRows = this.gridOptionsFdm.api.getSelectedRows();
    if(fdmSelectedRows.length > 0 ){
        var currentTime = new Date();
        var fdmResponseList = [];
        var fileName = '';
            fileName = "FDM Response"+"-"+currentTime.toLocaleDateString();
            var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: [ "Reference Number" ,"Barcodelabel Number", "Weight", "Message No", "ArticleId", "Supplier", "Timestamp", "Response" ]
            };

          let referencenumber = 'referencenumber';
          let barcodelabelnumber ='barcodelabelnumber'
          let weight = 'weight';
          let message = 'message';
          let articleid ='articleid'
          let supplier = 'supplier';
          let timestamp = 'timestamp';
          let response ='response';

          for (var fdmVal in fdmSelectedRows) {
              var fdmObj = fdmSelectedRows[fdmVal];
              var fdmMainObj = (
                fdmMainObj={},
                fdmMainObj[referencenumber]= fdmObj.referencenumber != null ? fdmObj.referencenumber: '', fdmMainObj,
                fdmMainObj[barcodelabelnumber]= fdmObj.barcodelabelnumber != null ? fdmObj.barcodelabelnumber: '', fdmMainObj,
                fdmMainObj[weight]= fdmObj.weight != null ? fdmObj.weight: '', fdmMainObj,
                fdmMainObj[message]= fdmObj.message != null ? fdmObj.message: '', fdmMainObj,
                fdmMainObj[articleid]= fdmObj.articleid != null ? fdmObj.articleid: '', fdmMainObj,
                fdmMainObj[supplier]= fdmObj.supplier != null ? fdmObj.supplier: '', fdmMainObj,
                fdmMainObj[timestamp]= fdmObj.timestamp != null ? fdmObj.timestamp: '', fdmMainObj,
                fdmMainObj[response]= fdmObj.response != null ? fdmObj.response: '', fdmMainObj
              );
              fdmResponseList.push(fdmMainObj)
          }
        new Angular2Csv(fdmResponseList, fileName, options);        
      }else{
        this.errorMsg = "**Please select the below records to download the FDM Response details";
      } 
  }

  downloadFreipostData(){
    var feripostSelectedRows = this.gridOptionsFreipost.api.getSelectedRows();
    if(feripostSelectedRows.length > 0 ){
        var currentTime = new Date();
        var feripostResponseList = [];
        var fileName = '';
            fileName = "FeriPost Response"+"-"+currentTime.toLocaleDateString();
            var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: [ "Reference Number" ,"Barcodelabel Number", "Weight", "Supplier", "Timestamp", "Response" ]
            };

          let referencenumber = 'referencenumber';
          let barcodelabelnumber ='barcodelabelnumber'
          let weight = 'weight';
          let supplier = 'supplier';
          let timestamp = 'timestamp';
          let response ='response';

          for (var feriPostVal in feripostSelectedRows) {
              var feriObj = feripostSelectedRows[feriPostVal];
              var feriPostMainObj = (
                feriPostMainObj={},
                feriPostMainObj[referencenumber]= feriObj.referencenumber != null ? feriObj.referencenumber: '', feriPostMainObj,
                feriPostMainObj[barcodelabelnumber]= feriObj.barcodelabelnumber != null ? feriObj.barcodelabelnumber: '', feriPostMainObj,
                feriPostMainObj[weight]= feriObj.weight != null ? feriObj.weight: '', feriPostMainObj,
                feriPostMainObj[supplier]= feriObj.supplier != null ? feriObj.supplier: '', feriPostMainObj,
                feriPostMainObj[timestamp]= feriObj.timestamp != null ? feriObj.timestamp: '', feriPostMainObj,
                feriPostMainObj[response]= feriObj.response != null ? feriObj.response: '', feriPostMainObj
              );
              feripostResponseList.push(feriPostMainObj)
          }
        new Angular2Csv(feripostResponseList, fileName, options);        
      }else{
        this.errorMsg = "**Please select the below records to download the FeriPost Response details";
      } 
  }

  logSearch(){
    this.errorMsg = null;
    this.successMsg = '';
    if(this.fromDate == undefined){
      this.errorMsg = "From Date is Mandatory";
    }else if(this.toDate == undefined){
      this.errorMsg = "To Date is Mandatory";
    }

    if(this.errorMsg == null){
      this.spinner.show();
      this.trackingDataService.fetchApiLogReport(
        this.clientType, this.fromDate+" 00:00:00:000",this.toDate+" 23:59:59:999", (resp) => {
        this.spinner.hide();
        if(this.clientType === 'etower'){
          this.rowDataEtower = resp;
        }else if(this.clientType === 'auPost'){
          this.rowDataAUPost = resp;
        }else if(this.clientType === 'fdm'){
          this.rowDataFdm = resp;
        }else if(this.clientType === 'freiPost'){
          this.rowDataFreipost = resp;
        }
      }); 
    }
  };

  onEtowerChange() {
    var etowerSelectedRows = this.gridOptionsEtower.api.getSelectedRows();
    this.errorMsg = null;
  };

  onAuPostChange(){
    var auPostSelectedRows = this.gridOptionsAupost.api.getSelectedRows();
    this.errorMsg = null;
  }

  onFdmChange(){
    var fdmSelectedRows = this.gridOptionsFdm.api.getSelectedRows();
    this.errorMsg = null;
  }

  onFreipostChange(){
    var freipostSelectedRows = this.gridOptionsFreipost.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


