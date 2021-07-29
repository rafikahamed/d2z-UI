import { Component, ElementRef, ViewChild, OnInit, Compiler } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'd2z-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {
    
    public gridOptions: GridOptions;
    public autoGroupColumnDef;
    public rowGroupPanelShow;
    public rowData: any[];
    public defaultColDef;
    message: String;
    errorMsg: String;
    file:File;
    system:String;
    arrayBuffer:any;
    public importList = [];
  
    constructor(
      public consigmentUploadService: ConsigmentUploadService,
      private spinner: NgxSpinnerService,
      private router: Router,
      private _compiler: Compiler
    ){
      this.message = null;
      this.errorMsg = null;
      this._compiler.clearCache();
      this.gridOptions = <GridOptions>{rowSelection: "multiple"};
      this.autoGroupColumnDef = {
        headerCheckboxSelection: true,
        cellRenderer: "agGroupCellRenderer",
        cellRendererParams: { checkbox: true }
      };      
      this.rowGroupPanelShow = "always";
      this.defaultColDef = {
        editable: true
      };
    };

    ngOnInit(){
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
     
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
        this.gridOptions.columnDefs = [
          {
            headerName: "Broker Name",
            field: "brokerName",
            width: 180,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Tracking Number",
            field: "trackingNumber",
            width: 180
          },
          {
            headerName: "Postage",
            field: "postage",
            width: 150
          },
          {
            headerName: "Fuel Surcharge",
            field: "fuelSurcharge",
            width: 150
          },
          {
            headerName: "Total",
            field: "total",
            width: 120
          },
          {
            headerName: "Airway Bill",
            field: "airwayBill",
            width: 150
          }
        ]   
      
      
    };
    
    fileExport() {
      var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      fileReader.readAsArrayBuffer(this.file);
      	let brokerName = 'brokerName';
      	let trackingNumber = 'trackingNumber';
        let postage = 'postage';
        let fuelSurcharge = 'fuelSurcharge';
        let total = 'total';
        let airwayBill = 'airwayBill';

      
        
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
                var newLine = "\r\n"

              if(!dataObj['Tracking Number'] ){
                this.errorMsg = "Tracking Number is mandatory";
              }else if(!dataObj['Broker Name']){
                this.errorMsg = "Broker Name is mandatory";
              }else if(!dataObj['Postage']){
                this.errorMsg = "Postage is mandatory";
              }else if(!dataObj['Fuel Surcharge']){
                this.errorMsg = 'Fuel Surcharge is mandatory';
              }else if(!dataObj['Total']){
                this.errorMsg = 'Total is mandatory';
              }
			  else{
			  this.errorMsg = '';
                var importObj = (
                  importObj={}, 
                  importObj[brokerName]= dataObj['Broker Name'] != undefined ? dataObj['Broker Name'] : '', importObj,
                  importObj[trackingNumber]= dataObj['Tracking Number'] != undefined ? dataObj['Tracking Number'] : '', importObj,
                  importObj[fuelSurcharge]= dataObj['Fuel Surcharge'] != undefined ? dataObj['Fuel Surcharge'] : '',  importObj,
                  importObj[postage]= dataObj['Postage'] != undefined ? dataObj['Postage'] : '',  importObj,
                  importObj[total]= dataObj['Total'] != undefined ? dataObj['Total'] : '', importObj,
                  importObj[airwayBill]= dataObj['Airway Bill'] != undefined ? dataObj['Airway Bill'] : '', importObj
              );
            
              this.importList.push(importObj);
              this.rowData = this.importList;
              }
          
        }
    };
}
    fileUpload(){
      var selectedRows = this.gridOptions.api.getSelectedRows();
    
      console.log(selectedRows.length)
      console.log(this.errorMsg)
      if(selectedRows.length > 0 && this.errorMsg=='') {
        this.spinner.show();
        this.consigmentUploadService.uploadManualInvoice(selectedRows, (resp) => {
        this.spinner.hide();
        this.message = resp.message;
        $('#message').modal('show');  
        
          setTimeout(() => { this.spinner.hide() }, 5000);
        });
      }
    };

    clearUpload(){
      $("#congFileControl").val('');
      this.rowData = [];
      this.importList = [];
    };

    incomingfile(event) {
      this.rowData = [];
      this.file = event.target.files[0]; 
      this.fileExport();
    };

    onSelectionChange() {
      this.errorMsg = '';
      var selectedRows = this.gridOptions.api.getSelectedRows();
    };
};

