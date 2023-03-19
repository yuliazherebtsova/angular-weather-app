import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeolocationData } from '../models/geolocation.model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  getGeolocation(): Observable<GeolocationData> {
    let headers = new HttpHeaders();
    headers = headers
      .set(environment.xRapidAPIHostName, environment.xRapidAPIHostValue)
      .set(environment.xRapidAPIKeyName, environment.xRapidAPIKeyValue);
    let params = new HttpParams();
    params = params.set('apikey', environment.ipFindApiKey);

    return this.http.get<GeolocationData>(environment.ipFindApiBaseUrl, {
      headers,
      params,
    });
  }
}
