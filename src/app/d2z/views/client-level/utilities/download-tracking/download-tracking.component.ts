import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { LoginService } from 'app/d2z/service/login.service';
import {SelectItem} from 'primeng/api';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

interface City {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-download-tracking',
  templateUrl: './download-tracking.component.html',
  styleUrls: ['./download-tracking.component.css']
})
export class UtilitiesTracking implements OnInit{
  fileName: string;
  errorMsg: string;
  user_Id: String;
  successMsg: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  file:File;
  cities2: City[];  
  selectedCity2: City;
  englishFlag:boolean;
  chinessFlag:boolean;

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.cities2 = [];
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
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
      this.user_Id= this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
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
              field: "refrenceNumber",
              width: 250,
              checkboxSelection: true,
              headerCheckboxSelection: function(params) {
                return params.columnApi.getRowGroupColumns().length === 0;
              }
            },
            {
              headerName: "Name",
              field: "consigneeName",
              width: 250
            },
            {
              headerName: "Barcode Label Number",
              field: "barCodeLabelNumber",
              width: 500
            }
          ]
      } 
      if(this.chinessFlag){
          this.gridOptions.columnDefs = [
            {
              headerName: "参考编号",
              field: "refrenceNumber",
              width: 250,
              checkboxSelection: true,
              headerCheckboxSelection: function(params) {
                return params.columnApi.getRowGroupColumns().length === 0;
              }
            },
            {
              headerName: "名称",
              field: "consigneeName",
              width: 250
            },
            {
              headerName: "条形码标签号",
              field: "barCodeLabelNumber",
              width: 500
            }
          ]
      }
      this.consigmentUploadService.fileList(this.user_Id, (resp) => {
        this.spinner.hide();
        this.cities2 = resp;
        this.fileName = this.cities2[0] ? this.cities2[0].value:'';
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      })
  }
  
  onFileChange(event){
    this.fileName = event.value ? event.value.value : '';
  }

  trackingList(){
    this.spinner.show();
    this.consigmentUploadService.downloadTrackingList(this.fileName, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);
    })
  };

  downloadTracking(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length > 0 ){
        var currentTime = new Date();
        var fileName = '';
            fileName = "Tracking_Details"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: [ 'Reference Number', 'Consignee Name', 'BarCode Label Number' ]
          };
        new Angular2Csv(selectedRows, fileName, options);        
      }else{
        if(this.englishFlag){
          this.errorMsg = "**Please select the below records to download the tracking details";
        }else if(this.chinessFlag){
          this.errorMsg = "**请选择以下记录以下载跟踪详细信息";
        }
      } 
  } 

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}



