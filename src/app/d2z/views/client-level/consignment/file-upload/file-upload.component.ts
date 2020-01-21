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
    showSuccess: Boolean;
    stsFlag: Boolean;
    errorMsg: String;
    userMessage: userMessage;
    errorDetails: any[];
    successReferenceNumber: any[];
    errorDetails1: String;
    file:File;
    system:String;
    arrayBuffer:any;
    exportTypeDropdown: dropdownTemplate[];  
    selectedExportType: dropdownTemplate;
    public importList = [];
    englishFlag:boolean;
    chinessFlag:boolean;
    carrierType: String;
    serviceType: String;
    FileHeading = ['Reference number', 'Consignee Name', 'Consignee Address 1', 'Consignee Suburb', 
    'Consignee State', 'Consignee Postcode',
    'Product Description', 'Value', 'Weight', 'Service type'];
    constructor(
      public consigmentUploadService: ConsigmentUploadService,
      private spinner: NgxSpinnerService,
      private router: Router,
      private _compiler: Compiler
    ){
      this.successMsg = null;
      this.errorMsg = null;
      this._compiler.clearCache();
      this.show = false;
      this.showSuccess = false;
      this.stsFlag = false;
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
      this.userMessage = this.consigmentUploadService.userMessage;
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.exportTypeDropdown = [
        { "name": "eParcel", "value": "eParcel" },
        { "name": "Express", "value": "Express" },
        { "name": "Fastway", "value": "fastway" }
       /** { "name": "Multi Carrier", "value": "multiCarrier" },
        { "name": "AuPost", "value":"aupost"} */
      ];
      this.selectedExportType = this.exportTypeDropdown[0];
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      if(this.englishFlag){
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
          },
          {
            headerName: "SKU",
            field: "sku",
            width: 100
          },
          {
            headerName: "Label Sender Name",
            field: "labelSenderName",
            width: 180
          },
          {
            headerName: "Delivery Instructions",
            field: "deliveryInstructions",
            width: 180
          }
        ]   
      }
      if(this.chinessFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "参考编号",
            field: "referenceNumber",
            width: 180,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "收货人公司",
            field: "consigneeCompany",
            width: 180
          },
          {
            headerName: "收货人姓名 ",
            field: "consigneeName",
            width: 150
          },
          {
            headerName: "收货人地址",
            field: "consigneeAddr1",
            width: 200
          },
          {
            headerName: "收件人区",
            field: "consigneeSuburb",
            width: 150
          },
          {
            headerName: "收货人国",
            field: "consigneeState",
            width: 150
          },
          {
            headerName: "收货人邮政编码",
            field: "consigneePostcode",
            width: 150
          },
          {
            headerName: "收货人电话",
            field: "consigneePhone",
            width: 150
          },
          {
            headerName: "产品描述",
            field: "productDescription",
            width: 160
          },
          {
            headerName: "货物价值",
            field: "value",
            width: 100
          },
          {
            headerName: "货币",
            field: "currency",
            width: 100
          },
          {
            headerName: "装运数量",
            field: "shippedQuantity",
            width: 150
          },
          {
            headerName: "重量",
            field: "weight",
            width: 100
          },
          {
            headerName: "尺寸X",
            field: "dimensionsLength",
            width: 100
          },
          {
            headerName: "尺寸Y",
            field: "dimensionsWidth",
            width: 100
          },
          {
            headerName: "尺寸Z",
            field: "dimensionsHeight",
            width: 100
          },
          {
            headerName: "服务类型",
            field: "serviceType",
            width: 140
          },
          {
            headerName: "托运人姓名",
            field: "shipperName",
            width: 140
          },
          {
            headerName: "托运人地址",
            field: "shipperAddr1",
            width: 140
          },
          {
            headerName: "托运人城市",
            field: "shipperCity",
            width: 140
          },
          {
            headerName: "托运人国家",
            field: "shipperState",
            width: 140
          },
          {
            headerName: "托运人邮政编码",
            field: "shipperPostcode",
            width: 160
          },
          {
            headerName: "托运人国家",
            field: "shipperCountry",
            width: 140
          },
          {
            headerName: "SKU",
            field: "sku",
            width: 100
          },
          {
            headerName: "标签发件人名称",
            field: "labelSenderName",
            width: 180
          },
          {
            headerName: "交货说明",
            field: "deliveryInstructions",
            width: 180
          }
        ] 
      }
    };
    
    fileExport() {
      var worksheet;
      this.errorMsg = null;
      let fileReader = new FileReader();
      this.importList= [];
      fileReader.readAsArrayBuffer(this.file);
        let referenceNumber = 'referenceNumber';
        let consigneeName = 'consigneeName';
        let consigneeAddr1 = 'consigneeAddr1';
        let consigneeAddr2 = 'consigneeAddr2';
        let consigneeEmail = 'consigneeEmail';
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
        let userID = 'userID';
        let userName = 'userName';
        let sku = 'sku';
        let labelSenderName = 'labelSenderName';
        let deliveryInstructions = 'deliveryInstructions';
        let carrier = 'carrier'

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
        var dateString = year+month+day+hour+minutes+seconds;

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
            var referencenumber;
            var cname;
            var cadd;
            var cstate;
            var csub;
            var cpostcode;
            var pd;
            var valu;
            var servi;
            var we;
            for (var importVal in exportData) {
              var dataObj = exportData[importVal];
              for(var keyVal in dataObj){
                var newLine = "\r\n"

              if(keyVal === 'Reference number' || keyVal ==='Referencenumber' || keyVal ==='referencenumber' || keyVal === 'reference number' ){
               referencenumber = keyVal; 
              }else if(keyVal ==='Consignee Name'|| keyVal ==='ConsigneeName' || keyVal ==='consigneename'|| keyVal ==='consignee name'){
                cname = keyVal;
              }else if(keyVal === 'Consignee Address 1'|| keyVal ==='ConsigneeAddress1' || keyVal === 'consignee address 1'|| keyVal === 'consigneeaddress1'){
               cadd = keyVal;
              }else if(keyVal === 'Consignee Suburb'|| keyVal ==='consignee suburb'|| keyVal ==='ConsigneeSuburb' || keyVal ==='consigneesuburb'){
               csub = keyVal;
              }else if(keyVal ==='Consignee State' || keyVal ==='ConsigneeState'|| keyVal ==='consigneestate'|| keyVal ==='consignee state' ){
                cstate = keyVal;
              }else if(keyVal === 'Consignee Postcode' || keyVal === 'ConsigneePostcode'|| keyVal === 'consigneepostcode'|| keyVal === 'consignee postcode'){
               cpostcode =keyVal;
              }else if(keyVal === 'Product Description'|| keyVal === 'product description'|| keyVal === 'ProductDescription'|| keyVal === 'productdescription'){
               pd = keyVal;
              }else if(keyVal === 'Value'|| keyVal === 'value'){
               valu = keyVal;
              }else if(keyVal === 'Weight'|| keyVal === 'weight'){
                console.log("in weight");
                we = keyVal;
              }else if(keyVal === 'Service type'|| keyVal === 'service type'|| keyVal === 'servicetype'|| keyVal === 'Servicetype'){
               servi = keyVal;
              }

                //if(!this.FileHeading.includes(keyVal)){
                  // this.errorMsg = "***Invalid file format, Please check the field in given files"+ 
                  // newLine + "Allowed fields are [ Reference number, Consignee Company, Consignee Name, Consignee Address 1, Consignee Suburb, Consignee State, Consignee Postcode"+
                  // newLine + "Consignee Phone, Product Description, Value, Currency, Shipped Quantity, Weight, Dim_X, Dim_Y"+
                  // newLine + "Dim_Z, Service type, Shipper Name, Shipper Address, Shipper City, Shipper State, Shipper Postcode',Shipper Country ]";
                  // break;

                //   this.errorMsg = "***Invalid file format, Please check the field in given files"+ 
                //   newLine + "Allowed fields are [ Reference number,Consignee Name, Consignee Address 1, Consignee Suburb, Consignee State, Consignee Postcode,"+
                //   newLine + "Product Description, Value, Weight"+
                //   newLine + " Service type]";
                //   break;
                // }
              }

              if(!dataObj['Reference number'] && !dataObj['Referencenumber'] && !dataObj['referencenumber'] && !dataObj['reference number'] ){
                this.errorMsg = "Reference Number is mandatory";
              }else if(!dataObj['Consignee Name'] && !dataObj['ConsigneeName'] && !dataObj['consigneename'] && !dataObj['consignee name']){
                this.errorMsg = "Consignee Name is mandatory";
              }else if(!dataObj['Consignee Address 1'] && !dataObj['ConsigneeAddress1'] && !dataObj['consignee address 1'] && !dataObj['consigneeaddress1']){
                this.errorMsg = "Consignee Address 1 is mandatory";
              }else if(!dataObj['Consignee Suburb'] && !dataObj['consignee suburb'] && !dataObj['ConsigneeSuburb'] &&!dataObj['consigneesuburb']){
                this.errorMsg = 'Consignee Suburb is mandatory';
              }else if(!dataObj['Consignee State'] && !dataObj['ConsigneeState'] && !dataObj['consigneestate'] && !dataObj['consignee state']  ){
                this.errorMsg = 'Consignee State is mandatory';
              }else if(!dataObj['Consignee Postcode'] && !dataObj['ConsigneePostcode'] && !dataObj['consigneepostcode'] && !dataObj['consignee postcode']){
                this.errorMsg = 'Consignee Postcode is mandatory';
              }else if(!dataObj['Product Description'] && !dataObj['product description'] && !dataObj['ProductDescription']
              && !dataObj['productdescription']){
                this.errorMsg = 'Product Description is mandatory';
              }else if(!dataObj['Value'] && !dataObj['value']){
                this.errorMsg = 'Value is mandatory';
              }else if(!dataObj['Weight'] && !dataObj['weight']){
                this.errorMsg = 'Weight is mandatory';
              }else if(!dataObj['Service type'] && !dataObj['service type'] && !dataObj['servicetype'] && !!dataObj['Servicetype']){
                this.errorMsg = 'Service type is mandatory';
              }

              if(this.errorMsg == null){
                var importObj = (
                  importObj={}, 
                  importObj[referenceNumber]= dataObj[referencenumber] != undefined ? dataObj[referencenumber] : '', importObj,
                  importObj[consigneeCompany]= dataObj['Consignee Company'] != undefined ? dataObj['Consignee Company'] : '', importObj,
                  importObj[consigneeName]= dataObj[cname] != undefined ? dataObj[cname] : '', importObj,
                  importObj[consigneeAddr1]= dataObj[cadd] != undefined ? dataObj[cadd] : '', importObj,
                  importObj[consigneeAddr2]= dataObj['Consignee Address 2'] != undefined ? dataObj['Consignee Address 2'] : '',  importObj,
                  importObj[consigneeEmail]= dataObj['Consignee Email'] != undefined ? dataObj['Consignee Email'] : '',  importObj,
                  importObj[consigneeSuburb]= dataObj[csub] != undefined ? dataObj[csub] : '', importObj,
                  importObj[consigneeState]= dataObj[cstate] != undefined ? dataObj[cstate] : '',  importObj,
                  importObj[consigneePostcode]= dataObj[cpostcode] != undefined ? dataObj[cpostcode] : '', importObj,
                  importObj[consigneePhone]= dataObj['Consignee Phone'] != undefined ? dataObj['Consignee Phone'] : '', importObj,
                  importObj[productDescription]= dataObj[pd] != undefined ? dataObj[pd] : '',  importObj,
                  importObj[value]= dataObj[valu] != undefined ? parseInt(dataObj[valu]) : '', importObj,
                  importObj[currency]= dataObj['Currency'] != undefined ? dataObj['Currency'] : 'AUD', importObj,
                  importObj[shippedQuantity]= dataObj['Shipped Quantity'] != undefined ? parseInt(dataObj['Shipped Quantity']) : 1, importObj,
                  importObj[weight]= dataObj[we] != undefined ? dataObj[we] : '',  importObj,
                  importObj[dimensionsLength]= dataObj['Dim_X'] != undefined ? parseInt(dataObj['Dim_X']) : '',  importObj,
                  importObj[dimensionsWidth]= dataObj['Dim_Y'] != undefined ? parseInt(dataObj['Dim_Y']) : '', importObj,
                  importObj[dimensionsHeight]= dataObj['Dim_Z'] != undefined ? parseInt(dataObj['Dim_Z']) : '', importObj,
                  importObj[serviceType]= dataObj[servi] != undefined ? dataObj[servi] : '',  importObj,
                  importObj[shipperName]= dataObj['Shipper Name'] != undefined ? dataObj['Shipper Name'] : '', importObj,
                  importObj[shipperAddr1]= dataObj['Shipper Address'] != undefined ? dataObj['Shipper Address'] : '',  importObj,
                  importObj[shipperCity]= dataObj['Shipper City'] != undefined ? dataObj['Shipper City'] : '', importObj,
                  importObj[shipperState]= dataObj['Shipper State'] != undefined ? dataObj['Shipper State'] : '', importObj,
                  importObj[shipperPostcode]= dataObj['Shipper Postcode'] != undefined ? dataObj['Shipper Postcode'] : '',  importObj,
                  importObj[shipperCountry]= dataObj['Shipper Country'] != undefined ? dataObj['Shipper Country'] : '',  importObj,
                  importObj[sku]= dataObj['SKU'] != undefined ? dataObj['SKU'] : '',  importObj,
                  importObj[labelSenderName]= dataObj['Label Sender Name'] != undefined ? dataObj['Label Sender Name'] : '',  importObj,
                  importObj[deliveryInstructions]= dataObj['Delivery Instructions'] != undefined ? dataObj['Delivery Instructions'] : '',  importObj,
                  importObj[fileName]= this.file.name+'-'+dateString, importObj,
                  importObj[userID]= this.consigmentUploadService.userMessage.user_id, importObj,
                  importObj[userName]= this.consigmentUploadService.userMessage.userName, importObj,
                  importObj[carrier]= this.carrierType ? this.carrierType : '',  importObj
              );
              //if(importObj.consigneeAddr1.length > 50){
                //this.errorMsg = 'Consginee Address 1 should not contain more than 50 character';
                //break;
              //}else if(importObj.consigneeAddr2.length > 50){
                //this.errorMsg = 'Consginee Address 2 should not contain more than 50 character';
                //break;
              //}
              console.log(importObj);
              this.importList.push(importObj);
              this.serviceType = this.importList[0].serviceType;
              this.rowData = this.importList;
              }
          }
        }
    };

    fileUpload(){
      var selectedRows = this.gridOptions.api.getSelectedRows();
      for(var i = 0; i != selectedRows.length; ++i){
        selectedRows[i].carrier = this.carrierType;
      }
      this.errorMsg = null;
      this.successMsg = '';
      this.errorDetails1 = '';
      this.showSuccess = false;
      this.show = false;
      var fastwayArray = ["FWS","FWM","FW"];
      var multiCarrierArray = ["MCM","MCM1","MCM2","MCM3","MCS"];
      var nonEparcel = ["MCM","MCM1","MCM2","MCM3","MCS","FWS","FWM","1PME"];
      var aupostArray = ["1PME","1PM"]
      
      for(var k = 0; k != selectedRows.length; ++k){
        if(selectedRows[k].carrier == 'eParcel'){
          if(nonEparcel.includes(selectedRows[k].serviceType)){
            this.errorMsg = this.englishFlag ? "**Invalid service Type for selected Carrier Type" : "**所选运营商类型的服务类型无效";
            break;
          }
        }else if(selectedRows[k].carrier == 'Express'){
          if(selectedRows[k].serviceType != '1PME' || selectedRows[k].serviceType != '1PSE'){
            this.errorMsg = this.englishFlag ? "**Invalid service Type for selected Carrier Type" : "**所选运营商类型的服务类型无效";
            break;
          }
        }else if(selectedRows[k].carrier == 'fastway'){
          console.log(fastwayArray.includes(selectedRows[k].serviceType))
          if( !fastwayArray.includes(selectedRows[k].serviceType)){
            this.errorMsg = this.englishFlag ? "**Invalid service Type for selected Carrier Type" : "**所选运营商类型的服务类型无效";
            break;
          }
        }else if(selectedRows[k].carrier == 'multiCarrier'){
          console.log(multiCarrierArray.includes(selectedRows[k].serviceType));
          if(!multiCarrierArray.includes(selectedRows[k].serviceType)){
            this.errorMsg = this.englishFlag ? "**Invalid service Type for selected Carrier Type" : "**所选运营商类型的服务类型无效";
            break;
          }
        }else if(selectedRows[k].carrier == 'aupost'){
          console.log(aupostArray.includes(selectedRows[k].serviceType));
          if(!aupostArray.includes(selectedRows[k].serviceType)){
            this.errorMsg = this.englishFlag ? "**Invalid service Type for selected Carrier Type" : "**所选运营商类型的服务类型无效";
            break;
          }
        }
      }

      if(!this.carrierType){
        this.errorMsg = this.englishFlag ? "**Please select the Carrier Type to upload the records" : "**请选择运营商类型以上传记录" ;
      }else if(selectedRows.length == 0){
        this.errorMsg = this.englishFlag ? "**Please select the below records to upload the file into system" : "**请选择以下记录将文件上传到D2Z系统" ;
      }

      if(selectedRows.length > 0 && this.errorMsg == null){
        this.spinner.show();
        this.consigmentUploadService.consigmentFileUpload(selectedRows, (resp) => {
        this.spinner.hide();
        if(resp.error){
            this.errorMsg = resp.error.errorMessage;
            this.errorDetails = resp.error.errorDetails;
            this.errorDetails1 = JSON.stringify(resp.error.errorDetails);
            this.show = true;
            $('#fileUploadModal').modal('show');  
          }else{  
            for (var data in resp) {
              var dataObj = resp[data];
                if(dataObj.message != null){
                  this.stsFlag = true;
                }else{
                  this.stsFlag = false;
                }
            }

            if(!this.stsFlag){
              this.successMsg = this.englishFlag ? 'File data uploaded successfully to System' : '文件数据成功上传到D2Z系统';
              this.successReferenceNumber = resp;
              this.showSuccess = true;
              $('#fileUploadModal').modal('show');
            }else{
              this.successMsg = this.englishFlag ? 'Having Issue with Uploaing File' : '文件数据成功上传到D2Z系统';
              this.successReferenceNumber = resp;
              this.showSuccess = true;
              $('#fileUploadModal').modal('show');
            }
          }
          setTimeout(() => { this.spinner.hide() }, 5000);
        });
      }
    };

    clearUpload(){
      $("#congFileControl").val('');
      this.rowData = [];
      this.importList = [];
      this.errorMsg = null;
      this.successMsg = null;
    };

    downLoad(){
      var fileName = "Reference Number Details";
      if(!this.showSuccess){
        if(this.errorMsg == 'Invalid Service Type'){
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: ['Reference Number', 'Service Type']
          }
        }else if(this.errorMsg == 'Invalid Consignee Postcode or Consignee Suburb or Consiggnee State'){
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: ['Reference Number', 'Suburb', 'PostCode', 'State']
          }
        }else if(this.errorMsg == 'Reference Number must be unique'){
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: ['Reference Number']
          }
      }else if(this.errorMsg = 'VALIDATION FAILED'){
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: ['Reference Number']
          }
      }else{
         var options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          useBom: true,
          headers: ['Reference Number']
        }
      }
    }else{
        if(!this.stsFlag){
            var options = { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.',
              showLabels: true, 
              useBom: true,
              headers: ['Reference Number', 'BarCode Label Number']
            }
        }else{
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: ['Message']
          }
        }
    }
      
      var refernceNumberList = [];
      let referenceNumber = 'referenceNumber';
      let serviceType = 'serviceType';
      let postCode = 'postCode';
      let suburb = 'suburb';
      let state = 'state';
      let barCodeNumber = 'barCodeNumber';
      let errorMsg = 'errorMsg';
      if(!this.showSuccess) {
        for(var refNum in this.errorDetails){
          var a = this.errorDetails[refNum].split("-") // Delimiter is a string
            for (var i = 0; i < a.length; i++){
              if(this.errorMsg == 'Invalid Service Type'){
                  var importObj = (
                    importObj={}, 
                    importObj[referenceNumber]= a[0], importObj,
                    importObj[serviceType]= a[1], importObj
                  )
               }else if(this.errorMsg == 'Invalid Consignee Postcode or Consignee Suburb or Consiggnee State'){
                  var importObj = (
                    importObj={}, 
                    importObj[referenceNumber]= a[0], importObj,
                    importObj[suburb]= a[1], importObj,
                    importObj[postCode]= a[2], importObj,
                    importObj[state] = a[3], importObj
                  )
               }else if(this.errorMsg == 'Reference Number must be unique'){
                var importObj = (
                    importObj={}, 
                    importObj[referenceNumber]= a[0], importObj
                  )
               }else if(this.errorMsg == 'VALIDATION FAILED'){
                  var importObj = (
                    importObj={}, 
                    importObj[referenceNumber]= a[0], importObj
                  )
               }
              }
            refernceNumberList.push(importObj)
          }
      }else{
        if(!this.stsFlag){
          for(var refNum in this.successReferenceNumber){
            var importObj = (
                importObj={}, 
                importObj[referenceNumber]= this.successReferenceNumber[refNum].referenceNumber, importObj,
                importObj[barCodeNumber]= this.successReferenceNumber[refNum].barcodeLabelNumber ? this.successReferenceNumber[refNum].barcodeLabelNumber : '', importObj
            )
            refernceNumberList.push(importObj);
          }
        }else if(this.stsFlag){
          console.log(this.successReferenceNumber)
          for(var refNum in this.successReferenceNumber){
            var importObj = (
                importObj={}, 
                importObj[errorMsg]= this.successReferenceNumber[refNum].message, importObj
            )
            refernceNumberList.push(importObj);
          }
        }
      }
      new Angular2Csv(refernceNumberList, fileName, options);
    };

    incomingfile(event) {
      this.rowData = [];
      this.file = event.target.files[0]; 
      this.fileExport();
    };

    onSelectionChange() {
      this.errorMsg = '';
      this.successMsg = '';
      var selectedRows = this.gridOptions.api.getSelectedRows();
    };

    onCarrierChange(event){
      this.carrierType = event.value ? event.value.value : '';
    };
};

export interface userMessage {
  contactName,
  address,
  suburb,
  state,
  postCode,
  country,
  emailAddress,
  userName,
  serviceType,
  contactPhoneNumber,
  role_Id,
  companyName,
  user_id
}
