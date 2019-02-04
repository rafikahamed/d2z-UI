import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
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
    trackingPrintForm: FormGroup;
    englishFlag:boolean;
    chinessFlag:boolean;
    constructor(
      public trackingDataService: TrackingDataService,
      private spinner: NgxSpinnerService,
      public consigmentUploadService: ConsigmentUploadService,
      private router: Router
      ){
      this.trackingPrintForm = new FormGroup({
        refBarNum: new FormControl()
      })
    }
  
    ngOnInit() {
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
    }

    printLable(){
      this.errorMsg=null;
      this.successMsg=null;
      var elem = document.getElementById("print-Util");
      var that = this;
      elem.onkeyup = function(e){
          if(e.keyCode == 13){
            if(that.trackingPrintForm.value.refBarNum != null && $("#print-Util").val().length > 1){
              that.spinner.show();
              that.trackingDataService.generateTrackLabel(that.trackingPrintForm.value.refBarNum.trim(), (resp) => {
                that.spinner.hide();
                if(resp.status === 500){
                  that.errorMsg = that.englishFlag ? ' Invalid "Reference Number" or "BarCode label number" ' : '无效的"参考编号"或"条码标签编号"';
                }else{
                  var pdfFile = new Blob([resp], {type: 'application/pdf'});
                  var pdfUrl = URL.createObjectURL(pdfFile);
                  var printwWindow = window.open(pdfUrl);
                  printwWindow.print();
                  that.successMsg = that.englishFlag ? "Document Opened Successfully" : '文档打开成功';
                  setTimeout(() => {that.spinner.hide()},5000);
                }
              })
            }else{
                that.spinner.hide();
                that.errorMsg = that.englishFlag ? '*Please enter the "Reference Number" or "BarCode label number" to Print the label.' : '请输入"参考编号"或"条码标签编号"以打印标签。';
            } 
          }
      }
    }
 
}
