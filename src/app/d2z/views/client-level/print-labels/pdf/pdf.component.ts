import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
declare var $: any;
import { GridOptions } from "ag-grid";
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface City {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class ZebraPdfPrintLabels implements OnInit{
  fileName: string;
  errorMsg: string;
  successMsg: String;
  user_Id: string;
  userName: string;
  private gridOptions: GridOptions;
  private autoGroupColumnDef;
  private rowGroupPanelShow;
  private rowData: any[];
  private defaultColDef;
  file:File;
  system:String;
  cities2: City[];  
  englishFlag:boolean;
  chinessFlag:boolean;

  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService: TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this.cities2 = [];
    this._compiler.clearCache();
    this.gridOptions = <GridOptions>{ rowSelection: "multiple" };
    this.autoGroupColumnDef = {
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }
    };      
    this.rowGroupPanelShow = "always";
    this.defaultColDef = {
      editable: true
    };
  }

  ngOnInit() {
      this.spinner.show();
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id: '';
      this.userName = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.userName : '';
      var lanObject = this.consigmentUploadService.currentMessage.source['_value'];
      this.englishFlag = lanObject.englishFlag;
      this.chinessFlag = lanObject.chinessFlag;
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
      if(this.englishFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "Reference number",
            field: "reference_number",
            width: 180,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "Consignee Company",
            field: "consigneeCompany",
            width: 180
          },
          {
            headerName: "Name",
            field: "consignee_name",
            width: 150
          },
          {
            headerName: "Address 1",
            field: "consignee_addr1",
            width: 200
          },
          {
            headerName: "Suburb",
            field: "consignee_Suburb",
            width: 100
          },
          {
            headerName: "State",
            field: "consignee_State",
            width: 100
          },
          {
            headerName: "Postcode",
            field: "consignee_Postcode",
            width: 100
          },
          {
            headerName: "Phone",
            field: "consignee_Phone",
            width: 100
          },
          {
            headerName: "Product Description",
            field: "product_Description",
            width: 160
          },
          {
            headerName: "Value",
            field: "value",
            width: 100
          },
          {
            headerName: "Shipped Quantity",
            field: "shippedQuantity",
            width: 150
          },
          {
            headerName: "Weight",
            field: "weight",
            width: 100
          },
          {
            headerName: "Dim_X",
            field: "dimensions_Length",
            width: 100
          },
          {
            headerName: "Dim_Y",
            field: "dimensions_Width",
            width: 100
          },
          {
            headerName: "Dim_Z",
            field: "dimensions_Height",
            width: 100
          },
          {
            headerName: "Service type",
            field: "servicetype",
            width: 140
          },
          {
            headerName: "Del Type",
            field: "deliverytype",
            width: 100
          },
          {
            headerName: "Shipper Name",
            field: "shipper_Name",
            width: 140
          },
          {
            headerName: "Shipper Addr1",
            field: "shipper_Addr1",
            width: 140
          },
          {
            headerName: "Shipper Addr2",
            field: "shipper_Addr2",
            width: 140
          },
          {
            headerName: "Shipper City",
            field: "shipper_City",
            width: 140
          },
          {
            headerName: "Shipper State",
            field: "shipper_State",
            width: 140
          },
          {
            headerName: "Shipper Postcode",
            field: "shipper_Postcode",
            width: 140
          },
          {
            headerName: "Shipper Country",
            field: "shipper_Country",
            width: 140
          },
          {
            headerName: "Carrier",
            field: "carrier",
            width: 100
          },
          {
            headerName: "Barcode Label Number",
            field: "barcodelabelNumber",
            width: 350
          },
          {
            headerName: "Data Matrix",
            field: "datamatrix",
            width: 550
          },
          {
            headerName: "SKU",
            field: "sku",
            width: 100
          },
          {
            headerName: "Label Sender Name",
            field: "labelSenderName",
            width: 180
          },
          {
            headerName: "Delivery Instructions",
            field: "deliveryInstructions",
            width: 180
          },
          {
            headerName: "Return Address1 ",
            field: "returnAddress1",
            width: 180
          },
          {
            headerName: "Return Address2",
            field: "returnAddress2",
            width: 150
          }
        ]
      }
      if(this.chinessFlag){
        this.gridOptions.columnDefs = [
          {
            headerName: "å�‚è€ƒç¼–å�·",
            field: "reference_number",
            width: 180,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "æ”¶è´§äººå…¬å�¸",
            field: "consigneeCompany",
            width: 180
          },
          {
            headerName: "å��ç§°",
            field: "consignee_name",
            width: 150
          },
          {
            headerName: "åœ°å�€1",
            field: "consignee_addr1",
            width: 200
          },
          {
            headerName: "å¸‚éƒŠ",
            field: "consignee_Suburb",
            width: 100
          },
          {
            headerName: "å·ž",
            field: "consignee_State",
            width: 100
          },
          {
            headerName: "é‚®ç¼–",
            field: "consignee_Postcode",
            width: 100
          },
          {
            headerName: "ç”µè¯�",
            field: "consignee_Phone",
            width: 100
          },
          {
            headerName: "äº§å“�æ��è¿°",
            field: "product_Description",
            width: 160
          },
          {
            headerName: "è´§ç‰©ä»·å€¼",
            field: "value",
            width: 100
          },
          {
            headerName: "è£…è¿�æ•°é‡�",
            field: "shippedQuantity",
            width: 150
          },
          {
            headerName: "é‡�é‡�",
            field: "weight",
            width: 100
          },
          {
            headerName: "å°ºå¯¸X",
            field: "dimensions_Length",
            width: 100
          },
          {
            headerName: "å°ºå¯¸Y",
            field: "dimensions_Width",
            width: 100
          },
          {
            headerName: "å°ºå¯¸Z",
            field: "dimensions_Height",
            width: 100
          },
          {
            headerName: "æœ�åŠ¡ç±»åž‹",
            field: "servicetype",
            width: 140
          },
          {
            headerName: "æ´¾é€�ç±»åž‹",
            field: "deliverytype",
            width: 100
          },
          {
            headerName: "æ‰˜è¿�äººå§“å��",
            field: "shipper_Name",
            width: 140
          },
          {
            headerName: "æ‰˜è¿�äººAddr1",
            field: "shipper_Addr1",
            width: 140
          },
          {
            headerName: "æ‰˜è¿�äººAddr2",
            field: "shipper_Addr2",
            width: 140
          },
          {
            headerName: "æ‰˜è¿�äººåŸŽå¸‚",
            field: "shipper_City",
            width: 140
          },
          {
            headerName: "æ‰˜è¿�äººå›½å®¶",
            field: "shipper_State",
            width: 140
          },
          {
            headerName: "æ‰˜è¿�äººé‚®æ”¿ç¼–ç �",
            field: "shipper_Postcode",
            width: 140
          },
          {
            headerName: "æ‰˜è¿�äººå›½å®¶",
            field: "shipper_Country",
            width: 140
          },
          {
            headerName: "æ”¯æž¶",
            field: "carrier",
            width: 100
          },
          {
            headerName: "æ�¡å½¢ç �æ ‡ç­¾å�·",
            field: "barcodelabelNumber",
            width: 350
          },
          {
            headerName: "æ•°æ�®çŸ©é˜µ",
            field: "datamatrix",
            width: 550
          },
          {
            headerName: "SKU",
            field: "sku",
            width: 100
          },
          {
            headerName: "æ ‡ç­¾å�‘ä»¶äººå��ç§°",
            field: "labelSenderName",
            width: 180
          },
          {
            headerName: "äº¤è´§è¯´æ˜Ž",
            field: "deliveryInstructions",
            width: 180
          },
          {
            headerName: "è¿”å›žåœ°å�€1",
            field: "returnAddress1",
            width: 180
          },
          {
            headerName: "Return Address2",
            field: "è¿”å›žåœ°å�€2",
            width: 150
          }
        ]
      }
      // http call to get the data file list
      this.consigmentUploadService.labelFileList( this.user_Id,(resp) => {
        this.spinner.hide();
        this.cities2 = resp;
        this.fileName = this.cities2[0] ? this.cities2[0].value: '';
        if(!resp){
            this.errorMsg = "Invalid Credentials!";
        }  
      });
  }
  
  onFileChange(event){
    this.fileName = event.value ? event.value.value : '';
  }

  zibraSearch(){
    this.spinner.show();
    this.consigmentUploadService.consignmentFileData(this.fileName, (resp) => {
      this.spinner.hide();
      this.rowData = resp;
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 5000);
    })
  }

  downLoadLabels(){
    var today = new Date();
        var day = today.getDate() + "";
        var month = (today.getMonth() + 1) + "";
        var year = today.getFullYear() + "";
        var hour = today.getHours() + "";
        var minutes = today.getMinutes() + "";
        var seconds = today.getSeconds() + "";

        day = checkZero(day);
        month = checkZero(month);
        year = checkZero(year);
        hour = checkZero(hour);
        minutes = checkZero(minutes);
        seconds = checkZero(seconds);

        function checkZero(data){
          if(data.length == 1){
            data = "0" + data;
          }
          return data;
        };
    var dateString = year+month+day+"-"+hour+minutes+seconds;
    var selectedRows = this.gridOptions.api.getSelectedRows();
    var printLabelList = [];
        let referenceNumber = 'referenceNumber';
        let consigneeName = 'consigneeName';
        let consigneeAddr1 = 'consigneeAddr1';
        let consigneeSuburb = 'consigneeSuburb';
        let consigneeState = 'consigneeState';
        let consigneePostcode = 'consigneePostcode';
        let consigneePhone = 'consigneePhone';
        let weight = 'weight';
        let shipperName = 'shipperName';
        let shipperAddr1 = 'shipperAddr1';
        let shipperAddr2 = 'shipperAddr2';
        let shipperCity = 'shipperCity';
        let shipperState = 'shipperState';
        let shipperCountry = 'shipperCountry';
        let shipperPostcode = 'shipperPostcode';
        let barcodeLabelNumber = 'barcodeLabelNumber';
        let datamatrix = 'datamatrix';
        let injectionState = 'injectionState';
        let sku = 'sku';
        let labelSenderName = 'labelSenderName';
        let deliveryInstructions = 'deliveryInstructions';
        let consigneeCompany = 'consigneeCompany';
        let carrier = 'carrier';
        let consigneeAddr2 = 'consigneeAddr2';
        let returnAddress1 = 'returnAddress1';
        let returnAddress2 = 'returnAddress2';
        let userID = 'userID';
        let userName = 'userName';
        let serviceType = 'serviceType';

        for (var labelValue in selectedRows) {
          var labelObj = selectedRows[labelValue];
          var printObj = (
              printObj={}, 
              printObj[referenceNumber]= labelObj.reference_number, printObj,
              printObj[consigneeName]= labelObj.consignee_name, printObj,
              printObj[consigneeAddr1]= labelObj.consignee_addr1, printObj,
              printObj[consigneeSuburb]= labelObj.consignee_Suburb, printObj,
              printObj[consigneeState] = labelObj.consignee_State, printObj,
              printObj[consigneePostcode]= labelObj.consignee_Postcode, printObj,
              printObj[consigneePhone]= labelObj.consignee_Phone, printObj,
              printObj[weight]= labelObj.weight, printObj,
              printObj[shipperName]= labelObj.shipper_Name, printObj,
              printObj[shipperAddr1]= labelObj.shipper_Addr1, printObj,
              printObj[shipperAddr2]= labelObj.shipper_Addr2, printObj,
              printObj[shipperCity] = labelObj.shipper_City, printObj,
              printObj[shipperState]= labelObj.shipper_State, printObj,
              printObj[shipperCountry]= labelObj.shipper_Country, printObj,
              printObj[shipperPostcode]= labelObj.shipper_Postcode, printObj,
              printObj[barcodeLabelNumber]= labelObj.barcodelabelNumber, printObj,
              printObj[datamatrix]= labelObj.datamatrix, printObj,
              printObj[injectionState]= labelObj.injectionState, printObj,
              printObj[sku]= labelObj.sku, printObj,
              printObj[labelSenderName]= labelObj.labelSenderName, printObj,
              printObj[deliveryInstructions]= labelObj.deliveryInstructions, printObj,
              printObj[consigneeCompany]= labelObj.consigneeCompany, printObj,
              printObj[carrier]= labelObj.carrier, printObj,
              printObj[consigneeAddr2]= labelObj.consignee_addr2, printObj,
              printObj[returnAddress1]= labelObj.returnAddress1 ? labelObj.returnAddress1 : '', printObj,
              printObj[returnAddress2]= labelObj.returnAddress2 ? labelObj.returnAddress2 : '', printObj,
              printObj[userID]= parseInt(this.user_Id), printObj,
              printObj[userName]= this.userName, printObj,
              printObj[serviceType] = labelObj.servicetype, printObj
          );
          printLabelList.push(printObj);
        }
      if(selectedRows.length > 0){
        this.spinner.show();
        //this.trackingDataService.generateTrackLabel(printLabelList.join(','), (resp) => {
        this.consigmentUploadService.generateLabel(printLabelList, (resp) => {
          this.spinner.hide();
          var pdfFile = new Blob([resp], {type: 'application/pdf'});
          var pdfUrl = URL.createObjectURL(pdfFile);
        //  var fileName = "D2Z-Label-"+dateString+".pdf";
        var fileName = "label-"+dateString+".pdf";
          var a = document.createElement("a");
              document.body.appendChild(a);
              a.href = pdfUrl;
              a.download = fileName;
              a.click();
          if(!resp){
            this.successMsg = resp.message;
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 5000);
        });
      }else{
        if(this.englishFlag){
          this.errorMsg = "**Please select the below records before Generating the PDF";
        }else if(this.chinessFlag){
          this.errorMsg = "**è¯·åœ¨ç”Ÿæˆ�PDFä¹‹å‰�é€‰æ‹©ä»¥ä¸‹è®°å½•";
        }

      }
  } 

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    if(selectedRows.length > 0){
      this.errorMsg = '';
    }
  }
 
}

