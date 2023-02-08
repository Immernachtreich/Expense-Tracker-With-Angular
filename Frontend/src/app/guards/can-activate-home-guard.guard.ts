import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanActivateHomeGuardGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    if(localStorage.getItem('token')) {
      return true;
    } 
    
    return this.router.createUrlTree(['/login']);
  }
  
}
