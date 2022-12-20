import { SettingService } from './../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { DataService } from '../../allads/allads.service';
import { MyAdService } from '../myads.service';

@Component({
  selector: 'app-viewcarrierads',
  templateUrl: './viewcarrierads.component.html',
  styleUrls: ['./viewcarrierads.component.css']
})
export class ViewcarrieradsComponent implements OnInit {

  mrcURL: string = 'https://pacsend.app';
  clientid = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  public btntextcarry = "Connect";
  adID: any; //Getting id from URL
  adData: any; //Getting details
  userData: any; //User Data
  addTypes: any // Ad Type
  travellingTypes: any //Travelling type
  deliveryPriority: any // Delivery Priority
  assignedCategories: any // Assigned Categories
  form: FormGroup
  hideconenct: boolean;
  hiderequest: boolean = true

  constructor(private router: Router,
    private actRoute: ActivatedRoute, private dataService: MyAdService, private _notitfication: NzNotificationService, private SettingService: SettingService,
    private fb: FormBuilder, private _dataService: DataService) { }

  ngOnInit() {
    this.adID = this.actRoute.snapshot.params['id'];
    this.getAdDetails(this.adID);
  }

  initform() {
    this.form = this.fb.group({
      user_id: [],
      client_key: [],
      ad_id: []
    })
  }

  CheckTest() {
    const adId = localStorage.getItem("CarryAdId");
    const value = localStorage.getItem("CarrierRequest");
    if (value && this.adID == adId) {
      this.btntextcarry = "Requested"
    }
    else {
      this.btntextcarry = "Connect"
    }
  }

  postCarryConnect() {
    let userId = localStorage.getItem("userId");
    this.form.controls['user_id'].setValue(userId);
    this.form.controls['client_key'].setValue(this.clientid);
    this.form.controls['ad_id'].setValue(Number(this.adID));
    this._dataService.postcarrierConnect(this.form.value).subscribe(res => {
      this.SettingService.Success("Request Sent Successfully")
      localStorage.setItem("CarrierRequest", JSON.stringify(1))
      localStorage.setItem("CarryAdId", this.adID);
      this.btntextcarry = "Requested";
      this.hideconenct = true;
      this.hiderequest = false
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    })
  }

  getAdDetails(adID) {
    this.dataService.viewAd(adID).subscribe(product => {
      this.adData = product['data'];
      this.userData = this.adData['get_user']
      this.addTypes = this.adData['add_types'];
      this.travellingTypes = this.adData['traveling_types'];
      this.deliveryPriority = this.adData['delivery_priority'];
      this.assignedCategories = this.adData['assigned_categories'];
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    });
  }

}
