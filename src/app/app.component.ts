import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherData } from './models/weather.model';
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

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  private loadWeather(): void {
    this.weatherData$ = this.weatherService.getWeatherData('Moscow');
  }
}
