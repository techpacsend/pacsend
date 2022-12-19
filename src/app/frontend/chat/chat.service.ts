import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly baseUrl = environment.baseUrl;
  readonly Carrierchatlist = this.baseUrl + "/carrier-chat-lists";
  readonly Sendetchatlist = this.baseUrl + "/sender-chat-lists";
  // readonly ChatMessages = this.baseUrl + "/messages";
  readonly ChatMessages = this.baseUrl + "/messages_v2";
  readonly SendMessages = this.baseUrl + "/send-message";
  readonly ActionRequest = this.baseUrl + "/sender-acceptance";
  readonly ActionRequestCarrier = this.baseUrl + "/carrier-acceptance";
  readonly OfferAcceptance = this.baseUrl + "/sender-offer-acceptance";
  readonly VerificationPIN = this.baseUrl + "/sender-verification-pin";

  readonly CarrierPostAward = this.baseUrl + "/carrier-award-delivery";
  readonly VerificatiopnPInForCarrier = this.baseUrl + "/carrier-verification-pin";

  constructor(private _http: HttpClient) { }

  getCarrierChatlist() {
    let formdata = new FormData();
    let userId = localStorage.getItem("userId");
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("user_id", userId);
    return this._http.post(this.Carrierchatlist, formdata);
  }

  getSenderChatlist() {
    let formdata = new FormData();
    let userId = localStorage.getItem("userId");
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("user_id", userId);
    return this._http.post(this.Sendetchatlist, formdata);
  }

  GetChatMesages(id) {
    let userId = localStorage.getItem("userId")
    let formdata = new FormData();
    let longitude = localStorage.getItem("longitude");
    let latitude = localStorage.getItem("latitude")
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("chat_head_id", id);
    formdata.append("user_id", userId)
    formdata.append("longitude", longitude)
    formdata.append("latitude", latitude)
    return this._http.post(this.ChatMessages, formdata);
  }

  GetSendMessages(adId, chatheadid, message, msgType, file?) {
    let formdata = new FormData();
    let userId = localStorage.getItem("userId");
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("from", userId);
    formdata.append("ad_user_id", adId);
    formdata.append("chat_head_id", chatheadid);
    formdata.append("message_type", msgType);
    if(msgType == 0 || msgType == 4)
      formdata.append("message", message);
    else
      formdata.append("attachment", file);
    return this._http.post(this.SendMessages, formdata);
  }

  PostActionRequest(actionid, adId, offererid) {
    let formdata = new FormData();
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("action", actionid);
    formdata.append("ad_id", adId);
    formdata.append("user_id", offererid)
    return this._http.post(this.ActionRequest, formdata);
  }

  PostActionRequestCarrier(actionid, adId, offererid) {
    let formdata = new FormData();
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("action", actionid);
    formdata.append("ad_id", adId);
    formdata.append("user_id", offererid)
    return this._http.post(this.ActionRequestCarrier, formdata);
  }

  PostOfferAcceptance(adId, userid) {
    let formdata = new FormData();
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("ad_id", adId);
    formdata.append("user_id", userid)
    return this._http.post(this.OfferAcceptance, formdata);
  }

  PostVerificationPIN(adId) {
    let userId = localStorage.getItem("userId")
    let formdata = new FormData();
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("ad_id", adId);
    formdata.append("user_id", userId)
    return this._http.post(this.VerificationPIN, formdata);
  }

  PostAwardForCarrier(adId, userid, pointcontactnumber, pointcontactname) {
    let formdata = new FormData();
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("ad_id", adId);
    formdata.append("user_id", userid)
    formdata.append("point_of_contact_name", pointcontactname);
    formdata.append("point_of_contact_number", pointcontactnumber)
    return this._http.post(this.CarrierPostAward, formdata);
  }

  PostVerificationPinfoprCarrier(adId) {
    let userId = localStorage.getItem("userId")
    let formdata = new FormData();
    formdata.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    formdata.append("ad_id", adId);
    formdata.append("user_id", userId)
    return this._http.post(this.VerificatiopnPInForCarrier, formdata);
  }

}
