import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';

@Component({
  selector: 'hms-superuser-level-invoices',
  templateUrl: './reconcile.component.html',
  styleUrls: ['./reconcile.component.css']
})

export class SuperUserReconcileComponent implements OnInit {

  userName: String;
  role_id: String;
  constructor(
    public consignmenrServices: ConsigmentUploadService
  ){}

  ngOnInit() {
    this.getLoginDetails();
  }

  getLoginDetails(){
    if(this.consignmenrServices.userMessage != undefined){
      this.userName = this.consignmenrServices.userMessage.userName;
      this.role_id = this.consignmenrServices.userMessage.role_Id;
    }
  }

}

