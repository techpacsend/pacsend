import { Component, OnInit } from '@angular/core';
import { SettingService } from './signup.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NzNotificationService } from 'ng-zorro-antd';
import { BaseService } from '../services/base.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup-next.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupNextComponent implements OnInit {

  settings = [];
  countries = [];
  states = [];
  cities = [];
  logo;
  signUpForm;
  previousFormValues;

  constructor(private _notification: NzNotificationService,
    private baseService: BaseService,
    private loader: NgxUiLoaderService, private _fb: FormBuilder, private settingService: SettingService, private router: Router) {

  }

  ngOnInit() {
    this.baseService.currentSignup.subscribe(res => this.previousFormValues = res.value);
    this.initForm();
    this.getSetting();
    this.getCountries();
  }

  getCountries() {
    this.settingService.getCountries().subscribe((data: any[]) => {
      this.countries = data['data'];
    })
  }

  initForm() {
    this.signUpForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      first_name: [this.previousFormValues.first_name, [Validators.required]],
      last_name: [this.previousFormValues.last_name, [Validators.required]],
      email: [this.previousFormValues.email, [Validators.required]],
      password: [this.previousFormValues.password, [Validators.minLength(8)]],
      contact2: [this.previousFormValues.contact, [Validators.required]],
      // country: [this.previousFormValues.country, [Validators.required]],
      // country_id: ['', [Validators.required]],
      // state_id: ['', [Validators.required]],
      // city_id: ['', [Validators.required]],
      contact: ['', [Validators.required]],
    })
  }


  toFormData<T>(formValue: T) {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  }

  getStates(value) {
    this.loader.startBackgroundLoader('select-1');
    this.getAllStates(value);
  }
  getAllStates(id) {
    this.settingService.getStateById(id).subscribe((data: any) => {
      if (data['data']) {
        this.loader.stopBackgroundLoader('select-1')
      }
      this.states = data['data'];
    });
  }
  getCity(value) {
    this.loader.startBackgroundLoader('select-2')
    this.getAllCities(value);
  }

  getAllCities(id) {
    this.settingService.getCityById(id).subscribe((data: any) => {
      if (data['data']) {
        this.loader.stopBackgroundLoader('select-2')
      }
      this.cities = data['data'];
    });
  }
  

  onSubmit() {
    if (!this.signUpForm.valid) {
      this.settingService.Error("Please fill all the fields!");
      return;
    } else {
      this.settingService.Error(" Else Please fill all the fields!");
      localStorage.setItem("verificationEmail1", this.signUpForm.controls.email.value)
      localStorage.setItem("Sfirst_name2", this.signUpForm.controls.first_name.value)
      localStorage.setItem("Slast_name", this.signUpForm.controls.last_name.value)
      localStorage.setItem("Spassword", this.signUpForm.controls.password.value)
      localStorage.setItem("Scontact", this.signUpForm.controls.contact.value)
      this.loader.startBackgroundLoader('saveButton');
      this.settingService.signUp(this.signUpForm.value);

      setTimeout(() => {
        this.loader.stopBackgroundLoader('saveButton')
      }, 1500);
    }
  }

  getSetting() {
    this.settingService.getSettings().subscribe((data: any[]) => {
      this.settings = data['data'];
      this.logo = data['data'].logo;
    })
  }

  loginpage() {
    this.router.navigateByUrl("/login")
  }

}
