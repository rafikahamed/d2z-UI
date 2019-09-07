import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'hms-open-enquiry',
  templateUrl: './open-enquiry.component.html',
  styleUrls: ['./open-enquiry.component.css']
})

export class superUserOpenEnquiryComponent{
  private openEnquiryArray: Array<any> = [];
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  system: String;
  arrayBuffer:any;
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
      })
      this.spinner.show();
      this.trackingDataService.openEnquiryDetails((resp) => {
        this.spinner.hide();
        this.openEnquiryArray = resp; 
        setTimeout(() => {
          this.spinner.hide() }, 5000);
      });
  };


  UpdateEnquiry(){

    if(this.openEnquiryArray.length > 0 ){
      this.openEnquiryList = [];
      let articleID = 'articleID';
      let comments = 'comments';
      let d2zComments = 'd2zComments';
      let sendUpdate = 'sendUpdate';
      let status = 'status';

        for (var enquiryVal in this.openEnquiryArray) {
          var fieldObj = this.openEnquiryArray[enquiryVal];
          var openEnquiryObj = (
            openEnquiryObj={}, 
            openEnquiryObj[articleID]= fieldObj.articleID != undefined ? fieldObj.articleID : '', openEnquiryObj,
            openEnquiryObj[comments]= fieldObj.comments != undefined ? fieldObj.comments : '', openEnquiryObj,
            openEnquiryObj[d2zComments]= fieldObj.d2zComments != undefined ? fieldObj.d2zComments : null, openEnquiryObj,
            openEnquiryObj[sendUpdate]= fieldObj.sendUpdate == true ? "yes" : "no", openEnquiryObj,
            openEnquiryObj[status]= fieldObj.closeEnquiry == true ? "closed" : "open", openEnquiryObj
          );
          this.openEnquiryList.push(openEnquiryObj);
        }
        this.spinner.show();
        this.trackingDataService.updateEnquiry(this.openEnquiryList,(resp) => {
          this.spinner.hide();
          $('#superEnquiry').modal('show');
          if(resp.error){
            this.successMsg = resp.error.message;
          }else{
            this.successMsg = resp.message;
            this.trackingDataService.openEnquiryDetails((resp) => {
              this.openEnquiryArray = resp; 
            });
          }
          setTimeout(() => {
            this.spinner.hide() }, 5000);
        })
      }else{
        this.errorMsg =  "**Data is not Avilable to download";
    } 
  }


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
            var invoiceApproveObj = (
              invoiceApproveObj={}, 
              invoiceApproveObj[articleID]= invoiceApprovedData.articleID != null ? invoiceApprovedData.articleID : '' , invoiceApproveObj,
              invoiceApproveObj[consigneeName]= invoiceApprovedData.consigneeName != null ? invoiceApprovedData.consigneeName : '', invoiceApproveObj,
              invoiceApproveObj[consigneeaddr1]= invoiceApprovedData.consigneeaddr1 != null ?  invoiceApprovedData.consigneeaddr1 : '', invoiceApproveObj,
              invoiceApproveObj[consigneeSuburb]= invoiceApprovedData.consigneeSuburb != null ? invoiceApprovedData.consigneeSuburb : '', invoiceApproveObj,
              invoiceApproveObj[consigneeState]= invoiceApprovedData.consigneeState != null ? invoiceApprovedData.consigneeState : '', invoiceApproveObj,
              invoiceApproveObj[consigneePostcode]= invoiceApprovedData.consigneePostcode != null ? invoiceApprovedData.consigneePostcode : '', invoiceApproveObj,
              invoiceApproveObj[productDescription]= invoiceApprovedData.productDescription != null ? invoiceApprovedData.productDescription : '', invoiceApproveObj,
              invoiceApproveObj[trackingStatus]= invoiceApprovedData.trackingStatus != null ? invoiceApprovedData.trackingStatus : '', invoiceApproveObj,
              invoiceApproveObj[enquiryCreatedDate]= invoiceApprovedData.trackingEventDateOccured != null ? invoiceApprovedData.trackingEventDateOccured : '', invoiceApproveObj,
              invoiceApproveObj[trackingDeliveryDate]= invoiceApprovedData.trackingDeliveryDate != null ? invoiceApprovedData.trackingDeliveryDate : '', invoiceApproveObj,
              invoiceApproveObj[comments]= invoiceApprovedData.comments != null ? invoiceApprovedData.comments : '', invoiceApproveObj
            );
            enquiryDownloadData.push(invoiceApproveObj);
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
              headers: [ 'Tracking Number', 'Consignee Name', 'Address', 'Suburb', 'State', 'Postcode', 'Description', 'Tracking Status', 'Enquiry created date','Expected Delivery Date','Broker/Client Comments']
            };
          new Angular2Csv(enquiryDownloadData, fileName, options); 
      }else{
          this.errorMsg =  "**Data is not Avilable to download";
      } 
    
  }
  
}



