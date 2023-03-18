import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherData } from './models/weather.model';
import { WeatherService } from './services/weather.service';

enum Temperature {
  VeryCold = -18,
  Cold = -9,
  Cool = 6,
  Warm = 15,
  Hot = 20,
  VeryHot = 27,
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
