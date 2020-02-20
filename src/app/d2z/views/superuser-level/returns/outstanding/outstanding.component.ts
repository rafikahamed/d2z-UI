import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridOptions } from "ag-grid";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-returns-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.css']
})

export class superUserReturnsOutstandingComponent implements OnInit{
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  system: String;
  fromDate: String;
  toDate: String;
  brokerName: String;
  returnSuperFlag:boolean;
  brokerDropdown: dropdownTemplate[];  
  selectedBrokerName: dropdownTemplate;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();  
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
  }

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
              return;
          }
          window.scrollTo(0, 0)
      });
      this.returnSuperFlag = false;
      this.spinner.show();
      this.consigmentUploadService.fetchReturnsBrokerDetails((resp) => {
          this.spinner.hide();
          this.brokerDropdown = resp;
          this.brokerName = this.brokerDropdown[0].value;
      });
      this.gridOptions.columnDefs = [
          {
            headerName: "Article ID",
            field: "articleId",
            width: 220,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Reference Number",
            field: "referenceNumber",
            width: 220
          },
          {
            headerName: "Consignee Name",
            field: "consigneeName",
            width: 230
          },
          {
            headerName: "Client Name",
            field: "clientName",
            width: 230
          },
          {
            headerName: "Return Reason",
            field: "returnReason",
            width: 200
          },
          {
            headerName: "Shipment Number",
            field: "airwaybill",
            width: 200
          }
          ,
          {
            headerName: "Scanned Date",
            field: "returnsCreatedDate",
            width: 200
          }
        ];
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

  onBrokerChange(event){
    this.brokerName = event.value.value;
  };

  returnSuperSearch(){
    this.spinner.show();
    var fromDate = null;
    var toDate = null;
    if(this.fromDate){
      fromDate = this.fromDate;
    }
    if(this.toDate){
      toDate = this.toDate;
    }
    console.log(this.brokerName)
    this.consigmentUploadService.fetchSuperuserOutstandingReturns( fromDate, toDate, this.brokerName, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      if(this.rowData.length > 0){
        this.returnSuperFlag = true;
      }
      setTimeout(() => {
        this.spinner.hide() 
      }, 5000);
    }) 
  };

  outstandingSuperReturns(){
    var returnArrayDetails = []
    if(this.rowData && this.rowData.length > 0 ){
      let articleId       = 'articleId';
      let referenceNumber = 'referenceNumber';
      let consigneeName   = 'consigneeName';
      let clientName      = 'clientName';
      let returnReason    = 'returnReason';
      let airwaybill      = 'airwaybill';
      let returnsCreatedDate = 'returnsCreatedDate';
      for(var returnsData in this.rowData){
          var returnArrayData = this.rowData[returnsData];
          var returnObj = (
            returnObj={}, 
              returnObj[articleId]       = returnArrayData.articleId != null ? returnArrayData.articleId : '' , returnObj,
              returnObj[referenceNumber] = returnArrayData.referenceNumber != null ? returnArrayData.referenceNumber : '', returnObj,
              returnObj[consigneeName]   = returnArrayData.consigneeName != null ?  returnArrayData.consigneeName : '', returnObj,
              returnObj[clientName]      = returnArrayData.clientName != null ? returnArrayData.clientName : '', returnObj,
              returnObj[returnReason]    = returnArrayData.returnReason != null ? returnArrayData.returnReason : '', returnObj,
              returnObj[airwaybill]      = returnArrayData.airwaybill != null ? returnArrayData.airwaybill : '', returnObj,
              returnObj[returnsCreatedDate]= returnArrayData.returnsCreatedDate != null ? "'"+returnArrayData.returnsCreatedDate+"'" : '', returnObj
            );
            returnArrayDetails.push(returnObj);
       };
        var currentTime = new Date();
        var fileName = '';
            fileName = "Return-Details"+"-"+currentTime.toLocaleDateString();
        var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Article Id', 'Reference Number', 'Consignee Name', 'Client Name', 'Return Reason', 'Shipment Number','Scanned Date']
          };
        new Angular2Csv(returnArrayDetails, fileName, options); 
    }else{
        this.errorMsg =  "**Data is not Avilable to download";
    } 
  };

  onEnquiryChange(){
    
  }

}



