import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationService } from 'ng-zorro-antd';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChatService } from '../chat/chat.service';
import { MyAdService } from '../myads/myads.service';
import { SettingService } from '../signup/signup.service';
import { UserProfileService } from './user-profile.service';
import { NgxStarsComponent } from 'ngx-stars';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @ViewChild(NgxStarsComponent, { static: false }) starsComponent: NgxStarsComponent;

  mrcURL: string = 'https://pacsend.tech';
  modalReference: any
  changePasswordForm;
  userEdit: any = {}
  productID: any; //Getting Product id from URL
  productData: any; //Getting Product details
  userDetails: any;
  userimage: any;
  avatar_image = "http://searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png";
  Sender: any;
  SenderArray1
  Carrier: any;
  signUpForm;
  countries: any;
  visible:boolean=false;
  tab: string = "show_haveawarded_me"
  states: any;
  cities: any;
  SenderArray: any;
  SenderActiveAds = []
  CarrierActiveAd = []
  SenderExpiredAds = []
  CarrierExpiredAds = []
  SenderPendingAds = []
  CarrierPendingAds = []
  MyCarrierAwardAds: any;
  MySenderAwardAds: any;
  MyFeedBacksSender = []
  MyFeedBacksCarrier = []
  visibility: boolean;
  device: string;
  deviceInfo = null;
  showCarrierMobile: boolean;
  rate: any = 5;
  c_id: any;
  s_id: any;
  city_id: any;
  profile_image: File;
  page: number = 1;
  tagImgUrl = "https://pacsend.tech/public/uploads/category/";
  adBaseImgUrl = 'https://pacsend.tech/public/uploads/adds/';

  constructor(private dataService: MyAdService,
     private signService: SettingService,
     private _chatservice: ChatService,
    private loader: NgxUiLoaderService,
    private alertService: SettingService,
     private settingService: UserProfileService,
     private router: Router,
     private actRoute: ActivatedRoute,
     private _fb: FormBuilder,
    private modalService: NgbModal,
     private sharedService: SharedService,
     private _notification: NzNotificationService,
     private deviceService: DeviceDetectorService,
     private cdRef: ChangeDetectorRef)
     {
    this.Sender1();
    this.epicFunction();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.device = this.deviceInfo.os;
    if(this.device == 'Android' || this.device == 'iOS')
      this.showCarrierMobile = false;
  }


  ngOnInit() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    this.productID = this.actRoute.snapshot.params['id'];
    if (user.id == this.productID) {
      this.getCountries();
      this.GetSenderActiveAds()
      this.GetCarrierActiveAds()
      this.GetSenderExpiredAds()
      this.GetCarrierExpiredAds()
      this.GetSenderPendingAds()
      this.GetCarrierPendingAds()
      this.GetMyAwardedSenderAds()
      this.GetMyAwardedCarrierAds()
      this.GetMyFeedbacks()
      this.userimage = user.image
      if (+this.productID > 0) {
        this.getUserProfile(this.productID);
      } else {
        this.signService.Error("User Not Found!");
      }
      this.initForm();
    }
    else {
      this.router.navigateByUrl("/404")
    }
  }

  GetSenderPendingAds() {
    this.settingService.GetSenderPendingAds().subscribe((res: any) => {
      this.SenderPendingAds = res.ads as []
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }

  GetCarrierPendingAds() {
    this.settingService.GetCarrierPendingAds().subscribe((res: any) => {
      this.CarrierPendingAds = res.ads as []
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }
  GetMyAwardedCarrierAds() {
    this.settingService.GetMyCarrierAwardedAds().subscribe((res: any) => {
      this.MyCarrierAwardAds = res.ads as [];
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }

  GetMyFeedbacks() {
    this.settingService.GetMyFeedbacks().subscribe((res: any) => {
      this.MyFeedBacksSender = res.data['sender_feedbacks'] as []
      this.MyFeedBacksCarrier = res.data['carrier_feedbacks'] as []
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }
  GetMyAwardedSenderAds() {
    this.settingService.GetMySenderAwardedAds().subscribe((res: any) => {
      this.MySenderAwardAds = res.ads as []
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }

  GetSenderActiveAds() {
    this.settingService.GetSenderActiveAds().subscribe((res: any) => {
      this.SenderActiveAds = res.ads as []
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }

  GetCarrierActiveAds() {
    this.settingService.GetCarrierActiveAds().subscribe((res: any) => {
      this.CarrierActiveAd = res.ads as []
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }

  GetSenderExpiredAds() {
    this.settingService.GetSenderExpiredAds().subscribe((res: any) => {
      this.SenderExpiredAds = res.ads as []
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }

  GetCarrierExpiredAds() {
    this.settingService.GetCarrierExpiredAds().subscribe((res: any) => {
      this.CarrierExpiredAds = res.ads as [];
      
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.error);
    })
  }


  openEditModal(profile_edit) {
    this.modalReference = this.modalService.open(profile_edit, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });
  }
  getCountries() {
    this.signService.getCountries().subscribe((data: any[]) => {
      this.countries = data['data'];
    })
  }
  onChangePage(SenderArray1: Array<any>) {
    // update current page of items
    this.SenderArray1 = SenderArray1;
  }
  getUserProfile(id) {
    this.settingService.getUserProfile(id).subscribe((x: any) => {
      this.userDetails = x.userData;
      window.scrollTo(0, 30);
      if (x.userData.custom_profile_photo) {
        this.avatar_image = "https://pacsend.tech/public/uploads/users/" + x.userData.custom_profile_photo;
       }
      else if (this.userDetails.image != null) {
        this.avatar_image = "https://pacsend.tech/public/uploads/users/" + x.userData.image;

      } else {
        this.avatar_image = "../../../assets/default.jpg"
      }
    }, error => {
    })
  }
  initForm() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    this.changePasswordForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      user_id: [user.id],
      password: ['', Validators.required]
    });
    this.signUpForm = this._fb.group({
      client_key: ['Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G'],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.minLength(8)]],
      country_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
      contact: ['', [Validators.required]],
    })
  }
  getOnlineUser(id) {
    this.settingService.getUser(id).subscribe((data: any[]) => {
      this.userDetails = data['data'];
    }, (err: HttpErrorResponse) => {
      this.signService.Error(err.message);
    })
  }

  submitChangePassword() {
    this.settingService.changePass(this.changePasswordForm.value);
  }
  changePassword() {
    this.router.navigateByUrl('/change-password');
  }

  Mybookingurl() {
    this.router.navigateByUrl("/my-ads/mybookings")
  }

  Favourites() {
    this.router.navigateByUrl("/favourites")
  }

  MyAdsURL() {
    this.router.navigateByUrl("/my-ads")
  }
  Sender1() {
    let user: any = JSON.parse(localStorage.getItem("user"))
    if (user) {
      this.userimage = user.image
    }
    const userid = localStorage.getItem("userId")
    this.dataService.Myads(this.page,userid).subscribe(res => {
      this.SenderArray = res['data'].sender;
    });
  }
  Edit() {
    this.loader.start();
    if (this.userDetails.fname.length == 0) {
      this.loader.stop();
      this.signService.Error("FName cannot be Empty.");
    }
    if (this.userDetails.lname.length == 0) {
      this.loader.stop();
      this.signService.Error("LName cannot be Empty.");
    }

    else{
    this.userEdit = {
      fname: this.userDetails.fname,
      lname: this.userDetails.lname,
      contact: this.userDetails.contact,
      nic_no: this.userDetails.nic_no,
      country_id:this.c_id,
      state_id:this.s_id,
      city_id:this.city_id,
      country:this.userDetails.country,
      state:this.userDetails.state,
      city:this.userDetails.city,
      user_id: +localStorage.getItem("userId")

    }
    this.settingService.edit(this.userEdit).subscribe(res => {
      if (res) {
        this.loader.stop();
        this.getUserProfile(this.userDetails.id);
        this.signService.Success("Profile Updated Successfully");
        this.modalService.dismissAll()
      }
    }, (err: HttpErrorResponse) => {
      this.loader.stop();
      this.signService.Error(err.error);
     })
    }

  }

  Showload() {
    this.loader.startLoader("master");
    setTimeout(() => {
      this.loader.stopLoader("master");
    })
  }

  getSenderId(item) {
    if (item.id === '') {
      this.router.navigate(["404/"]);
    } else {
      this.sharedService.getSenderDetail(item);
      // this.router.navigate(['all-ads/sender-details/' + id]);
    }
  }
  getCarrierId(item) {
    if (item.id === '') {
      this.router.navigate(["404/"]);
    } else {
      this.sharedService.getCarrierDetail(item);
      // this.router.navigate(['all-ads/carrier-details/' + id]);
    }
  }

  updateProfilePicture(event) { 
    this.loader.start();
    this.profile_image = event.target.files[0];
    if (this.profile_image.type === 'image/jpeg' || this.profile_image.type === 'image/jpg' || this.profile_image.type === 'image/png') {
      this.settingService.saveUserProfileImage(this.profile_image).subscribe((res: any) => {
        if (res) {
          this.loader.stop();
          if (res.userData.custom_profile_photo) {
            this.avatar_image = "https://pacsend.tech/public/uploads/users/" + res.userData.custom_profile_photo;
            this.sharedService.onProfileImageSet(res.userData.custom_profile_photo);
          }
          this.alertService.Success(res.status);
        }
      }, (errorMessage) => {
        this.loader.stop();
        this.alertService.Error(errorMessage.error.errors[0])
      });
    }
    else { 
      this.loader.stop();
      this.alertService.Error('Please Select Image only!')
    }

  }
}
