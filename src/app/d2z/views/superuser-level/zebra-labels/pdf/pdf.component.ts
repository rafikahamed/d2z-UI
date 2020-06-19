import { Component, OnInit, Compiler} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'hms-zebra-labels-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class SuperUserZebraScanPDF implements OnInit{
    trackingPrintForm: FormGroup;
    errorMsg: string;
    successMsg: String;
    englishFlag:boolean;
    chinessFlag:boolean;
    constructor(
      public trackingDataService: TrackingDataService,
      private spinner: NgxSpinnerService,
      public consigmentUploadService: ConsigmentUploadService,
      private router: Router,
      private _compiler: Compiler
    ) {
      this._compiler.clearCache();
      this.trackingPrintForm = new FormGroup({
        identifier: new FormControl('articleId'),
        refBarNum: new FormControl()
      });
    }
  
    ngOnInit() {
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
            var numberOfLineBreaks = '';
            numberOfLineBreaks = (that.trackingPrintForm.value.refBarNum.match(/\n/g)||[]).length;
            if(that.trackingPrintForm.value.refBarNum != null && $("#pdf-Util").val().length > 1){
                  that.spinner.show();
                  var fileRefNum = that.trackingPrintForm.value.refBarNum;
                  that.trackingDataService.generateSuperUserTrackLabel(that.trackingPrintForm.value.identifier,that.trackingPrintForm.value.refBarNum.trim(), (resp) => {
                  that.spinner.hide();
                    if(resp.status === 500){
                      that.errorMsg =' Invalid "Reference Number" or "BarCode label number"';
                    }else{
                      var pdfFile = new Blob([resp], {type: 'application/pdf'});
                      var pdfUrl = URL.createObjectURL(pdfFile);
                      var fileName = fileRefNum+"-tracking.pdf";
                      var a = document.createElement("a");
                          document.body.appendChild(a);
                          a.href = pdfUrl;
                          a.download = fileName;
                          a.click();
                          that.successMsg = " Document Downloaded Successfully ";
                      setTimeout(() => { that.spinner.hide() }, 5000);
                    }
                  })
            }else{
              that.spinner.hide();
              that.errorMsg =  '*Please enter the "Reference Number" or "barCode Label Number" to generate the PDF.';
            }
          }
      }
    }
 
}

