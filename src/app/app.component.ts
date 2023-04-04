import { Component, OnInit, ViewChild } from '@angular/core';
import {
  catchError,
  concat,
  concatMap,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { WeatherData } from './models/weather.model';
import { GeolocationService } from './services/geolocation.service';
import { WeatherService } from './services/weather.service';
import { City } from 'country-state-city';
import { NgSelectComponent } from '@ng-select/ng-select';

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

  currentCity: string;
  selectedCity: SearchCity;
  cityInput$ = new Subject<string>();
  weatherData$: Observable<WeatherData>;
  temperature = Temperature;
  selectedCar: number;
  cities$: Observable<SearchCity[]>;

  constructor(
    private weatherService: WeatherService,
    private geolocationService: GeolocationService
  ) {}

  private loadWeather(): void {
    if (this.currentCity) {
      this.weatherData$ = this.weatherService.getWeatherData(this.currentCity);
    } else {
      this.weatherData$ = this.geolocationService.getGeolocation().pipe(
        concatMap(({ city, countryCapital }) => {
          const currentCity = city ? city : countryCapital;
          this.currentCity = currentCity;
          return this.weatherService.getWeatherData(currentCity);
        })
      );
    }
  }

  private getSearchCities(term: string): Observable<SearchCity[]> {
    const cities = City.getAllCities();
    const filteredCities = cities
      .filter((city) => city.name.toLowerCase().startsWith(term?.toLowerCase()))
      .map((city, index) => ({
        id: index,
        name: city.name,
        nameWithCountry: `${city.name}, ${city.countryCode}`,
      }));
    return of(filteredCities);
  }

  private createSearchCities() {
    this.cities$ = concat(
      of([]), // default items
      this.cityInput$.pipe(
        distinctUntilChanged(),
        switchMap((term) =>
          this.getSearchCities(term).pipe(
            catchError(() => of([])) // empty list on error
          )
        )
      )
    );
  }

  ngOnInit(): void {
    this.loadWeather();
    this.createSearchCities();
  }

  onSearchCity(): void {
    this.currentCity = this.selectedCity?.name;
    this.loadWeather();
    this.ngSelectComponent.handleClearClick();
  }
}
