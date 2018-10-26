import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { LoginService } from 'app/d2z/service/login.service';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'hms-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class ZebraFileUpload implements OnInit{
    private gridOptions: GridOptions;
    private autoGroupColumnDef;
    private rowGroupPanelShow;
    private rowData: any[];
    private defaultColDef;
    successMsg: String;
    show: Boolean;
    errorMsg: String;
    errorDetails: any[];
    errorDetails1: String;
    file:File;
    arrayBuffer:any;
    childmenuOne: boolean;
    childmenuTwo:boolean;
    childmenuThree:boolean;
    childmenuFour:boolean;
    childmenuFive:boolean;
    public importList = [];
    FileHeading = ['Reference number', 'Consignee Company', 'Consignee Name', 'Consignee Address', 'Consignee Suburb', 'Consignee State', 'Consignee Postcode',
                   'Consignee Phone', 'Product Description', 'Value', 'Currency', 'Shipped Quantity', 'Weight', 'Dim_X', 'Dim_Y',
                   'Dim_Z', 'Service type', 'Shipper Name', 'Shipper Address', 'Shipper City', 'Shipper State', 'Shipper Postcode',
                   'Shipper Country'];
    constructor(
      public consigmentUploadService: ConsigmentUploadService,
      private spinner: NgxSpinnerService
    ){
      this.successMsg = null;
      this.errorMsg = null;
      this.show = false;
      this.gridOptions = <GridOptions>{rowSelection: "multiple"};
      this.gridOptions.columnDefs = [
        {
          headerName: "Reference number",
          field: "referenceNumber",
          width: 180,
          checkboxSelection: true,
          headerCheckboxSelection: function(params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
        {
          headerName: "Consignee Company",
          field: "consigneeCompany",
          width: 180
        },
        {
          headerName: "Consignee Name",
          field: "consigneeName",
          width: 150
        },
        {
          headerName: "Consignee Address",
          field: "consigneeAddr1",
          width: 200
        },
        {
          headerName: "Consignee Suburb",
          field: "consigneeSuburb",
          width: 150
        },
        {
          headerName: "Consignee State",
          field: "consigneeState",
          width: 150
        },
        {
          headerName: "Consignee Postcode",
          field: "consigneePostcode",
          width: 150
        },
        {
          headerName: "Consignee Phone",
          field: "consigneePhone",
          width: 150
        },
        {
          headerName: "Product Description",
          field: "productDescription",
          width: 160
        },
        {
          headerName: "Value",
          field: "value",
          width: 100
        },
        {
          headerName: "Currency",
          field: "currency",
          width: 100
        },
        {
          headerName: "Shipped Quantity",
          field: "shippedQuantity",
          width: 150
        },
        {
          headerName: "Weight",
          field: "weight",
          width: 100
        },
        {
          headerName: "Dim_X",
          field: "dimensionsLength",
          width: 100
        },
        {
          headerName: "Dim_Y",
          field: "dimensionsWidth",
          width: 100
        },
        {
          headerName: "Dim_Z",
          field: "dimensionsHeight",
          width: 100
        },
        {
          headerName: "Service type",
          field: "serviceType",
          width: 140
        },
        {
          headerName: "Shipper Name",
          field: "shipperName",
          width: 140
        },
        {
          headerName: "Shipper Address",
          field: "shipperAddr1",
          width: 140
        },
        {
          headerName: "Shipper City",
          field: "shipperCity",
          width: 140
        },
        {
          headerName: "Shipper State",
          field: "shipperState",
          width: 140
        },
        {
          headerName: "Shipper Postcode",
          field: "shipperPostcode",
          width: 160
        },
        {
          headerName: "Shipper Country",
          field: "shipperCountry",
          width: 140
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
    
    zibraExport() {
      var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      fileReader.readAsArrayBuffer(this.file);
        let referenceNumber = 'referenceNumber';
        let consigneeName = 'consigneeName';
        let consigneeAddr1 = 'consigneeAddr1';
        let consigneeSuburb = 'consigneeSuburb';
        let consigneeState = 'consigneeState';
        let consigneePostcode = 'consigneePostcode';
        let consigneePhone = 'consigneePhone';
        let productDescription = 'productDescription';
        let value = 'value';
        let shippedQuantity = 'shippedQuantity';
        let weight = 'weight';
        let dimensionsLength = 'dimensionsLength';
        let dimensionsWidth = 'dimensionsWidth';
        let dimensionsHeight = 'dimensionsHeight';
        let serviceType = 'serviceType';
        let deliveryType = 'deliveryType';
        let shipperName = 'shipperName';
        let shipperAddr1 = 'shipperAddr1';
        let shipperCity = 'shipperCity';
        let shipperState = 'shipperState';
        let shipperPostcode = 'shipperPostcode';
        let shipperCountry = 'shipperCountry';
        let fileName = 'fileName';
        let currency = 'currency';
        let consigneeCompany = 'consigneeCompany';

        var today = new Date();
        var day = today.getDate() + "";
        var month = (today.getMonth() + 1) + "";
        var year = today.getFullYear() + "";
        var hour = today.getHours() + "";
        var minutes = today.getMinutes() + "";
        var seconds = today.getSeconds() + "";

        day = checkZero(day);
        month = checkZero(month);
        year = checkZero(year);
        hour = checkZero(hour);
        minutes = checkZero(minutes);
        seconds = checkZero(seconds);

        function checkZero(data){
          if(data.length == 1){
            data = "0" + data;
          }
          return data;
        }
        var dateString = year+month+day+"-"+hour+minutes+seconds;

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
                  this.errorMsg = "***Invalid file format, Please check the field in given files"+ 
                  newLine + "Allowed fields are [ Reference number, Consignee Company, Consignee Name, Consignee Address, Consignee Suburb, Consignee State, Consignee Postcode"+
                  newLine + "Consignee Phone, Product Description, Value, Currency, Shipped Quantity, Weight, Dim_X, Dim_Y"+
                  newLine + "Dim_Z, Service type, Shipper Name, Shipper Address, Shipper City, Shipper State, Shipper Postcode',Shipper Country ]";
                  break;
                }
              }

              if(this.errorMsg == null){
                var importObj = (
                  importObj={}, 
                  importObj[referenceNumber]= dataObj['Reference number'] != undefined ? dataObj['Reference number'] : '', importObj,
                  importObj[consigneeCompany]= dataObj['Consignee Company'] != undefined ? dataObj['Consignee Company'] : '', importObj,
                  importObj[consigneeName]= dataObj['Consignee Name'] != undefined ? dataObj['Consignee Name'] : '', importObj,
                  importObj[consigneeAddr1]= dataObj['Consignee Address'] != undefined ? dataObj['Consignee Address'] : '', importObj,
                  importObj[consigneeSuburb]= dataObj['Consignee Suburb'] != undefined ? dataObj['Consignee Suburb'] : '', importObj,
                  importObj[consigneeState]= dataObj['Consignee State'] != undefined ? dataObj['Consignee State'] : '',  importObj,
                  importObj[consigneePostcode]= dataObj['Consignee Postcode'] != undefined ? dataObj['Consignee Postcode'] : '', importObj,
                  importObj[consigneePhone]= dataObj['Consignee Phone'] != undefined ? dataObj['Consignee Phone'] : '', importObj,
                  importObj[productDescription]= dataObj['Product Description'] != undefined ? dataObj['Product Description'] : '',  importObj,
                  importObj[value]= dataObj['Value'] != undefined ? parseInt(dataObj['Value']) : '', importObj,
                  importObj[currency]= dataObj['Currency'] != undefined ? dataObj['Currency'] : '', importObj,
                  importObj[shippedQuantity]= dataObj['Shipped Quantity'] != undefined ? parseInt(dataObj['Shipped Quantity']) : '', importObj,
                  importObj[weight]= dataObj['Weight'] != undefined ? dataObj['Weight'] : '',  importObj,
                  importObj[dimensionsLength]= dataObj['Dim_X'] != undefined ? parseInt(dataObj['Dim_X']) : '',  importObj,
                  importObj[dimensionsWidth]= dataObj['Dim_Y'] != undefined ? parseInt(dataObj['Dim_Y']) : '', importObj,
                  importObj[dimensionsHeight]= dataObj['Dim_Z'] != undefined ? parseInt(dataObj['Dim_Z']) : '', importObj,
                  importObj[serviceType]= dataObj['Service type'] != undefined ? dataObj['Service type'] : '',  importObj,
                  importObj[shipperName]= dataObj['Shipper Name'] != undefined ? dataObj['Shipper Name'] : '', importObj,
                  importObj[shipperAddr1]= dataObj['Shipper Address'] != undefined ? dataObj['Shipper Address'] : '',  importObj,
                  importObj[shipperCity]= dataObj['Shipper City'] != undefined ? dataObj['Shipper City'] : '', importObj,
                  importObj[shipperState]= dataObj['Shipper State'] != undefined ? dataObj['Shipper State'] : '', importObj,
                  importObj[shipperPostcode]= dataObj['Shipper Postcode'] != undefined ? dataObj['Shipper Postcode'] : '',  importObj,
                  importObj[shipperCountry]= dataObj['Shipper Country'] != undefined ? dataObj['Shipper Country'] : '',  importObj,
                  importObj[fileName]= this.file.name+'-'+dateString, importObj
              );
              this.importList.push(importObj)
              this.rowData = this.importList;
              }
          }
        }
    }

    zibraUpload(){
      var selectedRows = this.gridOptions.api.getSelectedRows();
      this.errorMsg = '';
      this.successMsg = '';
      this.errorDetails1 = '';
      if(selectedRows.length > 0){
        this.spinner.show();
        this.consigmentUploadService.consigmentFileUpload(selectedRows, (resp) => {
          this.spinner.hide();
          if(!resp.error){
            this.successMsg = 'File data upload successfully to D2Z System';
            this.show = false;
            $('#fileUploadModal').modal('show');
          }else{  
            this.errorMsg = resp.error.errorMessage;
            this.errorDetails = resp.error.errorDetails;
            this.errorDetails1 = JSON.stringify(resp.error.errorDetails);
            this.show = true;
            $('#fileUploadModal').modal('show');
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        })
      }else{
         this.errorMsg = "**Please select the below records to upload the file into D2Z system";
      }
    }

    downLoad(){
      var fileName = "Error Details";
      var options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        useBom: true,
        headers: ['Reference Number']
      };
    var refernceNumberList = [];
    let referenceNumber = 'referenceNumber';
    for(var refNum in this.errorDetails){
      var importObj = (
        importObj={}, 
        importObj[referenceNumber]= this.errorDetails[refNum], importObj
      )
      refernceNumberList.push(importObj)
    }

     new Angular2Csv(refernceNumberList, fileName, options);
    }

    ngOnInit() {
      this.childmenuOne = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
    }
  
    toggle(arrow) {
      this.childmenuOne = !this.childmenuOne;
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
      this.childmenuOne = !this.childmenuOne;
      if (arrow.className === 'nav-md') {
        arrow.className = '';
        arrow.className = 'nav-sm';
      }
      else {
        arrow.className = '';
        arrow.className = 'nav-md';
      }
    }

    incomingfile(event) {
      this.rowData = [];
      this.file = event.target.files[0]; 
      this.zibraExport();
    }

    onSelectionChange() {
      this.errorMsg = '';
      this.successMsg = '';
      var selectedRows = this.gridOptions.api.getSelectedRows();
    }
 
}
