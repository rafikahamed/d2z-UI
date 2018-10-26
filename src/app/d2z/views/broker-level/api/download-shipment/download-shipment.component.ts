import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { BrokerService } from 'app/d2z/service/broker/broker.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-download-shipment',
  templateUrl: './download-shipment.component.html',
  styleUrls: ['./download-shipment.component.css']
})
export class APIDownloadShipmentComponent implements OnInit{

  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  shipmentNumber: string;
  errorMsg: string;
  show: Boolean;
  successMsg: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  ShipmentArray: dropdownTemplate[];  
  selectedShipment: dropdownTemplate;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public brokerService: BrokerService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService
  ) {
    this.ShipmentArray = [];
    this.show = false;
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
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
        headerName: "CONNOTE NO",
        field: "con_no",
        width: 150
      },
      {
        headerName: "Weight",
        field: "weight",
        width: 150
      },
      {
        headerName: "Consignee Name",
        field: "consigneeName",
        width: 200
      },
      {
        headerName: "Consignee  Company",
        field: "consigneeCompany",
        width: 100
      },
      {
        headerName: "Consignee Phone",
        field: "consigneePhone",
        width: 100
      },
      {
        headerName: "Consignee Address",
        field: "consigneeAddress",
        width: 100
      },
      {
        headerName: "Consignee Suburb",
        field: "consigneeSuburb",
        width: 150
      },
      {
        headerName: "Consignee State",
        field: "consigneeState",
        width: 160
      },
      {
        headerName: "Consignee Postcode",
        field: "consigneePostcode",
        width: 100
      },
      {
        headerName: "destination",
        field: "destination",
        width: 150
      },
      {
        headerName: "quantity",
        field: "quantity",
        width: 100
      },
      {
        headerName: "commodity",
        field: "commodity",
        width: 100
      },
      {
        headerName: "value",
        field: "value",
        width: 100
      },
      {
        headerName: "cmeter",
        field: "cmeter",
        width: 100
      },
      {
        headerName: "shipperName",
        field: "shipperName",
        width: 100
      },
      {
        headerName: "shipperAddress",
        field: "shipperAddress",
        width: 140
      },
      {
        headerName: "shipperCity",
        field: "shipperCity",
        width: 140
      },
      {
        headerName: "shipperState",
        field: "shipperState",
        width: 140
      },
      {
        headerName: "shipperPostcode",
        field: "shipperPostcode",
        width: 140
      },
      {
        headerName: "shipperCountry",
        field: "shipperCountry",
        width: 140
      },
      {
        headerName: "shipperContact",
        field: "shipperContact",
        width: 140
      },
      {
        headerName: "insurance",
        field: "insurance",
        width: 140
      },
      {
        headerName: "clear",
        field: "clear",
        width: 140
      },
      {
        headerName: "invoiceRef",
        field: "invoiceRef",
        width: 200
      },
      {
        headerName: "importerAbn",
        field: "importerAbn",
        width: 200
      },
      {
        headerName: "vendorId",
        field: "vendorId",
        width: 200
      },
      {
        headerName: "consignorTin",
        field: "consignorTin",
        width: 200
      },
      {
        headerName: "fbapo",
        field: "fbapo",
        width: 200
      },
      {
        headerName: "fbashipmentID",
        field: "fbashipmentID",
        width: 200
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

  ngOnInit() {
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.spinner.show();
      this.trackingDataService.apiShipmentList( (resp) => {
        this.spinner.hide();
        this.ShipmentArray = resp;
        this.shipmentNumber = this.ShipmentArray[0].value;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
  }
  
  onShipmentChange(event){
    this.shipmentNumber = event.value.value;
  }

  apiDownLoadSearch(){
    this.spinner.show();
    this.trackingDataService.fetchShipmentDetails(this.shipmentNumber, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);
    })
  }

  apiShipmentDownload(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length > 0 ){
        var currentTime = new Date();
        var shipmentList = [];
        var fileName = '';
            fileName = "API_Shipment_Details"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ "CUSTOMER_REF", "CONNOTE NO.", "WEIGHT", "CNEE","CNEE COMPANY","TEL","ADDRESS","SUBURB","STATE","P/C","DESTINATION",
	    		  "PCS","COMMODITY","INNER ITEMS","UNIT VALUE","TTL VALUE","CMETER","SHIPPER","SHIPPER ADD","SHIPPER CITY","SHIPPER STATE","SHIPPER PC",
            "SHIPPER COUNTRY CODE","SHIPPER CONTACT","INSURANCE","RECEIVER","RECEIVER TEL","RECEIVER ADDRESS","RECEIVER SUBURB",
            "RECEIVER STATE","RECEIVER P/C","CLEAR","FBA PO","FBA SHIPMENT ID","INVOICE_REF","IMPORTER_ABN","VENDOR_ID","CONSIGNOR_TIN" ]
          };
          let CUSTOMER_REF = 'CUSTOMER_REF';
          let CONNOTE_NO = 'CONNOTE_NO';
          let WEIGHT = 'WEIGHT';
          let CNEE = 'CNEE';
          let CNEE_COMPANY = 'CNEE_COMPANY';
          let TEL = 'TEL';
          let ADDRESS = 'ADDRESS';
          let SUBURB = 'SUBURB';
          let STATE = 'STATE';
          let PC = 'PC';
          let DESTINATION = 'DESTINATION';
          let PCS = 'PCS';
          let COMMODITY = 'COMMODITY';
          let INNER_ITEMS = 'INNER_ITEMS';
          let UNIT_VALUE = 'UNIT_VALUE';
          let TTL_VALUE = 'TTL_VALUE';
          let CMETER = 'CMETER';
          let SHIPPER = 'SHIPPER';
          let SHIPPER_ADD = 'SHIPPER_ADD';
          let SHIPPER_CITY = 'SHIPPER_CITY';
          let SHIPPER_STATE = 'SHIPPER_STATE';
          let SHIPPER_PC = 'SHIPPER_PC';
          let SHIPPER_COUNTRY_CODE = 'SHIPPER_COUNTRY_CODE';
          let SHIPPER_CONTACT = 'SHIPPER_CONTACT';
          let INSURANCE = 'INSURANCE';
          let RECEIVER = 'RECEIVER';
          let RECEIVER_TEL = 'RECEIVER_TEL';
          let RECEIVER_ADDRESS = 'RECEIVER_ADDRESS';
          let RECEIVER_SUBURB = 'RECEIVER_SUBURB';
          let RECEIVER_STATE = 'RECEIVER_STATE';
          let RECEIVER_PC = 'RECEIVER_PC';
          let CLEAR = 'CLEAR';
          let FBA_PO = 'FBA_PO';
          let FBA_SHIPMENT_ID = 'FBA_SHIPMENT_ID';
          let INVOICE_REF = 'INVOICE_REF';
          let IMPORTER_ABN = 'IMPORTER_ABN';
          let VENDOR_ID = 'VENDOR_ID';
          let CONSIGNOR_TIN = 'CONSIGNOR_TIN';
      
          for (var importVal in selectedRows) {
              var adminObj = selectedRows[importVal];
              var importObj = (
                  importObj={}, 
                  importObj[CUSTOMER_REF]= adminObj.referenceNumber != null ? adminObj.referenceNumber: '', importObj,
                  importObj[CONNOTE_NO]= adminObj.con_no != null ? adminObj.con_no : '', importObj,
                  importObj[WEIGHT]= adminObj.weight != null ? adminObj.weight : '', importObj,
                  importObj[CNEE]= adminObj.consigneeName != null ? adminObj.consigneeName : '', importObj,
                  importObj[CNEE_COMPANY] = adminObj.consigneeCompany != null ? adminObj.consigneeCompany : '', importObj,
                  importObj[TEL]= adminObj.consigneePhone != null ? adminObj.consigneePhone : '', importObj,
                  importObj[ADDRESS]= adminObj.consigneeAddress != null ? adminObj.consigneeAddress : '', importObj,
                  importObj[SUBURB]= adminObj.consigneeSuburb != null ? adminObj.consigneeSuburb : '', importObj,
                  importObj[STATE]= adminObj.consigneeState != null ? adminObj.consigneeState : '', importObj,
                  importObj[PC]= adminObj.consigneePostcode != null ? adminObj.consigneePostcode : '',  importObj,
                  importObj[DESTINATION]= adminObj.destination != null ? adminObj.destination : '', importObj,
                  importObj[PCS]= adminObj.quantity != null ? adminObj.quantity : '', importObj,
                  importObj[COMMODITY]= adminObj.commodity != null ? adminObj.commodity : '', importObj,
                  importObj[INNER_ITEMS]= 1, importObj,
                  importObj[UNIT_VALUE] = adminObj.value != null ? adminObj.value : '', importObj,
                  importObj[TTL_VALUE]= adminObj.value != null ? adminObj.value : '', importObj,
                  importObj[CMETER]= '', importObj,
                  importObj[SHIPPER]= adminObj.shipperName != null ? adminObj.shipperName : '', importObj,
                  importObj[SHIPPER_ADD]= adminObj.shipperAddress != null ? adminObj.shipperAddress : '', importObj,
                  importObj[SHIPPER_CITY]= adminObj.shipperCity != null ? adminObj.shipperCity : '',  importObj,
                  importObj[SHIPPER_STATE]= adminObj.shipperState != null ? adminObj.shipperState : '', importObj,
                  importObj[SHIPPER_PC]= adminObj.shipperPostcode != null ? adminObj.shipperPostcode : '', importObj,
                  importObj[SHIPPER_COUNTRY_CODE]= adminObj.shipperCountry != null ? adminObj.shipperCountry : '', importObj,
                  importObj[SHIPPER_CONTACT]= adminObj.shipperContact != null ? adminObj.shipperContact : '', importObj,
                  importObj[INSURANCE] = '', importObj,
                  importObj[RECEIVER]= adminObj.shipperName != null ? adminObj.shipperName : '', importObj,
                  importObj[RECEIVER_TEL]= '', importObj,
                  importObj[RECEIVER_ADDRESS]= adminObj.shipperAddress != null ? adminObj.shipperAddress : '', importObj,
                  importObj[RECEIVER_SUBURB]= adminObj.shipperCity != null ? adminObj.shipperCity : '',  importObj,
                  importObj[RECEIVER_STATE]= adminObj.shipperState != null ? adminObj.shipperState : '', importObj,
                  importObj[RECEIVER_PC]= adminObj.shipperPostcode != null ? adminObj.shipperPostcode : '', importObj,
                  importObj[CLEAR]= adminObj.clear !=null ? adminObj.clear :'', importObj,
                  importObj[FBA_PO]= adminObj.fbapo != null ? adminObj.fbapo : '', importObj,
                  importObj[FBA_SHIPMENT_ID]= adminObj.fbashipmentID != null ? adminObj.fbashipmentID : '', importObj,
                  importObj[INVOICE_REF]= adminObj.invoiceRef != null ? adminObj.invoiceRef : '', importObj,
                  importObj[IMPORTER_ABN] = adminObj.importerAbn != null ? adminObj.importerAbn : '', importObj,
                  importObj[VENDOR_ID]= adminObj.vendorId != null ? adminObj.vendorId : '', importObj,
                  importObj[CONSIGNOR_TIN]= adminObj.consignorTin != null ? adminObj.consignorTin : '', importObj
              );
              shipmentList.push(importObj)
          }
        new Angular2Csv(shipmentList, fileName, options);        
      }else{
        this.errorMsg = "**Please select the below records to download the API Shipment details";
      } 
  }

  toggle(arrow) {
    this.childmenu = !this.childmenu;
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
    this.childmenu = !this.childmenu;
    if (arrow.className === 'nav-md') {
      arrow.className = '';
      arrow.className = 'nav-sm';
    }
    else {
      arrow.className = '';
      arrow.className = 'nav-md';
    }
  }

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


