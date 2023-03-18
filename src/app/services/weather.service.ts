import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeatherData } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherData(cityName: string): Observable<WeatherData> {
    let params = new HttpParams();
    params = params
      .set('q', cityName)
      .set('units', 'metric')
      .set('mode', 'json')
      .set('appid', environment.openWeatherApiKey);

    return this.http.get<WeatherData>(environment.weatherApiBaseUrl, {
      params,
    });
  }
}
