import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'app/d2z/service/login.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
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
    englishFlag:boolean;
    chinessFlag:boolean;
    constructor(
      public trackingDataService: TrackingDataService,
      private spinner: NgxSpinnerService,
      public consigmentUploadService: ConsigmentUploadService
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
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
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
              if(that.englishFlag){
                that.errorMsg = '*Please enter the reference or bar code label number to Print the label';
              }else if(that.chinessFlag){
                that.errorMsg = '*请输入参考号或条形码标签号以打印标签';
              } 
              
            } 
          }
      }
    }
  
    toggle(arrow) {
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
 
}
