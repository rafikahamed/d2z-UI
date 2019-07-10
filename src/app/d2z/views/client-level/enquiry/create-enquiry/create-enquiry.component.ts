import { Component, OnInit, Compiler} from '@angular/core';
declare var $: any;

@Component({
  selector: 'hms-create-enquiry',
  templateUrl: './create-enquiry.component.html',
  styleUrls: ['./create-enquiry.component.css']
})
export class CreateEnquiryComponent{
 
  constructor(){}
 
}

interface City {
  name: string;
  value: string;
}



