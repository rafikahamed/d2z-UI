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
  ngOnInit() {}
}

interface City {
  name: string;
  value: string;
}