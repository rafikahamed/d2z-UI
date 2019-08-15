import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

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
      console.log(this.openEnquiryList);
      this.spinner.show();
      this.trackingDataService.updateEnquiry(this.openEnquiryList,(resp) => {
        this.spinner.hide();
        $('#superEnquiry').modal('show');
        console.log(resp)
        this.successMsg = resp.message;
        setTimeout(() => {
          this.spinner.hide() }, 5000);
      });

  }
  


}



