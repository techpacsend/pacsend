import { SettingService } from './../../app.service';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Injectable({
  providedIn: 'root'
})

export class VerificationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;


  constructor(
    private httpClient: HttpClient,
    private SettingService: SettingService,
    private _http: HttpClient,
    private loader: NgxUiLoaderService,
    private _router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('token')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  readonly baseUrl = environment.baseUrl;
  readonly settings = this.baseUrl + "/setting?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  
  public getSettings() {
    return this.httpClient.get(this.settings);
  }
  async verification(data) {
    this.loader.start();
    try {
    
      const res = this._http.post(this.baseUrl + "/account-verfication?client_key=GeroO1JYhwlXo5fEQm5rHuG3ZX5Hj4gNc35odwYq", data).subscribe(res => {
        if (res) {
          this.loader.stop();
          if (res['status'] == "success") {

            localStorage.setItem("user", JSON.stringify(res['user']));
            localStorage.setItem("userId", res['user'].id)
            this.SettingService.Success('Successfully Verified')
            localStorage.removeItem('verificationId');
            localStorage.setItem("reload", '1');
            if (res['user'].is_verified == '0') {
              this._router.navigate(["/all-ads"]);

              return;
            } else
              window.location.href = "/app/user-profile/" + res['user'].id;
          } else {
            this.SettingService.Error('User Unverify')
          }
        } else {
          return;
        }
      }, (err: HttpErrorResponse) => {
        this.loader.stop();
        this.SettingService.Error('Verification pin is invalid!!')
         });
    }
    catch (e) {
      this.loader.stop();
    }
  }
  async resendVerification(data) {
    this.loader.start();
    try {
      
      const res = this._http.post(this.baseUrl + "/resend-verification-code?client_key=GeroO1JYhwlXo5fEQm5rHuG3ZX5Hj4gNc35odwYq", data).subscribe(res => {
        if (res) {
          if (res['status'] == "success") {
            this.loader.stop();
            this.SettingService.Success('Code sent successfully')

          } else {
            this.loader.stop();
            this.SettingService.Error('Code not sent')

          }
        } else {
          this.loader.stop();
          return;
        }
      });
    }
    catch (e) {
      this.loader.stop();
    }
  }
}
