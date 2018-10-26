import { Component } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-d2z',
  template: `
    <router-outlet></router-outlet>
  `
})
export class d2zComponent {
  constructor(
    private userIdle: UserIdleService
  ) {

    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe((count) => {
      console.log(`Inactive for ${count}`);
    });
    this.userIdle.onTimeout().subscribe(() => {
      console.log("Timeout");
    });

  }

}