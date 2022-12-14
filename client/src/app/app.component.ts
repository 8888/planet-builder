import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PlanetService } from './planet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public userIsAuthenticated = false;
  public planets: Observable<{ id: string, name: string, icon_url: string}[]>;

  constructor(private authService: AuthService, private planetService: PlanetService) {
    this.authService.validateAccess().then(
      () => this.userIsAuthenticated = true,
      () => this.authService.logout,
    );
    this.planets = this.planetService.planets;
  }

  public logout(): void {
    this.authService.logout();
  }
}
