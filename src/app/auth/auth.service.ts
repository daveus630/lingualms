import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environment.BASE_API_URL + 'agents/';
  private NAME_KEY = 'fullName';
  private IMAGE_URL = 'imageURL';
  private SIGNED_STATUS = 'signedStatus';
  private EMAIL_KEY = 'email';
  private fullName: string;
  public signedIn: string;
  private imageUrl: string;
  private emailId: string;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  agentId: string;
  isRole = 'User';

  constructor(
    private _ngZone: NgZone,
    private router: Router,
    public http: HttpClient
  ) {}

  get name() {
    return localStorage.getItem(this.NAME_KEY);
  }
  get image() {
    return localStorage.getItem(this.IMAGE_URL);
  }

  get email() {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  get isAuthenticated() {
    // Used !! to get boolean value instead of token value
    return !!localStorage.getItem(this.SIGNED_STATUS);
  }

  googleSignIn(): any {
    const googleAuth = gapi.auth2.getAuthInstance();

    googleAuth.then(() => {
      googleAuth.signIn({ scope: 'profile email' }).then(
        googleUser => {
          const profile = googleUser.getBasicProfile();
          this.fullName = profile.getName();
          this.imageUrl = profile.getImageUrl();
          this.signedIn = googleUser.isSignedIn();
          this.emailId = profile.getEmail();

          this._ngZone.run(() => {
            localStorage.setItem(this.NAME_KEY, this.fullName);
            localStorage.setItem(this.IMAGE_URL, this.imageUrl);
            localStorage.setItem(this.SIGNED_STATUS, this.signedIn);
            localStorage.setItem(this.EMAIL_KEY, this.emailId);
            if (this.isAuthenticated) {
              const redirect = this.redirectUrl
                ? this.router.parseUrl(this.redirectUrl)
                : '/gtech/dashboard';
              this.router.navigateByUrl(redirect);
            }
          });
        },
        error => {
          console.log(error);
          this._ngZone.run(() => {
            this.router.navigate(['/error']);
          });
        }
      );
    });
  }

  googleLogout() {
    const googleAuth = gapi.auth2.getAuthInstance();

    googleAuth.then(() => {
      googleAuth.signOut().then(() => {
        console.log('User signed out.');
        this._ngZone.run(() => {
          localStorage.removeItem(this.NAME_KEY);
          localStorage.removeItem(this.IMAGE_URL);
          localStorage.removeItem(this.SIGNED_STATUS);
          window.open('/', '_self');
          // this.router.navigate(['/lingua/home']);
        });
      });
    });
  }

  getAgentRole(agentId: string) {
    return this.http.get(this.API_URL + 'getAgentById/' + agentId);
  }

  getAgentId() {
    return this.email ? this.email.split('@')[0] : null;
  }
}
