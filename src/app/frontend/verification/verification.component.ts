import { SettingService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VerificationService } from './verification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  verificationForm;
  settings = [];
  logo;
  userid;
  email: string;
  countDown: Subscription;
  counter = 120;
  tick = 1000;
  constructor(private loader: NgxUiLoaderService,private _fb: FormBuilder, private _verification: VerificationService, private _router: ActivatedRoute,
    private SettingService: SettingService) { }

  ngOnInit() {
    this.email = localStorage.getItem("verificationEmail");
    this.userid = Number(this._router.snapshot.params.id);
    this.initForm();
    this.getSetting();
    if (this.userid) { 
      this.OTPResendTimer();
    }
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


  onSubmit() {
    this._verification.verification(this.verificationForm.value);   
  }

  resendOTP() {
    if (localStorage.getItem('verificationId') != null) {
      let form = new FormData();
      form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
      form.append("user_id", JSON.parse(localStorage.getItem('verificationId')));
      this._verification.resendVerification(form);
      this.counter = 120;
      this.OTPResendTimer();
      this.transform(this.counter);
    } else {
      this.SettingService.Error("Code not sent. Try again later.")
    }

  }

  OTPResendTimer() {
    this.countDown = timer(0, this.tick)
      .pipe(take(this.counter))
      .subscribe(() => {
        --this.counter;
        if (this.counter == 0) {
          this.countDown.unsubscribe();
         }
      });
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
