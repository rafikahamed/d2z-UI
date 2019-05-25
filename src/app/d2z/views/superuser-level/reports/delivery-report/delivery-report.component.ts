import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/filter';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import * as XLSX from 'xlsx';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-delivery-report',
  templateUrl: './delivery-report.component.html',
  styleUrls: ['./delivery-report.component.css']
})

export class SuperUserDeliveryReportComponent implements OnInit{
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  childmenuSix:boolean;
  public importList = [];
  errorMsg: string;
  show: Boolean;
  consignmentFlag; Boolean;
  deletedFlag: Boolean;
  shipmentFlag: Boolean;
  nonshipmentFlag: Boolean;
  mydate: Date;
  successMsg: String;
  fromDate: String;
  toDate: String;
  userName: String;
  role_id: String;
  system: String;
  private gridOptionsConsignment: GridOptions;
  private gridOptionsDeleted: GridOptions;
  private gridOptionsShipment: GridOptions;
  private gridOptionsNonShipment:GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowDataConsignment: any[];
  private rowDataDeleted: any[];
  private rowDataShipment: any[];
  private defaultColDef;
  exportTypeDropdown: dropdownTemplate[];  
  selectedExportType: dropdownTemplate;
  shipmentAllocateForm: FormGroup;
  exportFileType: String;
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consignmenrServices: ConsigmentUploadService
  ) {
    this.show = false;
    this.consignmentFlag = true;
    this.deletedFlag= false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
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
  }

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.childmenuSix= false;
      this.exportTypeDropdown = [
        { "name": "Export Consignment", "value": "export-consignment" },
        { "name": "Export Delete", "value": "export-delete" },
        { "name": "Export Shipment", "value": "export-shipment" 
        },
        { "name": "Export Non Shipment", "value": "export-nonshipment" 
        }
      ];
      this.selectedExportType = this.exportTypeDropdown[0];
      this.exportFileType = this.exportTypeDropdown[0].value;
      this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
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

  onExportTypeChange(event){
    this.exportFileType = event.value.value;
    if(event.value.value === 'export-consignment'){
        this.consignmentFlag = true;
        this.deletedFlag = false;
        this.shipmentFlag = false;
        this.nonshipmentFlag = false;
    }else if(event.value.value === 'export-delete'){
        this.consignmentFlag = false;
        this.deletedFlag = true;
        this.shipmentFlag = false;
        this.nonshipmentFlag = false;
    }else if(event.value.value === 'export-shipment'){
        this.consignmentFlag = false;
        this.deletedFlag = false;
        this.shipmentFlag = true;
        this.nonshipmentFlag = false;
    }
    else if(event.value.value === 'export-nonshipment'){
        this.consignmentFlag = false;
        this.deletedFlag = false;
        this.shipmentFlag = false;
        this.nonshipmentFlag = true;
    }
  };

    exportSearch(){
  
    };

}