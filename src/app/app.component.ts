import { City } from 'country-state-city';
import { Platform } from '@angular/cdk/platform';
import { WeatherData } from './models/weather.model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { WeatherService } from './services/weather.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GeolocationService } from './services/geolocation.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import {
  catchError,
  concat,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';

enum Temperature {
  VeryCold = -25,
  Cold = -11,
  Cool = 6,
  Warm = 14,
  Hot = 23,
  VeryHot = 30,
}

interface SearchCity {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;

  currentCity: string;
  selectedCity: SearchCity;
  cityInput$ = new Subject<string>();
  weatherData$: Observable<WeatherData>;
  temperature = Temperature;
  selectedCar: number;
  cities$: Observable<SearchCity[]>;

  constructor(
    private platform: Platform,
    private swUpdate: SwUpdate,
    private weatherService: WeatherService,
    private geolocationService: GeolocationService
  ) {
    this.isOnline = false;
    this.modalVersion = false;
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
  }

  private loadWeather(): void {
    if (this.currentCity) {
      this.weatherData$ = this.weatherService.getWeatherDataByCity(this.currentCity);
    } else {
      this.weatherData$ = this.geolocationService.getGeolocation().pipe(
        concatMap(({latitude, longitude, city}) => {
          this.currentCity = typeof city === 'string' ? city : "Current Location";
          return this.weatherService.getWeatherDataByCoordinates({latitude, longitude});
        })
      );
    }
  }

  private createSearchCities(term: string): Observable<SearchCity[]> {
    const cities = City.getAllCities();
    const filteredCities = cities
      .filter((city) => city.name.toLowerCase().startsWith(term?.toLowerCase()))
      .map((city, index) => ({
        id: index,
        name: city.name,
        nameWithCountry: `${city.name}, ${city.stateCode}, ${city.countryCode}`,
      }));
    return of(filteredCities);
  }

  private loadSearchCities() {
    this.cities$ = concat(
      of([]),
      this.cityInput$.pipe(
        distinctUntilChanged(),
        switchMap((term) =>
          this.createSearchCities(term).pipe(
            catchError(() => of([]))
          )
        )
      )
    );
  }

  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }

  ngOnInit(): void {
    this.updateOnlineStatus();
    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        }),
      );
    }

    this.loadModalPwa();
    this.loadSearchCities();
    this.loadWeather();
  }

  onSearchCity(): void {
    this.currentCity = this.selectedCity?.name;
    this.loadWeather();
    this.ngSelectComponent.handleClearClick();
  }
}
