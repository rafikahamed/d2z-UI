import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { GridOptions } from "ag-grid";

@Component({
  selector: 'hms-returns-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})

export class superUserReturnsActionComponent implements OnInit{
 
  private actionReturnsArray: Array<any> = [];
  errorMsg: string;
  successMsg: String;
  errorModal: String;
  showGrid: boolean;
  public resendReferNumber: any[];
  public returnsAction: any[];
  user_Id: String;
  exportCall: boolean;
  nonExportCall: boolean;
  system: String;
  fileExists: String;
  file:File;
  arrayBuffer:any;
  actionType: City[];
  public openEnquiryList = [];
  public importList = [];
  public resendData = [];
  public actionData = [];
  public nonResendData = [];
  private gridOptionsAction: GridOptions;
    private autoGroupColumnDef;
    private rowGroupPanelShow;
    private rowData: any[];
    private defaultColDef;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();  
    this.showGrid = false;
    this.exportCall = false;
    this.nonExportCall = false;
    this.gridOptionsAction = <GridOptions>{rowSelection: "multiple"};
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };
  }

  fetchReturnActionData(){
      this.spinner.show();
        this.consigmentUploadService.fetchActionReturns((resp) => {
          this.spinner.hide();
          this.actionReturnsArray = resp;
        })
  
  };

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      this.spinner.show();
      this.fetchReturnActionData();
  };

  generatePdf(resendRefNumber){
    console.log("resend RefNumber -->"+resendRefNumber);
    var today = new Date();
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    minutes = checkZero(minutes);
    seconds = checkZero(seconds);

    function checkZero(data){
      if(data.length == 1){
        data = "0" + data;
      }
      return data;
    };
    var dateString = year+month+day+"-"+hour+minutes+seconds;
    if(resendRefNumber){
        this.spinner.show();
        this.trackingDataService.generateTrackLabel(resendRefNumber.trim(), (resp) => {
          this.spinner.hide();
            if(resp.status === 500){
              this.errorMsg = ' Invalid "Reference Number" or "BarCode label number" ';
            }else{
              var pdfFile = new Blob([resp], {type: 'application/pdf'});
              var pdfUrl = URL.createObjectURL(pdfFile);
            var fileName = resendRefNumber+"-label"+dateString+".pdf";
              var a = document.createElement("a");
                  document.body.appendChild(a);
                  a.href = pdfUrl;
                  a.download = fileName;
                  a.click();
                  this.successMsg =  "Document Downloaded Successfully";
            }
          })
    }
  }

  UpdateAction(){
    this.exportCall= false;
    this.resendReferNumber = [];
    this.resendData = [];
    this.nonResendData = [];
    this.actionData = [];
    var that = this;
    this.actionReturnsArray.forEach(function(item){
        if(item.actionType && item.actionType.value == 'resend' && item.selection){
          that.resendReferNumber.push(item.referenceNumber);
          that.exportCall= true;
          that.resendData.push(item);
        }else if(item.selection){
          that.nonResendData.push(item);
        }
    });

    if(that.exportCall){
      if(that.resendReferNumber.length === 1){
        that.errorMsg = null;
        
      }else if(that.resendReferNumber.length > 1){
        that.errorMsg = '**Only one item is allowed to resend';
      }
    }else{
      console.log(that.nonResendData);
      that.returnsAction = [];
      if(that.nonResendData.length == 0){
        that.errorMsg = '**Atleast one item its required to perform Action';
      }else{ 
        that.nonResendData.forEach(function(item){
          if(item.actionType && item.actionType.value){
              that.nonExportCall = true;
            }else{
              that.errorMsg = '**Action Type cannot be Empty';
              that.nonExportCall = false;
            }
       });
     }
  
     // Making an Action returns API Call
     if(that.nonExportCall){
        that.errorMsg = null;
        let articleId = 'articleId';
        let brokerName = 'brokerName';
        let referenceNumber = 'referenceNumber';
        let action = 'action';
        let resendRefNumber = 'resendRefNumber';

        for (var actionVal in that.nonResendData) {
          var fieldObj = that.nonResendData[actionVal];
          var actionObj = (
              actionObj={}, 
              actionObj[articleId]= fieldObj.articleId != undefined ? fieldObj.articleId : '', actionObj,
              actionObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName: '', actionObj,
              actionObj[referenceNumber]= fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber:'', actionObj,
              actionObj[action]= fieldObj.actionType != undefined ? fieldObj.actionType.value: '',actionObj,
              actionObj[resendRefNumber]= fieldObj.actionType.value == 'resend' ? fieldObj.resendRefNumber : null,  actionObj
          );
          that.returnsAction.push(actionObj);
        }
        console.log("Non Returns Array--->")
        console.log(that.returnsAction)
        if(that.returnsAction.length > 0){
          this.spinner.show();
            // this.consigmentUploadService.updateAction(this.returnsAction, (resp) => {
            //   this.spinner.hide();
            //   if(resp.error){
            //   }else{
            //     this.returnsAction = [];
            //     this.successMsg= resp.message;
            //     $('#action').modal('show');
            //     this.fetchReturnActionData();
            //   }
            // });
        }
     }
    }
   
  };


}


interface City {
  name: string;
  value: string;
}






