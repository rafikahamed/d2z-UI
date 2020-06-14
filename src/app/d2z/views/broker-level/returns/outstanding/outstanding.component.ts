import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'hms-returns-broker-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.css']
})

export class BrokerReturnsOutstandingComponent implements OnInit{
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  system: String;
  fromDate: String;
  toDate: String;
  public gridOptions: GridOptions;
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  public rowData: any[];
  public defaultColDef;
  englishFlag:boolean;
  chinessFlag:boolean;
  returnBrokerFlag:boolean;
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
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.returnBrokerFlag = false;
      this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });

      if(this.englishFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "Article ID",
            field: "articleId",
            width: 200,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Reference Number",
            field: "referenceNumber",
            width: 200
          },
          {
            headerName: "Consignee Name",
            field: "consigneeName",
            width: 200
          },
          {
            headerName: "Client Name",
            field: "clientName",
            width: 200
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
          },
          {
            headerName: "Scanned Date",
            field: "returnsCreatedDate",
            width: 200
          }
        ];
       }
      if(this.chinessFlag){ }
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

  returnSearch(){
    this.errorMsg = null;
    this.spinner.show();
    var fromDate = null;
    var toDate = null;
    if(this.fromDate){
      fromDate = this.fromDate+" "+"00:00:00:000"
    }
    if(this.toDate){
      toDate = this.toDate+" "+"23:59:59:999"
    }
    this.consigmentUploadService.fetchUserId(this.user_Id, (resp) => {
      var userIds = [];
      this.spinner.hide();
      userIds.push(resp);
      userIds.push(this.user_Id);
      this.spinner.show();
      this.consigmentUploadService.fetchOutstandingReturns( fromDate, toDate, userIds.toString(), (resp) => {
        this.spinner.hide();
        this.rowData = resp;
        if(this.rowData.length > 0){
          this.returnBrokerFlag = true;
        }
        setTimeout(() => {
          this.spinner.hide() 
        }, 5000);
      })
    })
  };

  outstandingBrokerReturns(){
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
              returnObj[returnsCreatedDate]= returnArrayData.returnsCreatedDate != null ? returnArrayData.returnsCreatedDate : '', returnObj       
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

  onEnquiryChange(){}

}


