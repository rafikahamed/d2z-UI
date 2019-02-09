import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
declare var $: any;

@Component({
  selector: 'super-user-header',
  templateUrl: './super-user-header.component.html',
  styleUrls: ['./super-user-header.component.css']
})
export class SuperUserHeaderComponent implements OnInit {
  
  englishFlag:boolean;
  chinessFlag:boolean;
  childmenuSuperOne: boolean;
  childmenuSuperTwo: boolean;
  childmenuSuperThree: boolean;
  userName: String;

  constructor(
    public consigmentUploadService: ConsigmentUploadService
  ){}

  ngOnInit() {
    this.userName =  this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName : '';
    var menuSelection  = this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    this.childmenuSuperOne = menuSelection.childmenuSuperOne;
    this.childmenuSuperTwo = menuSelection.childmenuSuperTwo;
    this.childmenuSuperThree = menuSelection.childmenuSuperThree;
  }

  super_user(arrow) {
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperOne = !this.childmenuSuperOne;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperOne = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperOnes;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  super_user_zebra(arrow) {
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperTwo = !this.childmenuSuperTwo;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperTwo = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperTwo;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

  super_user_utils(arrow) {
    var menuSuperObj= this.consigmentUploadService.menuSuperSourceSelection.source['_value'];
    menuSuperObj.childmenuSuperThree = !this.childmenuSuperThree;
    this.consigmentUploadService.menuSuperSelection(menuSuperObj);
    this.childmenuSuperThree = this.consigmentUploadService.menuSuperSourceSelection.source['_value'].childmenuSuperThree;
    if (arrow.className === 'fa fa-chevron-down'){
      arrow.className = '';
      arrow.className = 'fa fa-chevron-up';
    }else{
      arrow.className = '';
      arrow.className = 'fa fa-chevron-down';
    }
  }

}

