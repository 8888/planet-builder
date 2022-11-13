import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  public idToken = '';
  public accessToken = '';

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public validateAccess(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchTokensFromLocal();
      if (this.idToken && this.accessToken) {
        resolve();
        return;
      }

      const code = this.extractCode();
      if (code) {
        this.exchangeCodeForTokens(code, resolve, reject);
      } else {
        this.logout();
        reject();
      }
    });
  }

  public logout(): void {
    localStorage.clear();
    this.document.location.href = environment.loginUrl;
  }

  private extractCode(): string {
    /*
    Using Angular's router to access the queryparams is not ideal
    We are looking for a code that comes from a redirect outside of angular, so it will be there immediately or not at all
    ActivatedRoute will subscribe and first emit an empty object,
    then a tick later find the params when the router initializes,
    then emit the params
    */
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    return code || '';
  }

  private exchangeCodeForTokens(code: string, resolve: () => void, reject: () => void): void {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('client_id', environment.userPoolClientId);
    body.set('redirect_uri', environment.userPoolClientRedirectUri);

    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    this.http.post<any>(
      environment.cognitoAuthUrl,
      body.toString(),
      { headers }
    ).subscribe({
      next: response => {
        this.storeTokens(response.id_token, response.access_token);
        resolve();
      },
      error: () => {
        this.logout();
        reject();
      },
    });
  }

  private storeTokens(id: string, access: string): void {
    this.idToken = id;
    this.accessToken = access;
    localStorage.setItem('idToken', id);
    localStorage.setItem('accessToken', access)
  }

  private fetchTokensFromLocal(): void {
    this.idToken = localStorage.getItem('idToken') || '';
    this.accessToken = localStorage.getItem('accessToken') || '';
  }
}
