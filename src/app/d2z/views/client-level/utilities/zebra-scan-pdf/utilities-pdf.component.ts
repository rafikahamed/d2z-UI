import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'hms-utilities-pdf',
  templateUrl: './utilities-pdf.component.html',
  styleUrls: ['./utilities-pdf.component.css']
})
export class UtilitiesScanPdf implements OnInit{

    childmenuOne: boolean;
    trackingPrintForm: FormGroup;
    childmenuTwo:boolean;
    childmenuThree:boolean;
    childmenuFour:boolean;
    childmenuFive:boolean;
    errorMsg: string;
    successMsg: String;
    englishFlag:boolean;
    chinessFlag:boolean;

    constructor(
      public trackingDataService: TrackingDataService,
      private spinner: NgxSpinnerService,
      public consigmentUploadService: ConsigmentUploadService,
      private router: Router
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
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
    }

    downloadLable(){
      this.errorMsg=null;
      this.successMsg=null;
      var elem = document.getElementById("pdf-Util");
      var that = this;
      elem.onkeyup = function(e){
          if(e.keyCode == 13){
            if(that.trackingPrintForm.value.refBarNum != null && $("#pdf-Util").val().length > 1){
              that.spinner.show();
              var fileRefNum = that.trackingPrintForm.value.refBarNum;
              that.trackingDataService.generateTrackLabel(that.trackingPrintForm.value.refBarNum.trim(), (resp) => {
              that.spinner.hide();
                if(resp.status === 500){
                  that.errorMsg = that.englishFlag ? ' Invalid "Reference Number" or "BarCode label number" ' : '无效的"参考编号"或"条码标签编号"';
                }else{
                  var pdfFile = new Blob([resp], {type: 'application/pdf'});
                  var pdfUrl = URL.createObjectURL(pdfFile);
                  var fileName = fileRefNum+"-tracking.pdf";
                  var a = document.createElement("a");
                      document.body.appendChild(a);
                      a.href = pdfUrl;
                      a.download = fileName;
                      a.click();
                      that.successMsg = that.englishFlag ? "Document Downloaded Successfully" : '文档下载成功';
                  setTimeout(() => { that.spinner.hide() }, 5000);
                }
              })
            }else{
              that.spinner.hide();
              that.errorMsg = that.englishFlag ? '*Please enter the "Reference Number" or "barCode Label Number" to generate the PDF.' : '*请输入"参考编号"或"条码标签编号"以生成PDF。';
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

