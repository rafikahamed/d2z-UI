import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'app/d2z/service/login.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-whychoose',
  templateUrl: './whychoose.component.html',
  styleUrls: ['./whychoose.component.css']
})
export class WhyChooseComponent implements OnInit{
  errorMsg: string;
  loginForm: FormGroup;
  userMessage: userMessage;
  loginBut: boolean;

  constructor(
    public loginservice: LoginService,
    public consigmentUploadService: ConsigmentUploadService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private meta: Meta
  ) {
      this.errorMsg = null;
      this.loginBut = true;
      this.loginForm = new FormGroup({
        userName: new FormControl('', Validators.required),
        passWord: new FormControl('', Validators.required)
      });

      this.meta.addTag({ name: 'description', content: 'We are the best international logistics & freight forwarding specialists for ecommerce goods. Delivering first rate supply chain solutions & cost savings.' });

 this.meta.addTag( {name: 'keywords', content: 'eCommerce logistics, eCommerce specialist'});

 this.meta.addTag( {property: 'og:title', content: 'Freight Forwarder and eCommerce logistics| D2Z Pty Ltd'});
    

  }

  ngOnInit(){
    this.router.events.subscribe((evt) => {
    if (!(evt instanceof NavigationEnd)) {
            return;}
        window.scrollTo(0, 0)
      });
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
    var menuSelection  = this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuSelection.childmenuOne = false;
    menuSelection.childmenuTwo = true;
    menuSelection.childmenuThree = true;
    menuSelection.childmenuFour = true;
    menuSelection.childmenuFive = true;
    var menuBrokerSelection  = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    menuBrokerSelection.childmenubrkOne = false;
    menuBrokerSelection.childmenubrkTwo = true;
    menuBrokerSelection.childmenubrkThree = true;
    menuBrokerSelection.childmenubrkFour = true;
    menuBrokerSelection.childmenubrkFive = true;
     menuBrokerSelection.childmenubrkSix = true;
    
    var menuSuperSelection  = this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperSelection.childmenuSuperOne = false;
    menuSuperSelection.childmenuSuperTwo = true;
    menuSuperSelection.childmenuSuperThree = true;
    if(this.loginForm.status == 'VALID'){
      this.spinner.show();
      this.consigmentUploadService.authenticate(this.loginForm.value, (resp) => {
        this.userMessage = resp;
        this.consigmentUploadService.getLoginDetails(resp);
        this.spinner.hide();
        if(resp.status == 500){
            this.errorMsg = "**Invalid Credentials, Please try again";
        }else{
            $('#myModal').modal('toggle');
            if(resp.role_Id == 3){
                this.router.navigate(['/main/']);
                this.consigmentUploadService.getLoginDetails(this.userMessage);
            }else if(resp.role_Id == 2){
                this.router.navigate(['/broker-main/']);
                this.consigmentUploadService.getLoginDetails(this.userMessage);
            }else if(resp.role_Id == 1){
                this.router.navigate(['/superuser-main/']);
                this.consigmentUploadService.getLoginDetails(this.userMessage);
            }
        }
      })
    }else{
      this.errorMsg = "Form is invalid";
    }
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
