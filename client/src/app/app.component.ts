import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanetService } from './planet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public planets: Observable<{ name: string, iconUrl: string}[]>;

  constructor(private planetService: PlanetService) {
    this.planets = this.planetService.planets;
  }
}
