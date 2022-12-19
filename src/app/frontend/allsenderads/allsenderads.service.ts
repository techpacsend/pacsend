import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ALlSenderAdService {

    readonly allSenderAds = "http://pacsend.uk/webservices/api/v1/ads/sender?client_key=GeroO1JYhwlXo5fEQm5rHuG3ZX5Hj4gNc35odwYq";

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(){
    return this.httpClient.get(this.allSenderAds);
  }
}