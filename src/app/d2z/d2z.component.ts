import { Component, OnInit } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-d2z',
  template: ` <router-outlet></router-outlet>`
})
export class d2zComponent implements OnInit{
  constructor(
    private userIdle: UserIdleService,
    private spinner: NgxSpinnerService
  ) {

    this.userIdle.startWatching();

    this.userIdle.onTimerStart().subscribe((count) => {
      console.log(`Inactive for ${count}`);
    });

    this.userIdle.onTimeout().subscribe(() => {
      console.log("Timeout");
    });
    
  }

  ngOnInit() {
    this.spinner.show();
      console.log("First Entry ------>")
  }

}