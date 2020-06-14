import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { GridOptions } from "ag-grid";
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { Global } from 'app/d2z/service/Global';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import _ from 'lodash';
interface dropdownTemplate {
  name: string;
  value: string;
}

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
  selectedTab: Number;
   indicator: String;
  file:File;
  file1:File;
  FileArticle = ['ArticleID'];
  public articleList = [];
  public importList = [];
  arrayBuffer:any;
  arrayBuffer1:any;
  invoiceApproveFlag: Boolean;
  invoiceBilledFlag: Boolean;
  nonD2zInvoiceApproveFlag: Boolean;
  nonD2zInvoiceBilledFlag: Boolean;
  public gridOptions: GridOptions;
  public gridOptionsApproved: GridOptions;
  public gridOptionsNonD2zPending: GridOptions;
  public gridOptionsNonD2zApproved: GridOptions;
  public gridOptionsShipmentCharges: GridOptions;
  public gridOptionsWeight: GridOptions;
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  public defaultColDef;
  public rowData: any[];
  public rowDataApproved: any[];
  public rowDataShipmentChanges: any[];
  public rowDataNonD2zPending: any[];
  public rowDataNonD2zApproved: any[];
  public rowDataWeight: any[];
  public rowDataArticle: any[];
  private invoiceDownloadList: any[];
  system: String;
  serviceListMainData = [];
  serviceDropdownValue = [];
  serviceTypeDropdown: dropdownTemplate[];  
  selectedserviceType: dropdownTemplate;
  serviceType: String;
   shipmentAllocateForm: FormGroup;
    public articlegridOptions:GridOptions;
    constructor(
      public consigmentUploadService: ConsigmentUploadService,
      private spinner: NgxSpinnerService,
        private global: Global,
    private router:Router
    ){
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
    this.gridOptionsWeight = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsWeight.columnDefs = [
      {
        headerName: "Article ID",
        field: "articleid",
        width: 300,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 250
      }
    ];

    this.articlegridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.articlegridOptions.columnDefs = [
      {
        headerName: "Article ID",
        field: "articleid",
        width: 500,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
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

     //This grid is for Shipment Charges
     this.gridOptionsShipmentCharges = <GridOptions>{ rowSelection: "multiple" };
     this.gridOptionsShipmentCharges.columnDefs = [
          {
            headerName: "Broker Name",
            field: "broker",
            width: 150,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Consignee Name",
            field: "consignee",
            width: 150
          },
          {
            headerName: "MAWB",
            field: "mawb",
            width: 100
          },
          {
            headerName: "Destination",
            field: "pod",
            width: 100
          },
          {
            headerName: "Piece",
            field: "pcs",
            width: 80
          },
          {
            headerName: "Weight",
            field: "weight",
            width: 80
          },
          {
            headerName: "HAWB",
            field: "hawb",
            width: 100
          },
          {
            headerName: "Process",
            field: "process",
            width: 150
          },
          {
            headerName: "PickUp",
            field: "pickUp",
            width: 100
          },
          {
            headerName: "Docs",
            field: "docs",
            width: 100
          },
          {
            headerName: "Airport",
            field: "airport",
            width: 100
          },
          {
            headerName: "Total",
            field: "total",
            width: 150
          }
     ];
  }

  ngOnInit() {
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
    this.getLoginDetails();
    this.spinner.show();
    this.invoiceApproveFlag = false;
    if(this.global.oustanding_InvoiceMAWB){
      console.log("outstanding");
      this.selectedTab=3;
      this.global.setoustanding_InvoiceMAWB(false);
    }
    else{
      console.log("invoice");
      this.selectedTab=0;
    }
console.log("init:::"+this.selectedTab);
    this.consigmentUploadService.invoicePendingData((resp) => {
      this.spinner.hide();
      this.rowData = resp;
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    })

    this.consigmentUploadService.mlidList( (resp) => {
      this.serviceListMainData = resp;
      this.spinner.hide();
      var that = this;
      resp.forEach(function(entry) {
      //console.log(entry.name);
        that.serviceDropdownValue.push(entry.name);
      })
      this.serviceTypeDropdown = this.serviceDropdownValue;
      // console.log( this.serviceTypeDropdown);
    })
  }

  onServiceTypeChange(event){
      this.serviceType = event.value ? event.value.value: '';
  };

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
          let brokerName = 'brokerName';
          let trackingNumber = 'trackingNumber';
          let reference = 'reference';
          let postcode = 'postcode';
          let weight = 'weight';
          let postage = 'postage';
          let fuelSurcharge = 'fuelSurcharge';
          let total = 'total';
          let serviceType = 'serviceType';
          let airwaybill ='airwaybill';
          
           for(var downloadInvoice in downloadInvoiceData){
              var invoiceData = downloadInvoiceData[downloadInvoice];
              var invoiceObj = (
                invoiceObj={}, 
                invoiceObj[brokerName]= invoiceData.brokerName != null ? invoiceData.brokerName : '' , invoiceObj,
                invoiceObj[trackingNumber]= invoiceData.trackingNumber != null ? invoiceData.trackingNumber : '' , invoiceObj,
                invoiceObj[reference]= invoiceData.referenceNuber != null ? invoiceData.referenceNuber : '', invoiceObj,
                invoiceObj[postcode]= invoiceData.postcode != null ?  invoiceData.postcode : '', invoiceObj,
                invoiceObj[weight]= invoiceData.weight != null ? invoiceData.weight : '', invoiceObj,
                invoiceObj[postage]= invoiceData.postage != null ? invoiceData.postage : '', invoiceObj,
                invoiceObj[fuelSurcharge]= invoiceData.fuelsurcharge != null ? invoiceData.fuelsurcharge : '', invoiceObj,
                invoiceObj[total]= invoiceData.total != null ? invoiceData.total : '', invoiceObj,
                invoiceObj[serviceType]= invoiceData.serviceType != null ? invoiceData.serviceType : '', invoiceObj,
                 invoiceObj[airwaybill]= invoiceData.airwaybill != null ? invoiceData.airwaybill : '', invoiceObj

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
             headers: [ 'Broker Name','Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type','Airway Bill']
             };
             new Angular2Csv(invoiceDownloadFinalList, fileName, options);   
             this.invoiceApproveFlag = true;
        })
    }else{
        this.errorMsg =  "**Please select the below records to download the Invoice Data";
    } 
  };


  downloadShipmentCharges(){
    var selectedRows = this.gridOptionsShipmentCharges.api.getSelectedRows();
    var shipmentDataFinalList = [];
    if(selectedRows.length > 0 ){
          let consignee = 'consignee';
          let mawb = 'mawb';
          let broker = 'broker';
          let pod = 'pod';
          let pcs = 'pcs';
          let weight = 'weight';
          let hawb = 'hawb';
          let process = 'process';
          let pickUp ='pickUp';
          let docs = 'docs';
          let airport = 'airport';
          let total ='total';
      for(var downloadShipment in selectedRows){
        var shipmentData = selectedRows[downloadShipment];
        var shipmentObjObj = (
          shipmentObjObj={}, 
          shipmentObjObj[broker]= shipmentData.broker != null ?  shipmentData.broker : '', shipmentObjObj,
          shipmentObjObj[consignee]= shipmentData.consignee != null ? shipmentData.consignee : '' , shipmentObjObj,
          shipmentObjObj[mawb]= shipmentData.mawb != null ? shipmentData.mawb : '', shipmentObjObj,
          shipmentObjObj[pod]= shipmentData.pod != null ? shipmentData.pod : '', shipmentObjObj,
          shipmentObjObj[pcs]= shipmentData.pcs != null ? shipmentData.pcs : '', shipmentObjObj,
          shipmentObjObj[weight]= shipmentData.weight != null ? shipmentData.weight : '', shipmentObjObj,
          shipmentObjObj[hawb]= shipmentData.hawb != null ? shipmentData.hawb : '', shipmentObjObj,
          shipmentObjObj[process]= shipmentData.process != null ? shipmentData.process : '', shipmentObjObj,
          shipmentObjObj[pickUp]= shipmentData.pickUp != null ? shipmentData.pickUp : '', shipmentObjObj,
          shipmentObjObj[docs]= shipmentData.docs != null ? shipmentData.docs : '', shipmentObjObj,
          shipmentObjObj[airport]= shipmentData.airport != null ? shipmentData.airport : '', shipmentObjObj,
          shipmentObjObj[total]= shipmentData.total != null ? shipmentData.total : '', shipmentObjObj
        );
        shipmentDataFinalList.push(shipmentObjObj);
     }

     var currentTime = new Date();
     var fileName = '';
     fileName = "Shipment Charges"+"-"+currentTime.toLocaleDateString();
     var options = { 
       fieldSeparator: ',',
       quoteStrings: '"',
       decimalseparator: '.',
       showLabels: true, 
       useBom: true,
       headers: [ 'Broker Name', 'Consignee', 'MAWB', 'POD', 'PCS', 'Weight', 'HAWB', 'Process','Pick Up','Docs','Airport','Total']
       };
       new Angular2Csv(shipmentDataFinalList, fileName, options);  
    }else{
        this.errorMsg =  "**Please select the below records to download the Shipmet Charges";
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
      // console.log(brokerListFFinal);
      // console.log(airwaybillListFinal);
      this.consigmentUploadService.downloadInvoiceData(brokerListFFinal, airwaybillListFinal,
        billed, invoiced, (resp) => {
        this.spinner.hide();
        var downloadInvoiceApprovedData = resp;
        let brokerName = 'brokerName'
        let trackingNumber = 'trackingNumber';
        let reference = 'reference';
        let postcode = 'postcode';
        let weight = 'weight';
        let postage = 'postage';
        let fuelSurcharge = 'fuelSurcharge';
        let total = 'total';
        let serviceType = 'serviceType';
        let airwaybill ='airwaybill';

         for(var downloadApproveInvoice in downloadInvoiceApprovedData){
            var invoiceApprovedData = downloadInvoiceApprovedData[downloadApproveInvoice];
            var invoiceApproveObj = (
              invoiceApproveObj={}, 
              invoiceApproveObj[brokerName]= invoiceApprovedData.brokerName != null ? invoiceApprovedData.brokerName : '' , invoiceApproveObj,
              invoiceApproveObj[trackingNumber]= invoiceApprovedData.trackingNumber != null ? invoiceApprovedData.trackingNumber : '' , invoiceApproveObj,
              invoiceApproveObj[reference]= invoiceApprovedData.referenceNuber != null ? invoiceApprovedData.referenceNuber : '', invoiceApproveObj,
              invoiceApproveObj[postcode]= invoiceApprovedData.postcode != null ?  invoiceApprovedData.postcode : '', invoiceApproveObj,
              invoiceApproveObj[weight]= invoiceApprovedData.weight != null ? invoiceApprovedData.weight : '', invoiceApproveObj,
              invoiceApproveObj[postage]= invoiceApprovedData.postage != null ? invoiceApprovedData.postage : '', invoiceApproveObj,
              invoiceApproveObj[fuelSurcharge]= invoiceApprovedData.fuelsurcharge != null ? invoiceApprovedData.fuelsurcharge : '', invoiceApproveObj,
              invoiceApproveObj[total]= invoiceApprovedData.total != null ? invoiceApprovedData.total : '', invoiceApproveObj,
              invoiceApproveObj[total]= invoiceApprovedData.total != null ? invoiceApprovedData.total : '', invoiceApproveObj,
              invoiceApproveObj[serviceType]= invoiceApprovedData.serviceType != null ? invoiceApprovedData.serviceType : '', invoiceApproveObj,
              invoiceApproveObj[airwaybill]= invoiceApprovedData.airwaybill != null ? invoiceApprovedData.airwaybill : '', invoiceApproveObj
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
            headers: ['Broker Name','Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type','Airway Bill']
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

  chargesApprove(){
    var shipmentArray = this.gridOptionsShipmentCharges.api.getSelectedRows();
    var shipmentFinalList = [];
    if(shipmentArray.length > 0){
      let mawb = 'mawb';
      for(var shipmentData in shipmentArray){
        var shipmentApprovedData = shipmentArray[shipmentData];
        var shipmentApproveObj = (
          shipmentApproveObj={}, 
          shipmentApproveObj[mawb]= shipmentApprovedData.mawb != null ? shipmentApprovedData.mawb : '' , shipmentApproveObj
        )
        shipmentFinalList.push(shipmentApproveObj);
      }
      console.log(shipmentFinalList);
      this.spinner.show();
      this.consigmentUploadService.shipmentApproved(shipmentFinalList, (resp) => {
          this.spinner.hide();
          this.successMsg = resp.message;
          $('#invoice').modal('show');  
          this.shipmentCharge();
        });
    }else{
      this.errorMsg = "**Please select atleast one record to Approve the shipment Charges";
    }
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
onSelectionArticleChange(){
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
        let airwaybill ='airwaybill';
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
              invoiceApproveNonD2zObj[serviceType]= invoiceApprovedData.serviceType != null ? invoiceApprovedData.serviceType : '', invoiceApproveNonD2zObj,
                invoiceApproveNonD2zObj[airwaybill]= invoiceApprovedData.airwaybill != null ? invoiceApprovedData.airwaybill : '', invoiceApproveNonD2zObj
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
            headers: [ 'Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type','Airway Bill']
          };
        new Angular2Csv(invoicePendingDownloadFinalList, fileName, options);   
        this.nonD2zInvoiceApproveFlag = true;
        });
    }else{
        this.errorMsg =  "**Please select the below records to download the Non-D2Z Invoice Data";
    } 
  };

  uploadWeight(){
    var selectedweight = this.gridOptionsWeight.api.getSelectedRows();
    if(selectedweight.length > 0){
    for (var weightrow in selectedweight) {
      var approveObj = selectedweight[weightrow];
      console.log(approveObj);
    }
    this.spinner.show();
      this.consigmentUploadService.uploadweight(selectedweight,  (resp) => {
          this.spinner.hide();
          this.successMsg = resp.message;
          console.log(resp);
      });
    }else{
      this.errorMsg =  "**Please select the below records to upload the weight";
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
        let airwaybill ='airwaybill';
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
              invoiceApproveObj[serviceType]= invoiceApprovedData.serviceType != null ? invoiceApprovedData.serviceType : '', invoiceApproveObj,
                invoiceApproveObj[airwaybill]= invoiceApprovedData.airwaybill != null ? invoiceApprovedData.airwaybill : '', invoiceApproveObj
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
            headers: [ 'Tracking Number', 'Reference', 'Postcode', 'Weight', 'Postage', 'Fuel Surcharge', 'Total', 'Service Type','Airway Bill']
          };
        new Angular2Csv(invoiceApprovedDownloadFinalList, fileName, options);   
        this.nonD2zInvoiceBilledFlag = true;
        });
    }else{
        this.errorMsg =  "**Please select the below records to download the Non-D2Z Approved Invoice Data";
    } 
  };

  onNonD2zPendingChange(){
    this.errorMsg =null;
    this.successMsg = null;
  };

  onNonD2zApprovedChange(){
    this.errorMsg =null;
    this.successMsg = null;
  };
  
  incomingfile(event) {
    this.rowDataWeight = [];
    this.file = event.target.files[0]; 
    this.uploadArticleID();
  }

   incomingfile1(event) {
   
    this.rowDataArticle =[];
    this.file1= event.target.files[0]; 
    this.shipmentExport();
  };

  shipmentExport(){
      var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      this.articleList=[];
      fileReader.readAsArrayBuffer(this.file1);
      let articleid = 'articleid';
      fileReader.onload = (e) => {
          this.arrayBuffer1 = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer1);
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
                console.log(dataObj['ArticleID']);
                {
                  if(!this.FileArticle.includes(keyVal)){
                    this.errorMsg = "***Invalid file format, Please check the field in given files ArticleID, allowed fields are ['ArticleID']"
                    }
                }
              }
              if(this.errorMsg == null){
                {
                 var importObj = (
                  importObj={}, 
                  importObj[articleid]= dataObj['ArticleID'] != undefined ? dataObj['ArticleID'] : '', importObj
                );
                this.articleList.push(importObj);
                this.rowDataArticle= this.articleList;
                console.log(this.rowDataArticle);
                }
              }
          }
        }
  };

  allocateShipment(){
    this.errorMsg = null;
    this.successMsg = '';
    {
      var selectedRows = this.articlegridOptions.api.getSelectedRows();
      var select = "Article";
      var refrenceNumList = [];
        for (var labelValue in selectedRows) {
              var labelObj = selectedRows[labelValue];
              refrenceNumList.push(labelObj.articleid)
        }
    }
    if(this.shipmentAllocateForm.value.shipmentNumber == null || this.shipmentAllocateForm.value.shipmentNumber == ''){
      this.errorMsg = "**Please Enter the shipment number for the selected items";
    }
    if(selectedRows.length == 0){
      this.errorMsg = "**Please select the below records to allocate the shipment";
    }
    if(selectedRows.length > 0 && this.errorMsg == null ){
        this.spinner.show();
        console.log(refrenceNumList);
        {
         this.consigmentUploadService.shipmentAllocationArticleID(refrenceNumList.toString(), this.shipmentAllocateForm.value.shipmentNumber, (resp) => {
          this.spinner.hide();
          if(resp.error){
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
    }
  };

  uploadArticleID(){
    var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      fileReader.readAsArrayBuffer(this.file);
      let ArticleID   ='articleid'; 
      let Weigh = 'weight'  ;
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
            console.log(dataObj);
            if(this.errorMsg == null){
              var importObj = (
                importObj={}, 
                importObj[ArticleID]= dataObj['Article ID'] != undefined ? dataObj['Article ID'] : '', importObj,
                importObj[Weigh]= dataObj['Weight'] != undefined ? dataObj['Weight'] : '', importObj
              );
              this.importList.push(importObj)
              console.log(this.importList);
              this.rowDataWeight = this.importList;
              }
          }
        }
  };

  onSelectionShipmentChange(){
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
            this.errorMsg = "Something Went wrong";
        }  
      })
    }else if(event.index == 4){
      this.spinner.show();
      this.invoiceBilledFlag = false;
      this.shipmentCharge();
    }
  };

  shipmentCharge(){
    this.consigmentUploadService.shipmentCharges((resp) => {
      this.spinner.hide();
      this.rowDataShipmentChanges = resp;
      if(!resp){
          this.errorMsg = "Something Went wrong";
      }  
    })
  };

  clearInvoiceD2zPending(){
    this.rowData = [];
    this.invoiceApproveFlag = false;
    this.spinner.show();
    this.successMsg = null;
    this.errorMsg = null;
    this.consigmentUploadService.invoicePendingData((resp) => {
      this.spinner.hide();
      this.rowData = resp;
      if(!resp){
          this.errorMsg = "Something Went wrong!";
      }  
    })
  };

  clearInvoiceD2zApproved(){
    this.rowDataApproved = [];
    this.invoiceBilledFlag = false;
    this.spinner.show();
    this.successMsg = null;
    this.errorMsg = null;
    this.consigmentUploadService.invoiceApprovedData((resp) => {
      this.spinner.hide();
      this.rowDataApproved = resp;
      if(!resp){
          this.errorMsg = "Something Went wrong!";
      }  
    })
  };

  clearInvoiceNDPending(){
    this.rowDataNonD2zPending = [];
    this.nonD2zInvoiceApproveFlag = false;
    this.spinner.show();
    this.successMsg = null;
    this.errorMsg = null;
    this.consigmentUploadService.invoiceNonD2zPendingData((resp) => {
      this.spinner.hide();
      this.rowDataNonD2zPending = resp;
      if(!resp){
          this.errorMsg = "Something Went wrong!";
      }  
    })
  };

  clearInvoiceNDApproved(){
    this.rowDataNonD2zApproved = [];
    this.nonD2zInvoiceBilledFlag = false;
    this.spinner.show();
    this.successMsg = null;
    this.errorMsg = null;
    this.consigmentUploadService.invoiceNonD2zApprovedData((resp) => {
      this.spinner.hide();
      this.rowDataNonD2zApproved = resp;
      if(!resp){
          this.errorMsg = "Something Went wrong!";
      }  
    })
  };

}


