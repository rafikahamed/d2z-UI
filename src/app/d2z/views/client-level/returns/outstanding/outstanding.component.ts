import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'hms-returns-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.css']
})

export class ReturnsOutStandingComponent{
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  system: String;
  fromDate: String;
  toDate: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  englishFlag:boolean;
  chinessFlag:boolean;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();  
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
  }

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      
      this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });

      if(this.englishFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "Article ID",
            field: "articleId",
            width: 220,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Reference Number",
            field: "referenceNumber",
            width: 220
          },
          {
            headerName: "Consignee Name",
            field: "consigneeName",
            width: 230
          },
          {
            headerName: "Client Name",
            field: "clientName",
            width: 230
          },
          {
            headerName: "Return Reason",
            field: "returnReason",
            width: 200
          }
        ];
       }
      if(this.chinessFlag){ }
  };


  FromDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.fromDate = [ date.getFullYear(), mnth, day ].join("-");
  };

  ToDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.toDate = [ date.getFullYear(), mnth, day ].join("-");
  };

  returnSearch(){
    this.spinner.show();
    this.consigmentUploadService.fetchOutstandingReturns( this.fromDate+" "+"00:00:00:000", this.toDate+" "+"23:59:59:999", this.user_Id, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide() 
      }, 5000);
    })
  }

  
}


interface City {
  name: string;
  value: string;
}


