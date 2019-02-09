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
  selector: 'hms-direct-injection',
  templateUrl: './direct-injection.component.html',
  styleUrls: ['./direct-injection.component.css']
})
export class DirectInjectionComponent implements OnInit{
  manifestNumber: string;
  companyName: String;
  errorMsg: string;
  show: Boolean;
  userName: String;
  role_id: String;
  successMsg: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  companyDropdown: dropdownTemplate[];  
  selectedCompany: dropdownTemplate;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public brokerService: BrokerService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService
  ) {
    this.companyDropdown = [];
    this.show = false;
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Article Id",
        field: "articleId",
        width: 300,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Reference Number",
        field: "referenceNumber",
        width: 200
      },
      {
        headerName: "Consignee Name",
        field: "consigneeName",
        width: 250
      },
      {
        headerName: "Consignee Postcode",
        field: "postCode",
        width: 200
      },
      {
        headerName: "weight",
        field: "weight",
        width: 100
      },
      {
        headerName: "Sender Name",
        field: "shipperName",
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
      this.spinner.show();
      this.getLoginDetails();
      this.trackingDataService.companyList( this.consigmentUploadService.userMessage.user_id, (resp) => {
        this.spinner.hide();
        this.companyDropdown = resp;
        this.companyName = this.companyDropdown[0].value;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
  };

  getLoginDetails(){
    if(this.consigmentUploadService.userMessage != undefined){
      this.userName = this.consigmentUploadService.userMessage.userName;
      this.role_id = this.consigmentUploadService.userMessage.role_Id;
    }
  };
  
  onCompanyDropdownchange(event){
    this.companyName = event.value ? event.value.value : '';
  }

  directInjectionSearch(){
    this.spinner.show();
    this.trackingDataService.fetchDirectInjectionDetails(this.companyName, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);
    })
  }

  downloadDirectShipment(){
    this.errorMsg = null;
    this.successMsg = '';
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length > 0 ){
      var currentTime = new Date();
      var shipmentList = [];
      var fileName = '';
          fileName = "Direct_Injection_Details"+"-"+currentTime.toLocaleDateString();
        var options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          useBom: true,
          headers: [ "Article Id", "Reference Number", "Consignee Name", "PostCode", "Weight", "Sender Name" ]
        };
        let articleId = 'articleId';
        let referenceNumber = 'referenceNumber';
        let consigneeName = 'consigneeName';
        let postCode = 'postCode';
        let weight = 'weight';
        let shipperName = 'shipperName';
    
        for (var importVal in selectedRows) {
            var adminObj = selectedRows[importVal];
            var importObj = (
                importObj={}, 
                importObj[articleId]= adminObj.articleId != null ? adminObj.articleId: '', importObj,
                importObj[referenceNumber]= adminObj.referenceNumber != null ? adminObj.referenceNumber : '', importObj,
                importObj[consigneeName]= adminObj.consigneeName != null ? adminObj.consigneeName : '', importObj,
                importObj[postCode]= adminObj.postCode != null ? adminObj.postCode : '', importObj,
                importObj[weight] = adminObj.weight != null ? adminObj.weight : '', importObj,
                importObj[shipperName]= adminObj.shipperName != null ? adminObj.shipperName : '', importObj
            );
            shipmentList.push(importObj)
        }
      new Angular2Csv(shipmentList, fileName, options);        
    }else{
      this.errorMsg = "**Please select the below records to download the Direct Injection details";
    } 
  }

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


