import { Component, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'hms-zebra-labels-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class SuperUserZebraScanPrint implements OnInit{
    errorMsg: string;
    successMsg: String;
    trackingPrintForm: FormGroup;
    englishFlag:boolean;
    chinessFlag:boolean;
    constructor(
      public trackingDataService: TrackingDataService,
      private spinner: NgxSpinnerService,
      public consigmentUploadService: ConsigmentUploadService,
      private router: Router,
      private _compiler: Compiler
      ){
      this._compiler.clearCache();
      this.trackingPrintForm = new FormGroup({
        identifier: new FormControl('articleId'),
        refBarNum: new FormControl()
      })
    }
  
    ngOnInit() {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      })
    };

    printLable(){
      this.errorMsg=null;
      this.successMsg=null;
      var elem = document.getElementById("print-Util");
      var that = this;
      elem.onkeyup = function(e){
          if(e.keyCode == 13){
            if(that.trackingPrintForm.value.refBarNum != null && $("#print-Util").val().length > 1){
              that.spinner.show();
              that.trackingDataService.generateSuperUserTrackLabel(that.trackingPrintForm.value.identifier,that.trackingPrintForm.value.refBarNum.trim(), (resp) => {
                that.spinner.hide();
                if(resp.status === 500){
                  that.errorMsg =  ' Invalid "Reference Number" or "BarCode label number" ';
                }else{
                  var pdfFile = new Blob([resp], {type: 'application/pdf'});
                  var pdfUrl = URL.createObjectURL(pdfFile);
                  var printWindow = window.open(pdfUrl);
                  printWindow.print();
                  printWindow.onfocus = () => setTimeout(function () { printWindow.close(); }, 3000);
                  that.successMsg = "Document Opened Successfully";
                  setTimeout(() => {that.spinner.hide()},5000);
                }
              })
            }else{
                that.spinner.hide();
                that.errorMsg = '*Please enter the "Reference Number" or "BarCode label number" to Print the label.';
            } 
          }
      }
    }
 
}
