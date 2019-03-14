import { Component, ElementRef, ViewChild, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-allocate-shipment',
  templateUrl: './allocate-shipment.component.html',
  styleUrls: ['./allocate-shipment.component.css']
})
export class AllocateShipmentComponent implements OnInit{

  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  manifestNumber: string;
  errorMsg: string;
  show: Boolean;
  userId: String;
  successMsg: String;
  userName: String;
  role_id: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  shipmentAllocateForm: FormGroup;
  ManifestArray: dropdownTemplate[];  
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();
    this.ManifestArray = [];
    this.show = false;
    this.shipmentAllocateForm = new FormGroup({
      manifestNumber: new FormControl(),
      shipmentNumber: new FormControl()
    });
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
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
        width: 150
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
        headerName: "Shipper Addr2",
        field: "shipper_Addr2",
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
      this.userId = this.consigmentUploadService.userMessage.user_id;
      this.trackingDataService.manifestList(this.userId, (resp) => {
        this.spinner.hide();
        this.ManifestArray = resp;
        this.manifestNumber = this.ManifestArray[0] ? this.ManifestArray[0].value : '';
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
  
  onManifestChange(event){
    this.manifestNumber = event.value ? event.value.value:'';
  }

  manifestDataSearch(){
    this.spinner.show();
    this.shipmentAllocateForm.value.shipmentNumber = null;
    this.successMsg = null;
    this.trackingDataService.fetchBrokerConsignment(this.manifestNumber,this.userId, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);
    })
  }

  allocateShipment(){
    this.errorMsg = null;
    this.successMsg = '';
    var selectedRows = this.gridOptions.api.getSelectedRows();
    var refrenceNumList = [];
    for (var labelValue in selectedRows) {
          var labelObj = selectedRows[labelValue];
          refrenceNumList.push(labelObj.reference_number)
    }
    if(this.shipmentAllocateForm.value.shipmentNumber == null || this.shipmentAllocateForm.value.shipmentNumber == ''){
      this.errorMsg = "**Please Enter the shipment number for the selected items";
    }
    if(selectedRows.length == 0){
      this.errorMsg = "**Please select the below records to allocate the shipment";
    }
    if(selectedRows.length > 0 && this.errorMsg == null ){
        this.spinner.show();
        this.trackingDataService.shipmentAllocation(refrenceNumList, this.shipmentAllocateForm.value.shipmentNumber, (resp) => {
          this.spinner.hide();
          this.successMsg = resp.responseMessage;
          $('#allocateShipmentModal').modal('show');
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
  };

  clearShipment(){
    $("#shipmentNumber").val('');
    this.rowData = [];
    this.errorMsg = null;
    this.successMsg = null;
  }
 
}


