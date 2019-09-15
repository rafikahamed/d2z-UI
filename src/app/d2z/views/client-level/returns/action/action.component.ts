import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridOptions } from "ag-grid";

@Component({
  selector: 'hms-returns-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})

export class ReturnsActionComponent{
 
  private actionReturnsArray: Array<any> = [];
  errorMsg: string;
  successMsg: String;
  referNumbers: any[];
  user_Id: String;
  system: String;
  arrayBuffer:any;
  actionType: City[];
  public openEnquiryList = [];
  private gridOptions: GridOptions;
    private autoGroupColumnDef;
    private rowGroupPanelShow;
    private rowData: any[];
    private defaultColDef;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();  
    this.gridOptions = <GridOptions>{rowSelection: "multiple"};
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
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      this.actionType  = [
        {"name":"Resend","value":"resend"},
        {"name":"Destroy","value":"destroy"},
        {"name":"Export","value":"export"}
      ];
      this.spinner.show();
      this.consigmentUploadService.fetchOutstandingReturns( null, null, this.user_Id, (resp) => {
        this.spinner.hide();
        this.actionReturnsArray = resp;
        setTimeout(() => {
          this.spinner.hide() 
        }, 5000);
      });

      this.gridOptions.columnDefs = [
        {
          headerName: "Reference number",
          field: "referenceNumber",
          width: 180,
          checkboxSelection: true,
          headerCheckboxSelection: function(params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
        {
          headerName: "Consignee Company",
          field: "consigneeCompany",
          width: 180
        },
        {
          headerName: "Consignee Name",
          field: "consigneeName",
          width: 150
        },
        {
          headerName: "Consignee Address",
          field: "consigneeAddr1",
          width: 200
        },
        {
          headerName: "Consignee Suburb",
          field: "consigneeSuburb",
          width: 150
        },
        {
          headerName: "Consignee State",
          field: "consigneeState",
          width: 150
        },
        {
          headerName: "Consignee Postcode",
          field: "consigneePostcode",
          width: 150
        },
        {
          headerName: "Consignee Phone",
          field: "consigneePhone",
          width: 150
        },
        {
          headerName: "Product Description",
          field: "productDescription",
          width: 160
        },
        {
          headerName: "Value",
          field: "value",
          width: 100
        },
        {
          headerName: "Currency",
          field: "currency",
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
          field: "dimensionsLength",
          width: 100
        },
        {
          headerName: "Dim_Y",
          field: "dimensionsWidth",
          width: 100
        },
        {
          headerName: "Dim_Z",
          field: "dimensionsHeight",
          width: 100
        },
        {
          headerName: "Service type",
          field: "serviceType",
          width: 140
        },
        {
          headerName: "Shipper Name",
          field: "shipperName",
          width: 140
        },
        {
          headerName: "Shipper Address",
          field: "shipperAddr1",
          width: 140
        },
        {
          headerName: "Shipper City",
          field: "shipperCity",
          width: 140
        },
        {
          headerName: "Shipper State",
          field: "shipperState",
          width: 140
        },
        {
          headerName: "Shipper Postcode",
          field: "shipperPostcode",
          width: 160
        },
        {
          headerName: "Shipper Country",
          field: "shipperCountry",
          width: 140
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
      ]   
  };

  onActionTypeChange(){};

  UpdateAction(){

    var referNumber = [];
    this.actionReturnsArray.forEach(function(item){
        if(item.actionType && item.actionType.value == 'resend' && item.selection){
          referNumber.push(item.referenceNumber)
        }
    });
    console.log(referNumber.length)
    console.log(referNumber)
    if(referNumber.length > 0){
      $('#returnAction').modal('show');
      this.referNumbers = referNumber;
    }
  }

}


interface City {
  name: string;
  value: string;
}


