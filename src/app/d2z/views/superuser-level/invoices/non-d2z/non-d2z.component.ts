import { Component, AfterContentChecked, OnInit } from '@angular/core';
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
  selector: 'hms-superuser-level-invoices',
  templateUrl: './non-d2z.component.html',
  styleUrls: ['./non-d2z.component.css']
})

export class SuperUserNonD2zClientComponent implements OnInit {
  arrayBuffer:any;
  userName: String;
  role_id: String;
  errorMsg:String;
  successMsg: String;
  show: Boolean;
  brokerUserName: String;
  errorDetails1: String;
  errorDetails: String;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private defaultColDef;
  file:File;
  system: String;
  private gridOptions: GridOptions;
  private rowData: any[];
  public nonD2ZList = [];
  brokerDropDown: dropdownTemplate[];
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consigmentUploadService: ConsigmentUploadService
  ) {
    this.show = false;
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };

    // This grid is for Consignment Items
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Tracking Number",
        field: "articleId",
        width: 250,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Reference Number",
        field: "reference_number",
        width: 200
      },
      {
        headerName: "Consignee Name",
        field: "consigneeName",
        width: 200
      },
      {
        headerName: "Address",
        field: "address",
        width: 200
      },
      {
        headerName: "Suburb",
        field: "suburb",
        width: 200
      },
      {
        headerName: "Postcode",
        field: "postcode",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 150
      },
      {
        headerName: "Length",
        field: "length",
        width: 150
      },
      {
        headerName: "Width",
        field: "width",
        width: 150
      },
      {
        headerName: "Height",
        field: "height",
        width: 150
      },
      {
        headerName: "Service Type",
        field: "serviceType",
        width: 200
      }
    ];
  };
 
  ngOnInit() {
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
    this.getLoginDetails();
    this.spinner.show();
    this.consigmentUploadService.fetchNonBrokerUserName((resp) => {
      this.spinner.hide();
      this.brokerDropDown = resp;
      if(!resp){
          this.errorMsg = "Invalid Credentials!";
      }  
    })
  };

  incomingfile(event) {
    this.rowData = [];
    this.errorDetails = '';
    this.errorDetails1 = '';
    this.file = event.target.files[0]; 
    this.nonD2zImport();
  };

  nonD2zImport(){
    var worksheet;
    this.errorMsg = null;
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
            
            let articleId = 'articleId';
            let reference_number = 'reference_number';
            let consigneeName = 'consigneeName';
            let address = 'address';
            let suburb = 'suburb';
            let postcode = 'postcode';
            let weight = 'weight';
            let height = 'height';
            let width = 'width';
            let length = 'length';
            let serviceType = 'serviceType';
            let brokerName = 'brokerName';
            let shipmentNumber = 'shipmentNumber';

            for (var nond2zVal in exportData) {
              var nonD2zVal = exportData[nond2zVal];
              if(this.errorMsg == null){
                var nonD2zObj = (
                  nonD2zObj={}, 
                  nonD2zObj[articleId]= nonD2zVal['Tracking Number'] != undefined ? nonD2zVal['Tracking Number'] : '', nonD2zObj,
                  nonD2zObj[reference_number]= nonD2zVal['Reference'] != undefined ? nonD2zVal['Reference'] : '', nonD2zObj,
                  nonD2zObj[consigneeName]= nonD2zVal['Consignee Name'] != undefined ? nonD2zVal['Consignee Name'] : '', nonD2zObj,
                  nonD2zObj[address]= nonD2zVal['Address'] != undefined ? nonD2zVal['Address'] : '', nonD2zObj,
                  nonD2zObj[suburb]= nonD2zVal['Suburb'] != undefined ? nonD2zVal['Suburb'] : '', nonD2zObj,
                  nonD2zObj[postcode]= nonD2zVal['Postcode'] != undefined ? nonD2zVal['Postcode'] : '', nonD2zObj,
                  nonD2zObj[weight]= nonD2zVal['Weight'] != undefined ? nonD2zVal['Weight'] : '', nonD2zObj,
                  nonD2zObj[length]= nonD2zVal['Weight'] != undefined ? nonD2zVal['Length'] : '', nonD2zObj,
                  nonD2zObj[width]= nonD2zVal['Weight'] != undefined ? nonD2zVal['Width'] : '', nonD2zObj,
                  nonD2zObj[height]= nonD2zVal['Weight'] != undefined ? nonD2zVal['Height'] : '', nonD2zObj,
                  nonD2zObj[serviceType]= nonD2zVal['Service Type'] != undefined ? nonD2zVal['Service Type'] : '', nonD2zObj,
                  nonD2zObj[brokerName]= this.brokerUserName, nonD2zObj,
                  nonD2zObj[shipmentNumber]= $("#shipmentNumber").val(), nonD2zObj
                );
              this.nonD2ZList.push(nonD2zObj)
              this.rowData = this.nonD2ZList;
              }
          }
        }
  };

  supplierClear(){
      $("#nonD2zCntrl").val('');
      this.rowData = [];
      this.nonD2ZList = [];
      this.errorMsg = null;
      this.successMsg = null;
  };

  onNonD2zClientChange(){
    this.errorMsg = '';
    this.successMsg = '';
  };

  uploadNonD2zData(){
    this.show = false;
    this.successMsg = '';
    this.errorMsg = '';
    this.errorDetails = '';
    this.errorDetails1 = '';
    var nonD2zData = this.gridOptions.api.getSelectedRows();
    if(nonD2zData.length > 0){
      this.spinner.show();
      this.consigmentUploadService.nonD2zUpload(nonD2zData, (resp) => {
          this.spinner.hide();
          if(resp.error){
            this.errorMsg = resp.error.errorMessage;
            this.errorDetails = resp.error.errorDetails;
            this.errorDetails1 = JSON.stringify(resp.error.errorDetails);
            this.show = true;
            $('#nonD2zModal').modal('show');  
          }else{  
            this.successMsg = resp.message;
            $('#nonD2zModal').modal('show');  
          }
          setTimeout(() => { this.spinner.hide() }, 5000);
        })
    }else{
      this.errorMsg = '**Please select the below records to upload the data';
    }
  };

  downloadErrDetails(){
    var fileName = "Article Id Details";
    var articleIdList = [];
    var articleId = 'articleId';
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      useBom: true,
      headers: ['Article Id']
    }

    for(var articleId in this.errorDetails){
      var articleObj = (
        articleObj={}, 
        articleObj[articleId]= this.errorDetails[articleId], articleObj
      )
      articleIdList.push(articleObj)
    }
    new Angular2Csv(articleIdList, fileName, options);
  };

  onBrokerTypeChange(event){
    this.successMsg = null;
    this.errorMsg = null;
    this.brokerUserName = event.value ? event.value.value : '';
  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
}


