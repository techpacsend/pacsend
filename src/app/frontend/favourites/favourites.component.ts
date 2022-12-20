import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../allads/allads.service';
import { SettingService } from "../../app.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { SharedService } from '../services/shared.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  mrcURL: string = 'https://pacsend.app';

  Senders = []
  Carriers = []
  nodatafound: boolean
  device: string;
  deviceInfo = null;
  showCarrierMobile: boolean;
  baseImageUrl = 'https://pacsend.app/public/uploads/users/';
  tagImgUrl = "https://pacsend.app/public/uploads/category/";
  adBaseImgUrl = 'https://pacsend.app/public/uploads/adds/';
  userId: number;
  clientId = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  page: number = 1;

  constructor(private _datService: DataService,
    private router: Router,
    private sharedService: SharedService,
    private SettingService: SettingService,
    private userProfileService: UserProfileService,
    private cdRef: ChangeDetectorRef,
    private db: AngularFirestore,
    private loader: NgxUiLoaderService,
    private deviceService: DeviceDetectorService) {
      this.epicFunction();
    }

    epicFunction() {
      this.deviceInfo = this.deviceService.getDeviceInfo();
      this.device = this.deviceInfo.os;
      if(this.device == 'Android' || this.device == 'iOS')
        this.showCarrierMobile = false;
    }

  ngOnInit() {
    this.GetWishlList();
    this.CheckNotificationFromFireStore();
    this.userId = Number(localStorage.getItem("userId"))
  }


  updateWishlistSender(id) {
    this.ngOnInit();
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append('client_key', 'Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G');
    form.append('ad_id', id);
    form.append('ad_type', '1');
    form.append('user_id', user.id);
    this._datService.addToWishlist(form).subscribe(res => {
      this.ngOnInit()
      if (res['status'] == "success") {
        this.SettingService.Success(res['message'])
      }
      else if (res['status'] == "error") {
        this.SettingService.Error(res['message'])
      }
    }, err => {
      this.SettingService.Error(err['message'])
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  updateWishlist(id) {
    this.ngOnInit();
    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append('client_key', 'Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G');
    form.append('ad_id', id);
    form.append('ad_type', '2');
    form.append('user_id', user.id);
    this._datService.addToWishlist(form).subscribe(res => {
      this.ngOnInit()
      if (res['status'] == "success") {
        this.SettingService.Success(res['message'])
      }
      else if (res['status'] == "error") {
        this.SettingService.Error(res['message'])
      }
    }, err => {
      this.SettingService.Error(err['message'])
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  GetWishlList() {
    this._datService.GetAllWishlist().subscribe(res => {
      if (this.Senders.length) { 
        res['data'].sender.forEach(ele => {
          let checksenderAdIdx = this.Senders.findIndex((val) => val.ad_id == ele.ad_id);
          if (checksenderAdIdx != -1) {
            this.Senders[checksenderAdIdx] = ele;
          }
          else { 
            this.Senders.push(ele);
          }
        });
        
      } else {
        this.Senders = res['data'].sender;
      }
      
      if (this.Carriers.length) {
        res['data'].carrier.forEach(ele => {
          let carrierAdIdx = this.Carriers.findIndex((val) => val.ad_id == ele.ad_id);
          if (carrierAdIdx != -1) {
            this.Carriers[carrierAdIdx] = ele;
          }
          else { 
            this.Carriers.push(ele);
          }
        });
      }
      else { 
        this.Carriers = res['data'].carrier;
      }
      
      if (this.Senders.length == 0 && this.Carriers.length == 0) {
        this.nodatafound = true
      }
      else {
        this.nodatafound = false
      }
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message);
    })
  }

  RemoveWishList(item: any, adType: number) {
    this._datService.RemoveWishlist(item, adType).subscribe(res => {
      this.GetWishlList()
      this.SettingService.Success("Wishlist removed successfully");
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.error.message);
    })
  }

  postcarrierConnect(item) {
    if (item) {
      if (item.requested_is_connect == 1) {
        this.SettingService.Info("Request already sent");
      }
      else { 
        this.loader.start();
        this.userProfileService.getUserProfile(this.userId).subscribe((res:any) => {
          if (res.userData.is_verified == 1) {
            let obj = {
              user_id: this.userId,
              client_key: this.clientId,
              ad_id: Number(item.ad_id)
            }
            this._datService.postcarrierConnect(obj).subscribe((res) => {
              this.SettingService.Success("Request Sent Successfully");
              this.loader.stop();
              this.PostConnectFirebase('A New Connection request is received from', item);
              this.GetWishlList();
              this.cdRef.detectChanges();
            });
          }
          else { 
            this.loader.stop();
            this.SettingService.Info('User is not verified');
          }
        });
      }
    }
    else {
      this.SettingService.Error("User Does not Exist");
      this.router.navigate(["404/"]);
    }
  }

  postSenderConnect(item) {
    if (item) {
      if (item.requested_is_connect == 1) {
        this.SettingService.Info("Request already sent")
      }
      else { 
        this.loader.start();
        this.userProfileService.getUserProfile(this.userId).subscribe((res: any) => {
          if (res.userData.is_verified == 1) {
            let obj = {
              user_id: this.userId,
              client_key: this.clientId,
              ad_id: Number(item.ad_id)
            }
            this._datService.postSenderConnect(obj).subscribe((res) => {
              this.SettingService.Success("Request Sent Successfully");
              this.loader.stop();
              this.PostConnectFirebase('A New Connection request is received from', item);
              this.GetWishlList();
              this.cdRef.detectChanges();
            });
          }
          else { 
            this.loader.stop();
            this.SettingService.Info('User is not verified');
          }
        });
      }
    }
    else {
      this.SettingService.Error("Ad Does not Exist");
      this.router.navigate(["404/"]);
    }
  }

  PostConnectFirebase(type: string,item) {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe('en-US');
    let todayDate = pip.transform(today, 'dd/MM/yyyy');
    let obj = {};
    let title: any;
    if (item.ad_type == 1) {
      if (item.ad_title) title = item.ad_title;
      else title = item.title;
       obj = {
        adId: +item.ad_id,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +item.user_id,
        fromUserName: user.fname + ' ' + user.lname,
        notificationText: type + ' ' + user.fname + ' ' + user.lname + ' on ' + todayDate + ' for ' + 'Sender ad ' + title,
        createdAt: new Date(),
        updatedAt: "",
        adType: item.ad_type,
        isRead: 0,
      }
    }
    else if(item.ad_type == 2){ 
      obj = {
        adId: +item.ad_id,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +item.user_id,
        fromUserName: user.fname + ' ' + user.lname,
        notificationText: type + ' ' + user.fname + ' ' + user.lname + ' on ' + todayDate + ' for ' + 'Carrier ad ' + item.title,
        createdAt: new Date(),
        updatedAt: "",
        adType: item.ad_type,
        isRead: 0,
      }
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    });
  }

  CheckNotificationFromFireStore() { 
    this.db.collection("NotificationTesting", ref => ref
      .orderBy("createdAt", "asc"))
      .valueChanges().subscribe((res) => {
      });
  }
  getSenderId(item) {
    if (item.ad_id === '') {
      this.router.navigate(["404/"]);
    } else {
      this.sharedService.getSenderDetail(item);
      // this.router.navigate(['all-ads/sender-details/' + id]);
    }
  }
  getCarrierId(item) {
    if (item.ad_id === '') {
      this.router.navigate(["404/"]);
    } else {
      this.sharedService.getCarrierDetail(item);
      // this.router.navigate(['all-ads/carrier-details/' + ad_id]);
    }
  }

}
