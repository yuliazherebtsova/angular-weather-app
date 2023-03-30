import { Component, OnInit } from '@angular/core';
import { concatMap, Observable } from 'rxjs';
import { WeatherData } from './models/weather.model';
import { GeolocationService } from './services/geolocation.service';
import { WeatherService } from './services/weather.service';
import { Country } from 'country-state-city';

enum Temperature {
  VeryCold = -25,
  Cold = -11,
  Cool = 6,
  Warm = 14,
  Hot = 23,
  VeryHot = 30,
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  weatherData$: Observable<WeatherData>;
  temperature = Temperature;
  currentCity: string;
  searchCity: string;
  selectedCar: number;

  cars = [
    { id: 1, name: 'Wellington' },
    { id: 2, name: 'Berlin' },
    { id: 3, name: 'Winnipeg' },
    { id: 4, name: 'Sydney' },
  ];

  constructor(
    private weatherService: WeatherService,
    private geolocationService: GeolocationService
  ) {}

  private loadWeather(): void {
    if (this.currentCity) {
      this.weatherData$ = this.weatherService.getWeatherData(this.currentCity);
      this.searchCity = this.currentCity;
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

  ngOnInit(): void {
    this.loadWeather();
    console.log(Country.getAllCountries());
  }

  onSearchCity(): void {
    this.currentCity = this.searchCity;
    this.loadWeather();
    this.searchCity = '';
  }
}
