import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-outstanding-enquiry',
  templateUrl: './outstanding-enquiry.component.html',
  styleUrls: ['./outstanding-enquiry.component.css']
})

export class BrokerOutstandingEnquiryComponent implements OnInit{
  fileName: string;
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  fromDate: String;
  toDate: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  status: String;
  statusDropdown: dropdownTemplate[];  
  selectedStatusType: dropdownTemplate;
  favoriteSeason: string;
  file:File;
  system: String;
  englishFlag:boolean;
  chinessFlag:boolean;
  public enquiryDetailsList = [];

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
      this.statusDropdown = [
        { "name": "Open", "value": "open" },
        { "name": "In Progress", "value": "InProgress"},
        { "name": "Closed", "value": "closed"}
      ];
      this.status = this.statusDropdown[0].value;
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      if(this.englishFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "Ticket ID",
            field: "ticketID",
            width: 150,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Article ID",
            field: "articleID",
            width: 180
          },
          {
            headerName: "Reference Number",
            field: "referenceNumber",
            width: 180
          },
          {
            headerName: "Enquiry",
            field: "deliveryEnquiry",
            width: 100
          },
          {
            headerName: "POD",
            field: "pod",
            width: 100
          },
          {
            headerName: "Comments",
            field: "comments",
            width: 350
          },
          {
            headerName: "D2Z Comments",
            field: "d2zComments",
            width: 300
          },
          {
            headerName: "Consignee Name",
            field: "consigneeName",
            width: 200
          },
          {
            headerName: "Tracking Event",
            field: "trackingEvent",
            width: 200
          },
          {
            headerName: "Tracking Date",
            field: "trackingEventDateOccured",
            width: 200
          }
        ];
       }
      if(this.chinessFlag){ }
  }

  onStatusChange(event){
    this.status = event.value.value;
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

  onEnquiryChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  };

  enquiryBrokerSearch(){
    this.spinner.show();
    var userIds = [];
    var fromDate = null;
    var toDate = null;
    if(this.fromDate){
      fromDate = this.fromDate+" "+"00:00:00:000"
    }
    if(this.toDate){
      toDate = this.toDate+" "+"23:59:59:999"
    }
    this.consigmentUploadService.fetchUserId(this.user_Id, (resp) => {
      this.spinner.hide();
      userIds.push(resp);
      userIds.push(this.user_Id);
      console.log(userIds.toString())
      this.spinner.show();
        this.consigmentUploadService.fetchEnquiry(this.status, fromDate, toDate, userIds.toString(), (resp) => {
            this.spinner.hide();
            this.rowData = resp;
          })
    })
  };

  downloadOutstandingDetails(){
    this.enquiryDetailsList = [];
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length > 0 ){
        var currentTime = new Date();
        var fileName = '';
            fileName = "Outstanding_Enquiry_Details"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Ticket ID', 'Article ID', 'Reference Number', 'Enquiry', 'POD', 'Comments', 'D2Z Comments', 'Consignee Name', 'Tracking Event', 'Tracking Date' ]
          };
        
        for (var selectVal in selectedRows) {
          var dataObj = selectedRows[selectVal];
          let ticketID = 'ticketID';
          let articleID = 'articleID';
          let referenceNumber = 'referenceNumber';
          let deliveryEnquiry = 'deliveryEnquiry';
          let pod = 'pod';
          let comments = 'comments';
          let d2zComments = 'd2zComments';
          let consigneeName = 'consigneeName';
          let trackingEvent = 'trackingEvent';
          let trackingEventDateOccured = 'trackingEventDateOccured';

          var importObj = (
            importObj={}, 
            importObj[ticketID]= dataObj.ticketID != undefined ? dataObj.ticketID : '', importObj,
            importObj[articleID]= dataObj.articleID != undefined ? dataObj.articleID : '', importObj,
            importObj[referenceNumber]= dataObj.referenceNumber != undefined ? dataObj.referenceNumber : '', importObj,
            importObj[deliveryEnquiry]= dataObj.deliveryEnquiry != undefined ? dataObj.deliveryEnquiry : '', importObj,
            importObj[pod]= dataObj.pod != undefined ? dataObj.pod : '',  importObj,
            importObj[comments]= dataObj.comments != undefined ? dataObj.comments : '',  importObj,
            importObj[d2zComments]= dataObj.d2zComments != undefined ? dataObj.d2zComments : '', importObj,
            importObj[consigneeName]= dataObj.consigneeName != undefined ? dataObj.consigneeName : '',  importObj,
            importObj[trackingEvent]= dataObj.trackingEvent != undefined ? dataObj.trackingEvent : '', importObj,
            importObj[trackingEventDateOccured]= dataObj.trackingEventDateOccured != undefined ? dataObj.trackingEventDateOccured : '', importObj
        )
        this.enquiryDetailsList.push(importObj);
        }    
        new Angular2Csv(this.enquiryDetailsList, fileName, options);   
      }else{
          this.errorMsg = "**Please select the below records to download the Outstanding enquiry details";
      } 
  };
 
}

