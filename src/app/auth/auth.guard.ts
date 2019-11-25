import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { WebService } from '../_services/web.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private webService: WebService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean | Observable<boolean> | Promise<boolean> {

    if (this.authService.isAuthenticated) {
      console.log(this.authService.isAuthenticated);
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    console.log(this.authService.redirectUrl);

    // Navigate to the login page with extras
    this.router.navigate(['/gtech/home']);
    return false;
  }
}
