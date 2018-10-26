import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { BrokerService } from 'app/d2z/service/broker/broker.service';
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

  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  manifestNumber: string;
  errorMsg: string;
  successMsg: String;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  ManifestArray: dropdownTemplate[];  
  selectedManifest: dropdownTemplate;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public brokerService: BrokerService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService
  ) {
    this.ManifestArray = [];
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
      this.childmenu = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.spinner.show();
      this.trackingDataService.manifestList( (resp) => {
        this.spinner.hide();
        this.ManifestArray = resp;
        this.manifestNumber = this.ManifestArray[0].value;
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
  }
  
  onManifestChange(event){
    this.manifestNumber = event.value.value;
  }

  downLoadSearch(){
    this.spinner.show();
    this.trackingDataService.fetchBrokerConsignment(this.manifestNumber, (resp) => {
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
              printObj[injectionState]= labelObj.injectionState, printObj
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


