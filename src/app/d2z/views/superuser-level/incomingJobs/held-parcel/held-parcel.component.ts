import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-create-parcel',
  templateUrl: './held-parcel.component.html',
  styleUrls: ['./held-parcel.component.css']
})

export class SuperHeldParcelComponent implements OnInit{
  
  private fieldArray: Array<any> = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
   errorMsg1: string;
  successMsg: String;
   successMsg1: String;
  brokerUserName: String;
  
  consigneedata:String;
   brokerListMainData = [];
   MlidListMainData = [];
   brokerDropdown: City[];  
   brokerDropdownValue = [];
    public recordList = [];
   file:File;
  user_Id: String;
  system: String;
  client: String;
  arrayBuffer:any;
  destinations:City[];
  status:City[];
  public importList = [];
  public importIndividualList = [];
  public importFileList = [];
  englishFlag:boolean;
  
  showFile:boolean;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) 
  { this.successMsg = null;

      this.errorMsg = null;
       this.successMsg1 = null;
  
      this.errorMsg1 = null;
      this._compiler.clearCache();

    
    }

  ngOnInit() {
 // 
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;

       this.consigmentUploadService.joblist( (resp) => {
      this.brokerListMainData = resp;
      this.spinner.hide();
      var that = this;
      
      resp.forEach(function(entry) {
     
     
        that.brokerDropdownValue.push(entry.brokerName);
      })
      this.brokerDropdown = this.brokerDropdownValue;
    })
  
     
      this.showFile = false;
     
     this.destinations = [
      {"name":"PER","value":"PER"},
        {"name":"ADL","value":"ADL"},
         {"name":"BNE","value":"BNE"},
         {"name":"SYD","value":"SYD"},
        
        {"name":"MEL","value":"MEL"},
         {"name":"OTH","value":"OTH"}
      ]
      
        this.status = [
      {"name":"AQIS HELD","value":"AQIS HELD"},
        {"name":"BORDER HELD","value":"BORDER HELD"},
         {"name":"CLEAR","value":"CLEAR"}
        
      ]
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
     
  };

onClientTypeChange(event){
console.log( event);
    this.client = event.value ? event.value.value: '';
  };
   addFieldValue() {
 
  console.log(this.newAttribute);
 
        this.fieldArray.push(this.newAttribute)
        this.newAttribute = {};
        console.log(this.newAttribute)
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

    incomingfile(event) {
    
    this.file = event.target.files[0]; 
    this.importRecords();
  }

   importRecords(){
    var worksheet;
    this.errorMsg1 = null;
    let fileReader = new FileReader();
    this.recordList = [];
    fileReader.readAsArrayBuffer(this.file);
    let mawb = 'mawb';
    let hawb = 'hawb';
    let note = 'note';
    let pod = 'pod';
    let stat = 'stat';
    let client = 'client';


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
         this.validateData(exportData);
          for (var importVal in exportData) {
            var dataObj = exportData[importVal];
            if(this.errorMsg1 == null){
              var importObj = (
                importObj={}, 
                importObj[hawb]= dataObj['HAWB'] != undefined ? dataObj['HAWB'] : '', importObj,
                importObj[mawb]= dataObj['MAWB'] != undefined ? dataObj['MAWB'] : '', importObj,
                importObj[stat]= dataObj['STATUS'] != undefined ? dataObj['STATUS'] : '', importObj,
                importObj[note]= dataObj['NOTES'] != undefined ? dataObj['NOTES'] : '', importObj,
                importObj[client]= this.client != undefined ? this.client : '', importObj,
                importObj[pod]= dataObj['POD'] != undefined ? dataObj['POD'] : '', importObj
              );
            this.recordList.push(importObj)
            
            }
        }
      }
  };

validateData(exportData)
{
console.log("in validate Data");
   var statusArr = ["AQIS HELD","BORDER HELD","CLEAR"];
   var destinationArr = ["PER","SYD","ADL","BNE","MEL","OTH"];
   for (var importVal in exportData) {
            var dataObj = exportData[importVal];
            console.log(this.errorMsg);
            if(this.errorMsg1 == null){
         //if(!(dataObj['STATUS'] != undefined && (dataObj['STATUS'] === 'AQIS HELD' || dataObj['STATUS'] === 'BORDER HELD' || dataObj['STATUS'] === 'CLEAR')))
         if(!statusArr.includes(dataObj['STATUS'])){
         this.errorMsg1 = dataObj['MAWB']+" - Invalid Status";
         }

 //if(!(dataObj['POD'] != undefined && (dataObj['POD'] === 'PER' || dataObj['POD'] === 'SYD' || dataObj['POD'] === 'MEL' || dataObj['POD'] === 'ADL' || dataObj['POD'] === 'BNY' || dataObj['POD'] === 'OTH')))
        if(!destinationArr.includes(dataObj['POD'])){       
         this.errorMsg1 = dataObj['MAWB']+" - Invalid POD";
         }



             
            
            }
}
}

uploadRecords(){
    this.spinner.show();

       this.errorMsg1 = null;
    this.successMsg1 = null;
   if(this.client ==  undefined){
      this.errorMsg1 = "**Please select Client";
      this.spinner.hide();
      }
      if(this.recordList.length == 0)
      {
        this.errorMsg1 = "Please Upload File";
        this.spinner.hide();
      }

       if(this.recordList.length > 0 && this.errorMsg1 == null ){

     console.log(this.recordList);
   this.consigmentUploadService.heldParcel(this.recordList, (resp) => {
      console.log(resp);
          this.spinner.hide();
          this.successMsg = resp.message;
         $('#brokerEnquiry').modal('show');
        setTimeout(() => { this.spinner.hide() }, 5000);
      });

      }
      else{
$('#invoice').modal('show');  
      }
      

};   
creatEnquiry(){

  
      this.errorMsg = '';
      this.importIndividualList = [];
      let hawb = 'hawb';
      let mawb = 'mawb';
      let stat = 'stat';
      let note = 'note';
      let client = 'client';
      let pod = 'pod';
    
      let userId = 'userId';
      var newBrokerEnquiryArray = [];
       
     
      if(this.newAttribute.hawb){
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
         console.log(fieldObj);
        var enquiryObj = (
          enquiryObj={}, 
          enquiryObj[hawb]= fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
          enquiryObj[mawb]= fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
          enquiryObj[stat]= fieldObj.stat != undefined ? fieldObj.stat.name: '', enquiryObj,
          enquiryObj[note]= fieldObj.note != undefined ? fieldObj.note : '', enquiryObj,
          enquiryObj[client]= fieldObj.client != undefined ? fieldObj.client.name: '', enquiryObj,
          enquiryObj[pod]= fieldObj.pod != undefined ? fieldObj.pod.name: '', enquiryObj
                  );
                  console.log(enquiryObj);
        this.importIndividualList.push(enquiryObj);
      }
      if(this.importIndividualList.length > 0 ){

  this.spinner.show();
        this.consigmentUploadService.heldParcel(this.importIndividualList, (resp) => {
           this.spinner.hide();
            this.successMsg = resp.message;
           $('#brokerEnquiry').modal('show');
           this.fieldArray = [];
           this.newAttribute = {};
        });
      }else{
        this.errorMsg = "** Atleast add one Job to proceed";
      }
      
    }

   
    clearEnquiry(){
      console.log("Clear Data")
      $("#enquiryFileControl").val('');
      this.fieldCreateArray = [];
      this.importList = [];
      this.errorMsg = null;
      this.successMsg = null;
    };

  
}


interface City {
  name: string;
  value: string;
}


