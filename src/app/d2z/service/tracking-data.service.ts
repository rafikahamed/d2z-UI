import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

const hostname = document.location.hostname;
const apiName = document.location.hostname.includes("speedcouriers.com.au") == true ? "speedcouriers" : "d2z";
//const baseUrl = "https://"+hostname+"/v1/"+apiName;
const baseUrl = "http://"+hostname+":8080/v1/"+apiName;
 //const baseUrl = "http://18.220.140.225:8080/v1/d2z";

@Injectable()
export class TrackingDataService implements OnInit{
  userMessage: userMessage;
  constructor(
      private http: HttpClient, 
      private router: Router
  ){}

  ngOnInit(){}

  generateTrackLabel( referenceNum, callback ): any {
      this.http.post(baseUrl+'/tracking-label', referenceNum, {responseType: 'arraybuffer'}
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

  generateSuperUserTrackLabel( referenceNum, callback ): any {
    this.http.post(baseUrl+'/superUser-level/tracking-label', referenceNum, {responseType: 'arraybuffer'}
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

  manifestCreation( manifestNumber, refrenceNumber, callback): any {
        this.http.get(baseUrl+'/manifest-creation', {
          params: { manifestNumber: manifestNumber, refrenceNumber: refrenceNumber }
        }).subscribe((resp) => {
          callback(resp);
          if (resp) {} else {
            console.error("Not Found!")
          }
        }, (error) => {
          callback(error);
        });
  };

  trackPracel(referenceNumberList, callback): any {
    this.http.get(baseUrl+'/trackParcel/referenceNumber/'+referenceNumberList).subscribe((resp) => {
      callback(resp);
      if (resp) {
        
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };
  
  etrackDetails(referenceNumberList, callback): any {
    this.http.get(baseUrl+'/superUser-level/track/etower/'+referenceNumberList).subscribe((resp) => {
      callback(resp);
      if (resp) {
        
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  //Broker Service call
  clientCreation( addClientData, callback): any {
    this.http.post(baseUrl+'/user',addClientData
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

  updateClient( updateClientData, callback): any {
    this.http.put(baseUrl+'/user',updateClientData
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

  companyList(brokerId, callback): any {
    this.http.get(baseUrl+'/broker-level/company-details',{
      params: { brokerId: brokerId }
    }).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  }

  brokerCompanyList(callback): any {
    this.http.get(baseUrl+'/superUser-level/broker-company-details'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  }

  manifestList(userId,callback): any {
    this.http.get(baseUrl+'/broker-level/manifestList',{
      params: { userId: userId }
    }).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  }

  shipmentList(userId, callback): any {
    this.http.get(baseUrl+'/broker-level/shipmentList',{
      params: { userId: userId }
    }).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  }

  apiShipmentList(callback): any {
    this.http.get(baseUrl+'/broker-level/api-shipmentList'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      callback(error);
    });
  }

  fetchClientDetails( companyName, roleId, callback): any {
    this.http.get(baseUrl+'/broker-level/user-details', {
      params: { companyName: companyName, roleId:'3'  }
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

  fetchBrokerDetails( companyName, callback): any {
    this.http.get(baseUrl+'/superUser-level/broker-details', {
      params: { companyName: companyName  }
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

  exportConsignment( fromDate, toDate, callback): any {
    this.http.get(baseUrl+'/superUser-level/export/consignment', {
      params: { fromDate: fromDate, toDate: toDate }
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

exportConsignmentfile( type, List,callback): any {
    this.http.get(baseUrl+'/superUser-level/export/consignmentfile', {
      params: { type: type, Data: List }
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

 exportShipmentfile( type, List, callback): any {
    this.http.get(baseUrl+'/superUser-level/export/shipmentfile', {
        params: { type: type, Data: List }
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
  exportDelete( fromDate, toDate, callback): any {
    this.http.get(baseUrl+'/superUser-level/export/delete', {
      params: { fromDate: fromDate, toDate: toDate }
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

  exportShipment( fromDate, toDate, callback): any {
    this.http.get(baseUrl+'/superUser-level/export/shipment', {
      params: { fromDate: fromDate, toDate: toDate }
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

  exportNonShipment( fromDate, toDate, callback): any {
    this.http.get(baseUrl+'/superUser-level/export/nonshipment', {
      params: { fromDate: fromDate, toDate: toDate }
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

  openEnquiryDetails( callback): any {
    this.http.get(baseUrl+'/superUser-level/open-enquiry').subscribe((resp) => {
      callback(resp);
      if (resp) {
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  };

  updateEnquiry(enquiryDetails, callback): any {
    this.http.put(baseUrl+'/superUser-level/Update-enquiry',enquiryDetails
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

  fetchShipmentDetails( shipmentNumber, userId, callback): any {
    this.http.get(baseUrl+'/consignments/shipment', {
      params: { shipmentNumber: shipmentNumber, userId: userId }
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

  fetchShipmentDetailsTempalte2( shipmentNumber, userId, callback): any {
    this.http.get(baseUrl+'/broker-level/consignments/shipment', {
      params: { shipmentNumber: shipmentNumber, userId: userId  }
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


fetchShipmentDetailsType( shipmentNumber, userId,Type, callback): any {
    this.http.get(baseUrl+'/consignments/shipmenttype', {
      params: { Data: shipmentNumber, userId: userId,Type:Type }
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

  fetchShipmentDetailsTempalte2Type( shipmentNumber, userId,Type, callback): any {
    this.http.get(baseUrl+'/broker-level/consignments/shipmenttype', {
      params: { Data: shipmentNumber, userId: userId,Type:Type  }
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

  fetchDirectInjectionDetails( companyName, callback): any {
    this.http.get(baseUrl+'/broker-level/direct-injection', {
      params: { companyName: companyName  }
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

  fetchBrokerConsignment( manifestNumber, userId, callback): any {
    this.http.get(baseUrl+'/broker-level/consignment-details', {
      params: { manifestNumber: manifestNumber, userId: userId  }
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

  shipmentAllocation( referenceNumbers, shipmentNumber, callback): any {
    this.http.put(baseUrl+'/broker-level/consignments/shipment/'+shipmentNumber, referenceNumbers).subscribe((resp) => {
      callback(resp);
      if (resp) {
        
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }
shipmentAllocationArticleID( referenceNumbers, shipmentNumber, callback): any {
    this.http.put(baseUrl+'/consignments/shipmentarticleid/'+shipmentNumber, referenceNumbers).subscribe((resp) => {
      callback(resp);
      if (resp) {
        
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      callback(error);
    });
  }

  superUserUpoloadTracking(trackingDetails, callback) : any {
    this.http.post(baseUrl+'/superUser-level/track-fileUpload', trackingDetails).subscribe((resp) => {
    callback(resp);
    if (resp) {
      
    } else {
        console.error("Not Found!")
     }
    }, (error) => {
      callback(error);
    });
  };

  superUserArrialUpload(arrivalDetails, callback) : any {
    this.http.post(baseUrl+'/superUser-level/track-arrivalReportUpload', arrivalDetails).subscribe((resp) => {
    callback(resp);
    if (resp) {
    } else {
        console.error("Not Found!")
     }
    }, (error) => {
      callback(error);
    });
  };

  fetchApiLogReport( client, fromDate, toDate, callback): any {
    this.http.get(baseUrl+'/superUser-level/d2z-apiLogs', {
      params: { client: client, fromDate: fromDate, toDate: toDate }
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

}

export interface userMessage {
  message,
  userName,
  access,
  companyName,
  userCode
}
