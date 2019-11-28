import { Component, ViewChild,ChangeDetectorRef,OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm,FormGroup, FormControl,  FormArray, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-update-parcel',
  templateUrl: './update-parcel.component.html',
  styleUrls: ['./update-parcel.component.css']
})

export class SuperUpdateParcelComponent implements OnInit{
@ViewChild('myForm') myForm: NgForm;

  private fieldArray = [];
   private fieldArrayout = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
 errorMsg1:String;
 successMsg1: String;
  successMsg: String;
  brokerUserName: String;
    brokerListMainData = [];
     file:File;
  brokerDropdown: City[];  
   brokerDropdownValue = [];
  displayedColumns = ["Broker", "Mlid", "Consignee"];
 status:City[];
 destinations: City[];
  type: String;
tabs =[];
  user_Id: String;
  system: String;
  client: String;
  arrayBuffer:any;
    form: FormGroup;
     brokerAddClientForm: FormGroup;
      public recordList = [];
      public ExportList = [];
  public importList = [];
  public importIndividualList = [];
  public importFileList = [];
  englishFlag:boolean;
  public selectedIndex: number = 0;
  showFile:boolean;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb : FormBuilder,

    private change: ChangeDetectorRef,
    private _compiler: Compiler
  ) {
    this.status = [
      {"name":"AQIS HELD","value":"AQIS HELD"},
        {"name":"BORDER HELD","value":"BORDER HELD"},
         {"name":"CLEAR","value":"CLEAR"}
        
      ]
      this.destinations = [
      {"name":"PER","value":"PER"},
        {"name":"ADL","value":"ADL"},
         {"name":"BNE","value":"BNE"},
         {"name":"SYD","value":"SYD"},
        
        {"name":"MEL","value":"MEL"},
         {"name":"OTH","value":"OTH"}
      ]
    this._compiler.clearCache();  
     this.form = this.fb.group({
      published: true,
      credentials: this.fb.array([]),
    });
     
  }

  ngOnInit() {
    this.spinner.show();
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
     //  this.consigmentUploadService.parcellist( (resp) => {
       //  this.spinner.hide();
     // this.fieldArray = resp;
     //this.fieldArrayout = resp;
      //var that = this;
      
    
    //})
  
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
  
  clientSearch(){
    var client = this.client;
       this.consigmentUploadService.parcellist(client,(resp) => {
         console.log(resp);
         this.spinner.hide();
      this.fieldArray = resp;
     this.fieldArrayout = resp;
     var that = this;
      
    
    })
    }
  
 check(element)
 {

 for (var fieldVal in this.fieldArray) {
        var fieldObj = this.fieldArray[fieldVal];
        fieldObj.checked = element.target.checked;

 }


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
    let name = 'name';
    let value = 'value';
    let output = 'output';
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
              var clientObj=(
                clientObj = {},
                clientObj[name]= this.client != undefined ? this.client : '', clientObj,
                clientObj[value]= this.client != undefined ? this.client : '', clientObj
                );
              var podObj=(
                podObj = {},
                podObj[name]= dataObj['POD'] != undefined ? dataObj['POD'] : '', podObj,
                podObj[value]= dataObj['POD'] != undefined ? dataObj['POD'] : '', podObj
                );
              var statusObj=(
                statusObj = {},
                statusObj[name]= dataObj['STATUS'] != undefined ? dataObj['STATUS'] : '', statusObj,
                statusObj[value]= dataObj['STATUS'] != undefined ? dataObj['STATUS'] : '', statusObj
                );
              var importObj = (
                importObj={}, 
                importObj[hawb]= dataObj['HAWB'] != undefined ? dataObj['HAWB'] : '', importObj,
                importObj[mawb]= dataObj['MAWB'] != undefined ? dataObj['MAWB'] : '', importObj,
                importObj[stat]= statusObj, importObj,
                importObj[note]= dataObj['NOTE'] != undefined ? dataObj['NOTE'] : '', importObj,
                importObj[client]= clientObj,importObj,
                importObj[pod]= podObj, importObj,
                importObj[output]= "C", importObj

                
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
      this.successMsg1 = null;
  
      this.errorMsg1 = null;
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
   this.consigmentUploadService.updateParcel(this.recordList, (resp) => {
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
      
      let note ='note'
      
      let jobid = 'jobid';
     
       let hawb = 'hawb';
     let stat= 'stat';
      let mawb = 'mawb';
      let parcelid = 'parcelid';
      let output = 'output';
      let client = 'client';
      let pod = 'pod';
      var newBrokerEnquiryArray =  this.fieldArray;
      

      for (var fieldVal in newBrokerEnquiryArray) {
        var fieldObj = newBrokerEnquiryArray[fieldVal];
       console.log(fieldObj);
       console.log(fieldObj.stat);
     if(fieldObj.checked === true)
     {

        var enquiryObj = (
          enquiryObj={}, 
         
          enquiryObj[mawb]= fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
         
            enquiryObj[hawb]= fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
            enquiryObj[parcelid] = fieldObj.parcelid != undefined ? fieldObj.parcelid : '', enquiryObj,
           enquiryObj[note]= fieldObj.note != undefined ? fieldObj.note : '', enquiryObj,
           enquiryObj[output] = 'C',
             enquiryObj[stat]= fieldObj.stat != undefined ? fieldObj.stat: '', enquiryObj,
             enquiryObj[pod]= fieldObj.pod != undefined ? fieldObj.pod: '', enquiryObj,
             enquiryObj[client]= fieldObj.client != undefined ? fieldObj.client: '', enquiryObj
         
        );
        console.log(enquiryObj);
        this.importIndividualList.push(enquiryObj);
      }
      }
      if(this.importIndividualList.length > 0 ){
     

  this.spinner.show();
        this.consigmentUploadService.updateParcel(this.importIndividualList, (resp) => {
            this.spinner.hide();
            this.successMsg = resp.message;
            $('#brokerEnquiry').modal('show');
            
           
        });
      }else{
        this.errorMsg = "** Atleast add one Job to proceed";
      }
      
    
    }
     

     ExportEnquiry(){

  
      this.errorMsg = '';
      
      this.ExportList = [];
      
      let note ='note'
       
      let jobid = 'jobid';
     
       let hawb = 'hawb';
     let stat= 'stat';
      let mawb = 'mawb';
      let parcelid = 'parcelid';
      let output = 'output';
      let client = 'client';
      let pod = 'pod';
        var currentTime = new Date();
      var newBrokerEnquiryArray =  this.fieldArray;
       var fileName = '';
            fileName = "Update_Parcel"+"-"+currentTime.toLocaleDateString();
            var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: [ "MAWB" ,"HAWB", "NOTE", "CLIENT","POD","STATUS" ]
            };

      for (var fieldVal in newBrokerEnquiryArray) {
        var fieldObj = newBrokerEnquiryArray[fieldVal];
       console.log(fieldObj);
       console.log(fieldObj.stat);
     if(fieldObj.checked === true)
     {

      
var exportObj = (
exportObj={}, 
         
          exportObj[mawb]= fieldObj.mawb != undefined ? fieldObj.mawb : '', exportObj,
         
            exportObj[hawb]= fieldObj.hawb != undefined ? fieldObj.hawb : '', exportObj,
            
           exportObj[note]= fieldObj.note != undefined ? fieldObj.note : '', exportObj,
           exportObj[client]= fieldObj.client != undefined ? fieldObj.client.name: '', exportObj,
           exportObj[pod]= fieldObj.pod != undefined ? fieldObj.pod.name: '', exportObj,
          exportObj[stat]= fieldObj.stat != undefined ? fieldObj.stat.name: '', exportObj
         

);

              this.ExportList.push(exportObj);
      }
      }
      if(this.ExportList.length > 0 ){
     

  this.spinner.show();
        
 new Angular2Csv(this.ExportList, fileName, options);  
            this.spinner.hide();
            this.successMsg = "Exported Successfully";
            $('#brokerEnquiry').modal('show');
            
           
        
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


