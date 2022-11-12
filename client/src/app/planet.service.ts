import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private planetsData = [
    { name: 'Earth', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/The_Blue_Marble_%28remastered%29.jpg' },
    { name: 'Mars', iconUrl: 'https://cdn.mos.cms.futurecdn.net/rFxjRZcHNTZ8Jpw34pthnQ.jpg' },
  ];
  private planetsSubject: BehaviorSubject<{ name: string, iconUrl: string }[]>;
  private planets$: Observable<{ name: string, iconUrl: string }[]>;

  constructor() {
    this.planetsSubject = new BehaviorSubject(this.planetsData);
    this.planets$ = this.planetsSubject.asObservable();
  }

  public get planets() {
    return this.planets$;
  }
}
