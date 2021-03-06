import { Component, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'hms-completed-enquiry',
  templateUrl: './completed-enquiry.component.html',
  styleUrls: ['./completed-enquiry.component.css']
})

export class superUserCompletedEnquiryComponent implements OnInit{
  manifestForm: FormGroup;
  fileName: string;
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  public gridOptions: GridOptions;
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  public rowData: any[];
  public defaultColDef;
  file:File;
  system: String;
 
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();
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
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.spinner.show();
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      this.gridOptions.columnDefs = [
          {
            headerName: "Ticket ID",
            field: "ticketNumber",
            width: 150,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Article ID",
            field: "articleID",
            width: 180
          },
          {
            headerName: "Reference Number",
            field: "referenceNumber",
            width: 200
          },
          {
            headerName: "Enquiry",
            field: "deliveryEnquiry",
            width: 100
          },
          {
            headerName: "POD",
            field: "pod",
            width: 100
          },
          {
            headerName: "Client/Broker Comments",
            field: "comments",
            width: 300
          },
          {
            headerName: "D2Z Comments",
            field: "d2zComments",
            width: 300
          },
          {
            headerName: "Tracking Status",
            field: "trackingStatus",
            width: 150
          },
          {
            headerName: "Consignee Name",
            field: "consigneeName",
            width: 150
          },
          {
            headerName: "Tracking Event",
            field: "trackingEvent",
            width: 150
          },
          {
            headerName: "Tracking Date",
            field: "trackingEventDateOccured",
            width: 200
          }
        ]
      this.consigmentUploadService.superUserCompletedEnquiry((resp) => {
        this.spinner.hide();
        this.rowData = resp; 
        setTimeout(() => {
          this.spinner.hide() }, 5000);
      });
  }
  
  onEnquiryChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg = null;
  };

}

interface City {
  name: string;
  value: string;
}