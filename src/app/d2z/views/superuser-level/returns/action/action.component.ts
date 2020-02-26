import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
  role_Id: Number;
  exportCall: boolean;
  nonExportCall: boolean;
  showReturn: boolean;
  system: String;
  fileExists: String;
  file:File;
  arrayBuffer:any;
  public openEnquiryList = [];
  public importList = [];
  public superuserAction = [];
  public actionData = [];
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
      this.showReturn = true;
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.role_Id  = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.role_Id: '';
      if(this.role_Id == 5){
          this.showReturn = false;
      }
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
    this.errorMsg = null;
    this.successMsg = null;
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
    this.errorMsg = null;
    this.successMsg = null;
    this.exportCall= false;
    this.actionData = [];
    this.superuserAction = [];
    var that=this;
    this.actionReturnsArray.forEach(function(item){
      if(item.selection){
        that.actionData.push(item);
      }
    });

    if(that.actionData.length > 0){
      let articleId = 'articleId';
      let brokerName = 'brokerName';
      let referenceNumber = 'referenceNumber';
      let action = 'action';
      for (var actionVal in that.actionData) {
        var fieldObj = that.actionData[actionVal];
        var actionObj = (
            actionObj={}, 
            actionObj[articleId]= fieldObj.articleId != undefined ? fieldObj.articleId : '', actionObj,
            actionObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName: '', actionObj,
            actionObj[referenceNumber]= fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber:'', actionObj
        );
        that.superuserAction.push(actionObj);
      }
      this.spinner.show();
      this.consigmentUploadService.updateSuperUserAction(this.superuserAction, (resp) => {
        this.spinner.hide();
        if(resp.error){
        }else{
          this.returnsAction = [];
          this.successMsg= resp.message;
          $('#action').modal('show');
          this.fetchReturnActionData();
        }
      });
    }else{
      that.errorMsg = '**Atleast one item its required to perform Action';
    }
  };

}





