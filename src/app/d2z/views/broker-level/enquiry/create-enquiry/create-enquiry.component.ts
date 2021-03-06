import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-create-enquiry',
  templateUrl: './create-enquiry.component.html',
  styleUrls: ['./create-enquiry.component.css']
})

export class BrokerCreateEnquiryComponent implements OnInit{
  public fieldArray: Array<any> = [];
  private fieldCreateArray: Array<any> = [];
  public newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  successMsg: String;
  type: String;
  enquiry: String;
  file:File;
  user_Id: String;
  userName: String;
  system: String;
  arrayBuffer:any;
  cities2: City[];
  public importList = [];
  enquiryType: City[];
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
      this.userName = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.showFile = false;
      this.cities2  = [
        {"name":"Article Id","value":"articleId"},
        {"name":"Reference Number","value":"referenceNumber"}
      ];
      this.enquiryType = [
        {"name":"Status Enquiry","value":"enquiry"},
        {"name":"POD","value":"pod"}
      ];
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
     this.newAttribute = {};
  };

    addFieldValue() {
        this.fieldArray.push(this.newAttribute)
        this.newAttribute = {};
        this.errorMsg = '';
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

    onFileChange(event){
      this.type = event.value ? event.value.value : '';
    }

    onEnquiryChange(event){
      this.enquiry = event.value ? event.value.value : '';
    }

    deleteFieldFileValue(index) {
      this.fieldCreateArray.splice(index, 1);
    }

    creatEnquiry(){
      this.errorMsg = null;
      this.importIndividualList = [];
      let type = 'type';
      let identifier = 'identifier';
      let enquiry = 'enquiry';
      let pod = 'pod';
      let comments = 'comments';
      let userName = 'userName'; 
      let enquiryDetails = 'enquiryDetails'
      var newBrokerEnquiryArray = [];
      if(this.newAttribute.type){
        newBrokerEnquiryArray.push(this.newAttribute);
      }
      if(this.fieldArray.length > 0){
        for (var fieldVal in this.fieldArray) {
          var enquiryObj = this.fieldArray[fieldVal];
          newBrokerEnquiryArray.push(enquiryObj);
        }
      }

      for (var fieldVal in newBrokerEnquiryArray) {
          var fieldObj = newBrokerEnquiryArray[fieldVal];
          var enquiryObj = (
            enquiryObj={}, 
            enquiryObj[type]= fieldObj.type != undefined ? fieldObj.type.name : '', enquiryObj,
            enquiryObj[identifier]= fieldObj.identifier != undefined ? fieldObj.identifier : '', enquiryObj,
            enquiryObj[enquiry]= fieldObj.enquiry.value == 'enquiry'  ? "yes" : "no", enquiryObj,
            enquiryObj[pod]= fieldObj.enquiry.value == 'pod' ? "yes" : "no", enquiryObj,
            enquiryObj[comments]= fieldObj.comments != undefined ? fieldObj.comments : '',  enquiryObj
          );
          this.importIndividualList.push(enquiryObj);
      }

      if(this.importIndividualList.length > 0){
          for(var k = 0; k != this.importIndividualList.length; k++){
              if( this.importIndividualList[k].identifier.length == 0 ){
                this.errorMsg = "** Parcel Details cannot be Empty";
              }
          }

          var enquiryFinalObj = (
            enquiryFinalObj={}, 
            enquiryFinalObj[enquiryDetails]= this.importIndividualList, enquiryFinalObj,
            enquiryFinalObj[userName]= this.userName, enquiryFinalObj
          );
      
      if(this.errorMsg == null){
          this.spinner.show();
          this.consigmentUploadService.createEnquiry(enquiryFinalObj, (resp) => {
              this.spinner.hide();
              if(resp.error){
                this.successMsg = resp.error.errorMessage;
              }else{
                this.successMsg = resp.message;
                this.fieldArray = [];
                this.newAttribute = {};
              }
              $('#brokerEnquiry').modal('show');
          })
        }
      }else{
        this.errorMsg = "** Atleast add one enquiry to proceed";
      }
      
    }

    enquiryTabChanged(event){
          if(event.index == 0){
            this.fieldArray = [];
            this.newAttribute = {};
            this.errorMsg = '';
          }else if(event.index == 1){
            this.fieldCreateArray = [];
            this.errorMsg = '';
          }
    }

    incomingfile(event) {
      this.file = event.target.files[0]; 
      this.fileExport();
    };

    clearEnquiry(){
      $("#enquiryFileControl").val('');
      this.fieldCreateArray = [];
      this.importList = [];
      this.errorMsg = null;
      this.successMsg = null;
    };

    fileExport(){
      var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      fileReader.readAsArrayBuffer(this.file);
        let type = 'type';
        let identifier = 'identifier';
        let enquiry = 'enquiry';
        let pod = 'pod';
        let comments = 'comments';
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var exportData = XLSX.utils.sheet_to_json(worksheet);
            for (var importVal in exportData) {
              var dataObj = exportData[importVal];
              for(var keyVal in dataObj){
                var newLine = "\r\n"
              }

              if(!dataObj['Search Type']){
                this.errorMsg = "Search Type is mandatory";
              }else if(!dataObj['Search Details']){
                this.errorMsg = "Search Details is mandatory";
              }else if(!dataObj['Search Enquiry / POD']){
                this.errorMsg = "Search Enquiry / POD is mandatory";
              }else if(!dataObj['Comments']){
                this.errorMsg = 'Comments is mandatory';
              }

              if(this.errorMsg == null){
                var importObj = (
                  importObj={}, 
                  importObj[type]= dataObj['Search Type'] != undefined ? dataObj['Search Type'] : '', importObj,
                  importObj[identifier]= dataObj['Search Details'] != undefined ? dataObj['Search Details'] : '', importObj,
                  importObj[enquiry]= dataObj['Search Enquiry / POD'] != undefined ? dataObj['Search Enquiry / POD'] : '', importObj,
                  importObj[comments]= dataObj['Comments'] != undefined ? dataObj['Comments'] : '',  importObj
              );
              this.importList.push(importObj);
              }
           }
        }
        this.fieldCreateArray = this.importList;
        this.showFile = true;
    };

    creatFileEnquiry(){
      this.importFileList = [];
      this.errorMsg = null;
      let type = 'type';
      let identifier = 'identifier';
      let enquiry = 'enquiry';
      let pod = 'pod';
      let userName = 'userName';
      let comments = 'comments';
      let enquiryDetails = 'enquiryDetails'
      for (var fieldVal in this.fieldCreateArray) {
        var fieldObj = this.fieldCreateArray[fieldVal];
        var searchEnquiry = fieldObj.enquiry;
        if( searchEnquiry != "Enquiry" && searchEnquiry != "POD"){
          this.errorMsg = "**Allowed values are 'Enquiry' or 'POD' ";
          return;
        }
        var enquiryObj = (
          enquiryObj={}, 
          enquiryObj[type]= fieldObj.type != undefined ? fieldObj.type : '', enquiryObj,
          enquiryObj[identifier]= fieldObj.identifier != undefined ? fieldObj.identifier : '', enquiryObj,
          enquiryObj[enquiry]= fieldObj.enquiry == 'Enquiry' ? "yes" : "no", enquiryObj,
          enquiryObj[pod]= fieldObj.pod == 'POD' ? "yes" : "no", enquiryObj,
          enquiryObj[comments]= fieldObj.comments != undefined ? fieldObj.comments : '',  enquiryObj
        );
        this.importFileList.push(enquiryObj);
      }

      var enquiryFinalObj = (
        enquiryFinalObj={}, 
        enquiryFinalObj[enquiryDetails]= this.importFileList, enquiryFinalObj,
        enquiryFinalObj[userName]= this.userName, enquiryFinalObj
      );
      
      if(this.importFileList.length > 0 ){
          this.spinner.show();
          this.consigmentUploadService.createEnquiry(enquiryFinalObj, (resp) => {
            this.spinner.hide();
            if(resp.error){
              this.successMsg = resp.error.errorMessage;
            }else{
              this.fieldCreateArray = [];
              this.successMsg = resp.message;
            }
            $('#brokerEnquiry').modal('show');
            setTimeout(() => {
              this.spinner.hide();
            }, 5000);
          })
      }else{
        this.errorMsg = "** Atleast add one enquiry to proceed";
      }
    }

}


interface City {
  name: string;
  value: string;
}


