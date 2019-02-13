import { Component, ElementRef, ViewChild, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-broker-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class BrokerPdfComponent implements OnInit{
  manifestNumber: string;
  errorMsg: string;
  successMsg: String;
  userName: String;
  role_id: String;
  userId: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  ManifestArray: dropdownTemplate[];  
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private _compiler: Compiler
    ){
    this.ManifestArray = [];
    this._compiler.clearCache();
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
        headerName: "Consignee Company",
        field: "consigneeCompany",
        width: 180
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
      },
      {
        headerName: "SKU",
        field: "sku",
        width: 100
      },
      {
        headerName: "Label Sender Name",
        field: "labelSenderName",
        width: 180
      },
      {
        headerName: "Delivery Instructions",
        field: "deliveryInstructions",
        width: 180
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
    this.manifestNumber = event.value ? event.value.value: '';
  }

  downLoadSearch(){
    this.spinner.show();
    this.trackingDataService.fetchBrokerConsignment(this.manifestNumber,this.userId, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);
    })
  }

  downloadLabel(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    var printLabelList = [];
        let referenceNumber = 'referenceNumber';
        let consigneeName = 'consigneeName';
        let consigneeAddr1 = 'consigneeAddr1';
        let consigneeSuburb = 'consigneeSuburb';
        let consigneeState = 'consigneeState';
        let consigneePostcode = 'consigneePostcode';
        let consigneePhone = 'consigneePhone';
        let weight = 'weight';
        let shipperName = 'shipperName';
        let shipperAddr1 = 'shipperAddr1';
        let shipperAddr2 = 'shipperAddr2';
        let shipperCity = 'shipperCity';
        let shipperState = 'shipperState';
        let shipperCountry = 'shipperCountry';
        let shipperPostcode = 'shipperPostcode';
        let barcodeLabelNumber = 'barcodeLabelNumber';
        let datamatrix = 'datamatrix';
        let injectionState = 'injectionState';
        let sku = 'sku';
        let labelSenderName = 'labelSenderName';
        let deliveryInstructions = 'deliveryInstructions';
        let consigneeCompany = 'consigneeCompany';

        for (var labelValue in selectedRows) {
          var labelObj = selectedRows[labelValue];
          var printObj = (
              printObj={}, 
              printObj[referenceNumber]= labelObj.reference_number, printObj,
              printObj[consigneeName]= labelObj.consignee_name, printObj,
              printObj[consigneeAddr1]= labelObj.consignee_addr1, printObj,
              printObj[consigneeSuburb]= labelObj.consignee_Suburb, printObj,
              printObj[consigneeState] = labelObj.consignee_State, printObj,
              printObj[consigneePostcode]= labelObj.consignee_Postcode, printObj,
              printObj[consigneePhone]= labelObj.consignee_Phone, printObj,
              printObj[weight]= labelObj.weight, printObj,
              printObj[shipperName]= labelObj.shipper_Name, printObj,
              printObj[shipperAddr1]= labelObj.shipper_Addr1, printObj,
              printObj[shipperAddr2]= labelObj.shipper_Addr2, printObj,
              printObj[shipperCity] = labelObj.shipper_City, printObj,
              printObj[shipperState]= labelObj.shipper_State, printObj,
              printObj[shipperCountry]= labelObj.shipper_Country, printObj,
              printObj[shipperPostcode]= labelObj.shipper_Postcode, printObj,
              printObj[barcodeLabelNumber]= labelObj.barcodelabelNumber, printObj,
              printObj[datamatrix]= labelObj.datamatrix, printObj,
              printObj[injectionState]= labelObj.injectionState, printObj,
              printObj[sku]= labelObj.sku, printObj,
              printObj[labelSenderName]= labelObj.labelSenderName, printObj,
              printObj[deliveryInstructions]= labelObj.deliveryInstructions, printObj,
              printObj[consigneeCompany]= labelObj.consigneeCompany, printObj
          );
          printLabelList.push(printObj)
        }
        if(selectedRows.length > 0){
          this.spinner.show();
          this.consigmentUploadService.generateLabel(printLabelList, (resp) => {
            this.spinner.hide();
            var pdfFile = new Blob([resp], {type: 'application/pdf'});
            var pdfUrl = URL.createObjectURL(pdfFile);
            var fileName = "file_name.pdf";
            var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = pdfUrl;
                a.download = fileName;
                a.click();
            if(!resp){
              this.successMsg = resp.message;
            }
            setTimeout(() => {
              this.spinner.hide();
            }, 5000);
          });
        }else{
          this.errorMsg = "**Please select the below records before Generating the PDF";
        }
  }

  deleteLabels(){
    var selectedRows = this.gridOptions.api.getSelectedRows();
    var refrenceNumList = [];
    for (var labelValue in selectedRows) {
          var labelObj = selectedRows[labelValue];
          refrenceNumList.push(labelObj.reference_number)
    }
    if(selectedRows.length > 0 ){
        this.spinner.show();
        this.consigmentUploadService.fileUploadDelete(refrenceNumList.toString(), (resp) => {
          this.spinner.hide();
          this.successMsg = resp.message;
          if(!resp){
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
      }else{
        this.errorMsg = "**Please select the below records to delete the entry into D2Z system";
      } 
  } 

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  }
 
}


