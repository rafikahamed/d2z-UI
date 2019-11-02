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
  selector: 'hms-release-parcel',
  templateUrl: './release-parcel.component.html',
  styleUrls: ['./release-parcel.component.css']
})

export class SuperReleaseParcelComponent implements OnInit{

  @ViewChild('myForm') myForm: NgForm;

  private fieldArray = [];
   private fieldArrayout = [];
  private fieldCreateArray: Array<any> = [];
  private newAttribute: any = {};
  private newCreateAttribute: any = {};
  errorMsg: string;
 
  successMsg: String;
  brokerUserName: String;
  displayedColumns = ["Broker", "Mlid", "Consignee"];
 status:City[]
  type: String;
tabs =[];
  user_Id: String;
  system: String;
  arrayBuffer:any;
    form: FormGroup;
     brokerAddClientForm: FormGroup;
 
  public importList = [];
  public importIndividualList = [];
  public ExportList = [];
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
       this.consigmentUploadService.releaseparcellist( (resp) => {
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
           enquiryObj[output] = 'D',
             enquiryObj[stat]= fieldObj.stat != undefined ? fieldObj.stat: '', enquiryObj
         
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
      this.importIndividualList = [];
      this.ExportList = [];
      
      let note ='note'
       
      let jobid = 'jobid';
     
       let hawb = 'hawb';
     let stat= 'stat';
      let mawb = 'mawb';
      let parcelid = 'parcelid';
      let output = 'output';
        var currentTime = new Date();
      var newBrokerEnquiryArray =  this.fieldArray;
       var fileName = '';
            fileName = "Release_Parcel"+"-"+currentTime.toLocaleDateString();
            var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: [ "MAWB" ,"HAWB", "NOTE", "STATUS" ]
            };

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
           enquiryObj[output] = 'E',
             enquiryObj[stat]= fieldObj.stat != undefined ? fieldObj.stat: '', enquiryObj
         
        );
var exportObj = (
exportObj={}, 
         
          exportObj[mawb]= fieldObj.mawb != undefined ? fieldObj.mawb : '', exportObj,
         
            exportObj[hawb]= fieldObj.hawb != undefined ? fieldObj.hawb : '', exportObj,
            
           exportObj[note]= fieldObj.note != undefined ? fieldObj.note : '', exportObj,
          
             exportObj[stat]= fieldObj.stat != undefined ? fieldObj.stat.name: '', exportObj

);

        console.log(enquiryObj);
        this.importIndividualList.push(enquiryObj);
        this.ExportList.push(exportObj);
      }
      }
      if(this.importIndividualList.length > 0 ){
     

  this.spinner.show();
        this.consigmentUploadService.updateParcel(this.importIndividualList, (resp) => {

         new Angular2Csv(this.ExportList, fileName, options);  
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


