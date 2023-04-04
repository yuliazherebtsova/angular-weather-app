import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeatherData } from '../models/weather.model';

interface Coordinates {
  latitude: number;
  longitude: number;
}
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherDataByCity(cityName: string): Observable<WeatherData> {
    const params = new HttpParams()
      .set('q', cityName)
      .set('units', 'metric')
      .set('mode', 'json')
      .set('appid', environment.openWeatherApiKey);

    return this.http.get<WeatherData>(environment.weatherApiBaseUrl, {
      params,
    });
  }

  getWeatherDataByCoordinates(
    coordinates: Coordinates
  ): Observable<WeatherData> {
    const { latitude, longitude } = coordinates;
    const params = new HttpParams()
      .set('lat', latitude)
      .set('lon', longitude)
      .set('units', 'metric')
      .set('mode', 'json')
      .set('appid', environment.openWeatherApiKey);

    return this.http.get<WeatherData>(environment.weatherApiBaseUrl, {
      params,
    });
  }
}
