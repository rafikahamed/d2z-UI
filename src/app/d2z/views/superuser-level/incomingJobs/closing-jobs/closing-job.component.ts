import { Component, ViewChild,ChangeDetectorRef,OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm,FormGroup, FormControl,  FormArray, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-closing-job',
  templateUrl: './closing-job.component.html',
  styleUrls: ['./closing-job.component.css']
})

export class SuperClosingJobComponent implements OnInit{

  private fieldArray = [];
   private fieldArrayout = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  private selectedTab = 0;
  successMsg: String;
  brokerUserName: String;
 
  consigneedata:String;
   brokerListMainData = [];
    MlidListMainData = [];
   fromDate: String;
  type: String;
tabs =[];
  user_Id: String;
  system: String;
  arrayBuffer:any;
    form: FormGroup;
 
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
       this.consigmentUploadService.closingJob( (resp) => {
         this.spinner.hide();
      this.fieldArray = resp;
     this.fieldArrayout = resp;
      var that = this;
     
      resp.forEach(function(entry) {
    
     
        
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

 
 

FieldValue(i)
{
   var newBroker=  this.fieldArray[i];

  
    this.form.controls['brokerName'].setValue(newBroker.broker);
   
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
     

  this.spinner.show();
        this.consigmentUploadService.deleteJob(this.importIndividualList, (resp) => {
            this.spinner.hide();
            this.successMsg = resp.message;
            $('#brokerEnquiry').modal('show');
           
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


