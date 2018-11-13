import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

// const baseUrl = "https://www.d2z.com.au/v1/d2z";
const baseUrl = "http://localhost:8080/v1/d2z";
// const baseUrl = "http://18.216.201.118:8080/v1/d2z";

@Injectable()
export class ConsigmentUploadService implements OnInit{
  public newUserSubject = new Subject<any>();
  userMessage: userMessage;
  constructor(
      private http: HttpClient, 
      private router: Router
  ){}

  ngOnInit(){}

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
      console.error(error);
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

  fileList(callback): any {
    this.http.get(baseUrl+'/consignment-fileList'
    ).subscribe((resp) => {
      callback(resp);
    }, (error) => {
      console.error(error);
    });
  }

  consignmentFileData( fileName, callback): any {
    this.http.get(baseUrl+'/consignment-fileData', {
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
  companyName
}
