import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})

export class SuperIncomingJobComponent implements OnInit{
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
   fromDate: String;
  type: String;
  brokerDropdown: City[];  
  consigneeDropdown:City[];
  consigneeDropdown2:City[];
    consigneeDropdownmlid=[];
  mlidDropdown:City[];
    consigneeDropdown1:City[];
    consigneeDropdown4:City[];
  mlidDropdown1:City[];
  brokerDropdownValue = [];
  file:File;
  user_Id: String;
  system: String;
  arrayBuffer:any;
  
  destinations:City[];
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
       this.consigmentUploadService.joblist( (resp) => {
      this.brokerListMainData = resp;
      this.spinner.hide();
      var that = this;
      console.log(resp);
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
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
     
  };

 onBrokerTypeChange(event,i){
 
   console.log("in Broker");

   
    var enquiryObj = this.fieldArray[i];
     enquiryObj.mlid = [];
      enquiryObj.mlidDropdown =[];
      enquiryObj.consignee = [];
        console.log(enquiryObj.consigneeDropdown);
         enquiryObj.consigneeDropdown=[];
    this.brokerUserName = event.value ? event.value.value: '';
    var that = this;
    this.brokerListMainData.forEach(function(entry) {
      if(entry.brokerName.name == that.brokerUserName){
       var enquiryObj = that.fieldArray[i];
            enquiryObj.mlidDropdown = entry.mlid;
            that.consigneeDropdown4= entry.consignee;
            
      }
    })
    
  };
   onBrokerTypeChangeNew(event){

 
   this.mlidDropdown1 = [];
   
    this.brokerUserName = event.value ? event.value.value: '';
    var that = this;
    this.brokerListMainData.forEach(function(entry) {
      if(entry.brokerName.name == that.brokerUserName){
   
            that.mlidDropdown1 = entry.mlid;
            that.consigneeDropdown1= entry.consignee;
            
      }
    })
    
  };

  onMlidChangeNew(event){
  this.errorMsg = '';
  this.consigneeDropdownmlid = [];

  if(event.value.length > 0)
  {

      for (var item in event.value)
             {
               var enObj = event.value[item];
                var that = this;
                 this.mlidDropdown1.forEach(function(entry,index) {
                                           if(entry.name == enObj.name){
                                    var data =  that.consigneeDropdown1[index];
                                    if(that.consigneeDropdownmlid.length > 0)
                                        {
                                           if(that.consigneeDropdownmlid.some(r => r.name === data.name))
                                                  {
   
                                                         }
                                           else
                                              {that.errorMsg = "** This combination doesnt have same consignee";   
                                                     }

                                                           } 
                                     else
                                         {
                                          that.consigneeDropdownmlid.push(data);
                                           }
                                          }
           
         
});
   this.consigneeDropdown2 = this.consigneeDropdownmlid;
  console.log("in Ne"+(enObj.name));
  }
  }

console.log(this.consigneeDropdownmlid)
   
   
  };
  
  onMlidChange(event,i){
  this.errorMsg = '';
  console.log(i);
   var enquiryObj = this.fieldArray[i];
var consigneeDrodownmlid = [];

  if(event.value.length > 0)
  {
  console.log("if loop");

  for (var item in event.value)
  {
  var enObj = event.value[item];
var that = this;
   enquiryObj.mlidDropdown.forEach(function(entry,index) {
      if(entry.name == enObj.name){
 var data =  that.consigneeDropdown4[index];
 
        if(consigneeDrodownmlid.length > 0)
                                        {
                                           if(consigneeDrodownmlid.some(r => r.name === data.name))
                                                  {
   
                                                         }
                                           else
                                              {that.errorMsg = "** This combination doesnt have same consignee";   
                                                     }

                                                           } 
                                     else
                                         {
                                          consigneeDrodownmlid.push(data);
                                           }
                                          }
   
           

            
      
    });
     
            enquiryObj.consigneeDropdown = consigneeDrodownmlid;
   
  console.log("in Ner"+(enObj.name));
  }
  }


   
   
  };
  FromDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.fromDate = [ date.getFullYear(), mnth, day ].join("-");
  };

    addFieldValue() {
 
  this.newAttribute.mlidDropdown = this.mlidDropdown1;
  this.newAttribute.consigneeDropdown = this.consigneeDropdown2;
 
        this.fieldArray.push(this.newAttribute)
        this.newAttribute = {};
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

   

    creatEnquiry(){

   if(this.errorMsg === "** This combination doesnt have same consignee")
   {
this.errorMsg === "** This combination doesnt have same consignee";
   }
   else{
      this.errorMsg = '';
      this.importIndividualList = [];
      let type = 'type';
      let mlid = 'mlid';
       let consignee = 'consignee';
      let hawb = 'hawb';
      let dest = 'dest';
      let weight = 'weight';
      let mawb = 'mawb';
      let flight = 'flight';
      let eta = 'eta';
      let price = 'price';
      
    
      let userId = 'userId';
      var newBrokerEnquiryArray = [];
       console.log("hello"+Object["values"](this.newAttribute));
      console.log("heer"+this.newAttribute.type);
      if(this.newAttribute.type){
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
         
        var enquiryObj = (
          enquiryObj={}, 
          enquiryObj[type]= fieldObj.type != undefined ? fieldObj.type.name : '', enquiryObj,
          enquiryObj[mlid]= fieldObj.mlid != undefined ? fieldObj.mlid : '', enquiryObj,
          enquiryObj[consignee]= fieldObj.consignee != undefined ? fieldObj.consignee.name: '', enquiryObj,
           enquiryObj[mawb]= fieldObj.mawb != undefined ? fieldObj.mawb : '', enquiryObj,
           enquiryObj[dest]= fieldObj.dest != undefined ? fieldObj.dest.name : '', enquiryObj,
              enquiryObj[flight]= fieldObj.flight != undefined ? fieldObj.flight : '', enquiryObj,
                 enquiryObj[eta]= fieldObj.eta != undefined ? fieldObj.eta : '', enquiryObj,
          enquiryObj[weight]= fieldObj.weight != undefined ? fieldObj.weight : '', enquiryObj,
           enquiryObj[price]= fieldObj.price != undefined ? fieldObj.price : '', enquiryObj,
            enquiryObj[hawb]= fieldObj.hawb != undefined ? fieldObj.hawb : '', enquiryObj
        );
        this.importIndividualList.push(enquiryObj);
      }
      if(this.importIndividualList.length > 0 ){

  this.spinner.show();
        this.consigmentUploadService.createJob(this.importIndividualList, (resp) => {
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


