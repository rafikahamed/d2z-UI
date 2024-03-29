import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
const hostname = document.location.hostname;
const apiName = document.location.hostname.includes("speedcouriers.com.au") == true ? "speedcouriers" : "d2z";

const baseUrl = "https://"+hostname+"/v1/d2z";
//const baseUrl = "https://d2ztracking.com.au/v1/d2z"; 
//const baseUrl = "http://www.d2ztest.com.au:8080/v1/d2z"; 
//const baseUrl = "http://localhost:8080/v1/d2z"; 
@Injectable()
export class ConsigmentUploadService implements OnInit{

  public newUserSubject = new Subject<any>();
  userMessage:userMessage;
  englishFlag:boolean;
  chinessFlag:boolean;

  private messageSource = new BehaviorSubject({"englishFlag":true, "chinessFlag":false});
  currentMessage = this.messageSource.asObservable();

  private menuSource = new BehaviorSubject({"childmenuOne":false, "childmenuTwo":true, "childmenuThree":true,
                        "childmenuFour":true, "childmenuFive": true, "childmenuSix":true, "childmenuSeven":true});
  menuSourceSelection = this.menuSource.asObservable();

  private menuBrokerSource = new BehaviorSubject({"childmenubrkOne":false, "childmenubrkTwo":true, "childmenubrkThree":true,
                        "childmenubrkFour":true, "childmenubrkFive": true,"childmenubrkSix":true, "childmenubrkSeven":true,
                        "childmenubrkEight":true});
  menuBrokerSourceSelection = this.menuBrokerSource.asObservable();

  private menuSuperSource = new BehaviorSubject({"childmenuSuperOne":false, "childmenuSuperTwo":true, "childmenuSuperThree":true,
                        "childmenuSuperFour":true, "childmenuSuperFive":true,"childmenuSuperSix":true,"childmenuSuperSeven":true,

                        "childmenuSuperEight":true, "childmenuSuperNine":true, "childmenuSuperTen":true, "childmenuSuperEleven":true,"childmenuSuperTwelve":true});

  menuSuperSourceSelection = this.menuSuperSource.asObservable();

  constructor(  
      private http: HttpClient, 
      private router: Router
  ){}

  versionFlag(message) {
    this.messageSource.next(message)
  }

  menuSelection(menuSelection){
    this.menuSource.next(menuSelection)
  }

  menuBrokerSelection(menuBrokerSelection){
    this.menuBrokerSource.next(menuBrokerSelection)
  }

  menuSuperSelection(menuBrokerSelection){
    this.menuSuperSource.next(menuBrokerSelection)
  }

  ngOnInit(){
    this.englishFlag = true;
    this.chinessFlag = false;
  }

  getLoginDetails(data){
    this.userMessage = data;
    this.newUserSubject.next(data);
  };

  contactus( ContactObject, callback ): any {
 
     this.http.get(baseUrl+'/contactUs',{
      params: { email: ContactObject.Email, name: ContactObject.Name ,subject:ContactObject.Subject,message:ContactObject.Message }}
            ).subscribe((resp) => {
              callback(resp);
              if (resp) {
                
              } else {
                  console.error("Not Found!")
              }
            }, (error) => {
                callback(error);
            });

  };
    shippingQuote( object, callback ): any {
 
     this.http.post(baseUrl+'/shippingQuote',object
            ).subscribe((resp:userMessage) => {
              callback(resp);
              if (resp) {
                
              } else {
                  console.error("Not Found!")
              }
            }, (error) => {
                callback(error);
            });

  };

adduserService( UserObject, callback ): any {
 console.log(":::"+baseUrl);
     this.http.get(baseUrl+'/userservice',{
      params: { userName: UserObject.userName, serviceType: UserObject.serviceType  }}
            ).subscribe((resp) => {
              callback(resp);
              if (resp) {
                
              } else {
                  console.error("Not Found!")
              }
            }, (error) => {
                callback(error);
            });
  };

  authenticate( loginObject, callback): any {
    this.http.get(baseUrl+'/login', {
      params: { userName: loginObject.userName, passWord: loginObject.passWord  }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

  clientHome( userId, callback): any {
    this.http.get(baseUrl+'/client/dashbaord', {
      params: { userId: userId }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }
  
  consigmentFileUpload( fileUploadList, callback): any {
    this.http.post(baseUrl+'/consignment-fileUpload',fileUploadList
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  }

 uploadManualInvoice( fileUploadList, callback): any {
    this.http.post(baseUrl+'/superUser-level/manualInvoice-fileUpload',fileUploadList
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  }


  fileList(userId, callback): any {
    this.http.get(baseUrl+'/consignment-fileList',{
      params: { userId: userId  }
    }).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      console.error(error);
    });
  };

  invoicePendingData(callback): any {
    this.http.get(baseUrl+'/superUser-level/broker-shipment'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  };

  invoiceNonD2zPendingData(callback): any {
    this.http.get(baseUrl+'/superUser-level/broker-nonD2z-shipment'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  };

  notBilledData(callback): any {
    this.http.get(baseUrl+'/superUser-level/not-billed'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  };

  nonD2zNotBilledData(callback): any {
    this.http.get(baseUrl+'/superUser-level/nd-Not-billed'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  };

  invoiceApprovedData(callback): any {
    this.http.get(baseUrl+'/superUser-level/broker-Invoiced'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  };

  invoiceNonD2zApprovedData(callback): any {
    this.http.get(baseUrl+'/superUser-level/broker-nonD2z-Invoiced'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  };

  labelFileList(userId, callback): any {
    this.http.get(baseUrl+'/label-fileList',{
      params: { userId: userId  }
    }).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  }

  consignmentFileData( fileName, callback): any {
    this.http.post(baseUrl+'/consignment-fileData',fileName)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

  createEnquiry( enquiryData, callback): any {
    this.http.post(baseUrl+'/create-enquiry',enquiryData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

   createJob( enquiryData, callback): any {
    this.http.post(baseUrl+'/superUser-level/create-job',enquiryData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }


heldParcel( enquiryData, callback): any {
    this.http.post(baseUrl+'/superUser-level/held-parcel',enquiryData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

updateJob( enquiryData, callback): any {
    this.http.post(baseUrl+'/superUser-level/update-job',enquiryData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};

generateShipmentSummary( enquiryData, callback): any {
    this.http.post(baseUrl+'/superUser-level/shipmentReport',enquiryData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};
updateParcel( enquiryData, callback): any {
    this.http.post(baseUrl+'/superUser-level/update-parcel',enquiryData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};

deleteJob( enquiryData, callback): any {
    this.http.post(baseUrl+'/superUser-level/delete-job',enquiryData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};

outstandingJob( callback): any {
    this.http.get(baseUrl+'/superUser-level/incoming-job-list')
    .subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};


releaseparcellist(client, callback): any {
    this.http.get(baseUrl+'/superUser-level/incoming-parcel-releaselist/'+client)
    .subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};

parcellist(client, callback): any {
    this.http.get(baseUrl+'/superUser-level/incoming-parcel-list/'+client)
    .subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};

submitJob( enquiryData,callback): any {
     this.http.post(baseUrl+'/superUser-level/submit-job',enquiryData)
    .subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};

closingJob( callback): any {
    this.http.get(baseUrl+'/superUser-level/closing-job-list')
    .subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
};
 fetchEnquiry( status, fromDate, toDate, userId, callback): any {
    this.http.get(baseUrl+'/enquiry', {
      params: { status: status, fromDate: fromDate, toDate: toDate, userId: userId  }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };


  fetchOutstandingReturns(fromDate, toDate, userId, callback): any {
    this.http.get(baseUrl+'/outStanding-returns', {
      params: { fromDate: fromDate, toDate: toDate, userId: userId  }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  fetchSuperuserOutstandingReturns(fromDate, toDate, brokerName, callback): any {
    this.http.get(baseUrl+'/superUser-level/outStanding-returns', {
      params: { fromDate: fromDate, toDate: toDate, brokerName: brokerName  }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  fetchReturnsBrokerDetails(callback): any {
    this.http.get(baseUrl+'/superUser-level/returns-broker').subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  fetchUserId( userId, callback): any {
    this.http.get(baseUrl+'/userId', {
      params: { userId: userId  }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  completedEnquiry(userId, callback): any {
    this.http.get(baseUrl+'/completed-Enquiry',{
      params: { userId: userId  }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
      console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  superUserCompletedEnquiry(callback): any {
    this.http.get(baseUrl+'/superUser-level/completed-enquiry').subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
      console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  manifestFileData( fileName, callback): any {
    this.http.get(baseUrl+'/manifest-data', {
      params: { fileName: fileName  }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
      console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

  generateLabel( labelData, callback): any {
    this.http.post(baseUrl+'/generateLabel',labelData, {responseType: 'arraybuffer'}
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

  fileUploadDelete( refrenceNumList, callback): any {
  console.log(refrenceNumList);
    this.http.post(baseUrl+'/consignment-delete',refrenceNumList
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  downloadTrackingList( fileName, callback): any {
    this.http.get(baseUrl+'/tracking-list', {
      params: { fileName: fileName  }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  } 

 deleteMlid (service, callback): any {
    this.http.get(baseUrl+'/superUser-level/deleteMLID', {
      params: { service: service  }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

   addMlid(addMlidData, callback): any {
    console.log(addMlidData);
    this.http.post(baseUrl+'/superUser-level/addMLID',addMlidData
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

uploadweight(Weight,callback):any{
   this.http.post(baseUrl+'/superUser-level/weight',Weight
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

 downloadauweight(ArticleData,callback):any{
   this.http.post(baseUrl+'/superUser-level/downloadAUweight',ArticleData
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  superUserAddBroker(addBrokerData, callback): any {
    this.http.post(baseUrl+'/superUser-level/brokerRates',addBrokerData
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };


  superUserD2ZRatesBroker(addD2ZData, callback): any {
    this.http.post(baseUrl+'/superUser-level/d2zRates',addD2ZData
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  brokerlist(callback): any {
    this.http.get(baseUrl+'/superUser-level/brokerList').subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  joblist(callback): any {
    this.http.get(baseUrl+'/superUser-level/incomingList').subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };



  mlidList(callback): any {
    this.http.get(baseUrl+'/superUser-level/mlidList').subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  mliddeleteList(callback): any {
    this.http.get(baseUrl+'/superUser-level/mliddeleteList').subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  reconcileData(reconcile, callback): any {
    this.http.post(baseUrl+'/superUser-level/reconcileInfo',reconcile
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  reconcileNonD2zData(reconcilNnD2z, callback): any {
    this.http.post(baseUrl+'/superUser-level/reconcileInfo-NonD2z',reconcilNnD2z
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  nonD2zUpload(nonD2zClient, callback): any {
    this.http.post(baseUrl+'/superUser-level/Non-D2Z-Client',nonD2zClient
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  invoiceApproved(invoiceApproved, callback): any {
    this.http.put(baseUrl+'/superUser-level/approve-Invoice',invoiceApproved
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  shipmentApproved(shipmentFinalList, callback): any {
    this.http.put(baseUrl+'/superUser-level/approve-shipment',shipmentFinalList
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  nonD2zInvoiceApproved(nonD2zInvoiceApproved, callback): any {
    this.http.put(baseUrl+'/superUser-level/approve-NonD2z-Invoice',nonD2zInvoiceApproved
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  downloadInvoiceData( brokerList, airwaybillList, billed, invoiced, callback): any {
    this.http.get(baseUrl+'/superUser-level/download-Invoice', {
      params: { 
                broker: brokerList, 
                airwayBill: airwaybillList,
                billed: billed,
                invoiced: invoiced
      }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

downloadMlidData( service, callback): any {
    this.http.get(baseUrl+'/superUser-level/downloadMLID', {
      params: { service: service  }
    }).subscribe((resp) => {
      callback(resp);
      if (resp) {
      console.log(resp)
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };
  downloadNonD2zInvoiceData( brokerList, airwaybillList, billed, invoiced, callback): any {
    this.http.get(baseUrl+'/superUser-level/download-nonD2z-Invoice', {
      params: { 
                broker: brokerList, 
                airwayBill: airwaybillList,
                billed: billed,
                invoiced: invoiced
      }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  downloadReconcile( reconcileNumbers, callback): any {
    this.http.post(baseUrl+'/superUser-level/download-reconcile', reconcileNumbers
    ).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  downloadNonD2zReconcile( nonD2zReconcileNumbers, callback): any {
    this.http.post(baseUrl+'/superUser-level/download-non-d2z-reconcile', nonD2zReconcileNumbers
    ).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  fetchNonBrokerUserName(callback): any {
    this.http.get(baseUrl+'/superUser-level/Non-D2z-Broker').
    subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  fetchProfitAndLoss( fromDate, toDate,  callback): any {
    this.http.get(baseUrl+'/superUser-level/profit-loss', {
      params: { fromDate: fromDate, toDate: toDate }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  fetchReturnsClientDetails( referenceNumber, barcodeLabel, articleId,  callback): any {
    this.http.get(baseUrl+'/superUser-level/clientDetails', {
      params: { referenceNumber: referenceNumber, barcodeLabel: barcodeLabel, articleId: articleId  }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };
  
  createReturns( importReturnsList, callback): any {
    this.http.post(baseUrl+'/superUser-level/create-returns', importReturnsList
    ).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  updateAction(returnsAction, callback): any {
    this.http.put(baseUrl+'/action-returns',returnsAction
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };


shipmentAllocationArticleID( referenceNumbers, shipmentNumber, callback): any {


 this.http.put(baseUrl+'/superUser-level/allocate-shipment/'+shipmentNumber, 
 referenceNumbers)
   .subscribe((resp) => {
      callback(resp);
      if (resp) {
        
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  fetchActionReturns(roleId,callback): any {
    this.http.get(baseUrl+'/superUser-level/action-returns/'+ roleId).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  shipmentCharges(callback): any {
    this.http.get(baseUrl+'/superUser-level/shipment-Charge'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  };

  updateSuperUserAction(returnsAction, callback): any {
    this.http.put(baseUrl+'/superUser-level/action',returnsAction
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
          console.error("Not Found!")
      }
    }, (error) => {
        callback(error);
    });
  };

  getZoneDetails( brokerRequestList, callback): any {
    this.http.post(baseUrl+'/superUser-level/zone-report', brokerRequestList
    ).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  enquiryFileUpload( formdata,ticketNumber, callback): any {
    this.http.post(baseUrl+'/superUser-level/enquiryPodFile/'+ticketNumber, formdata)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  enquiryNonFileUpload( updatedData, callback): any {
    this.http.post(baseUrl+'/superUser-level/enquiryPod',updatedData)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  enquiryUpload( openEnquiryList, callback): any {
    this.http.put(baseUrl+'/superUser-level/enquiry/update', openEnquiryList)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  enquiryUpdate( updateEnquiry, callback): any {
    this.http.put(baseUrl+'/update-enquiry', updateEnquiry)
    .subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

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
  companyName,
  user_id
}



