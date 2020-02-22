import { Component, ViewChild,OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm} from '@angular/forms';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'hms-open-enquiry',
  templateUrl: './open-enquiry.component.html',
  styleUrls: ['./open-enquiry.component.css']
})

export class superUserOpenEnquiryComponent implements OnInit {
  @ViewChild('myForm') myForm: NgForm;
  private openEnquiryArray: Array<any> = [];
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  system: String;
  arrayBuffer:any;
  formdata: any;
  formdataIndex: any;
  updateData = [];
  public selectedIndex: number = 0;
  tabs = [];
  public openEnquiryList = [];
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();  
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
      this.openEnquiry();
  };

  updateTrackingDetails(){
      this.spinner.show();
      this.trackingDataService.updateTrackingDetails((resp) => {
        this.spinner.hide();
        this.openEnquiry();
        setTimeout(() => {
          this.spinner.hide() }, 5000);
      });
  }

  openEnquiry(){
      this.spinner.show();
      this.trackingDataService.openEnquiryDetails((resp) => {
        this.spinner.hide();
        this.openEnquiryArray = resp; 
        setTimeout(() => {
          this.spinner.hide() }, 5000);
      });
  };

  UpdateEnquiry(){
    this.openEnquiryList = []; 
    var that = this;
     for(var enquiryData in this.openEnquiryArray){
            var updatedData = this.openEnquiryArray[enquiryData];
            if(updatedData.selection){
          that.openEnquiryList.push(updatedData);
        }
        }
    
    if(that.openEnquiryList.length > 0){
      that.spinner.show();
      that.consigmentUploadService.enquiryUpload( that.openEnquiryList, (resp) => {
              that.successMsg = resp.message;
              that.spinner.hide();
              $('#superEnquiry').modal('show');
              that.openEnquiry();
      });
    }else{
      this.errorMsg = "**Please select atleast one record to update";
    }
  };

  viewTickets(){
    this.tabs = [];
    var clientEnquiryArray = this.openEnquiryArray;
    for (var fieldVal in clientEnquiryArray) {
      var fieldObj = clientEnquiryArray[fieldVal];
      if (fieldObj.selection === true) {
        this.tabs.push({
          'label': 'Enquiry - ' + fieldObj.ticketNumber,
          'userName': fieldObj.userName,
          'ticketNumber': fieldObj.ticketNumber,
          'trackingEventDateOccured': fieldObj.trackingEventDateOccured != undefined ? fieldObj.trackingEventDateOccured : '',
          'articleID': fieldObj.articleID != undefined ? fieldObj.articleID : '',
          'consigneeName': fieldObj.consigneeName != undefined ? fieldObj.consigneeName : '',
          'trackingEvent': fieldObj.trackingEvent != undefined ? fieldObj.trackingEvent : '',
          'trackingDeliveryDate': fieldObj.trackingDeliveryDate != undefined ? fieldObj.trackingDeliveryDate : '',
          'comments': fieldObj.comments != undefined ? fieldObj.comments : '',
          'd2zComments': fieldObj.d2zComments != undefined ? fieldObj.d2zComments : '',
          'sendUpdate': fieldObj.sendUpdate != undefined ? fieldObj.sendUpdate : '',
          'closeEnquiry': fieldObj.closeEnquiry != undefined ? fieldObj.closeEnquiry : '',
          'fileName': fieldObj.fileName != undefined ? fieldObj.fileName : ''
        });
        this.selectedIndex = 1;
      }else{
        this.errorMsg = '**Please select atleast one item to view the details'
      }
     } 
  };

  check(event, index) {
   var enquiryTabObj = this.tabs[index];
    this.updateData = [];
    //var sendUpdate = enquiryTabObj.sendUpdate == true ? "yes" : "no";
    //var closeEnquiry = enquiryTabObj.closeEnquiry == true ? "closed" : "open";
    //var comments = enquiryTabObj.comments ? enquiryTabObj.comments : null;
    //var d2zComments = enquiryTabObj.d2zComments ? enquiryTabObj.d2zComments : null;
    let ticketNumber = 'ticketNumber';
    let comments = 'comments';
    let d2zComments = 'd2zComments';
    let sendUpdate = 'sendUpdate';
    let status = 'status';
        var that = this;
        var dataObj = (
            dataObj={}, 
            dataObj[ticketNumber]= enquiryTabObj.ticketNumber != undefined ? enquiryTabObj.ticketNumber : '', dataObj,
            dataObj[comments]= enquiryTabObj.comments != undefined ? enquiryTabObj.comments: '', dataObj,
            dataObj[d2zComments]= enquiryTabObj.d2zComments != undefined ? enquiryTabObj.d2zComments:'', dataObj,
            dataObj[sendUpdate]= enquiryTabObj.sendUpdate == true ? "yes" : "no", dataObj,
            dataObj[status]= enquiryTabObj.closeEnquiry == true ? "closed" : "open", dataObj
        );
        console.log(dataObj);
        that.updateData.push(dataObj);
    if(this.formdata){
      this.spinner.show();
      this.consigmentUploadService.enquiryFileUpload(this.formdata,enquiryTabObj.ticketNumber, (resp) => {
          //this.successMsg = resp.message;
          //this.spinner.hide();
          //$('#superEnquiry').modal('show');
          //this.tabs = [];
          //this.openEnquiry();
      });
    }
      //this.spinner.show();
      this.consigmentUploadService.enquiryNonFileUpload( dataObj, (resp) => {
          this.successMsg = resp.message;
          this.spinner.hide();
          $('#superEnquiry').modal('show');
          this.tabs = [];
          this.openEnquiry();
      });
    
   
  };

  tabChanged(event){
    this.errorMsg = null;
  };

  downloadEnquiryDetails(){
    var enquiryDownloadData = []
      if(this.openEnquiryArray.length > 0 ){
        let articleID = 'articleID';
        let consigneeName = 'consigneeName';
        let consigneeaddr1 = 'consigneeaddr1';
        let consigneeSuburb = 'consigneeSuburb';
        let consigneeState = 'consigneeState';
        let productDescription = 'productDescription';
        let consigneePostcode = 'consigneePostcode';
        let trackingStatus = 'trackingStatus';
        let trackingDeliveryDate ='trackingDeliveryDate';
        let enquiryCreatedDate = 'enquiryCreatedDate';
        let comments ='comments';
        for(var enquiryData in this.openEnquiryArray){
            var invoiceApprovedData = this.openEnquiryArray[enquiryData];
            if(invoiceApprovedData.selection){
            var invoiceApproveObj = (
              invoiceApproveObj={}, 
              invoiceApproveObj[articleID]= invoiceApprovedData.articleID != null ? invoiceApprovedData.articleID : '' , invoiceApproveObj,
              invoiceApproveObj[consigneeName]= invoiceApprovedData.consigneeName != null ? invoiceApprovedData.consigneeName : '', invoiceApproveObj,
              invoiceApproveObj[consigneeaddr1]= invoiceApprovedData.consigneeaddr1 != null ?  invoiceApprovedData.consigneeaddr1 : '', invoiceApproveObj,
              invoiceApproveObj[consigneeSuburb]= invoiceApprovedData.consigneeSuburb != null ? invoiceApprovedData.consigneeSuburb : '', invoiceApproveObj,
              invoiceApproveObj[consigneeState]= invoiceApprovedData.consigneeState != null ? invoiceApprovedData.consigneeState : '', invoiceApproveObj,
              invoiceApproveObj[consigneePostcode]= invoiceApprovedData.consigneePostcode != null ? invoiceApprovedData.consigneePostcode : '', invoiceApproveObj,
              invoiceApproveObj[productDescription]= invoiceApprovedData.productDescription != null ? invoiceApprovedData.productDescription : '', invoiceApproveObj,
              invoiceApproveObj[trackingStatus]= invoiceApprovedData.trackingEvent != null ? invoiceApprovedData.trackingEvent : '', invoiceApproveObj,
              invoiceApproveObj[enquiryCreatedDate]= invoiceApprovedData.trackingEventDateOccured != null ? invoiceApprovedData.trackingEventDateOccured : '', invoiceApproveObj,
              invoiceApproveObj[trackingDeliveryDate]= invoiceApprovedData.trackingDeliveryDate != null ? invoiceApprovedData.trackingDeliveryDate : '', invoiceApproveObj,
              invoiceApproveObj[comments]= invoiceApprovedData.comments != null ? invoiceApprovedData.comments : '', invoiceApproveObj
            );
            enquiryDownloadData.push(invoiceApproveObj);
            }
         };

          var currentTime = new Date();
          var fileName = '';
              fileName = "Enquiry-Details"+"-"+currentTime.toLocaleDateString();
          var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: [ 'Tracking Number', 'Consignee Name', 'Address', 'Suburb', 'State', 'Postcode', 'Description', 'Tracking Event', 'Tracking Event date','Expected Delivery Date','Broker/Client Comments']
            };
          new Angular2Csv(enquiryDownloadData, fileName, options); 
      }else{
          this.errorMsg =  "**Data is not Avilable to download";
      }   
  };

  fileChange(event,index){
    let fileList: FileList = event.target.files;
      if(fileList.length > 0) {
          let file: File = fileList[0];
          const formdata: FormData = new FormData();
          formdata.append('file', file);  
          this.formdata = formdata;
          this.formdataIndex = index;
          console.log( this.formdataIndex)
          console.log(this.formdata)
      }
  };

}
