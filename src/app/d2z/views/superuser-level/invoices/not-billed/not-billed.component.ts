import { Component, AfterContentChecked, OnInit } from '@angular/core';
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
  private gridOptionsNonD2z: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private rowDataNonD2z: any[];
  private notBilledList : any[];
  private notBilledNonD2zList : any [];
  private defaultColDef;
  system: String;
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
        width: 230,
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
        headerName: "D2Z Postage",
        field: "d2zRate",
        width: 150
      },
      {
        headerName: "Date Allocated",
        field: "dateAllocated",
        width: 250
      }
    ];

    this.gridOptionsNonD2z = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsNonD2z.columnDefs = [
      {
        headerName: "Customer",
        field: "userName",
        width: 230,
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
        headerName: "D2Z Postage",
        field: "d2zRate",
        width: 150
      }
    ];
    
  }

  ngOnInit() {
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
    this.getLoginDetails();
    this.spinner.show();
    this.consigmentUploadService.notBilledData((resp) => {
      this.spinner.hide();
      this.rowData = resp;
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    });
  };

  notBilledDownload(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.notBilledList = [];
    let userName = 'userName';
    let airwayBill = 'airwayBill';
    let articleId = 'articleId';
    let referenceNumber = 'referenceNumber';
    let d2zRate = 'd2zRate';
    let dateAllocated = 'dateAllocated';
    
     for(var notBilledData in selectedRows){
        var billedData = selectedRows[notBilledData];
        var notBillObj = (
          notBillObj={}, 
          notBillObj[userName]= billedData.userName != null ? billedData.userName : '' , notBillObj,
          notBillObj[airwayBill]= billedData.airwayBill != null ? billedData.airwayBill : '', notBillObj,
          notBillObj[articleId]= billedData.articleId != null ?  billedData.articleId : '', notBillObj,
          notBillObj[referenceNumber]= billedData.referenceNumber != null ? billedData.referenceNumber : '', notBillObj,
          notBillObj[d2zRate]= billedData.d2zRate != null ? billedData.d2zRate : '', notBillObj,
          notBillObj[dateAllocated]= billedData.dateAllocated != null ? "'"+billedData.dateAllocated+"'" : '', notBillObj

        );
      this.notBilledList.push(notBillObj)
     }

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
            headers: [ 'Customer', 'Shipment Number', 'Tracking Number', 'Reference Number', 'D2Z Postage','Date Allocated']
          };
        new Angular2Csv(this.notBilledList, fileName, options);   
    }else{
        this.errorMsg =  "**Please select the below records to download Not Billed Data";
    } 
  };

  nonD2zNotBilledDownload(){
    var selectedRowsNonD2z = this.gridOptionsNonD2z.api.getSelectedRows();
    this.notBilledNonD2zList = [];
    let userName = 'userName';
    let airwayBill = 'airwayBill';
    let articleId = 'articleId';
    let referenceNumber = 'referenceNumber';
    let d2zRate = 'd2zRate';
    
     for(var notBilledData in selectedRowsNonD2z){
        var billedData = selectedRowsNonD2z[notBilledData];
        var notBillObj = (
          notBillObj={}, 
          notBillObj[userName]= billedData.userName != null ? billedData.userName : '' , notBillObj,
          notBillObj[airwayBill]= billedData.airwayBill != null ? billedData.airwayBill : '', notBillObj,
          notBillObj[articleId]= billedData.articleId != null ?  billedData.articleId : '', notBillObj,
          notBillObj[referenceNumber]= billedData.referenceNumber != null ? billedData.referenceNumber : '', notBillObj,
          notBillObj[d2zRate]= billedData.d2zRate != null ? billedData.d2zRate : '', notBillObj
        );
      this.notBilledNonD2zList.push(notBillObj)
     }

    if(selectedRowsNonD2z.length > 0 ){
      var currentTime = new Date();
        var fileName = '';
          fileName = "Non-D2Z_Not_Billed"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Customer', 'Shipment Number', 'Tracking Number', 'Reference Number', 'D2Z Postage']
          };
        new Angular2Csv(this.notBilledNonD2zList, fileName, options);   
    }else{
        this.errorMsg =  "**Please select the below records to download Non-D2Z Not Billed Data";
    } 
  };

  onSelectionChange(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  };

  tabChanged(event){
    this.errorMsg = null;
    this.successMsg = null;
    if(event.index == 0){
      this.consigmentUploadService.notBilledData((resp) => {
        this.spinner.hide();
        this.rowData = resp;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
    }else if(event.index == 1){
      this.consigmentUploadService.nonD2zNotBilledData((resp) => {
        this.spinner.hide();
        this.rowDataNonD2z = resp;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
    }
  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };

}


