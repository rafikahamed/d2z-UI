import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'app/d2z/service/login.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { Global } from 'app/d2z/service/Global';

declare var $: any;

@Component({
  selector: 'hms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  errorMsg: string;
  successMsg:string;
  contactForm : FormGroup;
  loginForm: FormGroup;
  userMessage: userMessage;
  loginBut: boolean;

  constructor(
    public loginservice: LoginService,
    public consigmentUploadService: ConsigmentUploadService,
    private router: Router,
     public global: Global,
    private spinner: NgxSpinnerService,
    private meta: Meta
  ) {
      this.errorMsg = null;
      this.successMsg = null;
      this.loginBut = true;
      this.loginForm = new FormGroup({
        userName: new FormControl('', Validators.required),
        passWord: new FormControl('', Validators.required)
      });
  this.contactForm = new FormGroup({
        Name: new FormControl(),
        Email: new FormControl(),
        Subject: new FormControl(),
        Message: new FormControl()
      });
    this.meta.addTag({ name: 'description', content: 'We are the best international logistics & freight forwarding specialists for ecommerce goods. Delivering first rate supply chain solutions & cost savings.' });

    this.meta.addTag( {name: 'keywords', content: 'eCommerce logistics, eCommerce specialist'});

    this.meta.addTag( {property: 'og:title', content: 'Freight Forwarder and eCommerce logistics| D2Z Pty Ltd'});
    
    this.meta.addTag({ property: 'og:description', content: 'We are the best international logistics & freight forwarding specialists for ecommerce goods. Delivering first rate supply chain solutions & cost savings.' });


    this.meta.addTag({ property: 'og:image', content: '../../../assets/img/slider/slider-bg1.jpg', itemprop: 'image' });
    this.meta.addTag({ property: 'og:image:url', content: '../../../assets/img/slider/slider-bg1.jpg', itemprop: 'image' });
    this.meta.addTag({ property: 'og:image:type', content: 'image/jpg' });
    this.meta.addTag({ property: 'og:url', content:'https://www.d2z.com/' });

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

  contactus()
{  if(this.contactForm.value.Name != null && this.contactForm.value.Email !=null && this.contactForm.value.Subject!=null && this.contactForm.value.Message!=null)
{
this.spinner.show();

 this.consigmentUploadService.contactus(this.contactForm.value, (resp) => {
         this.userMessage = resp;
        this.spinner.hide();
        this.successMsg = this.userMessage.message;
            
      })
      }
      else
      {
      this.errorMsg ="All fields are required";
      }
      
    };

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
    menuSuperSelection.childmenuSuperFour = true;
    menuSuperSelection.childmenuSuperFive = true;
    menuSuperSelection.childmenuSuperSix = true;
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
            }else if(resp.role_Id == 1 || resp.role_Id == 4 || resp.role_Id == 5){
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
     message,
    companyName
}
