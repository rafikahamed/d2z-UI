import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { LoginService } from 'app/d2z/service/login.service';
import {SelectItem} from 'primeng/api';
declare var $: any;
import { GridOptions } from "ag-grid";

interface City {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-print-labels',
  templateUrl: './print-labels.component.html',
  styleUrls: ['./print-labels.component.css']
})
export class ZebraPrintLabels implements OnInit{

    childmenu: boolean;
    childmenuTwo:boolean;
    childmenuThree:boolean;
    childmenuFour:boolean;
    childmenuFive:boolean;
    fileName: string;

    private gridOptions: GridOptions;
    private autoGroupColumnDef;
    private rowGroupPanelShow;
    private rowData: any[];
    private defaultColDef;
    file:File;
  
    cities2: City[];  
    selectedCity2: City;
    constructor() {
      this.cities2 = [
          {name: 'Upload-file-template-1', value: 'Upload-file-template-1'},
          {name: 'Upload-file-template-2', value: 'Upload-file-template-2'},
          {name: 'Upload-file-template-3', value: 'Upload-file-template-3'},
          {name: 'Upload-file-template-4', value: 'Upload-file-template-4'},
          {name: 'Upload-file-template-5', value: 'Upload-file-template-5'}
      ];

      this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
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
          headerName: "Name",
          field: "name",
          width: 150
        },
        {
          headerName: "Company",
          field: "company",
          width: 100
        },
        {
          headerName: "Address 1",
          field: "addr1",
          width: 200
        },
        {
          headerName: "Suburb",
          field: "suburb",
          width: 100
        },
        {
          headerName: "State",
          field: "state",
          width: 100
        },
        {
          headerName: "Postcode",
          field: "postCode",
          width: 100
        },
        {
          headerName: "Phone",
          field: "phone",
          width: 100
        },
        {
          headerName: "Product Description",
          field: "prodDesc",
          width: 160
        },
        {
          headerName: "Value",
          field: "value",
          width: 100
        },
        {
          headerName: "Shipped Quantity",
          field: "quantity",
          width: 150
        },
        {
          headerName: "Weight",
          field: "weight",
          width: 100
        },
        {
          headerName: "Dim_X",
          field: "dimx",
          width: 100
        },
        {
          headerName: "Dim_Y",
          field: "dimy",
          width: 100
        },
        {
          headerName: "Dim_Z",
          field: "dimz",
          width: 100
        },
        {
          headerName: "Service type",
          field: "serviceType",
          width: 140
        },
        {
          headerName: "Del Type",
          field: "delType",
          width: 100
        },
        {
          headerName: "Shipper Name",
          field: "shipperName",
          width: 140
        },
        {
          headerName: "Shipper Addr1",
          field: "shipperAddr1",
          width: 140
        },
        {
          headerName: "Shipper Addr2",
          field: "shipperAddr2",
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
          width: 140
        },
        {
          headerName: "Shipper Country",
          field: "shipperCountry",
          width: 140
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
    }
    
    onFileChange(event){
      this.fileName = event.value.value;
    }

    zibraSearch(){
      this.rowData = [
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          },
          {
            addr1 : "72 Daws Rd  Edwardstown", company: "", delType : "SRD", dimx :"10", dimy : "10", dimz : "10", name : "Declan  Muldoon",
            phone : "(614)32701309", postCode : "5039", prodDesc:"Stereo", quantity: "1",  referenceNumber:"3346", serviceType : "1P",
            shipperAddr1 : "Block A  Jalan PJU 1A/20A", shipperAddr2 : "Dataran Ara Damansara", shipperCity : "Petaling Jaya", shipperCountry:"MY",
            shipperName:"XCITE AUDIO", shipperPostcode:"47301", state: "South Australia", suburb : "Edwardstown", value : "139.99", weight :"1.6"
          }

      ]
    }

    toggle(arrow) {
      // debugger
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
      // debugger
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
      // debugger
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
 
}
