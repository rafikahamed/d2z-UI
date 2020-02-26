import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'hms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  errorMsg: string;
  successMsg:string;
  contactForm : FormGroup;
  loginForm: FormGroup;
  userMessage: userMessage;
  loginBut: boolean;

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
      this.errorMsg = null;
      this.successMsg = null;
      this.loginBut = true;
      this.loginForm = new FormGroup({
        userName: new FormControl('', Validators.required),
        passWord: new FormControl('', Validators.required)
      });
  }

  ngOnInit(){
    $('#myModal').modal('hide');
  }

  login() {
    this.errorMsg = null;
    var menuSelection  = this.consigmentUploadService.menuSourceSelection.source['_value'];
    menuSelection.childmenuOne = false;
    menuSelection.childmenuTwo = true;
    menuSelection.childmenuThree = true;
    menuSelection.childmenuFour = true;
    menuSelection.childmenuFive = true;
    menuSelection.childmenuSix = true;
    
    var menuBrokerSelection  = this.consigmentUploadService.menuBrokerSourceSelection.source['_value'];
    menuBrokerSelection.childmenubrkOne = false;
    menuBrokerSelection.childmenubrkTwo = true;
    menuBrokerSelection.childmenubrkThree = true;
    menuBrokerSelection.childmenubrkFour = true;
    menuBrokerSelection.childmenubrkFive = true;
    menuBrokerSelection.childmenubrkSix = true;
    menuBrokerSelection.childmenubrkSeven = true;

    var menuSuperSelection  = this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperSelection.childmenuSuperOne = false;
    menuSuperSelection.childmenuSuperTwo = true;
    menuSuperSelection.childmenuSuperThree = true;
    menuSuperSelection.childmenuSuperFour = true;
    menuSuperSelection.childmenuSuperFive = true;
    menuSuperSelection.childmenuSuperSix = true;
    menuSuperSelection.childmenuSuperSeven = true;
    menuSuperSelection.childmenuSuperEight = true;
    menuSuperSelection.childmenuSuperNine = true;
    menuSuperSelection.childmenuSuperTen = true;

    if(this.loginForm.status == 'VALID'){
      this.spinner.show();
      this.consigmentUploadService.authenticate(this.loginForm.value, (resp) => {
        this.userMessage = resp;
        this.consigmentUploadService.getLoginDetails(resp);
        this.spinner.hide();
        if(resp.status == 500){
            this.errorMsg = "**Invalid Credentials, Please try again";
        }else{
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
      this.errorMsg = "*Invalid Form, Fill the mandatory details";
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
