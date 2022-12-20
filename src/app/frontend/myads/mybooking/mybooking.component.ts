import { SettingService } from './../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit,ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { MyAdService } from '../myads.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { NgxStarsComponent } from 'ngx-stars';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-mybooking',
  templateUrl: './mybooking.component.html',
  styleUrls: ['./mybooking.component.css']
})
export class MybookingComponent implements OnInit {

  @ViewChild(NgxStarsComponent, { static: false }) starsComponent: NgxStarsComponent;

 mrcURL: string = 'https://pacsend.app';

  hidesender: boolean = true;
  hidecarrier: boolean = true;
  clickCarrier: boolean;
  clickSender: boolean;
  nodatafound: boolean = true
  SenderArray = []
  CarriersArray = []
  norecordfoundtext = "No Ads Found..."
  awaredCount: any;
  device: string;
  deviceInfo = null;
  showCarrierMobile: boolean;



  constructor(private _MyAdService: MyAdService,
    private _notification: NzNotificationService,
    private router: Router,
    private SettingService: SettingService,
    private deviceService: DeviceDetectorService,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef) {
      this.epicFunction();
    }

    epicFunction() {
      this.deviceInfo = this.deviceService.getDeviceInfo();
      this.device = this.deviceInfo.os;
      if(this.device == 'Android' || this.device == 'iOS')
        this.showCarrierMobile = false;
    }

  ngOnInit() {
    this.Carrier();
    this.Sender()
  }

  async MyCarrierAds() {
    this.hidesender = true;
    this.hidecarrier = false
    this.clickCarrier = true;
    this.clickSender = false;
  }

  async MySendAds() {
    this.hidecarrier = true
    this.hidesender = false;
    this.clickCarrier = false;
    this.clickSender = true;
  }

  Carrier() {
    this.nodatafound = false
    this._MyAdService.MyBooking(2).subscribe(res => {
      this.CarriersArray = res['data'];
      if (this.CarriersArray == null || this.CarriersArray == undefined || this.CarriersArray.length <= 0) {
        this.norecordfoundtext = "No Carrier Ads Found..."
        this.nodatafound = true
      }
      else {
        this.nodatafound = false
      }
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message);

    })
  }

  getSenderId(item) {
    if (item.id === '') {
     this.router.navigate(["404/"]);
    } else {
      this.sharedService.getSenderDetail(item);
    //  this.router.navigate(['all-ads/sender-details/' + id]);
   }
 }

 getCarrierId(id) {
  if (id === '') {
   this.router.navigate(["404/"]);
 } else {
   this.router.navigate(['all-ads/carrier-details/' + id]);
 }
}

  Sender() {
    this.nodatafound = false
    this._MyAdService.MyBooking(1).subscribe(res => {
      this.SenderArray = res['data'];
      if (this.SenderArray == null || this.SenderArray == undefined || this.SenderArray.length == 0) {
        this.norecordfoundtext = "No Record Found"
        this.nodatafound = true
      }
      else {
        this.nodatafound = false
      }
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message);
    })
  }

  GetAwardedAds() {
    this._MyAdService.AwardedAds().subscribe((res: any) => {
      this.awaredCount = res.awardcount
      this.CarriersArray = res.awardlist;
      if (this.CarriersArray == null || this.CarriersArray == undefined || this.CarriersArray.length <= 0) {
        this.norecordfoundtext = "No Ads Found..."
        this.nodatafound = true
      }
      else {
        this.nodatafound = false
      }
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message);
    })
  }

}
