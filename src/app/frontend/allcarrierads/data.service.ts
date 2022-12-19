import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly allCarrierAds = "http://pacsend.uk/webservices/api/v1/ads/carrier?client_key=GeroO1JYhwlXo5fEQm5rHuG3ZX5Hj4gNc35odwYq";

  apiUrl="http://pacsend.uk/api/v1/city?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  constructor(private httpClient: HttpClient) { }

  getCitiesByNameApiUrl = "http://pacsend.uk/api/v1/get-selected-city?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G&city_name=";

  public sendGetRequest(){
    return this.httpClient.get(this.allCarrierAds);
  }

  public getAllCity(){
    return this.httpClient.get(this.apiUrl);
  }

  public getCitiesByName(city_name: string): Observable<any>{
    return this.httpClient.get<any>(this.getCitiesByNameApiUrl+city_name);
  }
}
