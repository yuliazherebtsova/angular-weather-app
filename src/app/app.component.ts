import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GeolocationData } from './models/geolocation.model';
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

  constructor(
    private weatherService: WeatherService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
    this.loadWeather();
    this.geolocationService.getGeolocation().subscribe({
      next: (res: GeolocationData) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private loadWeather(): void {
    this.weatherData$ = this.weatherService.getWeatherData('Moscow');
  }
}
