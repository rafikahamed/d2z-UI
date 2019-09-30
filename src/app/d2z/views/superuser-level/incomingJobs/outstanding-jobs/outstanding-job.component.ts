import { Component, ViewChild,ChangeDetectorRef,OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm,FormGroup, FormControl,  FormArray, FormBuilder, Validators } from '@angular/forms';
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
@ViewChild('myForm') myForm: NgForm;

  private fieldArray = [];
   private fieldArrayout = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
  private selectedTab = 0;
  successMsg: String;
  brokerUserName: String;
  displayedColumns = ["Broker", "Mlid", "Consignee"];
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
     brokerAddClientForm: FormGroup;
 
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
       this.consigmentUploadService.outstandingJob( (resp) => {
         this.spinner.hide();
      this.fieldArray = resp;
     this.fieldArrayout = resp;
      var that = this;
      console.log(resp);
     
    
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
            
           
        });
      }else{
        this.errorMsg = "** Atleast add one Job to proceed";
      }
      
    
    }
     submitEnquiry(){

  
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
     console.log(fieldObj.outturn);
     console.log(fieldObj.outturn === true);
     console.log(fieldObj.outturn === 'Y');
     console.log((fieldObj.outturn != undefined && (fieldObj.outturn === 'Y' || fieldObj.outturn === true) ));
     if(!(fieldObj.outturn != undefined && (fieldObj.outturn === 'Y' || fieldObj.outturn === true )))
     
     {
     this.errorMsg = "Please select outturn before submitting Job";
     }

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

      if(this.importIndividualList.length > 0 && this.errorMsg === ''){
     
console.log(this.importIndividualList);
  this.spinner.show();
        this.consigmentUploadService.submitJob(this.importIndividualList, (resp) => {
            this.spinner.hide();
            this.successMsg = resp.message;
            $('#brokerEnquiry').modal('show');
            
           
        });
      }else{
      if(this.errorMsg === '')
      {
        this.errorMsg = "** Atleast add one Job to proceed";
      }
      }
      
    
    }
check(event,index)
{
console.log(event);

  console.log(index);

 
    var newBrokerEnquiryArray =  this.tabs;
 

  var fieldObj =this.tabs[index];
        console.log(fieldObj);
console.log("note:"+fieldObj.note);
console.log("jkk:"+fieldObj.ata);
console.log("outturn:"+fieldObj.outturn);
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
      
        var enquiryObj = (
          enquiryObj={}, 
           enquiryObj[broker]= fieldObj.broker != undefined ? fieldObj.broker : '', enquiryObj,
          enquiryObj[mlid]= fieldObj.mlid != undefined ? fieldObj.mlid : '', enquiryObj,
          enquiryObj[consignee]= fieldObj.consignee != undefined ? fieldObj.consignee: '', enquiryObj,
          enquiryObj[mawb]= fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
           enquiryObj[dest]= fieldObj.dest!= undefined ? fieldObj.dest: '', enquiryObj,
              enquiryObj[flight]= fieldObj.flight != undefined ? fieldObj.flight : '', enquiryObj,
                 enquiryObj[eta]= fieldObj.eta != undefined ? fieldObj.eta : '', enquiryObj,
          enquiryObj[weight]= fieldObj.weight != undefined ? fieldObj.weight : '', enquiryObj,
           enquiryObj[piece]= fieldObj.piece != undefined ? fieldObj.piece : '', enquiryObj,
            enquiryObj[hawb]= fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj,
          enquiryObj[jobid]=fieldObj.jobid != undefined ? fieldObj.jobid : '', enquiryObj,
         /** enquiryObj[clear]= this.myForm.controls['clear'].value!= undefined ? this.myForm.controls['clear'].value : '', enquiryObj,
          enquiryObj[outturn]= this.myForm.controls['outturn'].value != undefined ? this.myForm.controls['outturn'].value: '', enquiryObj,
           enquiryObj[note]= this.myForm.controls['note'].value != undefined ? this.myForm.controls['note'].value : '', enquiryObj,
           enquiryObj[held]=this.myForm.controls['held'].value != undefined ? this.myForm.controls['held'].value : '', enquiryObj,
             
                 enquiryObj[ata]= this.myForm.controls['ata'].value != undefined ? this.myForm.controls['ata'].value : '', enquiryObj**/

            enquiryObj[clear]= fieldObj.clear!= undefined ? fieldObj.clear : '', enquiryObj,
          enquiryObj[outturn]= fieldObj.outturn != undefined ? fieldObj.outturn: '', enquiryObj,
           enquiryObj[note]= fieldObj.note!= undefined ? fieldObj.note : '', enquiryObj,
           enquiryObj[held]=fieldObj.held != undefined ? fieldObj.held: '', enquiryObj,
             
                 enquiryObj[ata]=fieldObj.ata != undefined ? fieldObj.ata : '', enquiryObj     
         
        );

        console.log(enquiryObj);
        this.importIndividualList.push(enquiryObj);
      
    

 this.spinner.show();
        this.consigmentUploadService.updateJob(this.importIndividualList, (resp) => {
           
            this.successMsg = resp.message;
            $('#brokerEnquiry').modal('show');
            this.consigmentUploadService.outstandingJob( (resp) => {
         this.spinner.hide();
      this.fieldArray = resp;
   this.tabs = [];

      console.log(resp);
     
    
    })
  
            
           
        });






}
    viewEnquiry(){
      
this.tabs = [];
  
      
      var newBrokerEnquiryArray =  this.fieldArray;
      

      for (var fieldVal in newBrokerEnquiryArray) {
        var fieldObj = newBrokerEnquiryArray[fieldVal];
        console.log(fieldObj.note);
     if(fieldObj.checked === true)
     {

     this.tabs.push({
                         'label':'Jobs'+fieldVal,
                         'broker':fieldObj.broker,
                         'mlid' : fieldObj.mlid,
                         'consignee': fieldObj.consignee != undefined ? fieldObj.consignee: '', 
          'mawb': fieldObj.mawb != undefined ? fieldObj.mawb : '', 
           'dest': fieldObj.destination != undefined ? fieldObj.destination: '', 
            'flight':fieldObj.flight != undefined ? fieldObj.flight : '', 
             'eta': fieldObj.eta != undefined ? fieldObj.eta : '', 
       'weight': fieldObj.weight != undefined ? fieldObj.weight : '', 
          'piece': fieldObj.piece != undefined ? fieldObj.piece : '', 
            'hawb': fieldObj.hawb != undefined ? fieldObj.hawb : '', 
         
          'clear': fieldObj.clear != undefined ? fieldObj.clear : '', 
          'outturn':fieldObj.outturn != undefined ? fieldObj.outturn: '', 
           'note':  fieldObj.note != undefined ? fieldObj.note:'',
           'held': fieldObj.held != undefined ? fieldObj.held : '', 
             
               'ata': fieldObj.ata != undefined ? fieldObj.ata : '',

               'jobid': fieldObj.jobid != undefined ? fieldObj.jobid : ''
                        });

                        
       
      }
        
      }

      this.selectedIndex = 1;
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


