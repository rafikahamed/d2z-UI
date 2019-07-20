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

export class CreateEnquiryComponent{
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
  cities2: City[];
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
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.showFile = false;
      this.cities2  = [
        {"name":"Article Id","value":"articleId"},
        {"name":"Reference Number","value":"referenceNumber"}
      ];
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
     
  };

    addFieldValue() {
        this.fieldArray.push(this.newAttribute)
        this.newAttribute = {};
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

    onFileChange(event){
      this.type = event.value ? event.value.value : '';
    }

    deleteFieldFileValue(index) {
      this.fieldCreateArray.splice(index, 1);
  }

    creatEnquiry(){
      let type = 'type';
      let identifier = 'identifier';
      let enquiry = 'enquiry';
      let pod = 'pod';
      let comments = 'comments';
      let userId = 'userId';
      for (var fieldVal in this.fieldArray) {
        var fieldObj = this.fieldArray[fieldVal];
        var enquiryObj = (
          enquiryObj={}, 
          enquiryObj[type]= fieldObj.type != undefined ? fieldObj.type.name : '', enquiryObj,
          enquiryObj[identifier]= fieldObj.identifier != undefined ? fieldObj.identifier : '', enquiryObj,
          enquiryObj[enquiry]= fieldObj.enquiry != undefined ? "yes" : "no", enquiryObj,
          enquiryObj[pod]= fieldObj.pod =! undefined ? "yes" : "no", enquiryObj,
          enquiryObj[userId]= this.user_Id,
          enquiryObj[comments]= fieldObj.comments != undefined ? fieldObj.comments : '',  enquiryObj
        );
        this.importIndividualList.push(enquiryObj);
      }
      this.spinner.show();
      console.log(this.importIndividualList)
      this.consigmentUploadService.createEnquiry(this.importIndividualList, (resp) => {
        this.spinner.hide();
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      });
    }

    enquiryTabChanged(event){
      console.log(event.index)
      if(event.index == 0){
        this.fieldArray = [];
      }else if(event.index == 1){
        this.fieldCreateArray = [];
      }
    }

    incomingfile(event) {
      this.file = event.target.files[0]; 
      this.fileExport();
    };

    clearEnquiry(){
      console.log("Clear Data")
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

              if(!dataObj['Parcel Type']){
                this.errorMsg = "Parcel Type is mandatory";
              }else if(!dataObj['Parcel Details']){
                this.errorMsg = "Parcel Details is mandatory";
              }else if(!dataObj['Delivery Enquiry']){
                this.errorMsg = "Delivery Enquiry is mandatory";
              }else if(!dataObj['Delivery POD']){
                this.errorMsg = 'Delivery POD is mandatory';
              }else if(!dataObj['Comments']){
                this.errorMsg = 'Comments is mandatory';
              }

              if(this.errorMsg == null){
                var importObj = (
                  importObj={}, 
                  importObj[type]= dataObj['Parcel Type'] != undefined ? dataObj['Parcel Type'] : '', importObj,
                  importObj[identifier]= dataObj['Parcel Details'] != undefined ? dataObj['Parcel Details'] : '', importObj,
                  importObj[enquiry]= dataObj['Delivery Enquiry'] == 'yes' ? true : false, importObj,
                  importObj[pod]= dataObj['Delivery POD'] == 'yes' ? true : false, importObj,
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
      let type = 'type';
      let identifier = 'identifier';
      let enquiry = 'enquiry';
      let pod = 'pod';
      let userId = 'userId';
      let comments = 'comments';
      for (var fieldVal in this.fieldCreateArray) {
        var fieldObj = this.fieldCreateArray[fieldVal];
        var enquiryObj = (
          enquiryObj={}, 
          enquiryObj[type]= fieldObj.type != undefined ? fieldObj.type : '', enquiryObj,
          enquiryObj[identifier]= fieldObj.identifier != undefined ? fieldObj.identifier : '', enquiryObj,
          enquiryObj[enquiry]= fieldObj.enquiry == true ? "yes" : "no", enquiryObj,
          enquiryObj[pod]= fieldObj.pod == true ? "yes" : "no", enquiryObj,
          enquiryObj[userId]= this.user_Id,
          enquiryObj[comments]= fieldObj.comments != undefined ? fieldObj.comments : '',  enquiryObj
        );
        this.importFileList.push(enquiryObj);
      }
      console.log(this.importFileList);
      this.spinner.show();
      this.consigmentUploadService.createEnquiry(this.importFileList, (resp) => {
        this.spinner.hide();
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      })
    }

}


interface City {
  name: string;
  value: string;
}


