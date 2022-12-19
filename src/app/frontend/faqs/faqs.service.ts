import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FaqsService {
  readonly baseUrl = environment.baseUrl;
    readonly allFaqs = this.baseUrl +"/faqs?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(){
    return this.httpClient.get(this.allFaqs);
  }
}