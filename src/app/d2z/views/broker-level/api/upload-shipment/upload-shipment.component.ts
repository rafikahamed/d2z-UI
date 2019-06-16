import { Component, ElementRef, ViewChild, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'hms-upload-shipment',
  templateUrl: './upload-shipment.component.html',
  styleUrls: ['./upload-shipment.component.css']
})

export class APIUploadShipmentComponent implements OnInit{
  public importList = [];
  FileHeading = ['Reference Number'];
  manifestNumber: string;
  arrayBuffer:any;
  file:File;
  errorMsg: string;
  show: Boolean;
  successMsg: String;
  userName: String;
  system: String;
  role_id: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  shipmentAllocateForm: FormGroup;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();
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
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.getLoginDetails();
  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
  
  incomingfile(event) {
    this.rowData = [];
    this.file = event.target.files[0]; 
    this.shipmentExport();
  };

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
                  importObj[referenceNumber]= dataObj['Reference Number'] != undefined ? dataObj['Reference Number'] : '', importObj
                );
              this.importList.push(importObj)
              this.rowData = this.importList;
              }
          }
        }
  };

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
        console.log(refrenceNumList.toString())
        this.trackingDataService.shipmentAllocation(refrenceNumList.toString(), this.shipmentAllocateForm.value.shipmentNumber, (resp) => {
          this.spinner.hide();
          if(resp.error.errorDetails){
            this.successMsg = resp.error.errorDetails;
            $('#allocateShipmentModal').modal('show');
          }else{
            this.successMsg = resp.responseMessage;
            $('#allocateShipmentModal').modal('show');
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
  };

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  };
 
}


