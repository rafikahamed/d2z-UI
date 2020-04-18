import { Component, Compiler, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridOptions } from "ag-grid";
import * as XLSX from 'xlsx';

@Component({
  selector: 'hms-broker-returns-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})

export class BrokerReturnsActionComponent implements OnInit{
  
  private actionReturnsArray: Array<any> = [];
  errorMsg: string;
  successMsg: String;
  errorModal: String;
  showGrid: boolean;
  public resendReferNumber: any[];
  public returnsAction: any[];
  user_Id: String;
  exportCall: boolean;
  nonExportCall: boolean;
  system: String;
  fileExists: String;
  file:File;
  arrayBuffer:any;
  actionType: City[];
  public openEnquiryList = [];
  public importList = [];
  public resendData = [];
  public actionData = [];
  public nonResendData = [];
  private gridOptionsAction: GridOptions;
    private autoGroupColumnDef;
    private rowGroupPanelShow;
    private rowData: any[];
    private defaultColDef;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();  
    this.showGrid = false;
    this.exportCall = false;
    this.nonExportCall = false;
    this.gridOptionsAction = <GridOptions>{rowSelection: "multiple"};
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

  fetchReturnActionData(){
    this.consigmentUploadService.fetchUserId(this.user_Id, (resp) => {
        var userIds = [];
        this.spinner.hide();
        userIds.push(resp);
        userIds.push(this.user_Id);
        this.spinner.show();
        this.consigmentUploadService.fetchOutstandingReturns( null, null, userIds.toString(), (resp) => {
          this.spinner.hide();
          this.actionReturnsArray = resp;
          setTimeout(() => {
            this.spinner.hide() 
          }, 5000);
        })
    })
  };

  ngOnInit() {
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      this.actionType  = [
        {"name":"Resend","value":"resend"},
        {"name":"Destroy","value":"destroy"},
        {"name":"Export","value":"export"}
      ];
      this.spinner.show();
      this.fetchReturnActionData();
      this.gridOptionsAction.columnDefs = [
        {
          headerName: "Reference number",
          field: "referenceNumber"
        },
        {
          headerName: "Consignee Company",
          field: "consigneeCompany"
        },
        {
          headerName: "Consignee Name",
          field: "consigneeName"
        },
        {
          headerName: "Consignee Address",
          field: "consigneeAddr1"
        },
        {
          headerName: "Consignee Suburb",
          field: "consigneeSuburb"
        },
        {
          headerName: "Consignee State",
          field: "consigneeState"
        },
        {
          headerName: "Consignee Postcode",
          field: "consigneePostcode"
        },
        {
          headerName: "Consignee Phone",
          field: "consigneePhone"
        },
        {
          headerName: "Product Description",
          field: "productDescription"
        },
        {
          headerName: "Value",
          field: "value"
        },
        {
          headerName: "Currency",
          field: "currency"
        },
        {
          headerName: "Shipped Quantity",
          field: "shippedQuantity"
        },
        {
          headerName: "Weight",
          field: "weight"
        },
        {
          headerName: "Dim_X",
          field: "dimensionsLength"
        },
        {
          headerName: "Dim_Y",
          field: "dimensionsWidth"
        },
        {
          headerName: "Dim_Z",
          field: "dimensionsHeight"
        },
        {
          headerName: "Service type",
          field: "serviceType"
        },
        {
          headerName: "Shipper Name",
          field: "shipperName"
        },
        {
          headerName: "Shipper Address",
          field: "shipperAddr1"
        },
        {
          headerName: "Shipper City",
          field: "shipperCity"
        },
        {
          headerName: "Shipper State",
          field: "shipperState"
        },
        {
          headerName: "Shipper Postcode",
          field: "shipperPostcode"
        },
        {
          headerName: "Shipper Country",
          field: "shipperCountry"
        },
        {
          headerName: "SKU",
          field: "sku"
        },
        {
          headerName: "Label Sender Name",
          field: "labelSenderName"
        },
        {
          headerName: "Delivery Instructions",
          field: "deliveryInstructions"
        }
      ]   
  };

  onActionTypeChange(){};

  UpdateAction(){
    this.exportCall= false;
    this.resendReferNumber = [];
    this.resendData = [];
    this.nonResendData = [];
    this.actionData = [];
    var that = this;
    this.actionReturnsArray.forEach(function(item){
        if(item.actionType && item.actionType.value == 'resend' && item.selection){
          that.resendReferNumber.push(item.referenceNumber);
          that.exportCall= true;
          that.resendData.push(item);
        }else if(item.selection){
          that.nonResendData.push(item);
        }
    });

    if(that.exportCall){
      if(that.resendReferNumber.length === 1){
        that.errorMsg = null;
        $('#returnAction').modal('show');
      }else if(that.resendReferNumber.length > 1){
        that.errorMsg = '**Only one item is allowed to resend';
      }
    }else{
      console.log(that.nonResendData);
      that.returnsAction = [];
      if(that.nonResendData.length == 0){
        that.errorMsg = '**Atleast one item its required to perform Action';
      }else{ 
        that.nonResendData.forEach(function(item){
          if(item.actionType && item.actionType.value){
              that.nonExportCall = true;
            }else{
              that.errorMsg = '**Action Type cannot be Empty';
              that.nonExportCall = false;
            }
       });
     }
  
     // Making an Action returns API Call
     if(that.nonExportCall){
        that.errorMsg = null;
        let articleId = 'articleId';
        let brokerName = 'brokerName';
        let referenceNumber = 'referenceNumber';
        let action = 'action';
        let resendRefNumber = 'resendRefNumber';

        for (var actionVal in that.nonResendData) {
          var fieldObj = that.nonResendData[actionVal];
          var actionObj = (
              actionObj={}, 
              actionObj[articleId]= fieldObj.articleId != undefined ? fieldObj.articleId : '', actionObj,
              actionObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName: '', actionObj,
              actionObj[referenceNumber]= fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber:'', actionObj,
              actionObj[action]= fieldObj.actionType != undefined ? fieldObj.actionType.value: '',actionObj,
              actionObj[resendRefNumber]= fieldObj.actionType.value == 'resend' ? fieldObj.resendRefNumber : null,  actionObj
          );
          that.returnsAction.push(actionObj);
        }
        console.log("Non Returns Array--->")
        console.log(that.returnsAction)
        if(that.returnsAction.length > 0){
          this.spinner.show();
            this.consigmentUploadService.updateAction(this.returnsAction, (resp) => {
              this.spinner.hide();
              if(resp.error){
              }else{
                this.returnsAction = [];
                this.successMsg= resp.message;
                $('#action').modal('show');
                this.fetchReturnActionData();
              }
            });
        }
     }
    }
   
  };

  clearUpload(){
    $("#congFileControl").val('');
    this.rowData = [];
    this.importList = [];
    this.errorMsg = null;
    this.successMsg = null;
    this.errorModal = null;
  };

  actionFile(event){
    this.fileExists = event.target.files[0]; 
    this.file = event.target.files[0];
      if(this.fileExists){
        this.showGrid = true;
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
  
          day = this.checkZero(day);
          month = this.checkZero(month);
          year = this.checkZero(year);
          hour = this.checkZero(hour);
          minutes = this.checkZero(minutes);
          seconds = this.checkZero(seconds);
  
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
              for (var importVal in exportData) {
                var dataObj = exportData[importVal];
                if(!dataObj['Reference number']){
                  this.errorMsg = "Reference Number is mandatory";
                }else if(!dataObj['Consignee Name']){
                  this.errorMsg = "Consignee Name is mandatory";
                }else if(!dataObj['Consignee Address 1']){
                  this.errorMsg = "Consignee Address 1 is mandatory";
                }else if(!dataObj['Consignee Suburb']){
                  this.errorMsg = 'Consignee Suburb is mandatory';
                }else if(!dataObj['Consignee State']){
                  this.errorMsg = 'Consignee State is mandatory';
                }else if(!dataObj['Consignee Postcode']){
                  this.errorMsg = 'Consignee Postcode is mandatory';
                }else if(!dataObj['Product Description']){
                  this.errorMsg = 'Product Description is mandatory';
                }else if(!dataObj['Value']){
                  this.errorMsg = 'Value is mandatory';
                }else if(!dataObj['Weight']){
                  this.errorMsg = 'Weight is mandatory';
                }else if(!dataObj['Service type']){
                  this.errorMsg = 'Service type is mandatory';
                }
  
                if(this.errorMsg == null){
                  var importObj = (
                    importObj={}, 
                    importObj[referenceNumber]= dataObj['Reference number'] != undefined ? dataObj['Reference number'] : '', importObj,
                    importObj[consigneeCompany]= dataObj['Consignee Company'] != undefined ? dataObj['Consignee Company'] : '', importObj,
                    importObj[consigneeName]= dataObj['Consignee Name'] != undefined ? dataObj['Consignee Name'] : '', importObj,
                    importObj[consigneeAddr1]= dataObj['Consignee Address 1'] != undefined ? dataObj['Consignee Address 1'] : '', importObj,
                    importObj[consigneeAddr2]= dataObj['Consignee Address 2'] != undefined ? dataObj['Consignee Address 2'] : '',  importObj,
                    importObj[consigneeEmail]= dataObj['Consignee Email'] != undefined ? dataObj['Consignee Email'] : '',  importObj,
                    importObj[consigneeSuburb]= dataObj['Consignee Suburb'] != undefined ? dataObj['Consignee Suburb'] : '', importObj,
                    importObj[consigneeState]= dataObj['Consignee State'] != undefined ? dataObj['Consignee State'] : '',  importObj,
                    importObj[consigneePostcode]= dataObj['Consignee Postcode'] != undefined ? dataObj['Consignee Postcode'] : '', importObj,
                    importObj[consigneePhone]= dataObj['Consignee Phone'] != undefined ? dataObj['Consignee Phone'] : '', importObj,
                    importObj[productDescription]= dataObj['Product Description'] != undefined ? dataObj['Product Description'] : '',  importObj,
                    importObj[value]= dataObj['Value'] != undefined ? parseInt(dataObj['Value']) : '', importObj,
                    importObj[currency]= dataObj['Currency'] != undefined ? dataObj['Currency'] : 'AUD', importObj,
                    importObj[shippedQuantity]= dataObj['Shipped Quantity'] != undefined ? parseInt(dataObj['Shipped Quantity']) : 1, importObj,
                    importObj[weight]= dataObj['Weight'] != undefined ? dataObj['Weight'] : '',  importObj,
                    importObj[dimensionsLength]= dataObj['Dim_X'] != undefined ? parseInt(dataObj['Dim_X']) : '',  importObj,
                    importObj[dimensionsWidth]= dataObj['Dim_Y'] != undefined ? parseInt(dataObj['Dim_Y']) : '', importObj,
                    importObj[dimensionsHeight]= dataObj['Dim_Z'] != undefined ? parseInt(dataObj['Dim_Z']) : '', importObj,
                    importObj[serviceType]=  'RES',  importObj,
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
                    importObj[carrier]= 'eParcel',  importObj
                );
                if(importObj.consigneeAddr1.length > 50){
                  this.errorMsg = 'Consginee Address 1 should not contain more than 50 character';
                  break;
                }else if(importObj.consigneeAddr2.length > 50){
                  this.errorMsg = 'Consginee Address 2 should not contain more than 50 character';
                  break;
                }
                this.importList.push(importObj);
                this.rowData = this.importList;
                }
            }
          }
      }
  };

  fileUpload(){
    this.returnsAction = [];
    this.actionData = [];
    let articleId = 'articleId';
    let barcodelabelNumber = 'barcodelabelNumber';
    let brokerName = 'brokerName';
    let referenceNumber = 'referenceNumber';
    let action = 'action';
    let resendRefNumber = 'resendRefNumber';
    if(this.importList.length > 0){
      this.spinner.show();
      this.consigmentUploadService.consigmentFileUpload(this.importList, (resp) => {
      this.spinner.hide();
          if(resp.error){
            this.errorModal = "**Unable to process the request - "+" "+resp.error.errorMessage;
          }else{  
            console.log(resp);
            if(resp[0].referenceNumber){
              for (let item of this.resendData ) {
                item.resendRefNumber = this.importList[0].referenceNumber;
                this.resendData = [];
                this.resendData.push(item);
              }
              this.actionData  = this.nonResendData.concat(this.resendData);
              //calling update returns action
              for (var actionVal in this.actionData) {
                  var fieldObj = this.actionData[actionVal];
                  var actionObj = (
                      actionObj={}, 
                      actionObj[articleId]= fieldObj.articleId != undefined ? fieldObj.articleId : '', actionObj,
                      actionObj[brokerName]= fieldObj.brokerName != undefined ? fieldObj.brokerName: '', actionObj,
                      actionObj[referenceNumber]= fieldObj.referenceNumber != undefined ? fieldObj.referenceNumber:'', actionObj,
                      actionObj[action]= fieldObj.actionType != undefined ? fieldObj.actionType.value: '',actionObj,
                      actionObj[resendRefNumber]= fieldObj.actionType.value == 'resend' ? fieldObj.resendRefNumber : null,  actionObj
                  );
                  this.returnsAction.push(actionObj);
              }
              this.spinner.show();
                console.log(this.returnsAction);
                this.consigmentUploadService.updateAction(this.returnsAction, (resp) => {
                  this.spinner.hide();
                  if(resp.error){
                  }else{
                    this.returnsAction = [];
                    $('#returnAction').modal('hide');
                    this.successMsg= resp.message;
                    $('#action').modal('show');
                    this.fetchReturnActionData();
                  }
                    setTimeout(() => {this.spinner.hide()}, 5000);
                })

            }
          }
       })
      }else{
          this.errorModal = '**Atleast one record its required to upload the returns';
     }
  };

  onSelectionChange() {
    this.errorMsg = '';
    this.successMsg = '';
  };

  checkZero(data){
    if(data.length == 1){
      data = "0" + data;
    }
    return data;
  }

}


interface City {
  name: string;
  value: string;
}


