import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { GridOptions } from "ag-grid";
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'hms-superuser-level-invoices',
  templateUrl: './not-billed.component.html',
  styleUrls: ['./not-billed.component.css']
})

export class SuperUserNotBilledComponent implements OnInit {

  userName: String;
  role_id: String;
  errorMsg: string;
  successMsg: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    private spinner: NgxSpinnerService
  ){
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };

    //This grid is for Pending Invoice
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Customer",
        field: "userName",
        width: 300,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Shipment Number",
        field: "airwayBill",
        width: 250
      },
      {
        headerName: "Tracking Number",
        field: "articleId",
        width: 250
      },
      {
        headerName: "Reference Number",
        field: "referenceNumber",
        width: 250
      },
      {
        headerName: "D2Z Cost",
        field: "d2zRate",
        width: 100
      }
    ];

  }

  ngOnInit() {
    this.getLoginDetails();
    this.spinner.show();
    this.consigmentUploadService.notBilledData((resp) => {
      this.spinner.hide();
      this.rowData = resp;
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    })
  };

  notBilledDownload(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length > 0 ){
      var currentTime = new Date();
        var fileName = '';
          fileName = "Not_Billed"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Customer', 'Shipment Number', 'Tracking Number', 'Reference Number', 'D2Z Cost']
          };
        new Angular2Csv(selectedRows, fileName, options);   
    }else{
        this.errorMsg =  "**Please select the below records to download Not Billed Data";
    } 
  }

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  }

}


