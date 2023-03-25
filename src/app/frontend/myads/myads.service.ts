import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import {Observable,Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyAdService {
  readonly baseUrl = environment.baseUrl;
  // readonly MYadsurl = this.baseUrl + "/my-ads?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G"
  readonly MYadsurl = this.baseUrl + "/my-ads_v2?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G"
  readonly allCarrierAds = this.baseUrl + "/ads/carrier?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G&";
  readonly allSenderAds = this.baseUrl + "/ads/sender?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G&";
  readonly ad = this.baseUrl + "/ads/";
  // readonly filterSenderData = this.baseUrl + "/my-filter-ads";
  // readonly filtercarrierData = this.baseUrl + "/filter-my-carrier-ads";
  readonly filterSenderData = this.baseUrl + "/my-filter-ads_v2";
  readonly filtercarrierData = this.baseUrl + "/filter-my-carrier-ads_v2";
  readonly clientkey = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly SenderDetail = this.baseUrl + "/sender-ad-detail_v2";
  readonly PostSenderad = this.baseUrl + "/post-sender-ad_v2";
  readonly EditSenderad = this.baseUrl + "/update-sender-ad_v2";
  readonly POstcarrierAd = this.baseUrl + "/post-carrier-ad_v2";
  readonly EditcarrierAd = this.baseUrl + "/update-carrier-ad_v2";
  
  readonly MyBookingUrl = this.baseUrl + "/my-bookings"
  readonly GetAwardedAds = this.baseUrl + "/my-carrier-award-delivery"
  constructor(private httpClient: HttpClient) { }

private subject=new Subject<any>();



 public getAlladsActive(){
   this.subject.next();
 }

doAlladsRed():Observable<any>{
  return this.subject.asObservable();

}

  public GetCarrierAds() {
    return this.httpClient.get(this.allCarrierAds);
  }
  public GetSenderAds() {
    return this.httpClient.get(this.allSenderAds);
  }
  public viewAd(id) {
    return this.httpClient.get(this.ad + id + this.clientkey);
  }

  public Myads(page,userid) {
    let user_id = userid
    let formData = new FormData();
    // formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append('user_id', userid)
    formData.append("page", page);
    return this.httpClient.post(this.MYadsurl, formData)
  }

  public sendImages(body) {
    return this.httpClient.post('https://pacsend.tech/api/v1/post-sender-ad-images', body);
  }

  public PostSenderAdnew(body) {
    body.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    return this.httpClient.post(this.PostSenderad, body);
  }


  public PostSenderAdEdit(id, body) {
    body.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    body.append("ad_id", id);
    return this.httpClient.post(this.EditSenderad, body);
  }


  public PostCarrierAdnew(body) {
    return this.httpClient.post(this.POstcarrierAd, body);
  }
  public EditCarrierAd(id, body) {
    let obj = {
      ...body,
      client_key: 'Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G',
      ad_id: id,
    }
    return this.httpClient.post(this.EditcarrierAd, obj);
  }

  viewSenderAd(id) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", id);
    form.append("user_id", user.id);
    return this.httpClient.post(this.SenderDetail, form);
  }

  AwardedAds() {
    let formData = new FormData();
    let user: any = JSON.parse(localStorage.getItem("user"))
    formData.append("user_id", user.id);
    formData.append("client_key", this.clientkey);
    return this.httpClient.post(this.GetAwardedAds, formData)
  }

  MyBooking(adtype) {
    let formData = new FormData();
    let userId = localStorage.getItem("userId")
    formData.append("user_id", userId);
    formData.append("client_key", this.clientkey);
    formData.append("ad_type", adtype);
    return this.httpClient.post(this.MyBookingUrl, formData)
  }
  MyAdFilter(data) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    if (data.fromLongitude != null && data.fromLongitude != '') {
      form.append("fromlongitude", (parseFloat(data.fromLongitude).toFixed(4)).toString());
      form.append("fromlatitude", (parseFloat(data.fromLatitude).toFixed(4)).toString());
    } else {
      form.append("fromlongitude", 'null')
      form.append("fromlatitude", 'null')
    }
    if (data.toLongitude != null && data.toLongitude != '') {
      form.append("tolongitude", (parseFloat(data.toLongitude).toFixed(3)).toString());
      form.append("tolatitude", (parseFloat(data.toLatitude).toFixed(3)).toString());
    } else {
      form.append("tolongitude", 'null')
      form.append("tolatitude", 'null')
    }
    let userId = localStorage.getItem("userId")
    form.append("user_id", userId);
    form.append("customdate", data.custom_date);
    form.append("capacity", data.capacity);
    form.append("categories", JSON.stringify(data.categories));
    return this.httpClient.post(this.filterSenderData, form);
  }


  MyCarrierAdFilter(data) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    if (data.fromLongitude != null && data.fromLongitude != '') {
      form.append("fromlongitude", (parseFloat(data.fromLongitude).toFixed(4)).toString());
      form.append("fromlatitude", (parseFloat(data.fromLatitude).toFixed(4)).toString());
    } else {
      form.append("fromlongitude", 'null')
      form.append("fromlatitude", 'null')
    }
    if (data.toLongitude != null && data.toLongitude != '') {
      form.append("tolongitude", (parseFloat(data.toLongitude).toFixed(3)).toString());
      form.append("tolatitude", (parseFloat(data.toLatitude).toFixed(3)).toString());
    } else {
      form.append("tolongitude", 'null')
      form.append("tolatitude", 'null')
    }
    let userId = localStorage.getItem("userId")
    form.append("user_id", userId);
    form.append("customdate", data.custom_date);
    form.append("capacity", data.capacity);
    form.append("categories", JSON.stringify(data.categories));
    return this.httpClient.post(this.filtercarrierData, form);
  }
}
