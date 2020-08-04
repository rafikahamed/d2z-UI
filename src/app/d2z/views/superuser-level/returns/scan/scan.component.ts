import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-returns-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})

export class superUserReturnsScanComponent implements OnInit{
  public fieldArray: Array<any> = [];
  private fieldCreateArray: Array<any> = [];
  public newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  successMsg: String;
  errorMessage: String;
  type: String;
  reason: String;
  file:File;
  user_Id: String;
  role_Id: Number;
  system: String;
  arrayBuffer:any;
  scanType: City[];
  reasonType: City[];
  errorDetails: any[];
  invalidRef = [];
  show: boolean;
  public importList = [];
  public importIndividualList = [];
  public importFileList = [];
  public importReturnsList = [];
  englishFlag:boolean;
  chinessFlag:boolean;
  showReturn:boolean;
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
      this.showReturn = true;
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.role_Id  = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.role_Id: '';
      console.log(this.role_Id)
      if(this.role_Id == 5){
          this.showReturn = false;
      }
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
        {"name":"Client Return","value":"Client Return"}
      ];
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      this.newAttribute.type = this.scanType[0];
      this.newAttribute.reason = this.reasonType[0];
  };

    addFieldValue() {
        this.fieldArray.push(this.newAttribute);
        this.newAttribute = {};
        this.newAttribute.type = this.scanType[0];
        this.newAttribute.reason = this.reasonType[0];
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
      var elem = document.getElementById("newAttributeScan");
      var that = this;
      elem.onkeyup = function(e){
          if(e.keyCode == 13){
            console.log("Entered ---->");
            var referenceNumber = null;
            var barcodeLabel = null;
            var articleId = null;
            console.log(that.newAttribute.type.value);
            if(that.newAttribute.type.value == 'referenceNumber'){
              referenceNumber = event.target.value;
            }else if(that.newAttribute.type.value == 'articleId'){
              articleId = event.target.value;
            }else if(that.newAttribute.type.value == 'barcode'){
              barcodeLabel = event.target.value;
            }
            that.spinner.show();
            that.consigmentUploadService.fetchReturnsClientDetails(referenceNumber,barcodeLabel,articleId, (resp) => {
              that.spinner.hide();
              
              that.successMsg = resp.message;
               that.newAttribute.brokerName = resp.brokerName;
               that.newAttribute.clientName = resp.clientName;
               that.newAttribute.consigneeName = resp.consigneeName;
               that.newAttribute.userId = resp.userId;
               that.newAttribute.clientBrokerId = resp.clientBrokerId;
               that.newAttribute.roleId = resp.roleId;
               that.newAttribute.carrier = resp.carrier;
               that.newAttribute.referenceNumber = resp.referenceNumber;
               that.newAttribute.barcodelabelNumber = resp.barcodelabelNumber;
               that.newAttribute.articleId = resp.articleId;
               that.newAttribute.airwayBill = resp.airwayBill;
               that.fieldArray.push(that.newAttribute);
               that.newAttribute = {};
               that.newAttribute.type = that.scanType[0];
               that.errorMsg = '';
              
             });
          
          }
        }
    };

   
    returnEnquiry(){
      this.importReturnsList = [];
      var newReturnsArray = [];
      var scanValidData = [];
      this.errorMsg = null;
      this.errorMessage = null;
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
          if(scanObj.scan){
            scanValidData.push(scanObj);
          }
      }
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
          let airwaybill = 'airwaybill'; 
    
          for (var fieldVal in scanValidData) {
            var fieldObj = scanValidData[fieldVal];
            if(fieldObj.type.value == "barcode"){
              var enquiryObj = (
                enquiryObj={}, 
                enquiryObj[scanType]= fieldObj.type != undefined ? fieldObj.type.name : '', enquiryObj,
                enquiryObj[articleId]= fieldObj.articleId != undefined ? fieldObj.articleId : null, enquiryObj,
                enquiryObj[barcodelabelNumber]= fieldObj.scan != undefined ? fieldObj.scan : null, enquiryObj,
                enquiryObj[referenceNumber]= fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber : null, enquiryObj,
                enquiryObj[returnReason]= fieldObj.reason != undefined ? fieldObj.reason.name : '', enquiryObj,
                enquiryObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName : '',  enquiryObj,
                enquiryObj[clientName]= fieldObj.clientName != undefined ? fieldObj.clientName : '',  enquiryObj,
                enquiryObj[carrier]= fieldObj.carrier != undefined ? fieldObj.carrier : '',  enquiryObj,
                enquiryObj[consigneeName]= fieldObj.consigneeName != undefined ? fieldObj.consigneeName : '',  enquiryObj,
                enquiryObj[userId]= fieldObj.userId != undefined ? fieldObj.userId : '',  enquiryObj,
                enquiryObj[clientBrokerId]= fieldObj.clientBrokerId != undefined ? fieldObj.clientBrokerId : '',  enquiryObj,
                enquiryObj[airwaybill]= fieldObj.airwayBill != undefined ? fieldObj.airwayBill : '', enquiryObj
              );
            }else if(fieldObj.type.value == "articleId"){
              var enquiryObj = (
                enquiryObj={}, 
                enquiryObj[scanType]= fieldObj.type != undefined ? fieldObj.type.name : '', enquiryObj,
                enquiryObj[articleId]= fieldObj.scan != undefined ? fieldObj.scan : null, enquiryObj,
                enquiryObj[barcodelabelNumber]= fieldObj.barcodelabelNumber != undefined ? fieldObj.barcodelabelNumber : null, enquiryObj,
                enquiryObj[referenceNumber]= fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber : null, enquiryObj,
                enquiryObj[returnReason]= fieldObj.reason != undefined ? fieldObj.reason.name : '', enquiryObj,
                enquiryObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName : '',  enquiryObj,
                enquiryObj[clientName]= fieldObj.clientName != undefined ? fieldObj.clientName : '',  enquiryObj,
                enquiryObj[carrier]= fieldObj.carrier != undefined ? fieldObj.carrier : '',  enquiryObj,
                enquiryObj[consigneeName]= fieldObj.consigneeName != undefined ? fieldObj.consigneeName : '',  enquiryObj,
                enquiryObj[userId]= fieldObj.userId != undefined ? fieldObj.userId : '',  enquiryObj,
                enquiryObj[clientBrokerId]= fieldObj.clientBrokerId != undefined ? fieldObj.clientBrokerId : '',  enquiryObj,
                enquiryObj[airwaybill]= fieldObj.airwayBill != undefined ? fieldObj.airwayBill : '', enquiryObj
              );
            }else if(fieldObj.type.value == "referenceNumber"){
              var enquiryObj = (
                enquiryObj={}, 
                enquiryObj[scanType]= fieldObj.type != undefined ? fieldObj.type.name : '', enquiryObj,
                enquiryObj[articleId]= fieldObj.articleId != undefined ? fieldObj.articleId : null, enquiryObj,
                enquiryObj[barcodelabelNumber]= fieldObj.barcodelabelNumber != undefined ? fieldObj.barcodelabelNumber : null, enquiryObj,
                enquiryObj[referenceNumber]= fieldObj.scan != undefined ? fieldObj.scan : null, enquiryObj,
                enquiryObj[returnReason]= fieldObj.reason != undefined ? fieldObj.reason.name : '', enquiryObj,
                enquiryObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName : '',  enquiryObj,
                enquiryObj[clientName]= fieldObj.clientName != undefined ? fieldObj.clientName : '',  enquiryObj,
                enquiryObj[carrier]= fieldObj.carrier != undefined ? fieldObj.carrier : '',  enquiryObj,
                enquiryObj[consigneeName]= fieldObj.consigneeName != undefined ? fieldObj.consigneeName : '',  enquiryObj,
                enquiryObj[userId]= fieldObj.userId != undefined ? fieldObj.userId : '',  enquiryObj,
                enquiryObj[clientBrokerId]= fieldObj.clientBrokerId != undefined ? fieldObj.clientBrokerId : '',  enquiryObj,
                enquiryObj[airwaybill]= fieldObj.airwayBill != undefined ? fieldObj.airwayBill : '', enquiryObj
              );
            }
           
            this.importReturnsList.push(enquiryObj);
          }
          this.spinner.show();
          console.log(this.importReturnsList);
          this.consigmentUploadService.createReturns(this.importReturnsList, (resp) => {
              this.spinner.hide();
              if(resp.error){
                  this.successMsg = resp.error.message;
                  this.errorMessage = resp.error.errorMessage;
                  //this.errorMessage = JSON.stringify(resp.error.errorDetails); 
                  this.errorDetails = resp.error.errorDetails;
                  console.log(this.errorDetails)
                   for(var refNum in this.errorDetails){
                   
                 this.invalidRef.push(this.errorDetails[refNum])

        }
                console.log(this.invalidRef)
                this.show = true;
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
 download(){
       var refernceNumberList = [];
       let referenceNumber = 'referenceNumber';
       var fileName = 'Invalid Scan Details';
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: ['Scan Details']}
          
     
        for(var refNum in this.errorDetails){
         var importObj = (
                    importObj={}, 
                    importObj[referenceNumber]= this.errorDetails[refNum], importObj
                    )
         refernceNumberList.push(importObj)

        }
        console.log(refernceNumberList);
      new Angular2Csv(refernceNumberList, fileName, options);
    };

}

interface City {
  name: string;
  value: string;
}




