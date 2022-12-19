import { SettingService } from './../../app.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd';
import { environment } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  readonly baseUrl = environment.baseUrl;

  // readonly user_profile = this.baseUrl + "/get_user_profile"
    // readonly MySenderCarrierPendingAds = this.baseUrl + "/my-bookings-ads-pending"
  // readonly MyTypeWiseBookingAds = this.baseUrl + "/my-bookings-ads"
   // readonly MyAwardedCarrierAds = this.baseUrl + "/my-carrier-ads-award"
  // readonly MyAwardedSenderAds = this.baseUrl + "/my-sender-ads-award"
  // readonly MyFeedBacks = this.baseUrl + "/my-feedbacks"
  readonly user_profile = this.baseUrl + "/get_user_profile_v2";
  readonly update_userProfile_image = this.baseUrl + "/upload_user_profile_photo_v2";
  readonly user = this.baseUrl + "/profiles"
  readonly UpdfateUser = this.baseUrl + "/update-user-profile"
  readonly MyAwardedCarrierAds = this.baseUrl + "/my-carrier-ads-award_v2"
  readonly MyAwardedSenderAds = this.baseUrl + "/my-sender-ads-award_v2"
  readonly MyFeedBacks = this.baseUrl + "/my-feedbacks_v2"
  readonly MySenderCarrierPendingAds = this.baseUrl + "/my-bookings-ads-pending_v2";
  readonly MyTypeWiseBookingAds = this.baseUrl + "/my-bookings-ads_v2";
  readonly clientkey = "?client_key=GeroO1JYhwlXo5fEQm5rHuG3ZX5Hj4gNc35odwYq";
  readonly key = "GeroO1JYhwlXo5fEQm5rHuG3ZX5Hj4gNc35odwYq"

  userObj: any = JSON.parse(localStorage.getItem("user"))
  userId: any = JSON.parse(localStorage.getItem("userId"))
  constructor(private httpClient: HttpClient, private _notification: NzNotificationService, private SettingService: SettingService) { }

  public getUser(id) {
    let formData = new FormData();
    let userId = id
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", userId)
    return this.httpClient.post(this.user, formData);
  }

  public getUserProfile(id) {
    let HTTPOptions: Object = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),

    }
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", id);
    return this.httpClient.post(this.user_profile, formData);
  }


  async changePass(data) {
    try {
      const res = this.httpClient.post(this.baseUrl + "/change-password-via-email?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G", data).subscribe(res => {

        if (res['status'] == "success") {
          this.SettingService.Success(res['message'])
        } else {
          this.SettingService.Error(res['message'])
         }
      });


    }
    catch (e) {
    }

  }
  public edit(data) {
    data.client_key = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
    return this.httpClient.post(this.UpdfateUser, data);
  }

  GetSenderActiveAds() {
    this.userObj = JSON.parse(localStorage.getItem("user"));
    let type: any = 1
    let status: any = 1
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    formData.append("type", type)
    formData.append("status", status)
    return this.httpClient.post(this.MyTypeWiseBookingAds, formData);
  }

  GetCarrierActiveAds() {
    this.userObj = JSON.parse(localStorage.getItem("user"));
    let type: any = 2
    let status: any = 1
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    formData.append("type", type)
    formData.append("status", status)
    return this.httpClient.post(this.MyTypeWiseBookingAds, formData);
  }

  GetSenderExpiredAds() {
    this.userObj = JSON.parse(localStorage.getItem("user"));
    let type: any = 1
    let status: any = 2
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    formData.append("type", type)
    formData.append("status", status)
    return this.httpClient.post(this.MyTypeWiseBookingAds, formData);
  }

  GetCarrierExpiredAds() {
    this.userObj = JSON.parse(localStorage.getItem("user"));
    let type: any = 2
    let status: any = 2
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    formData.append("type", type)
    formData.append("status", status)
    return this.httpClient.post(this.MyTypeWiseBookingAds, formData);
  }

  GetSenderPendingAds() {
    this.userObj = JSON.parse(localStorage.getItem("user"));
    let type: any = 1
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    formData.append("type", type)
    return this.httpClient.post(this.MySenderCarrierPendingAds, formData);
  }

  GetCarrierPendingAds() {
    this.userObj = JSON.parse(localStorage.getItem("user"));
    let type: any = 2
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    formData.append("type", type)
    return this.httpClient.post(this.MySenderCarrierPendingAds, formData);
  }
  GetMyCarrierAwardedAds() {
    let type: any = 2
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    return this.httpClient.post(this.MyAwardedCarrierAds, formData);
  }
  GetMySenderAwardedAds() {
    let type: any = 2
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    return this.httpClient.post(this.MyAwardedSenderAds, formData);
  }
  GetMyFeedbacks() {
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id)
    return this.httpClient.post(this.MyFeedBacks, formData);
  }

  saveUserProfileImage(data) { 
    let formData = new FormData();
    formData.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formData.append("user_id", this.userObj.id);
    formData.append("profile_photo", data);
    return this.httpClient.post(this.update_userProfile_image, formData);
  }
}
