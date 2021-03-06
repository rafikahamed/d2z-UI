import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'app/d2z/service/login.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-policy',
  templateUrl: './customs-quote.component.html',
  styleUrls: ['./customs-quote.component.css']
})
export class CustomsQuoteComponent implements OnInit {
  errorMsg: string;
  loginForm: FormGroup;
  userMessage: userMessage;
  loginBut: boolean;
  constructor(
    public loginservice: LoginService,
    public consigmentUploadService: ConsigmentUploadService,
    private router: Router,
    private spinner: NgxSpinnerService
  ){
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      passWord: new FormControl('', Validators.required)
    });
  }

  ngOnInit(){
    console.log("inside the data");
  };

  validateForm(){
    var input = $('.validate-input .input100');
    $('.validate-form').on('submit',function(){
        var check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        return check;
    });

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }
  }

  login() {
    this.validateForm();
    if(this.loginForm.status == 'VALID'){
      this.spinner.show();
      this.consigmentUploadService.authenticate(this.loginForm.value, (resp) => {
        this.userMessage = resp;
        this.spinner.hide();
        if(resp.role_Id == 3){
            this.router.navigate(['/main/']);
            this.consigmentUploadService.getLoginDetails(this.userMessage);
        }else if(resp.role_Id == 2){
            this.router.navigate(['/broker-main/']);
            this.consigmentUploadService.getLoginDetails(this.userMessage);
        }else if(resp.role_Id == 1 || resp.role_Id == 4 || resp.role_Id == 5){
            this.router.navigate(['/superuser-main/']);
            this.consigmentUploadService.getLoginDetails(this.userMessage);
        }
        this.userMessage = resp;
        setTimeout(() => {
        }, 5000);
      })
    }else{
      this.errorMsg = "Form is invalid";
    }
    $('#myModal').modal('toggle');
  }
}

export interface userMessage {
  contactName,
  address,
  suburb,
  state,
  postCode,
  country,
  emailAddress,
  userName,
  serviceType,
  contactPhoneNumber,
  role_Id,
  companyName
}
