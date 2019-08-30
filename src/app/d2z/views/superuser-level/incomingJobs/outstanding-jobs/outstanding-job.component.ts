import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-outstanding-job',
  templateUrl: './outstanding-job.component.html',
  styleUrls: ['./outstanding-job.component.css']
})

export class SuperOutstandingJobComponent implements OnInit{
  private fieldArray = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  successMsg: String;
  brokerUserName: String;
  displayedColumns = ["Broker", "Mlid", "Consignee"];
  consigneedata:String;
   brokerListMainData = [];
    MlidListMainData = [];
   fromDate: String;
  type: String;

  user_Id: String;
  system: String;
  arrayBuffer:any;
  
 
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
  ) {
    this._compiler.clearCache();  
  }

  ngOnInit() {
  this.spinner.show();
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
       this.consigmentUploadService.outstandingJob( (resp) => {
      this.fieldArray = resp;
      this.spinner.hide();
      var that = this;
      console.log(resp);
      resp.forEach(function(entry) {
    
     
        console.log(entry.mlid);
      })
    
    })
  
     
      this.showFile = false;
     
       
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
     
  };

 
    FromDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.fromDate = [ date.getFullYear(), mnth, day ].join("-");
  };

    
   

    creatEnquiry(){

  
      this.errorMsg = '';
      this.importIndividualList = [];
      let clear = 'clear';
      let outturn = 'outturn';
      let note ='note'
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
      var newBrokerEnquiryArray =  this.fieldArray;
      

      for (var fieldVal in newBrokerEnquiryArray) {
        var fieldObj = newBrokerEnquiryArray[fieldVal];
        console.log(fieldObj);
     if(fieldObj.checked === true)
     {

        var enquiryObj = (
          enquiryObj={}, 
           enquiryObj[broker]= fieldObj.broker != undefined ? fieldObj.broker : '', enquiryObj,
          enquiryObj[mlid]= fieldObj.mlid != undefined ? fieldObj.mlid : '', enquiryObj,
          enquiryObj[consignee]= fieldObj.consignee != undefined ? fieldObj.consignee: '', enquiryObj,
          enquiryObj[mawb]= fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
           enquiryObj[dest]= fieldObj.destination != undefined ? fieldObj.destination: '', enquiryObj,
              enquiryObj[flight]= fieldObj.flight != undefined ? fieldObj.flight : '', enquiryObj,
                 enquiryObj[eta]= fieldObj.eta != undefined ? fieldObj.eta : '', enquiryObj,
          enquiryObj[weight]= fieldObj.weight != undefined ? fieldObj.weight : '', enquiryObj,
           enquiryObj[piece]= fieldObj.piece != undefined ? fieldObj.piece : '', enquiryObj,
            enquiryObj[hawb]= fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
          enquiryObj[jobid]=fieldObj.jobid != undefined ? fieldObj.jobid : '', enquiryObj,
          enquiryObj[clear]= fieldObj.clear != undefined ? fieldObj.clear : '', enquiryObj,
          enquiryObj[outturn]= fieldObj.outturn != undefined ? fieldObj.outturn: '', enquiryObj,
           enquiryObj[note]= fieldObj.note != undefined ? fieldObj.note : '', enquiryObj,
           enquiryObj[held]= fieldObj.held != undefined ? fieldObj.held : '', enquiryObj,
             
                 enquiryObj[ata]= fieldObj.ata != undefined ? fieldObj.ata : '', enquiryObj
         
        );
        this.importIndividualList.push(enquiryObj);
      }
      }
      if(this.importIndividualList.length > 0 ){
     
console.log(this.importIndividualList);
  this.spinner.show();
        this.consigmentUploadService.updateJob(this.importIndividualList, (resp) => {
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


