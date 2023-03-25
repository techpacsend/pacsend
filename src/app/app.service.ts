import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { NzConfigService, NzNotificationService } from "ng-zorro-antd";

@Injectable({
  providedIn: "root",
})
export class SettingService {
  readonly baseUrl = environment.baseUrl;
  readonly settings =
    this.baseUrl +
    "/setting?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly adType =
    this.baseUrl +
    "/ad-types?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";


    readonly travellingtypes = this.baseUrl + "/traveling-by?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
     readonly travelType = this.baseUrl + "/traveling-type?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";

  readonly categories =
    this.baseUrl +
    "/categories?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly currency = this.baseUrl + "/currency-list?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";

    readonly keywords =
    this.baseUrl +
    "/keywords?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";

  readonly deliverypriority =
    this.baseUrl +
    "/delivery-priority?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly user = this.baseUrl + "/user/";
  readonly clientkey = "?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService,
    private nzConfigService: NzConfigService
  ) { }


  /// POSITION = topLeft , topRight , bottomLeft, bottomRight
  public Success(message: string): void {

    this.nzConfigService.set("notification", {
      nzPlacement: "bottomRight",
    });
    this.notification.create("success", "Success", message);
  }

  public Error(message: string): void {
    this.nzConfigService.set("notification", {
      nzPlacement: "bottomRight",
    });
    this.notification.create("error", "Error", message);
  }

  public Info(message: string): void {
    this.nzConfigService.set("notification", {
      nzPlacement: "bottomRight",
    });
    this.notification.create("info", "Information", message);
  }

  public getSettings() {
    return this.httpClient.get(this.settings);
  }

  public getUser(id) {
    return this.httpClient.get(this.user + id + this.clientkey);
  }

  public getDeliveryPriorities() {
    return this.httpClient.get(this.deliverypriority);
  }

  public getAdTypes() {
    return this.httpClient.get(this.adType);
  }

  public getCategories() {
    return this.httpClient.get(this.categories);
  }

  public getCurrencys() {
    return this.httpClient.get(this.currency);
  }

  public getkeywords() {
    return this.httpClient.get(this.keywords);
  }

  public getTravellingTypes() {
    return this.httpClient.get(this.travelType);
  }
  public getTravellingTypes2() {
    return this.httpClient.get(this.travellingtypes);
  }
}
