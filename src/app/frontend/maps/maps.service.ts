
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Position } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class MapsService {
  readonly baseUrl = environment.baseUrl;
  readonly senderAndcarrier = this.baseUrl + "/carrier-and-sender-at-location";
  readonly senderAds = this.baseUrl + "/sender-at-my-location";
  readonly carrierAds = this.baseUrl + "/carrier-at-my-location";
  readonly user = "https://pacsend.app/webservices/api/v1/user/";
  readonly clientkey = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly Verification1 = this.baseUrl + "/profile-verification-step-one";
  readonly Verification2 = this.baseUrl + "/profile-verification-step-two";
  readonly Verification3 = this.baseUrl + "/profile-verification-step-three";
  readonly longitude = localStorage.getItem("longitude");
  readonly latitude = localStorage.getItem("latitude");
  // readonly getAds = this.baseUrl + "/get_all_ads";
  readonly getAdsV2 = this.baseUrl + "/get_all_ads_v2";
  readonly getFilterData = this.baseUrl + "/all-data-filter?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G"
  readonly getFilterDataOnAdType = this.baseUrl + "/ad-data-filter?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G"
  readonly getAdCattegory = this.baseUrl + "/get-ad-category";
  readonly getSenderAd = this.baseUrl + "/sender-ad-detail_v2";
  readonly getCarrierAd = this.baseUrl + "/carrier-ad-detail_v2";

  
  constructor(private httpClient: HttpClient) { }

  public getALlUsers() {
    let form = new FormData();
    form.append("client_key", this.clientkey);
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    return this.httpClient.post(this.senderAndcarrier, form);
  }

  public getsenderAds() {
    let form = new FormData();
    form.append("client_key", this.clientkey);
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    return this.httpClient.post(this.senderAds, form);
  }
  public getPosition(): Observable<Position> {
    return Observable.create(
      (observer) => {
        navigator.geolocation.watchPosition((pos) => {
          observer.next(pos);
        }),
          () => {
          },
        {
          enableHighAccuracy: true
        };
      });
  }
  public getcarrierAds() {
    let form = new FormData();
    form.append("client_key", this.clientkey);
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    return this.httpClient.post(this.carrierAds, form);
  }

  public getUser(id) {
    return this.httpClient.get(this.user + id + this.clientkey);
  }

  PostverificationStepone(body) {
    return this.httpClient.post(this.Verification1, body);
  }

  PostverificationStepTwo(body) {
    return this.httpClient.post(this.Verification2, body);
  }

  PostverificationStepThree(body) {
    return this.httpClient.post(this.Verification3, body);
  }
  getAllSenderAds(body: any) {
    let form = new FormData();

    form.append("client_key", this.clientkey);
    form.append("how_many_ads", body.adsCount);
    form.append("ad_type", body.adsType);
    return this.httpClient.post(this.getAdsV2, form);
  }

  getSingleAdCattegory(body: any) {
    let form = new FormData();

    form.append("client_key", this.clientkey);
    form.append("ad_id", body.ad_id);
    form.append("ad_type", body.ad_type);
    return this.httpClient.post(this.getAdCattegory, form);
  }

  getSenderAdDetail(body: any) {
    body.client_key = this.clientkey;
    return this.httpClient.post(this.getSenderAd, body);
  }

  getCarrierAdDetail(body: any) {
    body.client_key = this.clientkey;
    return this.httpClient.post(this.getCarrierAd, body);
  }


  getFilterItem() {
    return this.httpClient.get(this.getFilterData);
  }

  getFilterItemOnAdType(type, lat, lng) {
    return this.httpClient.get(this.getFilterDataOnAdType + "&type=" + type + "&latitude=" + lat + "&longitude=" + lng);
  }

  getALLFilteredSenderData(filter) {

    filter.client_key = this.clientkey;
    return this.httpClient.post(this.getAdsV2, filter);
  }
}
