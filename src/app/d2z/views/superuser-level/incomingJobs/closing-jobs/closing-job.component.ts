import { Component, ViewChild,ChangeDetectorRef,OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm,FormGroup, FormControl,  FormArray, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
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

  public fieldArray = [];
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
     
    
    
    })
  
  
     
      this.showFile = false;
     
   
  
     
  
  
       
   
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
     
  };

 
 check(element)
 {

 for (var fieldVal in this.fieldArray) {
        var fieldObj = this.fieldArray[fieldVal];
        fieldObj.checked = element.target.checked;

 }


}

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
download()
{

 this.errorMsg = '';
 var newBrokerEnquiryArray =  this.fieldArray;

  var currentTime = new Date();
        var jobList = [];
        var fileName = '';
            fileName = "JOB-Details"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ "Broker" ,"Mlid", "Consignee","Mawb","Dest","Flight","ETA","ATA","Weight","Piece","Hawb","Clear","Outturn","Note","Held","ClearanceDate",
            "InjectionDate" ]
          };
      let broker = 'broker';
      let mlid = 'mlid';
      let consignee = 'consignee';
      let mawb = 'mawb';
      let dest = 'dest';
      let flight = 'flight';
      let eta = 'eta';
      let ata = 'ata';
      let weight = 'weight';
      let piece = 'piece';
      let hawb = 'hawb';
      let clear = 'clear';
      let outturn = 'outturn';
      let note = 'note';
      let held = 'held';
      let clearanceDate = 'clearanceDate';
      let injectionDate = 'injectionDate';

      for (var fieldVal in newBrokerEnquiryArray) {
        var fieldObj = newBrokerEnquiryArray[fieldVal];
       
     if(fieldObj.checked === true)
     {
 console.log(fieldObj.checked);
 

      var jobMainObj = (
                jobMainObj={},
                jobMainObj[broker]=fieldObj.broker,jobMainObj,

                jobMainObj[mlid]=fieldObj.mlid,jobMainObj,
                jobMainObj[consignee] = fieldObj.consignee != undefined ? fieldObj.consignee: '',jobMainObj,
                jobMainObj[mawb]=fieldObj.mawb != undefined ? fieldObj.mawb : '', jobMainObj,
                jobMainObj[dest]=fieldObj.destination != undefined ? fieldObj.destination: '',jobMainObj, 
                jobMainObj[flight]=fieldObj.flight != undefined ? fieldObj.flight : '',jobMainObj, 
                jobMainObj[eta]=fieldObj.eta != undefined ? fieldObj.eta : '', jobMainObj,
                jobMainObj[ata]=fieldObj.ata != undefined ? fieldObj.ata : '',jobMainObj,
                jobMainObj[weight]=fieldObj.weight != undefined ? fieldObj.weight : '', jobMainObj,
                jobMainObj[piece]=fieldObj.piece != undefined ? fieldObj.piece : '', jobMainObj,
                jobMainObj[hawb]=fieldObj.hawb != undefined ? fieldObj.hawb : '', jobMainObj,
                jobMainObj[clear]=fieldObj.clear != undefined ? fieldObj.clear : '', jobMainObj,
                jobMainObj[outturn] = fieldObj.outturn != undefined ? fieldObj.outturn: '', jobMainObj,
                jobMainObj[note]=fieldObj.note != undefined ? fieldObj.note:'',jobMainObj,
                jobMainObj[held] = fieldObj.held != undefined ? fieldObj.held : '',jobMainObj,
                jobMainObj[clearanceDate] = fieldObj.clearanceDate != undefined ? fieldObj.clearanceDate : '',jobMainObj,
                jobMainObj[injectionDate] = fieldObj.injectionDate != undefined ? fieldObj.injectionDate : '',jobMainObj

                );

console.log(jobMainObj);
jobList.push(jobMainObj);

     
                        
       
      }
        
      }

console.log(jobList);
console.log(jobList.length);


       if( jobList.length > 0 ){
     

  new Angular2Csv(jobList, fileName, options);  
           
        }
      else{
        this.errorMsg = "** Atleast select one Job to download";
      }
      

       
        };


  
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

  generateReport() {
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

    for (var fieldVal in this.fieldArray) {
        var fieldObj = this.fieldArray[fieldVal];
     if(fieldObj.checked === true)
     {
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
    
      this.importIndividualList.push(enquiryObj);
      }
    
  };
  console.log(this.importIndividualList);
      this.spinner.show();
     this.consigmentUploadService.generateShipmentSummary(this.importIndividualList,(resp) => {
      this.successMsg = resp.message;
      this.spinner.hide();
      $('#brokerEnquiry').modal('show');
     });
}
}
interface City {
  name: string;
  value: string;
}


