import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'hms-etower',
  templateUrl: './etower.component.html',
  styleUrls: ['./etower.component.css']
})

export class EtowerTrackingComponent implements OnInit{
  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  public importList = [];
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
  userName: String;
  role_id: String;
  system: String;
  shipmentAllocateForm: FormGroup;
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consignmenrServices: ConsigmentUploadService
  ) {
    this.show = false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
    });
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Reference number",
        field: "Reference Number",
        width: 400,
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
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.getLoginDetails();
  }

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  };
  
  incomingfile(event) {
    this.rowData = [];
    this.file = event.target.files[0]; 
    this.etowerFileTracking();
  };

  clearData(){
    $("#fileClearControl").val('');
    this.rowData = [];
  };

  etowerFileTracking(){
      var worksheet;
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
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
            this.rowData = exportData;
        }
  };

  etowerTracking(){
    this.errorMsg = null;
    this.successMsg = '';
    var referenceNumber = [];
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length == 0){
      this.errorMsg = "**Please select the below records to upload the eTower tracking details";
    };
    if(selectedRows.length > 0 && this.errorMsg == null ){
      for(var refrenceNum in selectedRows){
        var referenceData = selectedRows[refrenceNum]
        referenceNumber.push(referenceData['Reference Number'])
      }
      var result = referenceNumber.join(',');
      this.spinner.show();
        this.trackingDataService.etrackDetails(result, (resp) => {
          this.spinner.hide();
          if(resp.status == 400 ){
            this.successMsg = resp.error.message;
          }else if(resp.status == 500 ){
            this.successMsg = resp.error.message;
          }else{
            this.successMsg = resp.responseMessage;
          }
          $('#allocateEtowerModal').modal('show');
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
  };

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


