import { Component, ViewChild,ChangeDetectorRef,OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm,FormGroup, FormControl,  FormArray, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Global } from 'app/d2z/service/Global';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-outstanding-job',
  templateUrl: './outstanding-job.component.html',
  styleUrls: ['./outstanding-job.component.css']
})

export class SuperOutstandingJobComponent implements OnInit {
  @ViewChild('myForm') myForm: NgForm;
 
  public fieldArray = [];
  private fieldArrayout = [];
  private fieldCreateArray: Array < any > = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  errorMsg1: string;
  errorMsg2: string;
  private selectedTab = 0;
  successMsg: String;
  brokerUserName: String;
  displayedColumns = ["Broker", "Mlid", "Consignee"];
  consigneedata: String;
  brokerListMainData = [];
  MlidListMainData = [];
  fromDate: String;
  public recordList = [];
  file:File;
  type: String;
  tabs = [];
  user_Id: String;
  system: String;
  arrayBuffer: any;
  form: FormGroup;
  brokerAddClientForm: FormGroup;
 
  public importList = [];
  public importIndividualList = [];
  public importFileList = [];
  englishFlag: boolean;
  public selectedIndex: number = 0;
  showFile: boolean;
  constructor(
   public consigmentUploadService: ConsigmentUploadService,
   public trackingDataService: TrackingDataService,
   public global: Global,
   private spinner: NgxSpinnerService,
   private router: Router,
   private fb: FormBuilder,
 
   private change: ChangeDetectorRef,
   private _compiler: Compiler
  ) {
   this._compiler.clearCache();
   this.form = this.fb.group({
    published: true,
    credentials: this.fb.array([]),
   });
 
  }
 
  ngOnInit() {
   this.spinner.show();
   this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" : "D2Z";
   this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id : '';
   var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
   this.englishFlag = lanObject.englishFlag;
   this.consigmentUploadService.outstandingJob((resp) => {
    this.spinner.hide();
    this.fieldArray = resp;
    this.fieldArrayout = resp;
    var that = this;
   })

   this.showFile = false;
   this.router.events.subscribe((evt) => {
    if (!(evt instanceof NavigationEnd)) {
     return;
    }
    window.scrollTo(0, 0)
   })
 
  };

  FromDateChange(event) {
   var str = event.target.value;
   var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
   this.fromDate = [date.getFullYear(), mnth, day].join("-");
  };

  creatEnquiry() {
   this.errorMsg = '';
   this.importIndividualList = [];
   let clear = 'clear';
   let outturn = 'outturn';
   let note = 'note'
   let ata = 'ata';
   let held = 'held';
   let jobid = 'jobid';
   let broker = 'broker';
   let mlid = 'mlid';
   let consignee = 'consignee';
   let hawb = 'hawb';
   let dest = 'destination';
   let weight = 'weight';
   let mawb = 'mawb';
   let flight = 'flight';
   let eta = 'eta';
   let piece = 'piece';
   let userId = 'userId';
   var newBrokerEnquiryArray = this.fieldArray;
   let injectionDate = 'injectionDate';
   let clearanceDate = 'clearanceDate';
   let surplus = 'surplus';
   let damage = 'damage';
 
   for (var fieldVal in newBrokerEnquiryArray) {
      var fieldObj = newBrokerEnquiryArray[fieldVal];
      if (fieldObj.checked === true) {
      var enquiryObj = (
        enquiryObj = {},
        enquiryObj[broker] = fieldObj.broker != undefined ? fieldObj.broker : '', enquiryObj,
        enquiryObj[mlid] = fieldObj.mlid != undefined ? fieldObj.mlid : '', enquiryObj,
        enquiryObj[consignee] = fieldObj.consignee != undefined ? fieldObj.consignee : '', enquiryObj,
        enquiryObj[mawb] = fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
        enquiryObj[dest] = fieldObj.destination != undefined ? fieldObj.destination : '', enquiryObj,
        enquiryObj[flight] = fieldObj.flight != undefined ? fieldObj.flight : '', enquiryObj,
        enquiryObj[eta] = fieldObj.eta != undefined ? fieldObj.eta : '', enquiryObj,
        enquiryObj[weight] = fieldObj.weight != undefined ? fieldObj.weight : '', enquiryObj,
        enquiryObj[piece] = fieldObj.piece != undefined ? fieldObj.piece : '', enquiryObj,
        enquiryObj[hawb] = fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
        enquiryObj[jobid] = fieldObj.jobid != undefined ? fieldObj.jobid : '', enquiryObj,
        enquiryObj[clear] = fieldObj.clear != undefined ? fieldObj.clear : '', enquiryObj,
        enquiryObj[outturn] = fieldObj.outturn != undefined ? fieldObj.outturn : '', enquiryObj,
        enquiryObj[note] = fieldObj.note != undefined ? fieldObj.note : '', enquiryObj,
        enquiryObj[held] = fieldObj.held != undefined ? fieldObj.held : '', enquiryObj,
        enquiryObj[ata] = fieldObj.ata != undefined ? fieldObj.ata : '', enquiryObj,
        enquiryObj[injectionDate] = fieldObj.injectionDate != undefined ? fieldObj.injectionDate : '', enquiryObj,
        enquiryObj[clearanceDate] = fieldObj.clearanceDate != undefined ? fieldObj.clearanceDate : '', enquiryObj,
        enquiryObj[surplus] = fieldObj.surplus != undefined ? fieldObj.surplus : '', enquiryObj,
        enquiryObj[damage] = fieldObj.damage != undefined ? fieldObj.damage : '', enquiryObj
      );
      this.importIndividualList.push(enquiryObj);
      }
   };

   if (this.importIndividualList.length > 0) {
      this.spinner.show();
        this.consigmentUploadService.updateJob(this.importIndividualList, (resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        $('#brokerEnquiry').modal('show');
        });
    } else {
          this.errorMsg = "** Atleast add one Job to proceed";
    }
  };

  submitEnquiry() {
   this.errorMsg = '';
   this.importIndividualList = [];
   let clear = 'clear';
   let outturn = 'outturn';
   let note = 'note'
   let ata = 'ata';
   let held = 'held';
   let jobid = 'jobid';
   let broker = 'broker';
   let mlid = 'mlid';
   let consignee = 'consignee';
   let hawb = 'hawb';
   let dest = 'destination';
   let weight = 'weight';
   let mawb = 'mawb';
   let flight = 'flight';
   let eta = 'eta';
   let piece = 'piece';
   let injectionDate = 'injectionDate';
   let clearanceDate = 'clearanceDate';
   let surplus = 'surplus';
   let damage = 'damage';
   let userId = 'userId';
   var newBrokerEnquiryArray = this.fieldArray;
 
   for(var fieldVal in newBrokerEnquiryArray) {
    var fieldObj = newBrokerEnquiryArray[fieldVal];
    if(fieldObj.checked === true) {
     if(!(fieldObj.outturn != undefined && (fieldObj.outturn === 'Y' || fieldObj.outturn === true))){
      this.errorMsg = "Please select outturn before submitting Job";
     }
    var enquiryObj = (
      enquiryObj = {},
      enquiryObj[broker] = fieldObj.broker != undefined ? fieldObj.broker : '', enquiryObj,
      enquiryObj[mlid] = fieldObj.mlid != undefined ? fieldObj.mlid : '', enquiryObj,
      enquiryObj[consignee] = fieldObj.consignee != undefined ? fieldObj.consignee : '', enquiryObj,
      enquiryObj[mawb] = fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
      enquiryObj[dest] = fieldObj.destination != undefined ? fieldObj.destination : '', enquiryObj,
      enquiryObj[flight] = fieldObj.flight != undefined ? fieldObj.flight : '', enquiryObj,
      enquiryObj[eta] = fieldObj.eta != undefined ? fieldObj.eta : '', enquiryObj,
      enquiryObj[weight] = fieldObj.weight != undefined ? fieldObj.weight : '', enquiryObj,
      enquiryObj[piece] = fieldObj.piece != undefined ? fieldObj.piece : '', enquiryObj,
      enquiryObj[hawb] = fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
      enquiryObj[jobid] = fieldObj.jobid != undefined ? fieldObj.jobid : '', enquiryObj,
      enquiryObj[clear] = fieldObj.clear != undefined ? fieldObj.clear : '', enquiryObj,
      enquiryObj[outturn] = fieldObj.outturn != undefined ? fieldObj.outturn : '', enquiryObj,
      enquiryObj[note] = fieldObj.note != undefined ? fieldObj.note : '', enquiryObj,
      enquiryObj[held] = fieldObj.held != undefined ? fieldObj.held : '', enquiryObj,
      enquiryObj[ata] = fieldObj.ata != undefined ? fieldObj.ata : '', enquiryObj,
      enquiryObj[injectionDate] = fieldObj.injectionDate != undefined ? fieldObj.injectionDate : '', enquiryObj,
      enquiryObj[clearanceDate] = fieldObj.clearanceDate != undefined ? fieldObj.clearanceDate : '', enquiryObj,
      enquiryObj[surplus] = fieldObj.surplus != undefined ? fieldObj.surplus : '', enquiryObj,
      enquiryObj[damage] = fieldObj.damage != undefined ? fieldObj.damage : '', enquiryObj
     );
     this.importIndividualList.push(enquiryObj);
    }
   };
 
    if (this.importIndividualList.length > 0 && this.errorMsg === '') {
        this.spinner.show();
        this.consigmentUploadService.submitJob(this.importIndividualList, (resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        $('#brokerEnquiry').modal('show');
        });
    } else {
        if (this.errorMsg === '') {
        this.errorMsg = "** Atleast add one Job to proceed";
        }
    }
  };

  check(event, index) {
      var newBrokerEnquiryArray = this.tabs;
      var fieldObj = this.tabs[index];
      this.errorMsg = '';
      this.importIndividualList = [];
      let clear = 'clear';
      let outturn = 'outturn';
      let note = 'note'
      let ata = 'ata';
      let held = 'held';
      let jobid = 'jobid';
      let broker = 'broker';
      let mlid = 'mlid';
      let consignee = 'consignee';
      let hawb = 'hawb';
      let dest = 'destination';
      let weight = 'weight';
      let mawb = 'mawb';
      let flight = 'flight';
      let eta = 'eta';
      let piece = 'piece';
      let injectionDate = 'injectionDate';
      let clearanceDate = 'clearanceDate';
      let surplus = 'surplus';
      let damage = 'damage';
    
      var enquiryObj = (
            enquiryObj = {},
            enquiryObj[broker] = fieldObj.broker != undefined ? fieldObj.broker : '', enquiryObj,
            enquiryObj[mlid] = fieldObj.mlid != undefined ? fieldObj.mlid : '', enquiryObj,
            enquiryObj[consignee] = fieldObj.consignee != undefined ? fieldObj.consignee : '', enquiryObj,
            enquiryObj[mawb] = fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
            enquiryObj[dest] = fieldObj.dest != undefined ? fieldObj.dest : '', enquiryObj,
            enquiryObj[flight] = fieldObj.flight != undefined ? fieldObj.flight : '', enquiryObj,
            enquiryObj[eta] = fieldObj.eta != undefined ? fieldObj.eta : '', enquiryObj,
            enquiryObj[weight] = fieldObj.weight != undefined ? fieldObj.weight : '', enquiryObj,
            enquiryObj[piece] = fieldObj.piece != undefined ? fieldObj.piece : '', enquiryObj,
            enquiryObj[hawb] = fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
            enquiryObj[jobid] = fieldObj.jobid != undefined ? fieldObj.jobid : '', enquiryObj,
            /**enquiryObj[clear]= this.myForm.controls['clear'].value!= undefined ? this.myForm.controls['clear'].value : '', enquiryObj,
            enquiryObj[outturn]= this.myForm.controls['outturn'].value != undefined ? this.myForm.controls['outturn'].value: '', enquiryObj,
            enquiryObj[note]= this.myForm.controls['note'].value != undefined ? this.myForm.controls['note'].value : '', enquiryObj,
            enquiryObj[held]=this.myForm.controls['held'].value != undefined ? this.myForm.controls['held'].value : '', enquiryObj,
            enquiryObj[ata]= this.myForm.controls['ata'].value != undefined ? this.myForm.controls['ata'].value : '', enquiryObj**/
            enquiryObj[clear] = fieldObj.clear != undefined ? fieldObj.clear : '', enquiryObj,
            enquiryObj[outturn] = fieldObj.outturn != undefined ? fieldObj.outturn : '', enquiryObj,
            enquiryObj[note] = fieldObj.note != undefined ? fieldObj.note : '', enquiryObj,
            enquiryObj[held] = fieldObj.held != undefined ? fieldObj.held : '', enquiryObj,
            enquiryObj[ata] = fieldObj.ata != undefined ? fieldObj.ata : '', enquiryObj,
            enquiryObj[injectionDate] = fieldObj.injectionDate != undefined ? fieldObj.injectionDate : '', enquiryObj,
            enquiryObj[clearanceDate] = fieldObj.clearanceDate != undefined ? fieldObj.clearanceDate : '', enquiryObj,
            enquiryObj[surplus] = fieldObj.surplus != undefined ? fieldObj.surplus : '', enquiryObj,
            enquiryObj[damage] = fieldObj.damage != undefined ? fieldObj.damage : '', enquiryObj
          );
          console.log(enquiryObj);
          this.importIndividualList.push(enquiryObj);
          this.spinner.show();
          this.consigmentUploadService.updateJob(this.importIndividualList, (resp) => {
            this.successMsg = resp.message;
            $('#brokerEnquiry').modal('show');
            this.consigmentUploadService.outstandingJob((resp) => {
                this.spinner.hide();
                this.fieldArray = resp;
                this.errorMsg2 = '';
                //this.tabs = [];
            })
      });
  }
 
  generateReport(event, index) {
      this.errorMsg2 = '';
      var newBrokerEnquiryArray = this.tabs;
      var fieldObj = this.tabs[index];
      this.errorMsg = '';
      let clear = 'clear';
      let outturn = 'outturn';
      let note = 'note'
      let ata = 'ata';
      let held = 'held';
      let jobid = 'jobid';
      let broker = 'broker';
      let mlid = 'mlid';
      let consignee = 'consignee';
      let hawb = 'hawb';
      let dest = 'destination';
      let weight = 'weight';
      let mawb = 'mawb';
      let flight = 'flight';
      let eta = 'eta';
      let piece = 'piece';
      let injectionDate = 'injectionDate';
      let clearanceDate = 'clearanceDate';
      let surplus = 'surplus';
      let damage = 'damage';
    
      var enquiryObj = (
        enquiryObj = {},
        enquiryObj[broker] = fieldObj.broker != undefined ? fieldObj.broker : '', enquiryObj,
        enquiryObj[mlid] = fieldObj.mlid != undefined ? fieldObj.mlid : '', enquiryObj,
        enquiryObj[consignee] = fieldObj.consignee != undefined ? fieldObj.consignee : '', enquiryObj,
        enquiryObj[mawb] = fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
        enquiryObj[dest] = fieldObj.dest != undefined ? fieldObj.dest : '', enquiryObj,
        enquiryObj[flight] = fieldObj.flight != undefined ? fieldObj.flight : '', enquiryObj,
        enquiryObj[eta] = fieldObj.eta != undefined ? fieldObj.eta : '', enquiryObj,
        enquiryObj[weight] = fieldObj.weight != undefined ? fieldObj.weight : '', enquiryObj,
        enquiryObj[piece] = fieldObj.piece != undefined ? fieldObj.piece : '', enquiryObj,
        enquiryObj[hawb] = fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
        enquiryObj[jobid] = fieldObj.jobid != undefined ? fieldObj.jobid : '', enquiryObj,
        /** enquiryObj[clear]= this.myForm.controls['clear'].value!= undefined ? this.myForm.controls['clear'].value : '', enquiryObj,
        enquiryObj[outturn]= this.myForm.controls['outturn'].value != undefined ? this.myForm.controls['outturn'].value: '', enquiryObj,
        enquiryObj[note]= this.myForm.controls['note'].value != undefined ? this.myForm.controls['note'].value : '', enquiryObj,
        enquiryObj[held]=this.myForm.controls['held'].value != undefined ? this.myForm.controls['held'].value : '', enquiryObj,    
        enquiryObj[ata]= this.myForm.controls['ata'].value != undefined ? this.myForm.controls['ata'].value : '', enquiryObj**/
        enquiryObj[clear] = fieldObj.clear != undefined ? fieldObj.clear : '', enquiryObj,
        enquiryObj[outturn] = fieldObj.outturn != undefined ? fieldObj.outturn : '', enquiryObj,
        enquiryObj[note] = fieldObj.note != undefined ? fieldObj.note : '', enquiryObj,
        enquiryObj[held] = fieldObj.held != undefined ? fieldObj.held : '', enquiryObj,
        enquiryObj[ata] = fieldObj.ata != undefined ? fieldObj.ata : '', enquiryObj,
        enquiryObj[injectionDate] = fieldObj.injectionDate != undefined ? fieldObj.injectionDate : '', enquiryObj,
        enquiryObj[clearanceDate] = fieldObj.clearanceDate != undefined ? fieldObj.clearanceDate : '', enquiryObj,
        enquiryObj[surplus] = fieldObj.surplus != undefined ? fieldObj.surplus : '', enquiryObj,
        enquiryObj[damage] = fieldObj.damage != undefined ? fieldObj.damage : '', enquiryObj
      );
    
      console.log(enquiryObj);
      this.importIndividualList.push(enquiryObj);
      this.spinner.show();
      this.consigmentUploadService.generateShipmentSummary(this.importIndividualList,(resp) => {
          this.successMsg = resp.message;
          $('#brokerEnquiry').modal('show');
          this.consigmentUploadService.outstandingJob((resp) => {
              this.spinner.hide();
              this.fieldArray = resp;
              this.tabs = [];
          });
      });
  };

  loadInvoicePending() {
   this.global.setoustanding_InvoiceMAWB(true);
   this.router.navigateByUrl('/superuser/invoices/pending');
  };

  viewEnquiry() {
   this.tabs = [];
   var newBrokerEnquiryArray = this.fieldArray;
   for (var fieldVal in newBrokerEnquiryArray) {
    var fieldObj = newBrokerEnquiryArray[fieldVal];
    console.log(fieldObj.note);
    if (fieldObj.checked === true) {
        this.tabs.push({
          'label': 'Jobs' + fieldVal,
          'broker': fieldObj.broker,
          'mlid': fieldObj.mlid,
          'consignee': fieldObj.consignee != undefined ? fieldObj.consignee : '',
          'mawb': fieldObj.mawb != undefined ? fieldObj.mawb : '',
          'dest': fieldObj.destination != undefined ? fieldObj.destination : '',
          'flight': fieldObj.flight != undefined ? fieldObj.flight : '',
          'eta': fieldObj.eta != undefined ? fieldObj.eta : '',
          'weight': fieldObj.weight != undefined ? fieldObj.weight : '',
          'piece': fieldObj.piece != undefined ? fieldObj.piece : '',
          'hawb': fieldObj.hawb != undefined ? fieldObj.hawb : '',
          'clear': fieldObj.clear != undefined ? fieldObj.clear : '',
          'outturn': fieldObj.outturn != undefined ? fieldObj.outturn : '',
          'note': fieldObj.note != undefined ? fieldObj.note : '',
          'held': fieldObj.held != undefined ? fieldObj.held : '',
          'ata': fieldObj.ata != undefined ? fieldObj.ata : '',
          'jobid': fieldObj.jobid != undefined ? fieldObj.jobid : '',
          'injectionDate' :  fieldObj.injectionDate != undefined ? fieldObj.injectionDate : '',
          'clearanceDate' :  fieldObj.clearanceDate != undefined ? fieldObj.clearanceDate : '',
          'surplus' :  fieldObj.surplus != undefined ? fieldObj.surplus : '',
          'damage' :  fieldObj.damage != undefined ? fieldObj.damage : ''
        });
     }
   }
    this.selectedIndex = 1;
  };
 
  clearEnquiry() {
    $("#enquiryFileControl").val('');
    this.fieldCreateArray = [];
    this.importList = [];
    this.errorMsg = null;
    this.successMsg = null;
  };

  incomingfile(event,mawb) {
    this.file = event.target.files[0]; 
    this.importRecords(mawb);
  };

  importRecords(selectedMawb){
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
                importObj[client]= dataObj['CLIENT'] != undefined ? dataObj['CLIENT'] : '', importObj,
                importObj[pod]= dataObj['POD'] != undefined ? dataObj['POD'] : '', importObj
               );
            this.recordList.push(importObj)  
          }
        };
        if(this.recordList.length > 0){
          this.spinner.show();
          this.consigmentUploadService.heldParcel(this.recordList, (resp) => {
              console.log(resp);
              this.spinner.hide();
              this.errorMsg1 = resp.error.errorMessage+" - "+resp.error.errorDetails;
          });
        }
      }
  };

  validateData(exportData){
        console.log("in validate Data");
        // var statusArr = ["AQIS HELD","BORDER HELD","CLEAR"];
        // var destinationArr = ["PER","SYD","ADL","BNE","MEL","OTH"];
        // for (var importVal in exportData) {
        //         var dataObj = exportData[importVal];
        //         console.log(this.errorMsg);
        //         if(this.errorMsg1 == null){
        //             //if(!(dataObj['STATUS'] != undefined && (dataObj['STATUS'] === 'AQIS HELD' || dataObj['STATUS'] === 'BORDER HELD' || dataObj['STATUS'] === 'CLEAR')))
        //             // if(!statusArr.includes(dataObj['STATUS'])){
        //             //     this.errorMsg1 = dataObj['MAWB']+" - Invalid Status";
        //             // }
        //             //if(!(dataObj['POD'] != undefined && (dataObj['POD'] === 'PER' || dataObj['POD'] === 'SYD' || dataObj['POD'] === 'MEL' || dataObj['POD'] === 'ADL' || dataObj['POD'] === 'BNY' || dataObj['POD'] === 'OTH')))
        //             // if(!destinationArr.includes(dataObj['POD'])){       
        //             //     this.errorMsg1 = dataObj['MAWB']+" - Invalid POD";
        //             // }
        //         }
        // }
  };

  /*Outstanding job file returns Old */
  // importRecords(selectedMawb){
  //   var worksheet;
  //   this.errorMsg1 = null;
  //   let fileReader = new FileReader();
  //   this.recordList = [];
  //   fileReader.readAsArrayBuffer(this.file);
  //   let mawb = 'mawb';
  //   let hawb = 'hawb';
  //   let pod  = 'pod';
  //   let note = 'note';
  //   let stat = 'stat';
  //   let client = 'client';
  //   fileReader.onload = (e) => {
  //           this.arrayBuffer = fileReader.result;
  //             var data = new Uint8Array(this.arrayBuffer);
  //             var arr = new Array();
  //             for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //             var bstr = arr.join("");
  //             var workbook = XLSX.read(bstr, {type:"binary"});
  //             var first_sheet_name = workbook.SheetNames[0];
  //             var worksheet = workbook.Sheets[first_sheet_name];
  //             var exportData = XLSX.utils.sheet_to_json(worksheet);
  //             console.log(exportData);
  //           this.validateData(exportData);
  //             for (var importVal in exportData) {
  //               var dataObj = exportData[importVal];
  //               console.log(dataObj);
  //               console.log(this.errorMsg1);
  //               if(this.errorMsg1 == null){
  //               console.log("No Error");
  //                 var importObj = (
  //                   importObj={}, 
  //                   importObj[hawb]= dataObj['ArticleID'] != undefined ? dataObj['ArticleID'] : '', importObj,
  //                   importObj[mawb]= selectedMawb, importObj,
  //                   importObj[stat]= dataObj['SURPLUS/SHORTAGE'] != undefined ? dataObj['SURPLUS/SHORTAGE'] : '', importObj,
  //                   importObj[note]= 'SURPLUS/SHORTAGE', importObj
  //                 );
  //               this.recordList.push(importObj)
                
  //               }
  //           }
  //           console.log(this.recordList);
  //         }
  //    };

  /*Outstanding job file returns Old */
  // validateData(exportData){
  //   var statusArr = ["SURPLUS","SHORTAGE"];
  //   for (var importVal in exportData) {
  //           var dataObj = exportData[importVal];
  //           if(this.errorMsg1 == null){
          
  //             if(!statusArr.includes(dataObj['SURPLUS/SHORTAGE'])){
  //               this.errorMsg1 = dataObj['ArticleID']+" - Invalid Status";
  //             }
  //           }
  //       }
  //   }
}
 
interface City {
  name: string;
  value: string;
}

