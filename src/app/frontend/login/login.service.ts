import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "./../../../environments/environment";
import { SettingService } from "../../app.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PresenceService } from "src/app/shared/presence.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  modalReference: any;

  constructor(
    private httpClient: HttpClient,
    private _http: HttpClient,
    private _router: Router,
    private settingService: SettingService,
    private loader: NgxUiLoaderService,
    private presenseService: PresenceService,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("token"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  readonly baseUrl = environment.baseUrl;
  readonly settings =
    this.baseUrl +
    "/setting?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  readonly ChangePasswordUrl = this.baseUrl + "/change-password";
  readonly clientkey = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";

  public getSettings() {
    return this.httpClient.get(this.settings);
  }

  forgetPassword(data) {
    try {
      return this._http.post(this.baseUrl + "/reset-password-via-email", data)
    } catch (e) {
    }
  }

  forgetPasswordVerification(data) {
    try {
      return this._http.post(this.baseUrl + "/reset-password-verification", data)
    } catch (e) {
    }
  }

  newPassword(data) {
    try {
      data.user_id = JSON.parse(localStorage.getItem("user"));
      return this._http.post(this.baseUrl + "/change-password-via-email", data)
    } catch (e) {
    }
  }

  async login(data) {
    this.loader.start();
    try {
      const res = this._http
        .post(
          this.baseUrl +
          "/login?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G",
          data
        )
        .subscribe(
          (res) => {
            if (res) {
              this.loader.stop();
              if (res["status"] == "success") {
                let obj = {
                  ...res['user'],
                  provider: data['provider'] ? data['provider'] : 'PACSEND',
                  image: data['photoUrl'] ? data['photoUrl'] : res['user'].image
                }
                localStorage.setItem("user", JSON.stringify(obj));
                localStorage.setItem("userId", res["user"].id);
                localStorage.setItem("reload", '1');
                this.settingService.Success('You have logged in successfully!');
                const userid = res["user"].id;
                // loader
                if (res["user"].is_active == 0) {
                  localStorage.setItem(
                    "verificationId",
                    JSON.stringify(res["user_id"])
                  );
                  this._router.navigate(["/verification/" + userid]);
                  return null;
                }
                else if (res['user'].is_verified == '0' || res['user'].is_verified == '2') {
                  this._router.navigate(["/all-ads"]);
                  // this.presenseService.setUserStatusOnline();
                  return;
                }
                // this.presenseService.setUserStatusOnline();
                this._router.navigateByUrl("/all-ads");
              } else {
                this.settingService.Success('You have logged in successfully!');
              }
            } else {
              return;
            }
          },
          (err: HttpErrorResponse) => {
            this.loader.stop();
            if (err.status == 400) {
              this.settingService.Error(err.error.error);
            } else {
              this.settingService.Error(err.error);
            }
          }
        );
    } catch (e) {
    }
  }
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    this.currentUserSubject.next(null);
    this._router.navigate(["login"]);
    let docId = localStorage.getItem('documentId');
    this.presenseService.deleteUserStatus(docId); 
  }
  async resendVerification(data) {
    this.loader.start();
    try {
      const res = this._http
        .post(
          this.baseUrl +
          "/resend-verification-code?client_key=GeroO1JYhwlXo5fEQm5rHuG3ZX5Hj4gNc35odwYq",
          data
        )
        .subscribe((res) => {
          if (res) {
            this.loader.stop();
            if (res["status"] == "success") {
              this.settingService.Success("Code sent successfully.")
            } else {
              this.settingService.Error("Code not sent")
            }
          } else {
            return;
          }
        });
    } catch (e) {
      this.loader.stop();
    }
  }

  ChangePassword(currentpass: string, pass: string) {
    let userId = localStorage.getItem("userId");
    let formData = new FormData();
    formData.append("client_key", this.clientkey);
    formData.append("current_password", currentpass);
    formData.append("password", pass);
    formData.append("user_id", userId);
    return this._http.post(this.ChangePasswordUrl, formData);
  }
}
