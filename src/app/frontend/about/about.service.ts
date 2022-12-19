import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AboutService {
  readonly baseUrl = environment.baseUrl;
  readonly aboutAPI = this.baseUrl +"/about?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly SettingAPI = this.baseUrl +"/setting?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";

  constructor(private httpClient: HttpClient) { }

  public GetAbout() {
    return this.httpClient.get(this.aboutAPI);
  }

  getSetting() {
    return this.httpClient.get(this.SettingAPI);
  }
}