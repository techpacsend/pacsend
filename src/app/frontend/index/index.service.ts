import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class IndexService {
  readonly baseUrl = environment.baseUrl;
  readonly howContent =  this.baseUrl +"/home-how-content?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly aboutAPI =  this.baseUrl +"/about?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly whyPacsend =  this.baseUrl +"/home-why-content?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly settings =  this.baseUrl +"/setting?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";

  constructor(private httpClient: HttpClient) { }

  public GetAbout(){
    return this.httpClient.get(this.aboutAPI);
  }
  public GetVideoLink(){
    return this.httpClient.get("http://pacsend.uk/api/v1/home-how-content?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
  }
  public GetWhyPacsend(){
    return this.httpClient.get(this.whyPacsend);
  }
  public GetHowContent(){
    return this.httpClient.get(this.howContent);
  }
  public getSettings(){
    return this.httpClient.get(this.settings);
  }
}
