import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

// const baseUrl = "https://www.d2z.com.au/v1/d2z";
const baseUrl = "http://localhost:8080/v1/d2z";
// const baseUrl = "http://18.220.140.225:8080/v1/d2z";

@Injectable()
export class ConsigmentUploadService implements OnInit{
  public newUserSubject = new Subject<any>();
  userMessage: userMessage;
  englishFlag:boolean;
  chinessFlag:boolean;

  private messageSource = new BehaviorSubject({"englishFlag":true, "chinessFlag":false});
  currentMessage = this.messageSource.asObservable();

  private menuSource = new BehaviorSubject({"childmenuOne":false, "childmenuTwo":true, "childmenuThree":true,
                        "childmenuFour":true, "childmenuFive": true});
  menuSourceSelection = this.menuSource.asObservable();

  private menuBrokerSource = new BehaviorSubject({"childmenubrkOne":false, "childmenubrkTwo":true, "childmenubrkThree":true,
                        "childmenubrkFour":true, "childmenubrkFive": true});
  menuBrokerSourceSelection = this.menuBrokerSource.asObservable();

  private menuSuperSource = new BehaviorSubject({"childmenuSuperOne":false, "childmenuSuperTwo":true, "childmenuSuperThree":true,
                        "childmenuSuperFour":true, "childmenuSuperFive":true});
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
      console.error(error);
    });
  };

  notBilledData(callback): any {
    this.http.get(baseUrl+'/superUser-level/not-billed'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      console.error(error);
    });
  };

  invoiceApprovedData(callback): any {
    this.http.get(baseUrl+'/superUser-level/broker-Invoiced'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      console.error(error);
    });
  };

  labelFileList(userId, callback): any {
    this.http.get(baseUrl+'/label-fileList',{
      params: { userId: userId  }
    }).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      console.error(error);
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
      console.error(error);
    });
  }

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
      console.error(error);
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
        console.error(error);
    });
  }

  fileUploadDelete( refrenceNumList, callback): any {
    this.http.post(baseUrl+'/consignment-delete',refrenceNumList
    ).subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
        console.error(error);
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
        console.error(error);
    });
  }

  brokerlist(callback): any {
    this.http.get(baseUrl+'/superUser-level/brokerList').subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
        console.error(error);
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

  mlidList(callback): any {
    this.http.get(baseUrl+'/superUser-level/mlidList').subscribe((resp) => {
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

  downloadInvoiceData( brokerList, airwaybillList, callback): any {
    console.log(brokerList);
    console.log(airwaybillList);
    this.http.get(baseUrl+'/superUser-level/download-Invoice', {
      params: { broker: brokerList, 
                airwayBill: airwaybillList 
      }
    }).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
        console.error(error);
    });
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
  companyName,
  user_id
}



