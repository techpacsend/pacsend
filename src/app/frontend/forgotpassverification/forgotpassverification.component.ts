import { SettingService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VerificationService } from '../verification/verification.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-forgotpassverification',
  templateUrl: './forgotpassverification.component.html',
  styleUrls: ['./forgotpassverification.component.css']
})
export class ForgotpassverificationComponent implements OnInit {

  verificationForm: FormGroup;
  settings = [];
  logo;
  userid;
  email: string;
  constructor(private _fb: FormBuilder, private _login: LoginService, private _verification: VerificationService, private _router: ActivatedRoute,
    private SettingService: SettingService) { }

  ngOnInit() {
    this.email = localStorage.getItem("verificationEmail")
    this.userid = Number(this._router.snapshot.params.id);
    this.initForm();
    this.getSetting();
  }

  getSetting() {
    this._verification.getSettings().subscribe((data: any[]) => {
      this.settings = data['data'];
      this.logo = data['data'].logo;
    })
  }

  initForm() {
    this.verificationForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      verification_code: ['', Validators.minLength(6)],
      user_id: [this.userid],
    })
  }

  forgetPasswordVerification() {
    this._login.forgetPasswordVerification(this.verificationForm.value);
  }

  resendOTP() {
    if (localStorage.getItem('verificationId') != null) {
      let form = new FormData();
      form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
      form.append("user_id", JSON.parse(localStorage.getItem('verificationId')));
      this._verification.resendVerification(form);
    } else {
      this.SettingService.Error("Code not sent. Try again later.")
    }
  }
}
