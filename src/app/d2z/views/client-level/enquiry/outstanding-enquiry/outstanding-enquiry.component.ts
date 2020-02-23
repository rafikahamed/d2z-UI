import { Component, ViewChild,OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'hms-outstanding-enquiry',
  templateUrl: './outstanding-enquiry.component.html',
  styleUrls: ['./outstanding-enquiry.component.css']
})

export class OutstandingEnquiryComponent implements OnInit{
  @ViewChild('myForm') myForm: NgForm;
  private outstandingEnquiryArray: Array<any> = [];
  manifestForm: FormGroup;
  fileName: string;
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  fromDate: String;
  toDate: String;
  public selectedIndex: number = 0;
  status: String;
  tabs = [];
  system: String;
  englishFlag:boolean;
  chinessFlag:boolean;
  showOutstandingView:boolean;
  showOutstandingDownload:boolean;
  public enquiryDetailsList = [];

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();
    this.manifestForm = new FormGroup({
      manifestFile: new FormControl()
    });
  }

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.showOutstandingDownload = false;
      this.showOutstandingView = false;
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
  }

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

  enquirySearch(){
    this.errorMsg = null;
    var fromDate = null;
    var toDate = null;
    this.showOutstandingDownload = true;
    this.showOutstandingView = true;
    if(this.fromDate){
      fromDate = this.fromDate+" "+"00:00:00:000"
    }
    if(this.toDate){
      toDate = this.toDate+" "+"23:59:59:999"
    }
    this.spinner.show();
    this.consigmentUploadService.fetchEnquiry(this.status, fromDate, toDate, this.user_Id, (resp) => {
      this.spinner.hide();
      this.outstandingEnquiryArray = resp;
      setTimeout(() => {
        this.spinner.hide() 
      }, 5000);
    })
  };

  viewOutStandingTickets(){
    this.tabs = [];
    var outstandingEnquiryArray = this.outstandingEnquiryArray;
    for (var enquiryVal in outstandingEnquiryArray) {
      var fieldObj = outstandingEnquiryArray[enquiryVal];
      if (fieldObj.selection === true) {
        this.tabs.push({
          'label': 'Enquiry - ' + fieldObj.ticketID,
          'ticketID': fieldObj.ticketID,
          'articleID': fieldObj.articleID != undefined ? fieldObj.articleID : '',
          'referenceNumber': fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber : '',
          'deliveryEnquiry': fieldObj.deliveryEnquiry != undefined ? fieldObj.deliveryEnquiry : '',
          'pod': fieldObj.pod != undefined ? fieldObj.pod : '',
          'consigneeName': fieldObj.consigneeName != undefined ? fieldObj.consigneeName : '',
          'trackingEvent': fieldObj.trackingEvent != undefined ? fieldObj.trackingEvent : '',
          'trackingEventDateOccured': fieldObj.trackingEventDateOccured != undefined ? fieldObj.trackingEventDateOccured : '',
          'comments': fieldObj.comments != undefined ? fieldObj.comments : '',
          'd2zComments': fieldObj.d2zComments != undefined ? fieldObj.d2zComments : ''
        });
        this.selectedIndex = 1;
      }else{
        this.errorMsg = '**Please select atleast one item to view the details';
      }
     } 
  };

  tabChanged(event){
    this.errorMsg = null;
  };

  outStandingCheck(event, index){
    var enquiryTabObj = this.tabs[index];
    let ticketId = 'ticketId';
    let comments = 'comments';
    var enquiryObj = (
      enquiryObj={}, 
      enquiryObj[ticketId]=  enquiryTabObj.ticketID, enquiryObj,
      enquiryObj[comments]=  enquiryTabObj.comments, enquiryObj
    )
    this.spinner.show();
    this.consigmentUploadService.enquiryUpdate(enquiryObj, (resp) => {
        this.successMsg = resp.message;
        this.spinner.hide();
        $('#outstandingEnquiry').modal('show');
        this.tabs = [];
        this.enquirySearch();
    })
  };

  downloadOutstandingTracking(){
    this.enquiryDetailsList = [];
    //var selectedRows = this.outstandingEnquiryArray;
    if(this.outstandingEnquiryArray.length > 0 ){
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
        
        for (var selectVal in this.outstandingEnquiryArray) {
          var dataObj = this.outstandingEnquiryArray[selectVal];
          if(dataObj.selection){
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
        }
        new Angular2Csv(this.enquiryDetailsList, fileName, options);   
      }else{
          this.errorMsg = "**Please select the below records to download the Outstanding enquiry details";
      } 
  }
 check(element)
 {

 for (var fieldVal in this.outstandingEnquiryArray) {
        var fieldObj = this.outstandingEnquiryArray[fieldVal];
        fieldObj.selection = element.target.checked;
 }
 }
}

