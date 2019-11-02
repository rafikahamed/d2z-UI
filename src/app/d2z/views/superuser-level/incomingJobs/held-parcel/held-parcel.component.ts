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
  successMsg: String;
  brokerUserName: String;
  
  consigneedata:String;
   brokerListMainData = [];
    MlidListMainData = [];
    file:File;
  user_Id: String;
  system: String;
  arrayBuffer:any;
  
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
  ) {
    this._compiler.clearCache();  
  }

  ngOnInit() {
 // 
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
       
  
     
      this.showFile = false;
     
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

   addFieldValue() {
 
  console.log(this.newAttribute);
 
        this.fieldArray.push(this.newAttribute)
        this.newAttribute = {};
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

   

    creatEnquiry(){

  
      this.errorMsg = '';
      this.importIndividualList = [];
      let hawb = 'hawb';
      let mawb = 'mawb';
      let stat = 'stat';
      let note = 'note';
      
    
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
           enquiryObj[note]= fieldObj.note != undefined ? fieldObj.note : '', enquiryObj
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


