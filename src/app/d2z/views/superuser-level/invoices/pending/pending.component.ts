import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { GridOptions } from "ag-grid";
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import _ from 'lodash';

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
  nonD2zInvoiceApproveFlag: Boolean;
  nonD2zInvoiceBilledFlag: Boolean;
  private gridOptions: GridOptions;
  private gridOptionsApproved: GridOptions;
  private gridOptionsNonD2zPending: GridOptions;
  private gridOptionsNonD2zApproved: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private defaultColDef;
  private rowData: any[];
  private rowDataApproved: any[];
  private rowDataNonD2zPending: any[];
  private rowDataNonD2zApproved: any[];
  private invoiceDownloadList: any[];
  
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

    //This grid is for Pending Invoice NON-D2Z
    this.gridOptionsNonD2zPending = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsNonD2zPending.columnDefs = [
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

    //This grid is for Approved Invoice NON-D2Z
    this.gridOptionsNonD2zApproved = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsNonD2zApproved.columnDefs = [
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
    var airwaybillPendingList = [];
    var brokerPendingList = [];
    var invoiceDownloadFinalList = [];
    if(selectedRows.length > 0 ){
      for (var pendingDownload in selectedRows) {
        var pendingObj = selectedRows[pendingDownload];
        airwaybillPendingList.push(pendingObj.shipmentNumber);
        brokerPendingList.push(pendingObj.brokerName);
      };
      var brokerPendingListFinal = Array.from(new Set(brokerPendingList));
      var airwaybillPendingListFinal = Array.from(new Set(airwaybillPendingList));
      var billed = 'N';
      var invoiced = 'N';
      this.spinner.show();
      this.consigmentUploadService.downloadInvoiceData(brokerPendingListFinal, airwaybillPendingListFinal,
        billed, invoiced, (resp) => {
          this.spinner.hide();
          var downloadInvoiceData = resp;
          let trackingNumber = 'trackingNumber';
          let reference = 'reference';
          let postcode = 'postcode';
          let weight = 'weight';
          let postage = 'postage';
          let fuelSurcharge = 'fuelSurcharge';
          let total = 'total';
          let serviceType = 'serviceType';
          
           for(var downloadInvoice in downloadInvoiceData){
              var invoiceData = downloadInvoiceData[downloadInvoice];
              var invoiceObj = (
                invoiceObj={}, 
                invoiceObj[trackingNumber]= invoiceData.trackingNumber != null ? invoiceData.trackingNumber : '' , invoiceObj,
                invoiceObj[reference]= invoiceData.referenceNuber != null ? invoiceData.referenceNuber : '', invoiceObj,
                invoiceObj[postcode]= invoiceData.postcode != null ?  invoiceData.postcode : '', invoiceObj,
                invoiceObj[weight]= invoiceData.weight != null ? invoiceData.weight : '', invoiceObj,
                invoiceObj[postage]= invoiceData.postage != null ? invoiceData.postage : '', invoiceObj,
                invoiceObj[fuelSurcharge]= invoiceData.fuelsurcharge != null ? invoiceData.fuelsurcharge : '', invoiceObj,
                invoiceObj[total]= invoiceData.total != null ? invoiceData.total : '', invoiceObj,
                invoiceObj[serviceType]= invoiceData.serviceType != null ? invoiceData.serviceType : '', invoiceObj
              );
              invoiceDownloadFinalList.push(invoiceObj);
           }
           var currentTime = new Date();
           var fileName = '';
           fileName = "Invoice_Pending"+"-"+currentTime.toLocaleDateString();
           var options = { 
             fieldSeparator: ',',
             quoteStrings: '"',
             decimalseparator: '.',
             showLabels: true, 
             useBom: true,
             headers: [ 'Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type']
             };
             new Angular2Csv(invoiceDownloadFinalList, fileName, options);   
             this.invoiceApproveFlag = true;
        })
    }else{
        this.errorMsg =  "**Please select the below records to download the Invoice Data";
    } 
  };

  downloadApprovedInvoice(){
    var selectedApprovedRows = this.gridOptionsApproved.api.getSelectedRows();
    this.invoiceBilledFlag = false;
    var brokerList = [];
    var airwaybillList = [];
    var invoiceApprovedDownloadFinalList = [];
   
    if(selectedApprovedRows.length > 0 ){
      for (var approvedDownload in selectedApprovedRows) {
        var approveObj = selectedApprovedRows[approvedDownload];
        airwaybillList.push(approveObj.shipmentNumber);
        brokerList.push(approveObj.brokerName);
      };
      var brokerListFFinal = Array.from(new Set(brokerList));
      var airwaybillListFinal = Array.from(new Set(airwaybillList));
      var billed = 'N';
      var invoiced = 'Y';
      this.spinner.show();
      this.consigmentUploadService.downloadInvoiceData(brokerListFFinal, airwaybillListFinal,
        billed, invoiced, (resp) => {
        this.spinner.hide();
        var downloadInvoiceApprovedData = resp;
        let trackingNumber = 'trackingNumber';
        let reference = 'reference';
        let postcode = 'postcode';
        let weight = 'weight';
        let postage = 'postage';
        let fuelSurcharge = 'fuelSurcharge';
        let total = 'total';
        let serviceType = 'serviceType';
        
         for(var downloadApproveInvoice in downloadInvoiceApprovedData){
            var invoiceApprovedData = downloadInvoiceApprovedData[downloadApproveInvoice];
            var invoiceApproveObj = (
              invoiceApproveObj={}, 
              invoiceApproveObj[trackingNumber]= invoiceApprovedData.trackingNumber != null ? invoiceApprovedData.trackingNumber : '' , invoiceApproveObj,
              invoiceApproveObj[reference]= invoiceApprovedData.referenceNuber != null ? invoiceApprovedData.referenceNuber : '', invoiceApproveObj,
              invoiceApproveObj[postcode]= invoiceApprovedData.postcode != null ?  invoiceApprovedData.postcode : '', invoiceApproveObj,
              invoiceApproveObj[weight]= invoiceApprovedData.weight != null ? invoiceApprovedData.weight : '', invoiceApproveObj,
              invoiceApproveObj[postage]= invoiceApprovedData.postage != null ? invoiceApprovedData.postage : '', invoiceApproveObj,
              invoiceApproveObj[fuelSurcharge]= invoiceApprovedData.fuelsurcharge != null ? invoiceApprovedData.fuelsurcharge : '', invoiceApproveObj,
              invoiceApproveObj[total]= invoiceApprovedData.total != null ? invoiceApprovedData.total : '', invoiceApproveObj,
              invoiceApproveObj[total]= invoiceApprovedData.total != null ? invoiceApprovedData.total : '', invoiceApproveObj,
              invoiceApproveObj[serviceType]= invoiceApprovedData.serviceType != null ? invoiceApprovedData.serviceType : '', invoiceApproveObj
            );
            invoiceApprovedDownloadFinalList.push(invoiceApproveObj);
         };
         var currentTime = new Date();
          var fileName = '';
            fileName = "Invoice_Approved"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type']
          };
        new Angular2Csv(invoiceApprovedDownloadFinalList, fileName, options);   
        this.invoiceBilledFlag = true;
        });
    }else{
        this.errorMsg =  "**Please select the below records to download the Approved Invoice Data";
    } 
  };

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
        $('#invoice').modal('show');  
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
        $('#invoice').modal('show');  
        setTimeout(() => { this.spinner.hide() }, 5000);
      });
  };

  nonD2zBilledInvoice(){
    var selectedRows = this.gridOptionsNonD2zPending.api.getSelectedRows();
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
    this.consigmentUploadService.nonD2zInvoiceApproved(invoiceApproved,(resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        $('#invoice').modal('show');  
        setTimeout(() => { this.spinner.hide() }, 5000);
    });
  };

  nonD2zBilledInvoiceApproved(){
    var selectedRows = this.gridOptionsNonD2zApproved.api.getSelectedRows();
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
    this.consigmentUploadService.nonD2zInvoiceApproved(invoiceApproved,(resp) => {
        this.spinner.hide();
        this.successMsg = resp.message;
        $('#invoice').modal('show');  
        setTimeout(() => { this.spinner.hide() }, 5000);
    });
  };

  onSelectionChange() {
    this.errorMsg = null;
  };

  onApprovedChange(){
    this.errorMsg = null;
  };

  downloadNonD2zPendingInvoice(){
    var selectedNonD2zPendingRows = this.gridOptionsNonD2zPending.api.getSelectedRows();
    var invoicePendingDownloadFinalList = [];
    var nonD2zBrokerList = [];
    var nonD2zAirwayBillList = [];
    if(selectedNonD2zPendingRows.length > 0 ){
      for (var approvedDownload in selectedNonD2zPendingRows) {
        var approveObj = selectedNonD2zPendingRows[approvedDownload];
        nonD2zAirwayBillList.push(approveObj.shipmentNumber);
        nonD2zBrokerList.push(approveObj.brokerName);
      };
      var nonD2zBrokerFinal = Array.from(new Set(nonD2zBrokerList));
      var nonD2zAirwayBillFinal = Array.from(new Set(nonD2zAirwayBillList));
      var billed = 'N';
      var invoiced = 'N';
      this.spinner.show();
      this.consigmentUploadService.downloadNonD2zInvoiceData(nonD2zBrokerFinal, nonD2zAirwayBillFinal,
        billed,invoiced, (resp) => {
        this.spinner.hide();
        var downloadInvoiceApprovedData = resp;
        let trackingNumber = 'trackingNumber';
        let reference = 'reference';
        let postcode = 'postcode';
        let weight = 'weight';
        let postage = 'postage';
        let fuelSurcharge = 'fuelSurcharge';
        let total = 'total';
        let serviceType = 'serviceType';
        console.log(downloadInvoiceApprovedData);
        for(var downloadApproveInvoice in downloadInvoiceApprovedData){
            var invoiceApprovedData = downloadInvoiceApprovedData[downloadApproveInvoice];
            var invoiceApproveNonD2zObj = (
              invoiceApproveNonD2zObj={}, 
              invoiceApproveNonD2zObj[trackingNumber]= invoiceApprovedData.trackingNumber != null ? invoiceApprovedData.trackingNumber : '' , invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[reference]= invoiceApprovedData.referenceNuber != null ? invoiceApprovedData.referenceNuber : '', invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[postcode]= invoiceApprovedData.postcode != null ?  invoiceApprovedData.postcode : '', invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[weight]= invoiceApprovedData.weight != null ? invoiceApprovedData.weight : '', invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[postage]= invoiceApprovedData.postage != null ? invoiceApprovedData.postage : '', invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[fuelSurcharge]= invoiceApprovedData.fuelsurcharge != null ? invoiceApprovedData.fuelsurcharge : '', invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[total]= invoiceApprovedData.total != null ? invoiceApprovedData.total : '', invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[total]= invoiceApprovedData.total != null ? invoiceApprovedData.total : '', invoiceApproveNonD2zObj,
              invoiceApproveNonD2zObj[serviceType]= invoiceApprovedData.serviceType != null ? invoiceApprovedData.serviceType : '', invoiceApproveNonD2zObj
            );
            invoicePendingDownloadFinalList.push(invoiceApproveNonD2zObj);
         };
        var currentTime = new Date();
        var fileName = '';
            fileName = "Non-D2z_Invoice_Pending"+"-"+currentTime.toLocaleDateString();
        var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type']
          };
        new Angular2Csv(invoicePendingDownloadFinalList, fileName, options);   
        this.nonD2zInvoiceApproveFlag = true;
        });
    }else{
        this.errorMsg =  "**Please select the below records to download the Non-D2Z Invoice Data";
    } 
  };

  downloadNonD2zApprovedInvoice(){
    var selectedNonD2zApprovedRows = this.gridOptionsNonD2zApproved.api.getSelectedRows();
    var invoiceApprovedDownloadFinalList = [];
    var nonD2zBrokerList = [];
    var nonD2zAirwayBillList = [];
    if(selectedNonD2zApprovedRows.length > 0 ){
      for (var approvedDownload in selectedNonD2zApprovedRows) {
        var approveObj = selectedNonD2zApprovedRows[approvedDownload];
        nonD2zAirwayBillList.push(approveObj.shipmentNumber);
        nonD2zBrokerList.push(approveObj.brokerName);
      };
      var nonD2zBrokerFinal = Array.from(new Set(nonD2zBrokerList));
      var nonD2zAirwayBillFinal = Array.from(new Set(nonD2zAirwayBillList));
      var billed = 'N';
      var invoiced = 'Y';
      this.spinner.show();
      this.consigmentUploadService.downloadNonD2zInvoiceData(nonD2zBrokerFinal, nonD2zAirwayBillFinal,
        billed, invoiced, (resp) => {
        this.spinner.hide();
        var downloadInvoiceApprovedData = resp;
        let trackingNumber = 'trackingNumber';
        let reference = 'reference';
        let postcode = 'postcode';
        let weight = 'weight';
        let postage = 'postage';
        let fuelSurcharge = 'fuelSurcharge';
        let total = 'total';
        let serviceType = 'serviceType';
        
        for(var downloadApproveInvoice in downloadInvoiceApprovedData){
            var invoiceApprovedData = downloadInvoiceApprovedData[downloadApproveInvoice];
            var invoiceApproveObj = (
              invoiceApproveObj={}, 
              invoiceApproveObj[trackingNumber]= invoiceApprovedData.trackingNumber != null ? invoiceApprovedData.trackingNumber : '' , invoiceApproveObj,
              invoiceApproveObj[reference]= invoiceApprovedData.referenceNuber != null ? invoiceApprovedData.referenceNuber : '', invoiceApproveObj,
              invoiceApproveObj[postcode]= invoiceApprovedData.postcode != null ?  invoiceApprovedData.postcode : '', invoiceApproveObj,
              invoiceApproveObj[weight]= invoiceApprovedData.weight != null ? invoiceApprovedData.weight : '', invoiceApproveObj,
              invoiceApproveObj[postage]= invoiceApprovedData.postage != null ? invoiceApprovedData.postage : '', invoiceApproveObj,
              invoiceApproveObj[fuelSurcharge]= invoiceApprovedData.fuelsurcharge != null ? invoiceApprovedData.fuelsurcharge : '', invoiceApproveObj,
              invoiceApproveObj[total]= invoiceApprovedData.total != null ? invoiceApprovedData.total : '', invoiceApproveObj,
              invoiceApproveObj[serviceType]= invoiceApprovedData.serviceType != null ? invoiceApprovedData.serviceType : '', invoiceApproveObj
            );
            invoiceApprovedDownloadFinalList.push(invoiceApproveObj);
         };
        var currentTime = new Date();
        var fileName = '';
            fileName = "Non-D2z_Invoice_Approved"+"-"+currentTime.toLocaleDateString();
        var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type']
          };
        new Angular2Csv(invoiceApprovedDownloadFinalList, fileName, options);   
        this.nonD2zInvoiceBilledFlag = true;
        });
    }else{
        this.errorMsg =  "**Please select the below records to download the Non-D2Z Approved Invoice Data";
    } 
  }

  onNonD2zPendingChange(){
    this.errorMsg =null;
    this.successMsg = null;
  };

  onNonD2zApprovedChange(){
    this.errorMsg =null;
    this.successMsg = null;
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
    }else if(event.index == 2){
      this.spinner.show();
      this.nonD2zInvoiceApproveFlag = false;
      this.consigmentUploadService.invoiceNonD2zPendingData((resp) => {
        this.spinner.hide();
        this.rowDataNonD2zPending = resp;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      })
    }else if(event.index == 3){
      this.spinner.show();
      this.nonD2zInvoiceBilledFlag = false;
      this.consigmentUploadService.invoiceNonD2zApprovedData((resp) => {
        this.spinner.hide();
        this.rowDataNonD2zApproved = resp;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      })
    }
  }

}


