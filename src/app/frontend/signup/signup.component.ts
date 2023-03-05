import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SettingService } from './signup.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NzNotificationService } from 'ng-zorro-antd';
import { BaseService } from '../services/base.service';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, AfterViewInit {

  settings = [];

  logo;
  signUpForm: FormGroup;
  sEmial: string;
  sFirst_name: string;
  sLast_name: string;
  sPassword: string;
  sContact: string;
  sEmail: string;
  private geoCoder;
  country = 'AE';
  isCountry = false;
  inputType = 'password';
  isPasswordVisible = false;
  buttondisable = false;

  constructor(
    private loader: NgxUiLoaderService,
    private _fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private settingService: SettingService,
    private router: Router) { }
  
  
  ngAfterViewInit(): void {
    this.getCurrentLocation();
  }

  ngOnInit() {
    this.initForm();
    this.getLocation();
    this.preFilledDetailsOnPageReload();
  }

  get sForm() {
    return this.signUpForm.controls;
  }

  getLocation() { 
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder
    });
  }

  private getCurrentLocation() { 
    if ('geolocation' in navigator) { 
      navigator.geolocation.getCurrentPosition((possition:any) => { 
        this.getCurrentAddress(possition.coords.latitude, possition.coords.longitude)
      })
    }
  }

  private getCurrentAddress(latitude, longitude) { 
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (result, status) => {
      for (let i = 0; i < result[0].address_components.length; i++) { 
        let check = result[0].address_components[i].types.find((res) => res == "country");
        if (check) {
          this.isCountry = true;
          this.country = result[0].address_components[i].short_name;
          break;
        }
      }
    });
  }

  preFilledDetailsOnPageReload() { 
    this.signUpForm.patchValue({
      first_name:localStorage.getItem("first_name"),
        last_name:localStorage.getItem("last_name"),
      email:localStorage.getItem("verificationEmail"),
        password:localStorage.getItem("password"),
      contact: localStorage.getItem("contact"),
    })
  }

  initForm() {
    this.signUpForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.minLength(8)]],
      contact: ['', Validators.required],
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

  onSubmit() {
    if(this.buttondisable == true){
      return false;
    }
    localStorage.setItem("verificationEmail", this.signUpForm.controls.email.value)
    localStorage.setItem("first_name", this.signUpForm.controls.first_name.value)
    localStorage.setItem("last_name", this.signUpForm.controls.last_name.value)
    localStorage.setItem("password", this.signUpForm.controls.password.value)
    localStorage.setItem("contact", this.signUpForm.controls.contact.value)
    // if (this.signUpForm.invalid) {
    if (this.signUpForm.controls.contact.value ===null || this.signUpForm.controls.contact.errors ) { 
      this.settingService.Error("Please enter contact number!");
      return;
    }
    if (this.signUpForm.controls.email.value ==='' || this.signUpForm.controls.email.errors ) { 
      this.settingService.Error("Please enter email!");
      return;
    }
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!regex.test(this.signUpForm.controls.email.value)){
      this.settingService.Error("Please enter valid email!");
      return false;
    }

    if (this.signUpForm.controls.first_name.value ==='' || this.signUpForm.controls.first_name.errors ) { 
      this.settingService.Error("Please enter firstname!");
      return;
    }
    if (this.signUpForm.controls.last_name.value ==='' || this.signUpForm.controls.last_name.errors ) { 
      this.settingService.Error("Please enter lastname!");
      return;
    }
    if (this.signUpForm.controls.password.value ==='') { 
      this.settingService.Error("Please enter password!");
      return;
    }
    if (this.signUpForm.controls.password.errors && this.signUpForm.controls.password.errors.minlength.actualLength < 8) {
      this.settingService.Error("Password must be greater than 8 character !");
      return;
    }
    else {
      this.loader.startBackgroundLoader('saveButton');
      this.buttondisable = true;
      this.settingService.signUp(this.signUpForm.value);
      setTimeout(() => {
        this.buttondisable = false;
        this.loader.stopBackgroundLoader('saveButton')
      }, 1500);
    }
  }
  loginpage() {
    this.router.navigateByUrl("/login")
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
