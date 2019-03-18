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
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})

export class SuperUserInvoicePendingComponent implements OnInit {

  userName: String;
  role_id: String;
  errorMsg: string;
  successMsg: String;
  invoiceApproveFlag: Boolean;
  invoiceBilledFlag: Boolean;
  private gridOptions: GridOptions;
  private gridOptionsApproved: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  private rowDataApproved: any[];
  
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
        headerName: "Broker Name",
        field: "brokerName",
        width: 300,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Shipment Number",
        field: "shipmentNumber",
        width: 250
      }
    ];

     //This grid is for Approved Invoice
     this.gridOptionsApproved = <GridOptions>{ rowSelection: "multiple" };
     this.gridOptionsApproved.columnDefs = [
       {
         headerName: "Broker Name",
         field: "brokerName",
         width: 300,
         checkboxSelection: true,
         headerCheckboxSelection: function(params) {
           return params.columnApi.getRowGroupColumns().length === 0;
         }
       },
       {
         headerName: "Shipment Number",
         field: "shipmentNumber",
         width: 250
       }
     ];

  }

  ngOnInit() {
    this.getLoginDetails();
    this.spinner.show();
    this.invoiceApproveFlag = false;
    this.consigmentUploadService.invoicePendingData((resp) => {
      this.spinner.hide();
      this.rowData = resp;
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    })
  }

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };

  downloadPendingInvoice(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.invoiceApproveFlag = false;
    if(selectedRows.length > 0 ){
      var currentTime = new Date();
        var fileName = '';
            fileName = "Invoice_Pending"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Broker Name', 'ShipmentNumber']
          };
        new Angular2Csv(selectedRows, fileName, options);   
        this.invoiceApproveFlag = true;
    }else{
        this.errorMsg =  "**Please select the below records to download the Invoice Data";
    } 
  };

  downloadApprovedInvoice(){
    var selectedApprovedRows = this.gridOptionsApproved.api.getSelectedRows();
    this.invoiceBilledFlag = false;
    if(selectedApprovedRows.length > 0 ){
      var currentTime = new Date();
        var fileName = '';
            fileName = "Invoice_Pending"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Broker Name', 'ShipmentNumber']
          };
        new Angular2Csv(selectedApprovedRows, fileName, options);   
        this.invoiceBilledFlag = true;
    }else{
        this.errorMsg =  "**Please select the below records to download the Approved Invoice Data";
    } 
  }

  invoiceApprove(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    var airwaybillList = [];
    for (var invoiceRecord in selectedRows) {
      var invoiceObj = selectedRows[invoiceRecord];
      airwaybillList.push(invoiceObj.shipmentNumber);
    };
    let airwaybill = 'airwaybill';
    let indicator = 'indicator';
    var invoiceApproved = (
      invoiceApproved={}, 
      invoiceApproved[airwaybill]= airwaybillList.toString(), invoiceApproved,
      invoiceApproved[indicator]= 'Invoiced', invoiceApproved
      );
    this.spinner.show();
    this.consigmentUploadService.invoiceApproved(invoiceApproved, (resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        //$('#invoice').modal('show');  
        setTimeout(() => { this.spinner.hide() }, 5000);
      });
  };

  billedInvoice(){
    var selectedRows = this.gridOptionsApproved.api.getSelectedRows();
    var airwaybillList = [];
    for (var invoiceRecord in selectedRows) {
      var invoiceObj = selectedRows[invoiceRecord];
      airwaybillList.push(invoiceObj.shipmentNumber);
    };
    let airwaybill = 'airwaybill';
    let indicator = 'indicator';
    var invoiceApproved = (
      invoiceApproved={}, 
      invoiceApproved[airwaybill]= airwaybillList.toString(), invoiceApproved,
      invoiceApproved[indicator]= 'Billed', invoiceApproved
      );
    this.spinner.show();
    this.consigmentUploadService.invoiceApproved(invoiceApproved, (resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        //$('#invoice').modal('show');  
        setTimeout(() => { this.spinner.hide() }, 5000);
      });
  };

  onSelectionChange() {
    this.errorMsg = null;
  };

  onApprovedChange(){
    this.errorMsg = null;
  };

  tabChanged(event){
    this.errorMsg = null;
    this.successMsg = null;
    if(event.index == 0){
      this.spinner.show();
      this.invoiceApproveFlag = false;
      this.consigmentUploadService.invoicePendingData((resp) => {
        this.spinner.hide();
        this.rowData = resp;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      })
    }else if(event.index == 1){
      this.spinner.show();
      this.invoiceBilledFlag = false;
      this.consigmentUploadService.invoiceApprovedData((resp) => {
        this.spinner.hide();
        this.rowDataApproved = resp;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      })
    }
  }

}


