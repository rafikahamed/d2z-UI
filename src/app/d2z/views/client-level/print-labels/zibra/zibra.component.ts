import { Component, OnInit, Compiler} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
declare var $: any;
import { GridOptions } from "ag-grid";
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface City {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-zibra',
  templateUrl: './zibra.component.html',
  styleUrls: ['./zibra.component.css']
})
export class ZebraPdfFileUpload implements OnInit{

  childmenu: boolean;
  childmenuTwo:boolean;
  childmenuThree:boolean;
  childmenuFour:boolean;
  childmenuFive:boolean;
  fileName: string;
  errorMsg: string;
  successMsg: String;
  user_Id: string;
  userName: string
  public gridOptions: GridOptions;
  public autoGroupColumnDef;
  public rowGroupPanelShow;
  public rowData: any[];
  public defaultColDef;
  file:File;
  cities2: City[];  
  englishFlag:boolean;
  chinessFlag:boolean;
  system: String;
  constructor(
    public consigmentUploadService: ConsigmentUploadService,
    public trackingDataService: TrackingDataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this.cities2 = [];
    this._compiler.clearCache();
    this.errorMsg= null;
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
      this.system = document.location.hostname.includes("speedcouriers.com.au") == true ? "Speed Couriers" :"D2Z";
      this.spinner.show();
      this.user_Id = this.consigmentUploadService.userMessage ? this.consigmentUploadService.userMessage.user_id : '';
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
            headerName: "参考编号",
            field: "reference_number",
            width: 180,
            checkboxSelection: true,
            headerCheckboxSelection: function(params) {
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          },
          {
            headerName: "收货人公司",
            field: "consigneeCompany",
            width: 180
          },
          {
            headerName: "名称",
            field: "consignee_name",
            width: 150
          },
          {
            headerName: "地址1",
            field: "consignee_addr1",
            width: 200
          },
          {
            headerName: "市郊",
            field: "consignee_Suburb",
            width: 100
          },
          {
            headerName: "州",
            field: "consignee_State",
            width: 100
          },
          {
            headerName: "邮编",
            field: "consignee_Postcode",
            width: 100
          },
          {
            headerName: "电话",
            field: "consignee_Phone",
            width: 100
          },
          {
            headerName: "产品描述",
            field: "product_Description",
            width: 160
          },
          {
            headerName: "货物价值",
            field: "value",
            width: 100
          },
          {
            headerName: "装运数量",
            field: "shippedQuantity",
            width: 150
          },
          {
            headerName: "重量",
            field: "weight",
            width: 100
          },
          {
            headerName: "尺寸X",
            field: "dimensions_Length",
            width: 100
          },
          {
            headerName: "尺寸Y",
            field: "dimensions_Width",
            width: 100
          },
          {
            headerName: "尺寸Z",
            field: "dimensions_Height",
            width: 100
          },
          {
            headerName: "服务类型",
            field: "servicetype",
            width: 140
          },
          {
            headerName: "派送类型",
            field: "deliverytype",
            width: 100
          },
          {
            headerName: "托运人姓名",
            field: "shipper_Name",
            width: 140
          },
          {
            headerName: "托运人Addr1",
            field: "shipper_Addr1",
            width: 140
          },
          {
            headerName: "托运人Addr2",
            field: "shipper_Addr2",
            width: 140
          },
          {
            headerName: "托运人城市",
            field: "shipper_City",
            width: 140
          },
          {
            headerName: "托运人国家",
            field: "shipper_State",
            width: 140
          },
          {
            headerName: "托运人邮政编码",
            field: "shipper_Postcode",
            width: 140
          },
          {
            headerName: "托运人国家",
            field: "shipper_Country",
            width: 140
          },
          {
            headerName: "支架",
            field: "carrier",
            width: 100
          },
          {
            headerName: "条形码标签号",
            field: "barcodelabelNumber",
            width: 350
          },
          {
            headerName: "数据矩阵",
            field: "datamatrix",
            width: 550
          },
          {
            headerName: "SKU",
            field: "sku",
            width: 100
          },
          {
            headerName: "标签发件人名称",
            field: "labelSenderName",
            width: 180
          },
          {
            headerName: "交货说明",
            field: "deliveryInstructions",
            width: 180
          },
          {
            headerName: "返回地址1",
            field: "returnAddress1",
            width: 180
          },
          {
            headerName: "Return Address2",
            field: "返回地址2",
            width: 150
          }
        ]
      }
      this.consigmentUploadService.labelFileList( this.user_Id, (resp) => {
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

  printLabels(){
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
              printObj[userName]= this.userName , printObj
          );
          printLabelList.push(printObj);
        }
      if(selectedRows.length > 0 ){
        this.spinner.show();
        console.log(printLabelList)
        //this.trackingDataService.generateTrackLabel(printLabelList.join(','), (resp) => {
        this.consigmentUploadService.generateLabel(printLabelList, (resp) => {
          this.spinner.hide();
          var pdfFile = new Blob([resp], {type: 'application/pdf'});
          var pdfUrl = URL.createObjectURL(pdfFile);
          var printWindow = window.open(pdfUrl);
          printWindow.print();
           if(!resp){
            this.successMsg = resp.message;
          }
          setTimeout(() => {
            this.spinner.hide();
          },5000);
        });
      }else{
        if(this.englishFlag){
          this.errorMsg = "**Please select the below records before printing the labels";
        }else if(this.chinessFlag){
          this.errorMsg = "**请在打印标签前选择以下记录";
        }
      }
  } 

  onSelectionChange() {
    var selectedRows = this.gridOptions.api.getSelectedRows();
    this.errorMsg=null;
  }
 
}
