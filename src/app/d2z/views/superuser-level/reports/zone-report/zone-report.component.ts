import { Component, ViewChild,OnInit} from '@angular/core';
import {  MatInput } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/add/operator/filter';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-zone-report',
  templateUrl: './zone-report.component.html',
  styleUrls: ['./zone-report.component.css']
})
export class SuperUserZoneReportComponent implements OnInit{
  
  @ViewChild('frominput', {
    read: MatInput
  }) frominput: MatInput;

  @ViewChild('toinput', {
    read: MatInput
  }) toinput: MatInput;

  public importList = [];
  
  errorMsg: string;
  show: Boolean;
  etowerFlag: Boolean;
  auPostFlag: Boolean;
  pflFlag:Boolean;
  nexFlag:Boolean;
  mydate: Date;
  successMsg: String;
  fromDate: String;
  toDate: String;
  userName: String;
  role_id: String;
  system: String;
  private gridOptionsBroker: GridOptions;
  private gridOptionsPfl: GridOptions;
  private gridOptionsNex: GridOptions;
  private gridOptionsAupost: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  public brokerDataList = [];
  public brokerRequestList = [];
  shipmentAllocateForm: FormGroup;
  clientType: String;
  constructor(
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    public consignmenrServices: ConsigmentUploadService
  ) {
    this.show = false;
    this.shipmentAllocateForm = new FormGroup({
      shipmentNumber: new FormControl()
    });
    // This grid is for Consignment Items
    this.gridOptionsBroker = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsBroker.columnDefs = [
       {
            headerName: "brokerName",
            field: "brokerName",
            width: 300,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
      }
    ]
  };

  ngOnInit(){
    this.brokerDataList = [];
    this.spinner.show();
    this.consignmenrServices.brokerlist((resp) => {
        this.spinner.hide();
        let brokerName = 'brokerName';
        let userId = 'userId';
          for (var data in resp) {
            var dataValObj = resp[data];
            var brokerObj = (
              brokerObj={}, 
              brokerObj[brokerName]= dataValObj.brokerUserName != undefined ? dataValObj.brokerUserName.value : '', brokerObj,
              brokerObj[userId]= dataValObj.userId != undefined ? dataValObj.userId : '', brokerObj
            );
            this.brokerDataList.push(brokerObj);
          };
          this.rowData = this.brokerDataList;
    });
   
  };

  FromDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.fromDate = [ date.getFullYear(), mnth, day ].join("-");
  };

  ToDateChange(event){
    var str = event.target.value;
    var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
     this.toDate = [ date.getFullYear(), mnth, day ].join("-");
  };

  zoneSearch(){
    this.brokerRequestList =[];
    var selectedbroker = this.gridOptionsBroker.api.getSelectedRows();
    let brokerName = 'brokerName';
    let userId = 'userId';
    let fromDate = 'fromDate';
    let toDate = 'toDate';
    console.log(selectedbroker)
    for (var data in selectedbroker) {
      var brokerData = selectedbroker[data];
      console.log(brokerData)
      var brokerSelObj = (
        brokerSelObj={}, 
        brokerSelObj[brokerName]= brokerData.brokerName != undefined ? brokerData.brokerName : '', brokerSelObj,
        brokerSelObj[userId]= brokerData.userId != undefined ? brokerData.userId : '', brokerSelObj,
        brokerSelObj[fromDate]= this.fromDate != undefined ? this.fromDate+" 00:00:00:000" : '', brokerSelObj,
        brokerSelObj[toDate]= this.toDate != undefined ? this.toDate+" 23:59:59:999" : '', brokerSelObj
      )
      this.brokerRequestList.push(brokerSelObj);
    }
     console.log( this.brokerRequestList)
    //   this.spinner.show()
    //   this.consignmenrServices.getZoneDetails(this.brokerRequestList, (resp) => {
    //     this.spinner.hide();
    //   });

  };

  onZoneReportChange(){};
  
}


