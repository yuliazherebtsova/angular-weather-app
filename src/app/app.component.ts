import { Component, OnInit } from '@angular/core';
import { concatMap, Observable } from 'rxjs';
import { WeatherData } from './models/weather.model';
import { GeolocationService } from './services/geolocation.service';
import { WeatherService } from './services/weather.service';

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

  constructor(
    private weatherService: WeatherService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  private loadWeather(): void {
    this.weatherData$ = this.geolocationService.getGeolocation().pipe(
      concatMap(({ city, countryCapital }) => {
        const currentCity = city ? city : countryCapital;
        this.currentCity = currentCity;
        return this.weatherService.getWeatherData(currentCity);
      })
    );
  }
}
