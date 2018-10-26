import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'app/d2z/service/login.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'hms-utilities-print',
  templateUrl: './utilities-print.component.html',
  styleUrls: ['./utilities-print.component.css']
})
export class UtilitiesScanPrint implements OnInit{
    errorMsg: string;
    successMsg: String;
    childmenuOne: boolean;
    trackingPrintForm: FormGroup;
    childmenuTwo:boolean;
    childmenuThree:boolean;
    childmenuFour:boolean;
    childmenuFive:boolean;
    constructor(
      public trackingDataService: TrackingDataService,
      private spinner: NgxSpinnerService
    ) {
      this.trackingPrintForm = new FormGroup({
        refBarNum: new FormControl()
      });
    }
  
    ngOnInit() {
      this.childmenuOne = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
    }

    printLable(){
      this.errorMsg=null;
      this.successMsg=null;
      var elem = document.getElementById("print-Util");
      var that = this;
      elem.onkeyup = function(e){
          if(e.keyCode == 13){
            if(that.trackingPrintForm.value.refBarNum != null){
              that.spinner.show();
              that.trackingDataService.generateTrackLabel(that.trackingPrintForm.value.refBarNum.trim(), (resp) => {
                that.spinner.hide();
                var pdfFile = new Blob([resp], {type: 'application/pdf'});
                var pdfUrl = URL.createObjectURL(pdfFile);
                var printwWindow = window.open(pdfUrl);
                printwWindow.print();
                that.successMsg = "Document Opened Successfully";
                setTimeout(() => {
                  that.spinner.hide();
                }, 5000);
              })
            }else{
              that.errorMsg = '*Please enter the reference or bar code label number to Print the label';
            } 
          }
      }
    }
  
    toggle(arrow) {
      // debugger
      this.childmenuOne = !this.childmenuOne;
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
      this.childmenuOne = !this.childmenuOne;
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
