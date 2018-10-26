import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserIdleModule } from 'angular-user-idle';
import { UiModule } from 'app/ui/ui.module';
import { d2zComponent } from 'app/d2z/d2z.component';
import { HomeComponent } from 'app/d2z/views/home/home.component';
import { MainComponent } from 'app/d2z/views/main/main.component';
import { LoginService } from 'app/d2z/service/login.service';
import { BrokerService } from 'app/d2z/service/broker/broker.service';
import { ZebraFileUpload } from 'app/d2z/views/consignment-zebra/file-upload/file-upload.component';
import { ZebraPrintLabels } from 'app/d2z/views/consignment-zebra/print-labels/print-labels.component';
import { ZebraDelete } from 'app/d2z/views/consignment-zebra/delete/delete.component';
import { ZebraPdfFileUpload } from 'app/d2z/views/consignment-pdf/pdf-file-upload/pdf-file-upload.component';
import { ZebraPdfPrintLabels } from 'app/d2z/views/consignment-pdf/pdf-print-labels/pdf-print-labels.component';
import { ZebraPdfDelete } from 'app/d2z/views/consignment-pdf/pdf-delete/pdf-delete.component';
import { UtilitiesTracking } from 'app/d2z/views/utilities/download-tracking/download-tracking.component';
import { UtilitiesTrackParcel } from 'app/d2z/views/utilities/track-parcel/track-parcel.component';
import { UtilitiesScanPdf } from 'app/d2z/views/utilities/zebra-scan-pdf/utilities-pdf.component';
import { UtilitiesScanPrint } from 'app/d2z/views/utilities/zebra-scan-print/utilities-print.component';
import { ManifestComponent } from 'app/d2z/views/manifest-creation/manifest/manifest.component';
import { BrokerMainComponent } from 'app/d2z/views/broker-level/broker-main/broker-main.component';
import { AddClientComponent } from 'app/d2z/views/broker-level/client-management/add-client/add-client.component';
import { UpdateClientComponent } from 'app/d2z/views/broker-level/client-management/update-client/update-client.component';
import { BrokerPdfComponent } from 'app/d2z/views/broker-level/print-label/broker-pdf/pdf.component';
import { BrokerPrintComponent } from 'app/d2z/views/broker-level/print-label/broker-print/print.component';
import { AllocateShipmentComponent } from 'app/d2z/views/broker-level/create-shipment/allocate-shipment/allocate-shipment.component';
import { ScanShipmentComponent } from 'app/d2z/views/broker-level/create-shipment/scan-shipment/scan-shipment.component';
import { DownloadShipmentComponent } from 'app/d2z/views/broker-level/create-shipment/download-shipment/download-shipment.component';
import { DirectInjectionComponent } from 'app/d2z/views/broker-level/api/direct-injection/direct-injection.component';
import { APIUploadShipmentComponent } from 'app/d2z/views/broker-level/api/upload-shipment/upload-shipment.component';
import { APIDownloadShipmentComponent } from 'app/d2z/views/broker-level/api/download-shipment/download-shipment.component';
import { SuperUserMainComponent } from 'app/d2z/views/superuser-level/super-user/super-main.component';
import { SuperUserAddClientComponent } from 'app/d2z/views/superuser-level/client-management/add-client/add-client.component';
import { SuperUserUpdateClientComponent } from 'app/d2z/views/superuser-level/client-management/update-client/update-client.component';
import { SuperUserArrivalReportComponent } from 'app/d2z/views/superuser-level/utilities/arrival-report/arrival-report.component';
import { SuperUserUploadTrackingComponent } from 'app/d2z/views/superuser-level/utilities/upload-tracking/upload-tracking.component';
import { AgGridModule } from "ag-grid-angular/main";
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    NgxSpinnerModule,
    AgGridModule.withComponents([]),
    DropdownModule,
    AccordionModule,
    UserIdleModule.forRoot({idle: 300, timeout: 30, ping: 1}),
    RouterModule.forRoot([
          { path: "", redirectTo: "home", pathMatch: "full" },
          { path: "home", component: HomeComponent },
          { path: "main", component: MainComponent },
          { path: "consignment/fileUpload", component: ZebraFileUpload},
          { path: "consignment/delete", component: ZebraDelete},
          { path: "printLabels/zebra", component: ZebraPdfFileUpload},
          { path: "printLabels/pdf", component: ZebraPdfPrintLabels},
          { path: "utilities/trackingNumber", component: UtilitiesTracking},
          { path: "utilities/trackParcel", component: UtilitiesTrackParcel},
          { path: "utilities/scanPrintLabels", component: UtilitiesScanPrint},
          { path: "utilities/scanPdf", component: UtilitiesScanPdf},
          { path: "manifest/creation", component: ManifestComponent},
          { path: "broker-main", component: BrokerMainComponent},
          { path: "broker/add-client", component : AddClientComponent},
          { path: "broker/update-client", component : UpdateClientComponent},
          { path: "broker/print", component : BrokerPrintComponent},
          { path: "broker/pdf", component : BrokerPdfComponent},
          { path: "broker/allocate-shipment", component : AllocateShipmentComponent},
          { path: "broker/scan-shipment", component : ScanShipmentComponent},
          { path: "broker/download-shipment", component : DownloadShipmentComponent},
          { path: "broker/api/direct-injection", component : DirectInjectionComponent},
          { path: "broker/api/upload-shipment", component : APIUploadShipmentComponent},
          { path: "broker/api/download-shipment", component : APIDownloadShipmentComponent},
          { path: "superuser-main", component : SuperUserMainComponent},
          { path: "superuser/add-client", component : SuperUserAddClientComponent},
          { path: "superuser/update-client", component : SuperUserUpdateClientComponent},
          { path: "superuser/arrival-report", component : SuperUserArrivalReportComponent},
          { path: "superuser/upload-tracking", component : SuperUserUploadTrackingComponent}
    ], { useHash: true }),
    UiModule
  ],
  declarations: [
    d2zComponent,
    HomeComponent,
    MainComponent,
    ZebraFileUpload,
    ZebraPrintLabels,
    ZebraDelete,
    ZebraPdfFileUpload,
    ZebraPdfPrintLabels,
    ZebraPdfDelete,
    UtilitiesTracking,
    UtilitiesTrackParcel,
    UtilitiesScanPdf,
    UtilitiesScanPrint,
    ManifestComponent,
    BrokerMainComponent,
    AddClientComponent,
    UpdateClientComponent,
    BrokerPrintComponent,
    BrokerPdfComponent,
    AllocateShipmentComponent,
    ScanShipmentComponent,
    DownloadShipmentComponent,
    DirectInjectionComponent,
    APIUploadShipmentComponent,
    APIDownloadShipmentComponent,
    SuperUserMainComponent,
    SuperUserAddClientComponent,
    SuperUserUpdateClientComponent,
    SuperUserArrivalReportComponent,
    SuperUserUploadTrackingComponent
  ],
  entryComponents: [
    
  ],
  providers: [
    { provide: 'Window', useValue: window },
    LoginService,
    ConsigmentUploadService,
    TrackingDataService,
    BrokerService
  ],
  bootstrap: [
    d2zComponent
  ]
})
export class d2zModule {
  constructor() {
 
  }
}