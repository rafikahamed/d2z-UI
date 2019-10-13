import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-returns-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})

export class superUserReturnsScanComponent{
  private fieldArray: Array<any> = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  successMsg: String;
  type: String;
  reason: String;
  file:File;
  user_Id: String;
  system: String;
  arrayBuffer:any;
  scanType: City[];
  reasonType: City[];
  public importList = [];
  public importIndividualList = [];
  public importFileList = [];
  public importReturnsList = [];
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
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.scanType  = [
        {"name":"Barcode Label","value":"barcode"},
        {"name":"Article Id","value":"articleId"},
        {"name":"Reference Number","value":"referenceNumber"}
      ];
      this.reasonType = [
        {"name":"Unclaimed","value":"Unclaimed"},
        {"name":"Incorrect Address","value":"Incorrect Address"},
      ];
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      this.newAttribute.type = this.scanType[0];
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
      this.fieldArray.push(this.newAttribute);
  };

    addFieldValue() {
        this.fieldArray.push(this.newAttribute);
        this.newAttribute = {};
        this.newAttribute.type = this.scanType[0];
        this.errorMsg = '';
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

    onScanTypeChange(event){
      this.type = event.value ? event.value.value : '';
    }

    onReasonTypeChange(event){
      this.reason = event.value ? event.value.value : '';
    }

    deleteFieldFileValue(index) {
      this.fieldCreateArray.splice(index, 1);
    }

    onBlurMethod(event){
     var scanType = this.type;
     var scanValue = event.target.value;
     this.spinner.show();
     this.consigmentUploadService.fetchReturnsClientDetails(scanValue, (resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        this.newAttribute.brokerName = resp.brokerName;
        this.newAttribute.clientName = resp.clientName;
        this.newAttribute.consigneeName = resp.consigneeName;
        this.newAttribute.userId = resp.userId;
        this.newAttribute.clientBrokerId = resp.clientBrokerId;
        this.newAttribute.roleId = resp.roleId;
        this.newAttribute.carrier = resp.carrier;
        this.newAttribute.referenceNumber = resp.referenceNumber;
        this.newAttribute.barcodelabelNumber = resp.barcodelabelNumber;
        this.newAttribute.articleId = resp.articleId;
      });
    }

    returnEnquiry(){
      this.importReturnsList = [];
      var newReturnsArray = [];
      var scanValidData = [];
      if(this.newAttribute.type){
        newReturnsArray.push(this.newAttribute);
      }
      if(this.fieldArray.length > 0){
        for (var fieldVal in this.fieldArray) {
          var enquiryObj = this.fieldArray[fieldVal];
          newReturnsArray.push(enquiryObj);
        }
      }

      for(var scanArray in newReturnsArray ){
        var scanObj = newReturnsArray[scanArray];
          console.log(scanObj)
          if(scanObj.scan){
            scanValidData.push(scanObj);
          }
      }
      console.log(scanValidData);
      if(scanValidData.length > 0){
          let scanType = 'scanType';
          let articleId = 'articleId';
          let barcodelabelNumber = 'barcodelabelNumber';
          let referenceNumber = 'referenceNumber';
          let returnReason = 'returnReason';
          let brokerName = 'brokerName';
          let clientName = 'clientName';
          let consigneeName = 'consigneeName';
          let userId = 'userId';
          let clientBrokerId = 'clientBrokerId';
          let carrier = 'carrier';
    
          for (var fieldVal in newReturnsArray) {
            var fieldObj = newReturnsArray[fieldVal];
            var enquiryObj = (
              enquiryObj={}, 
              enquiryObj[scanType]= fieldObj.type != undefined ? fieldObj.type.name : '', enquiryObj,
              enquiryObj[articleId]= fieldObj.articleId != undefined ? fieldObj.articleId : '', enquiryObj,
              enquiryObj[barcodelabelNumber]= fieldObj.barcodelabelNumber != undefined ? fieldObj.barcodelabelNumber : '', enquiryObj,
              enquiryObj[referenceNumber]= fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber : '', enquiryObj,
              enquiryObj[returnReason]= fieldObj.reason != undefined ? fieldObj.reason.name : '', enquiryObj,
              enquiryObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName : '',  enquiryObj,
              enquiryObj[clientName]= fieldObj.clientName != undefined ? fieldObj.clientName : '',  enquiryObj,
              enquiryObj[carrier]= fieldObj.carrier != undefined ? fieldObj.carrier : '',  enquiryObj,
              enquiryObj[consigneeName]= fieldObj.consigneeName != undefined ? fieldObj.consigneeName : '',  enquiryObj,
              enquiryObj[userId]= fieldObj.userId != undefined ? fieldObj.userId : '',  enquiryObj,
              enquiryObj[clientBrokerId]= fieldObj.clientBrokerId != undefined ? fieldObj.clientBrokerId : '',  enquiryObj
            );
            this.importReturnsList.push(enquiryObj);
          }
          this.spinner.show();
          this.consigmentUploadService.createReturns(this.importReturnsList, (resp) => {
              this.spinner.hide();
              if(resp.error){
                  this.successMsg = resp.error.message;
                  $('#returnsScan').modal('show');
              }else{
                  this.successMsg = resp.message;
                  $('#returnsScan').modal('show');
                  this.fieldArray = [];
                  this.newAttribute = {};
                  this.newAttribute.type = this.scanType[0];
              }
          });
      }else{
        this.errorMsg = "** Atleast add one Returns to proceed";
      }
    };

}

interface City {
  name: string;
  value: string;
}




