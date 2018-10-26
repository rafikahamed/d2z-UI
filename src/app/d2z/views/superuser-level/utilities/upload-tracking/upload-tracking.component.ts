import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { BrokerService } from 'app/d2z/service/broker/broker.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'hms-upload-tracking',
  templateUrl: './upload-tracking.component.html',
  styleUrls: ['./upload-tracking.component.css']
})

export class SuperUserUploadTrackingComponent implements OnInit{
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  public importList = [];
  FileHeading = ['Reference number'];
  manifestNumber: string;
  arrayBuffer:any;
  file:File;
  errorMsg: string;
  show: Boolean;
  successMsg: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  shipmentAllocateForm: FormGroup;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public brokerService: BrokerService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService
  ) {
    this.show = false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
    });
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Reference number",
        field: "referenceNumber",
        width: 500,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      }
    ];
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
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
  }
  
  incomingfile(event) {
    this.rowData = [];
    this.file = event.target.files[0]; 
    this.shipmentExport();
  }

  shipmentExport(){
    var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      fileReader.readAsArrayBuffer(this.file);
      let referenceNumber = 'referenceNumber';
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var exportData = XLSX.utils.sheet_to_json(worksheet);
            for (var importVal in exportData) {
              var dataObj = exportData[importVal];
              for(var keyVal in dataObj){
                var newLine = "\r\n"
                if(!this.FileHeading.includes(keyVal)){
                  this.errorMsg = "***Invalid file format, Please check the field in given files Reference number, allowed fields are ['Reference Number']"
                }
              }
              if(this.errorMsg == null){
                var importObj = (
                  importObj={}, 
                  importObj[referenceNumber]= dataObj['Reference number'] != undefined ? dataObj['Reference number'] : '', importObj
                );
              this.importList.push(importObj)
              this.rowData = this.importList;
              }
          }
        }
  }

  allocateShipment(){
    this.errorMsg = null;
    this.successMsg = '';
    var selectedRows = this.gridOptions.api.getSelectedRows();
    var refrenceNumList = [];
    for (var labelValue in selectedRows) {
          var labelObj = selectedRows[labelValue];
          refrenceNumList.push(labelObj.referenceNumber)
    }
    if(this.shipmentAllocateForm.value.shipmentNumber == null || this.shipmentAllocateForm.value.shipmentNumber == ''){
      this.errorMsg = "**Please Enter the shipment number for the selected items";
    }
    if(selectedRows.length == 0){
      this.errorMsg = "**Please select the below records to allocate the shipment";
    }
    if(selectedRows.length > 0 && this.errorMsg == null ){
        this.spinner.show();
        this.trackingDataService.shipmentAllocation(refrenceNumList, this.shipmentAllocateForm.value.shipmentNumber, (resp) => {
          this.spinner.hide();
          this.successMsg = resp.message;
          $('#allocateShipmentModal').modal('show');
          if(!resp){
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
  }

  toggle(arrow) {
    this.childmenu = !this.childmenu;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_zebra(arrow) {
    this.childmenuTwo = !this.childmenuTwo;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }


  toggle_pdf(arrow) {
    this.childmenuThree = !this.childmenuThree;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_utilities(arrow){
    this.childmenuFour = !this.childmenuFour;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  toggle_maniFest(arrow){
    this.childmenuFive = !this.childmenuFive;
    if (arrow.className === 'fa fa-chevron-down') {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }
    else {
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  sidebartoggle(arrow) {
    this.childmenu = !this.childmenu;
    if (arrow.className === 'nav-md') {
      arrow.className = '';
      arrow.className = 'nav-sm';
    }
    else {
      arrow.className = '';
      arrow.className = 'nav-md';
    }
  }

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


