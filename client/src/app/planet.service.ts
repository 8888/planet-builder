import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public get planets() {
    const headers = { 'Authorization': this.authService.idToken };
    const url = `${environment.apiUrl}/planets`

    return this.http.get<{id: string, name: string, iconUrl: string}[]>(url, { headers });
  }
}
