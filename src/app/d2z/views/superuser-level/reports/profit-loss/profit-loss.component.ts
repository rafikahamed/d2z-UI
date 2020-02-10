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

@Component({
  selector: 'hms-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class SuperUserProfitLossReportComponent implements OnInit{
  
  @ViewChild('frominput', {
    read: MatInput
  }) frominput: MatInput;

  @ViewChild('toinput', {
    read: MatInput
  }) toinput: MatInput;

  public importList = [];
  errorMsg: string;
  show: Boolean;
 
  successMsg: String;
  fromDate: String;
  toDate: String;
  userName: String;
  role_id: String;
  system: String;
  private gridOptionsProfit: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowProfitData: any[];
  private defaultColDef;
  public profitDataList = [];
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
    this.gridOptionsProfit = <GridOptions>{ rowSelection: "multiple" };
    this.gridOptionsProfit.columnDefs = [
       {
            headerName: "Broker / Supplier",
            field: "broker",
            width: 200,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
      },
      {
        headerName: "Revenue / Cost",
        field: "revenue",
        width: 200
      },
      {
        headerName: "Parcels",
        field: "parcel",
        width: 200
      },
      {
        headerName: "Shipment Charges",
        field: "shipmentCharge",
        width: 150
      },
      {
        headerName: "Profit",
        field: "profit",
        width: 100
      },
      {
        headerName: "Profit per parcel",
        field: "profitPerParcel",
        width: 200
      }
    ]
  };

  ngOnInit(){};

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
    if(this.fromDate != null && this.toDate != null){
      this.spinner.show();
      this.consignmenrServices.fetchProfitAndLoss(
        this.fromDate+" 00:00:00:000",this.toDate+" 23:59:59:999", (resp) => {
        this.spinner.hide();
        this.rowProfitData = resp;
        
        let broker = 'broker';
        let revenue = 'revenue';
        let parcel = 'parcel';
        let shipmentCharge = 'shipmentCharge';
        let profit = 'profit';
        let profitPerParcel = 'profitPerParcel';
        
        for(var profitObj in resp){
          var prfLossObjData = resp[profitObj];
          var prfLossObj = (
            prfLossObj={}, 
            prfLossObj[broker]= prfLossObjData.broker != null ? prfLossObjData.broker : '' , prfLossObj,
            prfLossObj[revenue]= prfLossObjData.revenue != null ? prfLossObjData.revenue : '', prfLossObj,
            prfLossObj[parcel]= prfLossObjData.parcel != null ?  prfLossObjData.parcel : '', prfLossObj,
            prfLossObj[shipmentCharge]= prfLossObjData.shipmentCharge != null ? prfLossObjData.shipmentCharge : '', prfLossObj,
            prfLossObj[profit]= prfLossObjData.profit != null ? prfLossObjData.profit : '', prfLossObj,
            prfLossObj[profitPerParcel]= prfLossObjData.profitPerParcel != null ? prfLossObjData.profitPerParcel : '', prfLossObj
          );
        this.rowProfitData.push(prfLossObj);
       };

       });

    }else{
      this.errorMsg = "From Date and To Date is not empty"
    }
  };

  downloadProfitData(){
    this.errorMsg = null;
    var zoneDataDownloadedList =[];
    if(this.gridOptionsProfit.api.getSelectedRows().length > 1){
      let broker = 'broker';
      let revenue = 'revenue';
      let parcel = 'parcel';
      let shipmentCharge = 'shipmentCharge';
      let profit = 'profit';
      let profitPerParcel = 'profitPerParcel';
            
      for(var profitObj in this.rowProfitData){
        var prfLossObjData = this.rowProfitData[profitObj];
        var prfLossObj = (
          prfLossObj={}, 
          prfLossObj[broker]= prfLossObjData.broker != null ? prfLossObjData.broker : '' , prfLossObj,
          prfLossObj[revenue]= prfLossObjData.revenue != null ? prfLossObjData.revenue : '', prfLossObj,
          prfLossObj[parcel]= prfLossObjData.parcel != null ?  prfLossObjData.parcel : '', prfLossObj,
          prfLossObj[shipmentCharge]= prfLossObjData.shipmentCharge != null ? prfLossObjData.shipmentCharge : '', prfLossObj,
          prfLossObj[profit]= prfLossObjData.profit != null ? prfLossObjData.profit : '', prfLossObj,
          prfLossObj[profitPerParcel]= prfLossObjData.profitPerParcel != null ? prfLossObjData.profitPerParcel : '', prfLossObj
        );
        zoneDataDownloadedList.push(prfLossObj);
     };
     console.log(zoneDataDownloadedList)
      var currentTime = new Date();
      var fileName = '';
        fileName = "Profit & Loss Report"+"-"+currentTime.toLocaleDateString();
        var options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          title: "Profit & Loss Report",
          useBom: true,
          headers: [ 'Broker / Supplier', 'Revenue / Cost', 'Parcels', 'Shipment Charges', 'Profit', 'Profit per parcel']
        };
        new Angular2Csv(zoneDataDownloadedList, fileName, options);  
    }else{
        this.errorMsg = "**Please select one item to download the profit & loss report";
    }
  };

  clearZone(){
    this.toDate = null;
    this.fromDate = null;
    this.gridOptionsProfit.api.deselectAll();
  }

  onProfitChange(){
    this.errorMsg = null;
  };
  
}


