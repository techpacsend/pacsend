import { SettingService } from './../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { DataService } from '../../allads/allads.service';
import { MyAdService } from '../myads.service';

@Component({
  selector: 'app-viewsenderads',
  templateUrl: './viewsenderads.component.html',
  styleUrls: ['./viewsenderads.component.css']
})
export class ViewsenderadsComponent implements OnInit {

  mrcURL: string = 'http://pacsend.uk';
  clientid = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  btntext = "Connect";
  form: FormGroup
  disbaled: boolean = true;
  adID: any; // Getting id from URL
  adData: any; // Getting details
  userData: any; // User Data
  addTypes: any // Ad Type
  travellingTypes: any //Travelling type
  deliveryPriority: any // Delivery Priority
  assignedCategories: any // Assigned Categories

  constructor(private router: Router,
    private actRoute: ActivatedRoute, private dataService: MyAdService, private _dataService: DataService, private SettingService: SettingService,
    private fb: FormBuilder, private _notificaton: NzNotificationService) { }

  ngOnInit() {
    this.adID = this.actRoute.snapshot.params['id'];
    this.initform();
    this.CheckTest();
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
    const adId = localStorage.getItem("AdId");
    const value = localStorage.getItem("SenderRequest");
    if (value && this.adID == adId) {
      this.btntext = "Requested"
      this.disbaled = true;
    }
    else {
      this.btntext = "Connect"
      this.disbaled = false
    }
  }

  postSenderConnect() {
    let userId = localStorage.getItem("userId")
    this.form.controls['user_id'].setValue(userId);
    this.form.controls['client_key'].setValue(this.clientid);
    this.form.controls['ad_id'].setValue(Number(this.adID));
    this._dataService.postSenderConnect(this.form.value).subscribe(res => {
      localStorage.setItem("SenderRequest", JSON.stringify(1))
      localStorage.setItem("AdId", this.adID);
      this.btntext = "Requested";
      this.disbaled = true
      this.SettingService.Success("Request Sent Successfully")
      this.btntext = "Requested";
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    })
  }


  getAdDetails(adID) {
    this.dataService.viewSenderAd(adID).subscribe(product => {
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
