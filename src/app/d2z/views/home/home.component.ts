import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'app/d2z/service/login.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  errorMsg: string;
  loginForm: FormGroup;
  userMessage: userMessage;
  loginBut: boolean;

  constructor(
    public loginservice: LoginService,
    public consigmentUploadService: ConsigmentUploadService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
      this.errorMsg = null;
      this.loginBut = true;
      this.loginForm = new FormGroup({
        userName: new FormControl('', Validators.required),
        passWord: new FormControl('', Validators.required)
      });
  }

  ngOnInit(){

  }

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
        console.log(resp.role_Id)
        if(resp.role_Id == 3){
            this.router.navigate(['/main/']);
        }else if(resp.role_Id == 2){
            this.router.navigate(['/broker-main/']);
        }else if(resp.role_Id == 1){
            this.router.navigate(['/superuser-main/']);
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
  message,
  userName,
  access,
  companyName,
  userCode
}