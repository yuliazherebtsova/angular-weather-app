import { Component, OnInit, ViewChild } from '@angular/core';
import { concatMap, Observable } from 'rxjs';
import { WeatherData } from './models/weather.model';
import { GeolocationService } from './services/geolocation.service';
import { WeatherService } from './services/weather.service';
import { Country } from 'country-state-city';
import { NgSelectComponent } from '@ng-select/ng-select';

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
  @ViewChild('select') select: NgSelectComponent;

  weatherData$: Observable<WeatherData>;
  temperature = Temperature;
  currentCity: string;
  searchCity: string;
  selectedCar: number;
  cities = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys' },
    { id: 4, name: 'Pabradė' },
    { id: 5, name: 'Klaipėda' },
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
