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

  private fieldArray: Array<any> = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  successMsg: String;
  type: String;
  file:File;
  user_Id: String;
  system: String;
  arrayBuffer:any;
  public importList = [];
  public importIndividualList = [];
  public importFileList = [];
  englishFlag:boolean;
  chinessFlag:boolean;
  showFile:boolean;
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
      this.fieldCreateArray = [
        {"brokerName": "rafik", "enquiryOpenDate":"2019-08-10", "ticketNumber":"INC868686868", "trackingNumber":"i8686886868",
        "consigneeName":"rafik ahamed", "status":"Open", "deliveryDate":"2019-08-12", "Comments":"Having issue with given parcel", 
        "updatedComments":"", "sendUpdate":"Y", "closeEnquiry":"Y", "attachment":""},
        {"brokerName": "rafik", "enquiryOpenDate":"2019-08-10", "ticketNumber":"INC868686868", "trackingNumber":"i8686886868",
        "consigneeName":"rafik ahamed", "status":"Open", "deliveryDate":"2019-08-12", "Comments":"Having issue with given parcel", 
        "updatedComments":"", "sendUpdate":"N", "closeEnquiry":"Y", "attachment":""},
        {"brokerName": "rafik", "enquiryOpenDate":"2019-08-10", "ticketNumber":"INC868686868", "trackingNumber":"i8686886868",
        "consigneeName":"rafik ahamed", "status":"Open", "deliveryDate":"2019-08-12", "Comments":"Having issue with given parcel", 
        "updatedComments":"", "sendUpdate":"N", "closeEnquiry":"Y", "attachment":""},
        {"brokerName": "rafik", "enquiryOpenDate":"2019-08-10", "ticketNumber":"INC868686868", "trackingNumber":"i8686886868",
        "consigneeName":"rafik ahamed", "status":"Open", "deliveryDate":"2019-08-12", "Comments":"Having issue with given parcel", 
        "updatedComments":"", "sendUpdate":"N", "closeEnquiry":"Y", "attachment":""},
        {"brokerName": "rafik", "enquiryOpenDate":"2019-08-10", "ticketNumber":"INC868686868", "trackingNumber":"i8686886868",
        "consigneeName":"rafik ahamed", "status":"Open", "deliveryDate":"2019-08-12", "Comments":"Having issue with given parcel", 
        "updatedComments":"", "sendUpdate":"Y", "closeEnquiry":"Y", "attachment":""}
      ];
  };


  UpdateEnquiry(){
    console.log(this.fieldCreateArray);
  }
  


}



