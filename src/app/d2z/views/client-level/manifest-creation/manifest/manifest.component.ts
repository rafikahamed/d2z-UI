import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { LoginService } from 'app/d2z/service/login.service';
import {SelectItem} from 'primeng/api';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface City {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-manifest',
  templateUrl: './manifest.component.html',
  styleUrls: ['./manifest.component.css']
})
export class ManifestComponent implements OnInit{
  childmenu: boolean;
  manifestForm: FormGroup;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  fileName: string;
  errorMsg: string;
  successMsg: String;
  user_Id: String;
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
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService
  ) {
    this.cities2 = [];
    this.manifestForm = new FormGroup({
      manifestNumber: new FormControl(),
      manifestFile: new FormControl()
    });
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
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.spinner.show();
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      if(this.englishFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "Reference number",
            field: "reference_number",
            width: 180,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Name",
            field: "consignee_name",
            width: 150
          },
          {
            headerName: "Address 1",
            field: "consignee_addr1",
            width: 200
          },
          {
            headerName: "Suburb",
            field: "consignee_Suburb",
            width: 100
          },
          {
            headerName: "State",
            field: "consignee_State",
            width: 100
          },
          {
            headerName: "Postcode",
            field: "consignee_Postcode",
            width: 100
          },
          {
            headerName: "Phone",
            field: "consignee_Phone",
            width: 100
          },
          {
            headerName: "Product Description",
            field: "product_Description",
            width: 160
          },
          {
            headerName: "Value",
            field: "value",
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
            field: "dimensions_Length",
            width: 100
          },
          {
            headerName: "Dim_Y",
            field: "dimensions_Width",
            width: 100
          },
          {
            headerName: "Dim_Z",
            field: "dimensions_Height",
            width: 100
          },
          {
            headerName: "Service type",
            field: "servicetype",
            width: 140
          },
          {
            headerName: "Shipper Name",
            field: "shipper_Name",
            width: 140
          },
          {
            headerName: "Shipper Addr1",
            field: "shipper_Addr1",
            width: 140
          },
          {
            headerName: "Shipper City",
            field: "shipper_City",
            width: 140
          },
          {
            headerName: "Shipper State",
            field: "shipper_State",
            width: 140
          },
          {
            headerName: "Shipper Postcode",
            field: "shipper_Postcode",
            width: 140
          },
          {
            headerName: "Shipper Country",
            field: "shipper_Country",
            width: 140
          },
          {
            headerName: "Barcode Label Number",
            field: "barcodelabelNumber",
            width: 350
          },
          {
            headerName: "Data Matrix",
            field: "datamatrix",
            width: 550
          }
        ]
      }
      if(this.chinessFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "参考编号",
            field: "reference_number",
            width: 180,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "名称",
            field: "consignee_name",
            width: 150
          },
          {
            headerName: "地址1",
            field: "consignee_addr1",
            width: 200
          },
          {
            headerName: "市郊",
            field: "consignee_Suburb",
            width: 100
          },
          {
            headerName: "州",
            field: "consignee_State",
            width: 100
          },
          {
            headerName: "邮编",
            field: "consignee_Postcode",
            width: 100
          },
          {
            headerName: "电话",
            field: "consignee_Phone",
            width: 100
          },
          {
            headerName: "产品描述",
            field: "product_Description",
            width: 160
          },
          {
            headerName: "值",
            field: "value",
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
            headerName: "昏暗的X.",
            field: "dimensions_Length",
            width: 100
          },
          {
            headerName: "昏暗的Y.",
            field: "dimensions_Width",
            width: 100
          },
          {
            headerName: "昏暗的Z.",
            field: "dimensions_Height",
            width: 100
          },
          {
            headerName: "服务类型",
            field: "servicetype",
            width: 140
          },
          {
            headerName: "托运人姓名",
            field: "shipper_Name",
            width: 140
          },
          {
            headerName: "托运人Addr1",
            field: "shipper_Addr1",
            width: 140
          },
          {
            headerName: "托运人城市",
            field: "shipper_City",
            width: 140
          },
          {
            headerName: "托运人国家",
            field: "shipper_State",
            width: 140
          },
          {
            headerName: "托运人邮政编码",
            field: "shipper_Postcode",
            width: 140
          },
          {
            headerName: "托运人国家",
            field: "shipper_Country",
            width: 140
          },
          {
            headerName: "条形码标签号",
            field: "barcodelabelNumber",
            width: 350
          },
          {
            headerName: "数据矩阵",
            field: "datamatrix",
            width: 550
          }
        ]
      }
      // http call to get the data file list
      this.consigmentUploadService.fileList( this.user_Id, (resp) => {
        this.spinner.hide();
        this.cities2 = resp;
        this.fileName = this.cities2[0].value;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
  }
  
  onFileChange(event){
    this.fileName = event.value.value;
  }

  manifestSearch(){
    this.spinner.show();
    this.consigmentUploadService.manifestFileData(this.fileName, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);
    })
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

  manifestCreation(){
    this.errorMsg = null;
    this.successMsg = '';
    var selectedRows = this.gridOptions.api.getSelectedRows();
    var refrenceNumList = [];
    for (var labelValue in selectedRows) {
          var labelObj = selectedRows[labelValue];
          refrenceNumList.push(labelObj.reference_number)
    }
    if(this.manifestForm.value.manifestNumber == null || this.manifestForm.value.manifestNumber == ''){
      if(this.englishFlag){
          this.errorMsg = "**Please Enter the manifest number for the given entry";
      }else if(this.chinessFlag){
          this.errorMsg = "**请输入给定条目的清单编号";
      }
    }
    if(selectedRows.length == 0){
      if(this.englishFlag){
          this.errorMsg = "**Please select the below records to update the manifest entry into D2Z system";
      }else if(this.chinessFlag){
          this.errorMsg = "**请选择以下记录以将清单条目更新到D2Z系统";
      }
    }
    
    if(selectedRows.length > 0 && this.errorMsg == null ){
        this.spinner.show();
        this.trackingDataService.manifestCreation(this.manifestForm.value.manifestNumber, refrenceNumList, (resp) => {
          this.spinner.hide();
          this.successMsg = resp.message;
          if(!resp){
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
    }
  } 

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}



