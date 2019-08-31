import { Component, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-outstanding-enquiry',
  templateUrl: './outstanding-enquiry.component.html',
  styleUrls: ['./outstanding-enquiry.component.css']
})

export class OutstandingEnquiryComponent implements OnInit{
  manifestForm: FormGroup;
  fileName: string;
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  fromDate: String;
  toDate: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  status: String;
  statusDropdown: dropdownTemplate[];  
  selectedStatusType: dropdownTemplate;
  favoriteSeason: string;
  file:File;
  system: String;
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
    this.manifestForm = new FormGroup({
      manifestFile: new FormControl()
    });
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
      this.statusDropdown = [
        { "name": "Open", "value": "open" },
        { "name": "In Progress", "value": "InProgress"},
        { "name": "Closed", "value": "closed"}
      ];
      this.status = this.statusDropdown[0].value;
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
            headerName: "Ticket ID",
            field: "ticketID",
            width: 150,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Article ID",
            field: "articleID",
            width: 180
          },
          {
            headerName: "Reference Number",
            field: "referenceNumber",
            width: 180
          },
          {
            headerName: "Enquiry",
            field: "deliveryEnquiry",
            width: 100
          },
          {
            headerName: "POD",
            field: "pod",
            width: 100
          },
          {
            headerName: "Comments",
            field: "comments",
            width: 450
          },
          {
            headerName: "Tracking Status",
            field: "trackingStatus",
            width: 200
          },
          {
            headerName: "Consignee Name",
            field: "consigneeName",
            width: 200
          },
          {
            headerName: "Tracking Event",
            field: "trackingEvent",
            width: 200
          },
          {
            headerName: "Tracking Date",
            field: "trackingEventDateOccured",
            width: 200
          }
        ];
       }
      if(this.chinessFlag){ }
  }

  onStatusChange(event){
    this.status = event.value.value;
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

  onEnquiryChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  };

  enquirySearch(){
    this.spinner.show();
    this.consigmentUploadService.fetchEnquiry(this.status, this.fromDate+" "+"00:00:00:000", this.toDate+" "+"23:59:59:999", this.user_Id, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide() 
      }, 5000);
    })
  }
 
}

