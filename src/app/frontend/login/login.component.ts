import { Router } from '@angular/router';
import { SettingService } from './../signup/signup.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, NgForm, FormGroup, FormControl } from '@angular/forms';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationService } from 'ng-zorro-antd';
import { LoginService } from './login.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';

import { NgxUiLoaderService } from "ngx-ui-loader";
import { IndexService } from '../index/index.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: SocialUser;
  loggedIn: boolean;

  l = {
    hasProgressBar: false,
    loaderId: 'my-ads',
    logoSize: 80,
    isMaster: false,
    spinnerType: "ball-scale-multiple"
  }

  loginForm: any;
  forgetPasswordForm;
  forgetPasswordVerificationForm;
  newPasswordForm;
  settings = [];
  logo;
  // Modal Reference
  modalReference: any;
  text: string
  submitted = false;
  ShowForm = false;
  aboutPacsendLCP:boolean=true;
  clicked: any=false;
  dataAbout: any;
  aboutimage: any;
  inputType = 'password';
  isPasswordVisible = false;
  constructor(private dataService: IndexService,private loader: NgxUiLoaderService, private authService: SocialAuthService, private _fb: FormBuilder, private _login: LoginService, private modalService: NgbModal, private _router: Router,
    private _notification: NzNotificationService, private settingService: SettingService) { }

  ngOnInit() {
    localStorage.setItem("index", "logged");
    this.initForm();
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
    this.getSetting();
    setTimeout(() => {
      this.aboutPacsendLCP= false;
    }, 300);


    this.getAbout();
  }

  getAbout() {
    this.dataService.GetAbout().subscribe((data: any[]) => {
      this.dataAbout = data['data'].description;
      this.aboutimage = data['data'].image;
      localStorage.setItem('databout',this.dataAbout);
      localStorage.setItem('aboutimage',this.aboutimage);
    })
  }
  get f() { return this.loginForm.controls; }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => {
      this._login.login(x);
      this.loader.start()

      setTimeout(() => {
        this.loader.stop()
      }, 1500);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      this._login.login(x);

      this.loader.start()

      setTimeout(() => {
        this.loader.stop()
      }, 1500);
    });
  }
  signOut(): void {
    this.authService.signOut();
  }
  initForm() {

    this.loginForm = this._fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]]
    });
    this.forgetPasswordForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      email: ['', [Validators.required, Validators.email]]
    });
    this.forgetPasswordVerificationForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      verification_code: ['', [Validators.required]]
    });

    this.newPasswordForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

  }

  forgetPassword(forgetPass) {
    this.modalReference = this.modalService.open(forgetPass, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
  }


  onSubmit() {

    if(!this.clicked){

    if (this.loginForm.controls['email'].value == undefined || this.loginForm.controls['email'].value == "") {
      this.settingService.Error('Email is required"');
    }
    if (this.loginForm.controls['password'].value == undefined || this.loginForm.controls['password'].value == "") {
      this.settingService.Error('Password Is Required"');
    }

    else {
      this._login.login(this.loginForm.value);
    }

    this.clicked=true;
    }
    setTimeout(() => {
      this.clicked=false;
    },5000);
  }
  forgetPasswordEmail(forgetPassVerification) {
    this._login.forgetPassword(this.forgetPasswordForm.value).subscribe((res) => {
      if (res) {
        this.modalService.dismissAll()
        if (res["status"] == "success") {
          this.settingService.Success(res["message"]);
          this.modalReference = this.modalService.open(forgetPassVerification, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })

          // this._router.navigateByUrl('/forgot-password-verification');
        } else {
          this.settingService.Success(res["message"]);
        }
      } else {
        return;
      }
    }, (err: HttpErrorResponse) => {
      this.settingService.Error(err.error.message);
    });;
  }
  forgetPasswordVerification(newPassword) {
    this._login.forgetPasswordVerification(this.forgetPasswordVerificationForm.value).subscribe((res) => {
      if (res["status"] == "success") {
        localStorage.setItem("user", JSON.stringify(res["user_id"]));
        this.settingService.Success(res['message'])
        localStorage.removeItem("verificationId");
        this.modalService.dismissAll();
        this.modalReference = this.modalService.open(newPassword, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
        // this._router.navigateByUrl("/index");
      } else {
        this.settingService.Error(res['message'])
      }
    });
  }

  submitNewPassword() {
    if (this.newPasswordForm.controls.password.value === this.newPasswordForm.controls.confirmPassword.value) {
      this._login.newPassword(this.newPasswordForm.value).subscribe((res) => {
        if (res["status"] == "success") {
          this.settingService.Success(res['message'])
          this.modalService.dismissAll();
        } else {
          this.settingService.Error(res['message'])
        }
      });
    } else {
      this.settingService.Success("Confirm password does not match");
    }
  }

  resendOTP() {
    if (localStorage.getItem('verificationId') != null) {
      let form = new FormData();
      form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
      form.append("user_id", JSON.parse(localStorage.getItem('verificationId')));

      this._login.resendVerification(form);

    } else {
      this.settingService.Error("Code not sent. Try again later.");

    }

  }

  getSetting() {
    this.settingService.getSettings().subscribe((data: any) => {
      this.logo = data['data'].logo;
    })
  }

  viewPassord(value) { 
    if (value == 'show') {
      this.inputType = 'text';
      this.isPasswordVisible = true;
    }
    else {
      this.inputType = 'password';
      this.isPasswordVisible = false;
    }
  }
}
