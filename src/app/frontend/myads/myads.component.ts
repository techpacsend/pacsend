import { SettingService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { MyAdService } from './myads.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../allads/allads.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SharedService } from '../services/shared.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-myads',
  templateUrl: './myads.component.html',
  styleUrls: ['./myads.component.css']
})
export class MyadsComponent implements OnInit {


  mrcURL: string = 'http://pacsend.uk';

  searchForm;
  longitude1: number;
  latitude1: number;
  senderAds = [];
  CarriersArray = []
  carrierAds = [];
  SenderArray = []
  userData: any; // User Data
  addTypes: any // Ad Type
  travellingTypes: any //Travelling type
  deliveryPriority: any // Delivery Priority
  assignedCategories: any // Assigned Categories
  hidesender: boolean;
  hidecarrier: boolean;
  CarierCategory = [];
  form: FormGroup;
  clientid = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  clickCarrier: boolean;
  clickSender: boolean;
  userimage: any;
  nodatafound: boolean;
  noDatafoundSender: boolean = false;
  noDatafoundCarrier: boolean = false;

  norecordfoundtext: string;
  norecordfoundtextsender: string;
  l = {
    hasProgressBar: false,
    loaderId: 'my-ads',
    logoSize: 80,
    isMaster: false,
    spinnerType: "ball-scale-multiple"
  }
  filter = {
    toLongitude: '',
    toLatitude: '',
    fromLongitude: '',
    fromLatitude: '',
    state: '',
    city: '',
    sender: '',
    carrier: '',
    categories:[],
    custom_date: '',
    capacity: '',
    type: null
  }
  NonExactData = [];
  ExactData = [];
  type: number = 1;
  NonExactDataCarrier = []
  ExactDataCarrier = []
  device: string;
  deviceInfo = null;
  showCarrierMobile: boolean;

  testRating: number = 3.5;
  selfy: any;
  userVerfy: any;
  isDataAvalaible = true;
  baseImageUrl = 'http://pacsend.uk/public/uploads/users/';
  tagImgUrl = "http://pacsend.uk/public/uploads/category/";
  adBaseImgUrl = 'http://pacsend.uk/public/uploads/adds/';
  categoryDropdownSettings:IDropdownSettings={};
  categories = [];
  page: number = 1;
  searched: any;
  scrollDisable: boolean = true;
  scrollDistance = 6;
  scrollUpDistance = 2;
  throttle = 30;


  constructor(private loader: NgxUiLoaderService,
    private deviceService: DeviceDetectorService,
    private dataService: MyAdService,
    private _router: Router,
    private router: Router,
    private _fb: FormBuilder,
    private db: AngularFirestore,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,

    private settingService: SettingService) {
    this.epicFunction();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.device = this.deviceInfo.os;
    if (this.device == 'Android' || this.device == 'iOS')
      this.showCarrierMobile = false;
  }

  ngOnInit() {
    this.categoryDropdownSettings = { 
      idField: 'id',
      textField: 'title',
      allowSearchFilter: true,
      limitSelection: 4
    }
    this.SpinnerService.show();
    this.initForm();
    this.MySendAds();
    this.Sender();
    this.Carrier()
    setTimeout(() => {
      window.scroll(0, 0);
    }, 1000)

    this.selfy = localStorage.getItem("selfy");
    this.userVerfy = localStorage.getItem("userVerfy");
    localStorage.removeItem("filterLongtitude");
    localStorage.removeItem("filterLatitude");
    localStorage.removeItem("filterSendLongtitude");
    localStorage.removeItem("filterSendLatitude");
    this.getCategoriesType();
  }

  
  getCategoriesType() {
    this.settingService.getCategories().subscribe((res: any[]) => {
      this.categories = res["data"];
    });
  }
  initForm() {
    this.searchForm = this._fb.group({
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      senderId: ['', Validators.required],
      date: ['', Validators.required]
    })
    this.form = this._fb.group({
      user_id: [],
      client_key: [],
      ad_id: []
    })
  }

  onSubmitSearch() {
  }

  showspinner() {
    this.SpinnerService.show();
  }

  getCarrierAdsId(item) {
    if (item.ad_id === '' || item.ad_id == undefined) {
      this.router.navigate(["my-ads"]);
    } else {
      this.sharedService.getCarrierDetail(item)
      // this.router.navigate(['all-ads/carrier-details/' + id]);
    }
  }
  getSenderAdsId(item) {
    if (item.ad_id === '' || item.ad_id == undefined) {
      this.router.navigate(["my-ads"]);
    } else {
      this.sharedService.getSenderDetail(item);
      // this.router.navigate(['all-ads/sender-details/' + id]);
    }
  }

  getSenderAds() {
    this.dataService.GetSenderAds().subscribe((data: any[]) => {
      this.senderAds = data['data'];
      this.userData = this.senderAds['get_user']
      this.addTypes = this.senderAds['types'];
      this.travellingTypes = this.senderAds['traveling_types'];
      this.deliveryPriority = this.senderAds['delivery_priority'];
    }, (err: HttpErrorResponse) => {
      this.settingService.Error(err.message)
    })
  }

  getCarrierAds() {
    this.dataService.GetCarrierAds().subscribe((data: any[]) => {
      this.carrierAds = data['data'];
      this.userData = this.carrierAds['get_user']
      this.addTypes = this.carrierAds['data'].types;
      this.travellingTypes = this.carrierAds['traveling_types'];
      this.deliveryPriority = this.carrierAds['delivery_priority'];
    }, (err: HttpErrorResponse) => {
      this.settingService.Error(err.message)
    })
  }


  editAdCarier(id) {
    localStorage.setItem("value", JSON.stringify("carier"));
    localStorage.setItem("ad_typeCheck", JSON.stringify(2));
    this.router.navigate(['all-ads/ad-edit/' + id]);
  }

  editAdSender(id) {
    localStorage.setItem("value", JSON.stringify("sender"));
    localStorage.setItem("ad_type", JSON.stringify("1"));
    this.router.navigate(['all-ads/ad-edit/' + id]);
  }

  onScroll() { 
    this.searched=localStorage.getItem("search");
    if (this.searched != 1) {
      this.page = (this.page + 1);
      this.Sender();
      this.Carrier();
    }
  }

  Sender() {
    const userid = localStorage.getItem("userId")
    this.dataService.Myads(this.page, userid).subscribe(res => {
      this.NonExactData = [];
      this.ExactData = [];
      if (this.SenderArray.length) {
        res['data'].sender.forEach(ele => {
          let senderAdIdx = this.SenderArray.findIndex((val) => val.ad_id == ele.ad_id);
          if (senderAdIdx != -1) {
            this.SenderArray[senderAdIdx] = ele;
          }
          else { 
            this.SenderArray.push(ele);
          }
        });
      }
      else { 
        this.SenderArray = res['data'].sender;
      }
      if (this.SenderArray == undefined || this.SenderArray.length == 0) {
        this.norecordfoundtextsender = "No Sender Ads Found..."
        this.noDatafoundSender = true;
      }
      else {
        this.noDatafoundSender = false;
      }
      if (this.SenderArray.length % 10 !== 0) {
        this.scrollDisable = true;
      } else {
        this.scrollDisable = false;
      }
      if (this.SenderArray.length) {
        this.SenderArray.forEach((ad) => {
          if (ad.ad_status == 'Expired') { 
            this.adStatusNotification(ad, ad.ad_status);
          }
          else if (ad.ad_status == 'Reject') { 
            this.adStatusNotification(ad, ad.ad_status);
          }
        });
       }
      this.loader.stopLoader('my-ads');
      window.scrollTo(0, 30);
    });
  }

  
  Carrier() {
    const userid = localStorage.getItem("userId")
    this.dataService.Myads(this.page, userid).subscribe(res => {
      this.NonExactDataCarrier = [];
      this.ExactDataCarrier = [];
      if (this.CarriersArray.length) {
        res['data'].carrier.forEach(ele => {
          let carrierdIdx = this.CarriersArray.findIndex((val) => val.ad_id == ele.ad_id);
          if (carrierdIdx != -1) {
            this.CarriersArray[carrierdIdx] = ele;
          }
          else { 
            this.CarriersArray.push(ele);
          }
        });
      }
      else { 
        this.CarriersArray = res['data'].carrier;
      }
      if (this.CarriersArray == undefined || this.CarriersArray.length == 0) {
        this.norecordfoundtext = "No Carrier Ads Found..."

        this.noDatafoundCarrier = true;
      }
      else {
        this.noDatafoundCarrier = false;
      }
      if (this.CarriersArray.length % 10 !== 0) {
        this.scrollDisable = true;
      } else { 
        this.scrollDisable = false;
      }

      if (this.CarriersArray.length) {
        this.CarriersArray.forEach((ad) => {
          if (ad.ad_status == 'Expired') {
            this.adStatusNotification(ad, ad.ad_status);
          }
          else if (ad.ad_status == 'Reject') { 
            this.adStatusNotification(ad, ad.ad_status);
          }
        });
       }
    });
  }

  adStatusNotification(ad, ad_status) { 
    let adTitle = '';
    let user: any = JSON.parse(localStorage.getItem("user"));
    if (ad.ad_type == 1) adTitle = ad.sernder_ad_title;
    else adTitle = ad.carrier_ad_title;
    let obj = {
      adId: +ad.ad_id,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +localStorage.getItem("userId"),
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: 'Your ad ' + "'" + adTitle + "'" + ' is ' + ad_status,
      createdAt: new Date(),
      updatedAt: "",
      adType: ad.ad_type,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
    });
  }

  showpinner() {
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 8000);
  }

  async MyCarrierAds() {
    this.loader.startLoader('my-ads');
    this.hidesender = false;
    this.hidecarrier = true
    this.clickCarrier = true;
    this.clickSender = false;
    setTimeout(() => {
      this.loader.stopLoader('my-ads');
    }, 1500);
  }

  async MySendAds() {
    this.loader.startLoader('my-ads');
    this.hidecarrier = false
    this.hidesender = true;
    this.clickCarrier = false;
    this.clickSender = true;
  }

  postSenderConnect(id) {
    if (id) {
      this.router.navigate(['all-ads/sender-details/' + id]);
    }
    else {
      this.settingService.Error("User Does not Exist")
      this.router.navigate(["404/"]);
    }

  }

  postcarrierConnect(id) {
    if (id) {
      this.router.navigate(['all-ads/carrier-details/' + id]);
    }
    else {
      this.settingService.Error("User Does not Exist")
      this.router.navigate(["404/"]);
    }

  }
  findRecAdress(search) {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13
    });
    var Input = document.getElementById('searchmap');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(Input);
    var autocomplete = new google.maps.places.Autocomplete(search);
    autocomplete.bindTo('bounds', map);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    autocomplete.addListener('place_changed', function () {
      localStorage.removeItem("filterLocation");
      localStorage.removeItem("filterLongtitude");
      localStorage.removeItem("filterLatitude");
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
      localStorage.setItem("filterLocation", place.formatted_address)
      localStorage.setItem("filterLongtitude", JSON.stringify(place.geometry.location.lng()))
      localStorage.setItem("filterLatitude", JSON.stringify(place.geometry.location.lat()))
    });

  }
  findAdress(search) {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13
    });
    var Input = document.getElementById('searchmap');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(Input);
    var autocomplete = new google.maps.places.Autocomplete(search);
    autocomplete.bindTo('bounds', map);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    autocomplete.addListener('place_changed', function () {
      localStorage.removeItem("filterSendLocation");
      localStorage.removeItem("filterSendLongtitude");
      localStorage.removeItem("filterSendLatitude");
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
      localStorage.setItem("filterSendLocation", place.formatted_address)
      localStorage.setItem("filterSendLongtitude", JSON.stringify(place.geometry.location.lng()))
      localStorage.setItem("filterSendLatitude", JSON.stringify(place.geometry.location.lat()))
    });
  }
  reset() {
    this.filter = {
      toLongitude: '',
      toLatitude: '',
      fromLongitude: '',
      fromLatitude: '',
      state: '',
      city: '',
      sender: '',
      categories: [],
      carrier: '',
      custom_date: '',
      capacity: '',
      type:null
    }
    localStorage.removeItem("filterLongtitude");
    localStorage.removeItem("filterLatitude");
    localStorage.removeItem("filterSendLongtitude");
    localStorage.removeItem("filterSendLatitude");
    this.Sender();
    this.Carrier()
    window.location.reload();
  }
  search() {
  /**CODE ADDED BY HISSAN **/
    var myTag = document.querySelector('.dont-collapse-sm');      
    if(myTag.classList.contains('show')){
      myTag.classList.remove('show');
      window.scroll({ top: 0, left: 0});
    }
  /******************************************/
    localStorage.setItem("search", '1'); 
    this.loader.start();

    this.filter.toLongitude = localStorage.getItem("filterLongtitude");
        this.filter.toLatitude = localStorage.getItem("filterLatitude");
        this.filter.fromLongitude = localStorage.getItem("filterSendLongtitude");
        this.filter.fromLatitude = localStorage.getItem("filterSendLatitude");

      if (this.filter.toLongitude == null && this.filter.toLatitude == null && this.filter.fromLongitude == null && this.filter.fromLatitude == null) {
        this.settingService.Info("Please fill From or To Laction");
      }
      else {
        this.dataService.MyCarrierAdFilter(this.filter).subscribe((res: any) => {
          // this.dataService.senderFilterData(this.filter).subscribe((res: any) => {
          this.CarriersArray = [];
          this.NonExactDataCarrier = res.filter(x => x.is_exact == false);
          this.ExactDataCarrier = res.filter(x => x.is_exact == true);
          
        }, (err: HttpErrorResponse) => {
          this.settingService.Info("No Ads found for your search");
          this.isDataAvalaible = false;
          this.settingService.Error(err.message)
        })

        this.dataService.MyAdFilter(this.filter).subscribe((res: any) => {
          this.SenderArray = [];
          this.NonExactData = res.filter(x => x.is_exact == false);
          this.ExactData = res.filter(x => x.is_exact == true);
          
        }, (err: HttpErrorResponse) => {
          this.settingService.Info("No Ads found for your search");
          this.isDataAvalaible = false;
          this.settingService.Error(err.message)
        })


        setTimeout(() => {
          window.scrollTo(0, 80);
        }, 1000);
     
      }
      setTimeout(() => {
        this.loader.stop();
      }, 700);
  }

  selectCategory(event) { 
      this.filter.categories.push(event.id);
  }

}
