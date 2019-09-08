import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'hms-returns-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})

export class ReturnsActionComponent{
 
  private actionReturnsArray: Array<any> = [];
  errorMsg: string;
  successMsg: String;
  user_Id: String;
  system: String;
  arrayBuffer:any;
  actionType: City[];
  public openEnquiryList = [];
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService : TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this._compiler.clearCache();  
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
  };

  onActionTypeChange(){};

  UpdateAction(){

    var referNumber = [];
    this.actionReturnsArray.forEach(function(item){
      console.log(item)
        if(item.actionType && item.actionType.value == 'resend' && item.selection){
          referNumber.push(item.referenceNumber)
        }
    });

    if(referNumber.length > 0){
      $('#returnAction').modal('show');
    }
  }

}


interface City {
  name: string;
  value: string;
}


