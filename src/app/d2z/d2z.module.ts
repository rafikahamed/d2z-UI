import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserIdleModule } from 'angular-user-idle';
import { UiModule } from 'app/ui/ui.module';
import { d2zComponent } from 'app/d2z/d2z.component';
import { HomeComponent } from 'app/d2z/views/home/home.component';
import { ClientHomeComponent } from 'app/d2z/views/client-level/client-home/client-home.component';
import { PolicyComponent } from 'app/d2z/views/policy/policy.component'
import { TrackParcelComponent } from 'app/d2z/views/track-parcel/track-parcel.component'
import { LoginService } from 'app/d2z/service/login.service';
import { ZebraFileUpload } from 'app/d2z/views/client-level/consignment/file-upload/file-upload.component';
import { ZebraDelete } from 'app/d2z/views/client-level/consignment/delete/delete.component';
import { ZebraPdfFileUpload } from 'app/d2z/views/client-level/print-labels/zibra/zibra.component';
import { ZebraPdfPrintLabels } from 'app/d2z/views/client-level/print-labels/pdf/pdf.component';
import { UtilitiesTracking } from 'app/d2z/views/client-level/utilities/download-tracking/download-tracking.component';
import { UtilitiesTrackParcel } from 'app/d2z/views/client-level/utilities/track-parcel/track-parcel.component';
import { UtilitiesScanPdf } from 'app/d2z/views/client-level/utilities/zebra-scan-pdf/utilities-pdf.component';
import { UtilitiesScanPrint } from 'app/d2z/views/client-level/utilities/zebra-scan-print/utilities-print.component';
import { ManifestComponent } from 'app/d2z/views/client-level/manifest-creation/manifest/manifest.component';
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
import { EtowerTrackingComponent } from 'app/d2z/views/superuser-level/utilities/etower/etower.component';
import { ClientHeaderComponent } from 'app/d2z/views/client-level/client-header/client-header.component';
import { BrokerHeaderComponent } from 'app/d2z/views/broker-level/broker-header/broker-header.component';
import { SuperUserHeaderComponent } from 'app/d2z/views/superuser-level/super-user-header/super-user-header.component';
import { SuperUserRatesAddComponent } from 'app/d2z/views/superuser-level/rates/add/add.component';
import { SuperUserRatesUpdateComponent } from 'app/d2z/views/superuser-level/rates/update/update.component';
import { SuperUserD2ZRatesComponent } from 'app/d2z/views/superuser-level/rates/d2z-rates/d2z-rates.component';
import { SuperUserNotBilledComponent } from 'app/d2z/views/superuser-level/invoices/not-billed/not-billed.component';
import { SuperUserInvoicePendingComponent } from 'app/d2z/views/superuser-level/invoices/pending/pending.component';
import { SuperUserReconcileComponent } from 'app/d2z/views/superuser-level/invoices/reconcile/reconcile.component';
import { AgGridModule } from "ag-grid-angular/main";
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { ConsigmentUploadService } from 'app/d2z/service/consignment-upload.service';
import { TrackingDataService } from 'app/d2z/service/tracking-data.service';
import { SuperUserInvoiceComponent } from 'app/d2z/views/superuser-level/utilities/invoice-report/invoice-report.component'
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
          { path: "main", component: ClientHomeComponent },
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
          { path: "superuser/upload-tracking", component : SuperUserUploadTrackingComponent},
          { path: "superuser/invoice-report", component: SuperUserInvoiceComponent},
          { path: "superuser/etrack", component: EtowerTrackingComponent},
          { path: "policy", component: PolicyComponent},
          { path: "track-parcel", component: TrackParcelComponent},
          { path: "superuser/rates/add", component: SuperUserRatesAddComponent},
          { path: "superuser/rates/update", component: SuperUserRatesUpdateComponent},
          { path: "superuser/rates/d2z-rates", component: SuperUserD2ZRatesComponent},
          { path: "superuser/invoices/pending", component: SuperUserInvoicePendingComponent},
          { path: "superuser/invoices/reconcile", component: SuperUserReconcileComponent},
          { path: "superuser/invoice/not-billed", component: SuperUserNotBilledComponent}
    ], { useHash: true }),
    UiModule
  ],
  declarations: [
    d2zComponent,
    HomeComponent,
    ClientHomeComponent,
    ZebraFileUpload,
    ZebraDelete,
    ZebraPdfFileUpload,
    ZebraPdfPrintLabels,
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
    SuperUserUploadTrackingComponent,
    SuperUserInvoiceComponent,
    PolicyComponent,
    TrackParcelComponent,
    EtowerTrackingComponent,
    ClientHeaderComponent,
    BrokerHeaderComponent,
    SuperUserHeaderComponent,
    SuperUserRatesAddComponent,
    SuperUserRatesUpdateComponent,
    SuperUserD2ZRatesComponent,
    SuperUserInvoicePendingComponent,
    SuperUserReconcileComponent,
    SuperUserNotBilledComponent
  ],
  entryComponents: [],
  providers: [
    { provide: 'Window', useValue: window },
    LoginService,
    ConsigmentUploadService,
    TrackingDataService
  ],
  bootstrap: [
    d2zComponent
  ]
})
export class d2zModule {
  constructor() {
 
  }
}