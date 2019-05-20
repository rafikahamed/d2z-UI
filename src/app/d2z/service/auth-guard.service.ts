import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() {
//Your redirect logic/condition. I use this.

if (document.location.hostname == 'localhost') {
    this.router.navigate(['main']);
}
console.log('AuthGuard#canActivate called');
return true;

   
  }
//Constructor 
constructor(private router: Router) { }
}