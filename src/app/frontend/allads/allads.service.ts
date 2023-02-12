import { SettingService } from './../../app.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { PacsendApiLinks } from '../Pacsendapilinks';
import { resolve } from 'url';
import { environment } from './../../../environments/environment';
import { from, Observable } from 'rxjs';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly baseUrl = environment.baseUrl;
  // readonly filterSenderData = this.baseUrl + "/filter-sender-ads";
  readonly filterSenderData = this.baseUrl + "/filter-sender-ads_v2";
  readonly allds = this.baseUrl + "/senders-and-carriers-ads_v2";
  readonly allSenderAds = this.baseUrl + "/sender-ads_v2";
  readonly allCarrierAds = this.baseUrl + "/carrier-ads_v2";

  readonly myactivityallSenderAds = this.baseUrl + "/sender-ads-my-activity";
  readonly myactivityallCarrierAds = this.baseUrl + "/carrier-ads-my-activity";
  

  readonly ad = this.baseUrl + "/ads/";
  readonly clientkey = "?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly PostSenderChatting = this.baseUrl + "/sender-chat-lists";
  readonly PostCarrierChatting = this.baseUrl + "/carrier-chat-lists";

  readonly SenderConnect = this.baseUrl + "/sender-connect";
  readonly CarierConnect = this.baseUrl + "/carrier-connect";

  readonly CarrierAdDetail = this.baseUrl + "/carrier-ad-detail_v2";
  readonly SenderAdDetail = this.baseUrl + "/sender-ad-detail_v2";

  readonly PickUp = this.baseUrl + "/sender-package-pickup";
  readonly Reacheddestination = this.baseUrl + "/sender-reached-location";
  readonly Verification = this.baseUrl + "/sender-package-delivery";
  readonly Dilevered = this.baseUrl + "/sender-confirm-delivery";

  readonly ConfirmPickUpForCarrier = this.baseUrl + "/carrier-confirm-pickup";
  readonly Pickeuppckageforcarrier = this.baseUrl + "/carrier-package-pickup"
  readonly packageNotPickeupCarrier = this.baseUrl + "/carrier-package-pickup-cancel"
  readonly reachedlocationforcarrier = this.baseUrl + "/carrier-reached-location";
  readonly Varificationforcarrier = this.baseUrl + "/carrier-package-delivery";
  readonly Dileveredforcarrier = this.baseUrl + "/carrier-confirm-delivery"
  readonly Interestedlist = this.baseUrl + "/carrier-deliveries";
  readonly SenderAdCancelRequest = this.baseUrl + "/sender-ads-cancel-after-award";
  readonly CarrierAdCancelRequest = this.baseUrl + "/carrier-ads-cancel-after-award";
  readonly CancelRequestCarrierAdConfirm = this.baseUrl + "/carrier-ads-sender-confirm";
  readonly CancelRequestSenderAdConfirm = this.baseUrl + "/sender-ads-carrier-confirm"
  readonly CancelRequestYesorNo = this.baseUrl + "/sender-cancel-request-approve";
  readonly PostFeedback = this.baseUrl + "/feedback"

  // readonly GetWishlist = this.baseUrl + "/my-wishlist";
  readonly GetWishlist = this.baseUrl + "/my-wishlist_v2"
  readonly reports =this.baseUrl + "/report-reasons"
  readonly addreport =this.baseUrl + "/ad-report"
  readonly removeWishLlist = this.baseUrl + "/wishlist-remove"
  readonly feedbackUrl = this.baseUrl + "/add-my-feedbacks";
  heartClicked: string;
  data1: any;

  constructor(private httpClient: HttpClient, private _router: Router, private SettingService: SettingService) { }

  readonly longitude = localStorage.getItem("longitude");
  readonly latitude = localStorage.getItem("latitude");
  readonly user_id = localStorage.getItem("userId");


  public alladRequest() {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    form.append("userId", this.user_id);
    return this.httpClient.post(this.allds, form);
  }

  public allcarrierRequest(page) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    form.append("user_id", this.user_id);
    form.append("page", page);
    return this.httpClient.post(this.allCarrierAds, form);
  }

  public myactivityallcarrierRequest(page) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    form.append("user_id", this.user_id);
    form.append("page", page);
    return this.httpClient.post(this.myactivityallCarrierAds, form);
  }

  

  public allsenderRequest(page) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    form.append("user_id", this.user_id);
    form.append("page", page);
    return this.httpClient.post(this.allSenderAds, form);
  }

  public myactivityallsenderRequest(page) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("longitude", this.longitude);
    form.append("latitude", this.latitude);
    form.append("user_id", this.user_id);
    form.append("page", page);
    return this.httpClient.post(this.myactivityallSenderAds, form);
  }

  viewCarrierAdd(id) {
    let user: any = JSON.parse(localStorage.getItem('userId'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", id);
    if (user) {
      form.append("user_id", user);
      return this.httpClient.post(this.CarrierAdDetail, form);
    } else { 
      return this.httpClient.post(this.CarrierAdDetail, form);
    }
    
  }

  viewSenderAd(id) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", id);
    if (user) {
      form.append("user_id", user.id);
      return this.httpClient.post(this.SenderAdDetail, form);
    }
    else { 
      return this.httpClient.post(this.SenderAdDetail, form);
    }
    
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });

  }

  addToWishlist(data) {
    return this.httpClient.post(this.baseUrl + "/wishlist", data)
  }
  async connectSender(data) {
    try {
      this._router.navigateByUrl("/chat");
      const res = this.httpClient.post(this.baseUrl + "/sender-connect", data).subscribe(res => {
        if (res['status'] == "success") {
          this.SettingService.Success(res['message'])
          this._router.navigateByUrl("/chat");
        } else if (res['status'] == "error") {
          this.SettingService.Error(res['message'])
        }
      });
    }
    catch (e) {
    }
  }

  PostSenderChat(body) {
    try {
      this.httpClient.post(this.PostSenderChatting, body)
    } catch (e) {
    }
  }

  postSenderConnect(body) {
    return this.httpClient.post(this.SenderConnect, body);
  }

  postcarrierConnect(body) {
    return this.httpClient.post(this.CarierConnect, body);
  }
// pikup ids issue resolve
  PostDealProcess(adId, nostate?: string) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let adCreater_id: any = JSON.parse(localStorage.getItem('adCreater._id'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
      if (nostate && nostate != '') {
      form.append("nostate", nostate);
    }
    form.append("user_id", adCreater_id);
    return this.httpClient.post(this.PickUp, form);
  }

  PostReachedDestination(adId) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    return this.httpClient.post(this.Reacheddestination, form);
  }

  PostVerificationAPI(adId, code) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    form.append("verification_code", code)
    return this.httpClient.post(this.Verification, form);
  }

  PostDilevered(adId, receiverid) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", receiverid);
    return this.httpClient.post(this.Dilevered, form);
  }

  PostDealProcessForCarrier(adId) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    return this.httpClient.post(this.ConfirmPickUpForCarrier, form);
  }


  POSTPickeuppckageforcarrier(adId) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    return this.httpClient.post(this.Pickeuppckageforcarrier, form);
  }





  packageNotPickedCarrier(adId) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    return this.httpClient.post(this.packageNotPickeupCarrier, form);
  }

  POSTPickeuppckageforcarrierReq(adId, pickupUserId) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", pickupUserId);
    return this.httpClient.post(this.Pickeuppckageforcarrier, form);
  }

  POSTReachedlocationforcarrier(adId, receiverid) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    form.append("receiver_id", receiverid);
    return this.httpClient.post(this.reachedlocationforcarrier, form);
  }

  POSTVarificationforcarrier(adId, receiverid, code) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    form.append("receiver_id", receiverid);
    form.append("verification_code", code);
    return this.httpClient.post(this.Varificationforcarrier, form);
  }

  POSTDileveredforcarrier(adId, receiverid) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    form.append("receiver_id", receiverid);
    return this.httpClient.post(this.Dileveredforcarrier, form);
  }

  GetInterestedlist(adId) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    return this.httpClient.post(this.Interestedlist, form);
  }

  PostFeedbacks(adId, review, rating) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    form.append("review", review);
    form.append("rating", rating);
    return this.httpClient.post(this.PostFeedback, form);
  }

  Feedbacks(adId, review, rating, receiverId, ad_type) {
    
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    form.append("user_id", user.id);
    // form.append("offeror_id",receiverId);
    form.append("offeror_id", receiverId);
    form.append("title", review); 
    form.append("rating", rating);
    form.append("ad_type", ad_type);
    return this.httpClient.post(this.feedbackUrl, form);

  }


  GetAllWishlist() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("user_id", user.id);
    return this.httpClient.post(this.GetWishlist, form);
  }



  getReport(): Observable<any> {
let params = new HttpParams().set('client_key','Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G');
    return this.httpClient.get(this.reports,{params});
  }

  addReport(adID,type,reasson_id) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id",adID);
    form.append("ad_type",type);
    form.append("user_id", user.id);
    form.append("reason_id",reasson_id);
    return this.httpClient.post(this.addreport, form);
      }

      
  RemoveWishlist(data: any, adType: any) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("user_id", user.id);
    form.append("ad_type", adType);
    form.append("ad_id", data.ad_id);
    return this.httpClient.post(this.removeWishLlist, form);
  }


  SendCancelRequest(ad_id, user_id, requested_id, user_type_id) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", ad_id);
    form.append("user_id", user_id);
    form.append("requested_id", requested_id);
    form.append("user_type_id", user_type_id);
    return this.httpClient.post(this.SenderAdCancelRequest, form);
  }

  SendCarrierAdCancelRequest(ad_id, user_id, requested_id, user_type_id) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", ad_id);
    form.append("user_id", user_id);
    form.append("requested_id", requested_id);
    form.append("user_type_id", user_type_id);
    return this.httpClient.post(this.CarrierAdCancelRequest, form);
  }

  CancelRequestCarrierAdAccept(ad_id, user_id, requested_id, action) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", ad_id);
    form.append("user_id", user_id);
    form.append("requested_id", requested_id);
    form.append("action", action);
    return this.httpClient.post(this.CancelRequestCarrierAdConfirm, form);
  }

  CancelRequestSenderAdAccept(ad_id, user_id, requested_id, action) {
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", ad_id);
    form.append("user_id", user_id);
    form.append("requested_id", requested_id);
    form.append("action", action);
    return this.httpClient.post(this.CancelRequestSenderAdConfirm, form);
  }

  CancelRequestAcceptens(adId, userId, nostate?: string) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    form.append("ad_id", adId);
    if (nostate != null || nostate != '') {
      form.append("nostate", nostate);
    }
    form.append("user_id", userId);
    return this.httpClient.post(this.CancelRequestYesorNo, form);
  }
  senderFilterData(data) {
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
    form.append("customdate", data.custom_date);
    form.append("capacity", data.capacity);
    // form.append("categories", JSON.stringify(data.categories));
    form.append("categories", data.categories);
    form.append("type", data.type);
    form.append("user_id", data.user_id)
    return this.httpClient.post(this.filterSenderData, form);
  }
}
