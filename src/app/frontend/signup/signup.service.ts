import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzConfigService, NzNotificationService } from 'ng-zorro-antd';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private httpClient: HttpClient, private _notification: NzNotificationService, private _http: HttpClient,
    private _router: Router, private SettingService: SettingService,
    private loader: NgxUiLoaderService,
    private nzConfigService: NzConfigService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('token')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  readonly baseUrl = environment.baseUrl;
  readonly settings = this.baseUrl + "/setting?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly country = this.baseUrl + "/country?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly stateById = this.baseUrl + "/get-country-wise-states/";
  readonly clientKey = "?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly clientKeyQ = "?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly cityById = this.baseUrl + "/get-state-wise-cities/";

  public getSettings() {
    return this.httpClient.get(this.settings);
  }
  public getCountries() {
    return this.httpClient.get(this.country);
  }
  public getStateById(id) {
    return this.httpClient.get(this.stateById + id + this.clientKey);
  }
  public getCityById(id) {
    return this.httpClient.get(this.cityById + id + this.clientKey);
  }
  async signUp(data) {
    this.loader.start();
    try {

       this.httpClient.post(this.baseUrl + "/register_v2", data).subscribe((res: any) => {
        if (res.status ==="error") {
          this.loader.stop();
          this._notification.error("Error", res.message);
        } else {
          this.loader.stop();
          this.nzConfigService.set("notification", {
            nzPlacement: "bottomRight",
          });
          this._notification.success("Success", "Registration successful.");
          localStorage.setItem("verificationId", JSON.stringify(res['user_id']));
          const userid = res['user_id'];
          this._router.navigate(['/verification/' + userid]);
        }
      });

    }
    catch (e) {
      this.loader.stop();
    }
  }

  public Success(message: string): void {
    this.nzConfigService.set("notification", {
      nzPlacement: "bottomRight",
    });
    this._notification.create("success", "Success", message);
  }

  public Error(message: string): void {
    this.nzConfigService.set("notification", {
      nzPlacement: "bottomRight",
    });
    this._notification.create("error", "Error", message);
  }

  public Info(message: string): void {
    this.nzConfigService.set("notification", {
      nzPlacement: "bottomRight",
    });
    this._notification.create("info", "Information", message);
  }

}
