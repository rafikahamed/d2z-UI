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
  public gridOptionsBroker: GridOptions;
  public gridOptionsPfl: GridOptions;
  public gridOptionsNex: GridOptions;
  public gridOptionsAupost: GridOptions;
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  public rowData: any[];
  public defaultColDef;
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
    let metroZones = ['N0','V0','Q0','S0','W0','T0','N1','V1','Q1','S1','W1','NT1'];
    var selectedbroker = this.gridOptionsBroker.api.getSelectedRows();
    if(selectedbroker.length == 0){
      this.errorMsg = "**Atleast one broker should be selected";
    }
    let brokerName = 'brokerName';
    let userId = 'userId';
    let fromDate = 'fromDate';
    let toDate = 'toDate';
    var brokervalue = selectedbroker[0].brokerName;
    console.log(brokervalue)
    for (var data in selectedbroker) {
      var brokerData = selectedbroker[data];
      var brokerSelObj = (
        brokerSelObj={}, 
        brokerSelObj[brokerName]= brokerData.brokerName != undefined ? brokerData.brokerName : '', brokerSelObj,
        brokerSelObj[userId]= brokerData.userId != undefined ? brokerData.userId : '', brokerSelObj,
        brokerSelObj[fromDate]= this.fromDate != undefined ? this.fromDate+" 00:00:00:000" : '', brokerSelObj,
        brokerSelObj[toDate]= this.toDate != undefined ? this.toDate+" 23:59:59:999" : '', brokerSelObj
      )
      this.brokerRequestList.push(brokerSelObj);
      }

      if(this.brokerRequestList.length > 1){
        this.errorMsg = "**Only one broker allowed";
      }else{
        this.errorMsg = null;
        console.log(this.brokerRequestList);
        this.spinner.show()
        this.consignmenrServices.getZoneDetails(this.brokerRequestList, (resp) => {
        console.log(resp);
          if(resp.zoneResponse && resp.zoneResponse.length > 0){
            var zoneDataDownloadedList = [];
            this.spinner.hide();
            var zoneData = resp.zoneResponse;
            var zoneDataFull = resp.zoneResponse;
            var categoryResp = resp.categoryResponse;
            let zone = 'zone';
            let category1 = 'category1';
            let category2 = 'category2';
            let category3 = 'category3';
            let category4 = 'category4';
            let category5 = 'category5';
            let category6 = 'category6';
            let category7 = 'category7';
            let category8 = 'category8';
            let category9 = 'category9';
            let category10 = 'category10';
            let totalCnt = 'totalCnt';
            let zonePerctange = 'zonePerctange';
            let metro = 'metro'
            zoneData = zoneData.slice(0, zoneData.length - 1);
            var zoneDataLast = zoneDataFull.slice(-1);
            
            for(var zoneDataObj in zoneData){
                var zoneObj = zoneData[zoneDataObj];
                var zoneFinalObj = (
                  zoneFinalObj={}, 
                  zoneFinalObj[zone]= zoneObj.zone != null ? zoneObj.zone : '' , zoneFinalObj,
                  zoneFinalObj[category1]= zoneObj.category1 != null ? zoneObj.category1 : 0, zoneFinalObj,
                  zoneFinalObj[category2]= zoneObj.category2 != null ?  zoneObj.category2 : 0, zoneFinalObj,
                  zoneFinalObj[category3]= zoneObj.category3 != null ? zoneObj.category3 : 0, zoneFinalObj,
                  zoneFinalObj[category4]= zoneObj.category4 != null ? zoneObj.category4 : 0, zoneFinalObj,
                  zoneFinalObj[category5]= zoneObj.category5 != null ? zoneObj.category5 : 0, zoneFinalObj,
                  zoneFinalObj[category6]= zoneObj.category6 != null ? zoneObj.category6 : 0, zoneFinalObj,
                  zoneFinalObj[category7]= zoneObj.category7 != null ? zoneObj.category7 : 0, zoneFinalObj,
                  zoneFinalObj[category8]= zoneObj.category8 != null ? zoneObj.category8 : 0, zoneFinalObj,
                  zoneFinalObj[category9]= zoneObj.category9 != null ? zoneObj.category9 : 0, zoneFinalObj,
                  zoneFinalObj[category10]= zoneObj.category10 != null ? zoneObj.category10 : 0, zoneFinalObj,
                  zoneFinalObj[totalCnt]= zoneObj.totalCnt != null ? zoneObj.totalCnt : 0, zoneFinalObj,
                  zoneFinalObj[zonePerctange]= zoneObj.zonePerctange != null ? zoneObj.zonePerctange+"%" : 0+"%", zoneFinalObj,
                  zoneFinalObj[metro] = metroZones.includes(zoneObj.zone)? 'Metro' : 'Not',zoneFinalObj
                );
                zoneDataDownloadedList.push(zoneFinalObj);
             };
           
             for(var zoneDataLastObj in zoneDataLast){
              var zoneLast = zoneDataLast[zoneDataLastObj];
              var zoneLastObj = (
                zoneLastObj={}, 
                zoneLastObj[zone]     = zoneLast.zone != null ? zoneLast.zone : '' , zoneLastObj,
                zoneLastObj[category1]= zoneLast.category1 != null ? zoneLast.category1 : 0, zoneLastObj,
                zoneLastObj[category2]= zoneLast.category2 != null ? zoneLast.category2 : 0, zoneLastObj,
                zoneLastObj[category3]= zoneLast.category3 != null ? zoneLast.category3 : 0, zoneLastObj,
                zoneLastObj[category4]= zoneLast.category4 != null ? zoneLast.category4 : 0, zoneLastObj,
                zoneLastObj[category5]= zoneLast.category5 != null ? zoneLast.category5 : 0, zoneLastObj,
                zoneLastObj[category6]= zoneLast.category6 != null ? zoneLast.category6 : 0, zoneLastObj,
                zoneLastObj[category7]= zoneLast.category7 != null ? zoneLast.category7 : 0, zoneLastObj,
                zoneLastObj[category8]= zoneLast.category8 != null ? zoneLast.category8 : 0, zoneLastObj,
                zoneLastObj[category9]= zoneLast.category9 != null ? zoneLast.category9 : 0, zoneLastObj,
                zoneLastObj[category10]= zoneLast.category10 != null ? zoneLast.category10 : 0, zoneLastObj,
                zoneLastObj[totalCnt] = zoneLast.total != null ? zoneLast.total : 0, zoneLastObj,
                zoneLastObj[zonePerctange]= zoneLast.total != null ? '' : '', zoneLastObj

              );
              zoneDataDownloadedList.push(zoneLastObj);
           };

           if(categoryResp){
            var categoryObj = (
              categoryObj={}, 
              categoryObj[zone]     = categoryResp.zone != null ? categoryResp.zone : '' , categoryObj,
              categoryObj[category1]= categoryResp.category1 != null ? categoryResp.category1+"%" : 0+"%", categoryObj,
              categoryObj[category2]= categoryResp.category2 != null ? categoryResp.category2+"%" : 0+"%", categoryObj,
              categoryObj[category3]= categoryResp.category3 != null ? categoryResp.category3+"%" : 0+"%", categoryObj,
              categoryObj[category4]= categoryResp.category4 != null ? categoryResp.category4+"%" : 0+"%", categoryObj,
              categoryObj[category5]= categoryResp.category5 != null ? categoryResp.category5+"%" : 0+"%", categoryObj,
              categoryObj[category6]= categoryResp.category6 != null ? categoryResp.category6+"%" : 0+"%", categoryObj,
              categoryObj[category7]= categoryResp.category7 != null ? categoryResp.category7+"%" : 0+"%", categoryObj,
              categoryObj[category8]= categoryResp.category8 != null ? categoryResp.category8+"%" : 0+"%", categoryObj,
              categoryObj[category9]= categoryResp.category9 != null ? categoryResp.category9+"%" : 0+"%", categoryObj,
              categoryObj[category10]= categoryResp.category10 != null ? categoryResp.category10+"%" : 0+"%", categoryObj,
              categoryObj[totalCnt] = categoryResp.total != null ? '' : '', categoryObj,
              categoryObj[zonePerctange]= categoryResp.total != null ? '' : '', categoryObj
              );
            zoneDataDownloadedList.push(categoryObj);
           }

           console.log(zoneDataDownloadedList);
             var currentTime = new Date();
              var fileName = '';
                fileName = "Zone and Weight Report"+"-"+currentTime.toLocaleDateString();
                var options = { 
                  fieldSeparator: ',',
                  quoteStrings: '"',
                  decimalseparator: '.',
                  showLabels: true, 
                  title: brokervalue,
                  useBom: true,
                  headers: [ 'Zone', '0.5', '1', '2', '3', '4', '5', '7','10','15','22','Total','%','Metro']
                };
            new Angular2Csv(zoneDataDownloadedList, fileName, options);   
          }else{
            this.successMsg = "**Given Broker dose not have any zone details";
          }
          this.spinner.hide();
        });
      }
  };

  clearZone(){
    this.toDate = null;
    this.fromDate = null;
    this.gridOptionsBroker.api.deselectAll();
  }

  onZoneReportChange(){};
  
}


