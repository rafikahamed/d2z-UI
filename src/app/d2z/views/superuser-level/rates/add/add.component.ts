import { Component, ViewChild,ElementRef,AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { GridOptions } from "ag-grid";
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-superuser-level-rates',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class SuperUserRatesAddComponent implements OnInit {
@ViewChild('userPhoto') userPhoto: ElementRef;
  userName: String;
  role_id: String;
  brokerListMainData = [];
  public importRatesValue = [];
  brokerDropdown: dropdownTemplate[];  
  brokerDropdownValue = [];
  ratesList= [];
  brokerData = [];
  zoneObj = {};
  zone = [];
  selectedBrokerType: dropdownTemplate;
  brokerUserName: String;
  injectionDropdown: dropdownTemplate[];  
  selectedInjectionType: dropdownTemplate;
  injectionType: String;
  serviceTypeDropdown: dropdownTemplate[];  
  selectedserviceType: dropdownTemplate;
  serviceType: String;
  errorMsg: String;
  successMsg:  String;
  arrayBuffer:any;
  public gridOptions: GridOptions;
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  public rowData: any[];
  public defaultColDef;
  file:File;
  system: String;
  constructor(
    public consignmenrServices: ConsigmentUploadService,
    private spinner: NgxSpinnerService
  ){
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptions.columnDefs = [
      {
        headerName: "Destination Zone",
        field: "destinationZone",
        width: 200,
        checkboxSelection: true,
        headerCheckboxSelection: function(params) {
          return params.columnApi.getRowGroupColumns().length === 0;
        }
      },
      {
        headerName: "Up to 500g",
        field: "upto500g",
        width: 120
      },
      {
        headerName: "501g to 1kg",
        field: "_501gTo1kg",
        width: 120
      },
      {
        headerName: "1.01kg to 2kg",
        field: "_1kgTo2kg",
        width: 120
      },
      {
        headerName: "2.01kg to 3kg",
        field: "_2kgTo3kg",
        width: 120
      },
      {
        headerName: "3.01kg to 4kg",
        field: "_3kgTo4kg",
        width: 120
      },
      {
        headerName: "4.01kg to 5kg",
        field: "_4kgTo5kg",
        width: 120
      },
      {
        headerName: "5.01kg to 7kg",
        field: "_5kgTo7kg",
        width: 120
      },
      {
        headerName: "7.01kg to 10kg",
        field: "_7kgTo10kg",
        width: 130
      },
      {
        headerName: "10.01kg to 15kg",
        field: "_10kgTo15kg",
        width: 150
      },
      {
        headerName: "15.01kg to 22kg",
        field: "_15kgTo22kg",
        width: 150
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
    this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
    this.getLoginDetails();
    this.spinner.show();
    this.consignmenrServices.brokerlist( (resp) => {
      this.brokerListMainData = resp;
      this.spinner.hide();
      var that = this;
      resp.forEach(function(entry) {
        that.brokerDropdownValue.push(entry.brokerUserName);
      })
      this.brokerDropdown = this.brokerDropdownValue;
    })
  }

  onBrokerTypeChange(event){
    this.brokerUserName = event.value ? event.value.value: '';
    var that = this;
    this.brokerListMainData.forEach(function(entry) {
      if(entry.brokerUserName.name == that.brokerUserName){
            that.injectionDropdown = entry.injectionType;
            that.serviceTypeDropdown = entry.serviceType;
      }
    })
  };
clearDetails(){

   
   this.selectedInjectionType = null;
   this.selectedserviceType = null;
   this.selectedBrokerType = null;

 this.userPhoto.nativeElement.value = null;
   
    this.successMsg = null;
    this.errorMsg = null;
   
  };
  incomingfile(event) {
    this.rowData = [];
    this.file = event.target.files[0]; 
    this.importRates();
  }

  onInjectionTypeChange(event){
    this.injectionType = event.value ? event.value.value: '';
  }

  onServiceTypeChange(event){
    this.serviceType = event.value ? event.value.value: '';
  }

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  };

  importRates(){
    var worksheet;
    this.errorMsg = null;
    let fileReader = new FileReader();
    this.importRatesValue= [];
    fileReader.readAsArrayBuffer(this.file);
    var destinationZone = 'destinationZone';
    var upto500g = 'upto500g';
    let _501gTo1kg = '_501gTo1kg';
    let _1kgTo2kg = '_1kgTo2kg';
    let _2kgTo3kg = '_2kgTo3kg';
    let _3kgTo4kg = '_3kgTo4kg';
    let _4kgTo5kg = '_4kgTo5kg';
    let _5kgTo7kg = '_5kgTo7kg';
    let _7kgTo10kg = '_7kgTo10kg';
    let _10kgTo15kg = '_10kgTo15kg';
    let _15kgTo22kg = '_15kgTo22kg';

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
            if(this.errorMsg == null){
              var importObj = (
                importObj={}, 
                importObj[destinationZone]= dataObj['Destination Zone'] != undefined ? dataObj['Destination Zone'] : '', importObj,
                importObj[upto500g]= dataObj['Up to 500g'] != undefined ? dataObj['Up to 500g'] : '', importObj,
                importObj[_501gTo1kg]= dataObj['501g to 1kg'] != undefined ? dataObj['501g to 1kg'] : '', importObj,
                importObj[_1kgTo2kg]= dataObj['1.01kg to 2kg'] != undefined ? dataObj['1.01kg to 2kg'] : '', importObj,
                importObj[_2kgTo3kg]= dataObj['2.01kg to 3kg'] != undefined ? dataObj['2.01kg to 3kg'] : '', importObj,
                importObj[_3kgTo4kg]= dataObj['3.01kg to 4kg'] != undefined ? dataObj['3.01kg to 4kg'] : '', importObj,
                importObj[_4kgTo5kg]= dataObj['4.01kg to 5kg'] != undefined ? dataObj['4.01kg to 5kg'] : '', importObj,
                importObj[_5kgTo7kg]= dataObj['5.01kg to 7kg'] != undefined ? dataObj['5.01kg to 7kg'] : '', importObj,
                importObj[_7kgTo10kg]= dataObj['7.01kg to 10kg'] != undefined ? dataObj['7.01kg to 10kg'] : '', importObj,
                importObj[_10kgTo15kg]= dataObj['10.01kg to 15kg'] != undefined ? dataObj['10.01kg to 15kg'] : '', importObj,
                importObj[_15kgTo22kg]= dataObj['15.01kg to 22kg'] != undefined ? dataObj['15.01kg to 22kg'] : '', importObj
              );
            this.importRatesValue.push(importObj)
            this.rowData = this.importRatesValue;
            }
        }
      }
  };

  uploadRecords(){
    this.errorMsg = null;
    this.successMsg = null;
    this.zone= [];
    this.ratesList= [];
    var zoneObj = {};
    this.brokerData = [];
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(this.brokerUserName ==  undefined){
      this.errorMsg = "**Please select Broker User Name";
    }else if (this.injectionType == undefined){
      this.errorMsg = "**Please select the Injection type";
    }else if(this.serviceType == undefined){
      this.errorMsg = "**Please select the service type";
    }else if(selectedRows.length == 0){
      this.errorMsg = "**Please select the below records to upload the Rate Details";
    }

    if(selectedRows.length > 0 && this.errorMsg == null ){
      var zoneID = 'zoneID';
      var rates = 'rates';
      var rafik = 'rafik';
      var maxWeight = 'maxWeight';
      let minWeight = 'minWeight';
      let rate = 'rate';

      var that= this;
      selectedRows.forEach(function(data) {
        that.ratesList = [];
        if(data.upto500g){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data.upto500g != undefined ? 0.5 : '', rateObj,
            rateObj[minWeight]= data.upto500g != undefined ? 0 : '', rateObj,
            rateObj[rate]= data.upto500g != undefined ? parseFloat(data.upto500g.substr(1)): '', rateObj
          )
          that.ratesList.push(rateObj);
        } 
        if(data._501gTo1kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._501gTo1kg != undefined ? 1 : '', rateObj,
            rateObj[minWeight]= data._501gTo1kg != undefined ? 0.501 : '', rateObj,
            rateObj[rate]= data._501gTo1kg != undefined ? parseFloat(data._501gTo1kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._1kgTo2kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._1kgTo2kg != undefined ? 2 : '', rateObj,
            rateObj[minWeight]= data._1kgTo2kg != undefined ? 1.01 : '', rateObj,
            rateObj[rate]= data._1kgTo2kg != undefined ? parseFloat(data._1kgTo2kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._2kgTo3kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._2kgTo3kg != undefined ? 3 : '', rateObj,
            rateObj[minWeight]= data._2kgTo3kg != undefined ? 2.00999999999999 : '', rateObj,
            rateObj[rate]= data._2kgTo3kg != undefined ? parseFloat(data._2kgTo3kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._3kgTo4kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._3kgTo4kg != undefined ? 4 : '', rateObj,
            rateObj[minWeight]= data._3kgTo4kg != undefined ? 3.00999999999999 : '', rateObj,
            rateObj[rate]= data._3kgTo4kg != undefined ? parseFloat(data._3kgTo4kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._4kgTo5kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._4kgTo5kg != undefined ? 5 : '', rateObj,
            rateObj[minWeight]= data._4kgTo5kg != undefined ? 4.00999999999999 : '', rateObj,
            rateObj[rate]= data._4kgTo5kg != undefined ? parseFloat(data._4kgTo5kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._5kgTo7kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._5kgTo7kg != undefined ? 7 : '', rateObj,
            rateObj[minWeight]= data._5kgTo7kg != undefined ? 5.00999999999999 : '', rateObj,
            rateObj[rate]= data._5kgTo7kg != undefined ? parseFloat(data._5kgTo7kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._7kgTo10kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._7kgTo10kg != undefined ? 10 : '', rateObj,
            rateObj[minWeight]= data._7kgTo10kg != undefined ? 7.00999999999999 : '', rateObj,
            rateObj[rate]= data._7kgTo10kg != undefined ? parseFloat(data._7kgTo10kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._10kgTo15kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._10kgTo15kg != undefined ? 15 : '', rateObj,
            rateObj[minWeight]= data._10kgTo15kg != undefined ? 10.01 : '', rateObj,
            rateObj[rate]= data._10kgTo15kg != undefined ? parseFloat(data._10kgTo15kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }
        if(data._15kgTo22kg){
          var rateObj = (
            rateObj={}, 
            rateObj[maxWeight]= data._15kgTo22kg != undefined ? 22 : '', rateObj,
            rateObj[minWeight]= data._15kgTo22kg != undefined ? 15.01 : '', rateObj,
            rateObj[rate]= data._15kgTo22kg != undefined ? parseFloat(data._15kgTo22kg.substr(1)) : '', rateObj
          )
          that.ratesList.push(rateObj);
        }   
        
        that.zoneObj = (
          zoneObj={}, 
          zoneObj[rates]= that.ratesList, zoneObj,
          zoneObj[zoneID]= data.destinationZone != undefined ?  data.destinationZone : '', zoneObj
        )
        that.zone.push(that.zoneObj);
      });
      var brokerUserName = 'brokerUserName';
      var gst = 'gst';
      var fuelSurcharge = 'fuelSurcharge';
      var serviceType = 'serviceType';
      var injectionType = 'injectionType';
      var zone = 'zone';
      var brokerFinalObj = (
        brokerFinalObj={}, 
        brokerFinalObj[brokerUserName]=  this.brokerUserName ? this.brokerUserName : '', brokerFinalObj,
        brokerFinalObj[gst]= $("#gst").val() ? $("#gst").val() : '', brokerFinalObj,
        brokerFinalObj[fuelSurcharge]= $("#fuelSurCharge1").val() ? $("#fuelSurCharge1").val() : '', brokerFinalObj,
        brokerFinalObj[serviceType]=  this.serviceType ? this.serviceType : '', brokerFinalObj,
        brokerFinalObj[injectionType]= this.injectionType ? this.injectionType : '', brokerFinalObj,
        brokerFinalObj[zone]= this.zone, brokerFinalObj
      );
      this.brokerData.push(brokerFinalObj);
      this.spinner.show();
      this.consignmenrServices.superUserAddBroker(this.brokerData, (resp) => {
          this.spinner.hide();
          this.successMsg = resp.message;
          setTimeout(() => { this.spinner.hide() }, 5000);
        });
    }
  }

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  };

}


