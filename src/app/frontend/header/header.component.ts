import { AngularFirestore } from "@angular/fire/firestore";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ViewportScroller } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { zoomIn } from "ng-animate";
import { NzNotificationService } from "ng-zorro-antd";
import { NgxSpinnerService } from "ngx-spinner";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SettingService } from "src/app/app.service";
import { ModalCloseService } from "src/app/modalClose.service";
import { AboutService } from "../about/about.service";
import { MapsService } from "../maps/maps.service";
import { MyAdService } from "../myads/myads.service";
import { UserProfileService } from "../user-profile/user-profile.service";
import * as moment from "moment";
import { Guid } from "guid-typescript";
import { GoogleAdsService } from './../services/google-ads.service';

import {
  LyResizingCroppingImages,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
} from "@alyle/ui/resizing-cropping-images";
import { LyTheme2, Platform } from "@alyle/ui";
import { DataService } from '../allcarrierads/data.service';
import { Subscription } from "rxjs";
import { SafeHtml } from "@angular/platform-browser";
import { TermsAndConditionService } from "../termsandconditions/termsandcondition.service";
import { SharedService } from "../services/shared.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { PresenceService } from "src/app/shared/presence.service";


const styles = {
  actions: {
    display: "flex",
  },
  cropping: {
    maxWidth: "825px",
    height: "400px",
  },
  flex: {
    flex: 1,
  },
  range: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "14px",
  },
};

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  animations: [
    trigger("zoomIn", [
      transition(
        "* => *",
        useAnimation(zoomIn, {
          // Set the duration to 5seconds and delay to 2seconds
          params: { timing: 0.5 },
        })
      ),
    ]),
  ],
})

export class HeaderComponent implements OnInit, OnDestroy {

  public checkbox1: boolean = true;

  @ViewChild('navigationRestricted', { static: false }) navigationRestricted: TemplateRef<any>;
  @ViewChild('navigationLogin', { static: false }) navigationLogin: TemplateRef<any>;
  @ViewChild('whypacsend', { static: false }) pacsend: ElementRef;

  mrcURL: string = 'https://pacsend.app';

  isDisabled: boolean = false;
  usable: boolean = true;
  isclicked: boolean = false;
  isModalOpen = false;
  navMenu: boolean = false;

  lati: number;
  longi: number;
  zoomNum: any;
  private geoCoder;
  @ViewChild('searchInMap', { static: true })
  public searchElementRef: ElementRef;

  /* map data */
  readonly classes = this.theme.addStyleSheet(styles);
  croppedImage?: string;
  result: string;
  scale: number;
  @ViewChild(LyResizingCroppingImages, { static: false })
  cropper: LyResizingCroppingImages;
  myConfig: ImgCropperConfig = {
    autoCrop: true, // Default `false`
    width: 823, // Default `250`
    height: 400, // Default `200`

    fill: "#ff2997", // Default transparent if type = png else #000
    type: "image/png", // Or you can also use `image/jpeg`
  };
  travellingFreq = [
    {
      check: false,
      class: "col-12 text-left borderTravelling00",
    },
    {
      check: false,
      class: "col-12 text-left borderTravelling11",
    },
    {
      check: false,
      class: "col-12 text-left borderTravelling11",
    },
  ];
  /* new sender ad object */




  senderAd = {
    title: "",
    weight: "",
    image: [],
    categoryId: "",
    keywordId: "0",
    travelingTypeId: null,
    longitude: null,
    latitude: null,
    location: null,
    PriorityId: null,
    customDate: null,
    customTime: null,
    payment: null,
    userId: null,
    categoryIds: [],
    keyword_ids: [],
    fromLongitude: null,
    fromLatitude: null,
    fromLocation: null,
    toCity: null,
    fromCity: null,
    receiverName: null,
    receivernumber: null,
    terms: false

  };
  zoom_adcarry_from: any = 20;
  zoom_adcarry_to: any = 20;
  zoom_adsender_from: any = 20;
  zoom_adsener_to: any = 20;
  carriarAd = {
    title: "",
    carrier_longitude_from: null,
    carrier_latitude_from: null,
    carrier_from_location: '',
    carrier_longitude_to: null,
    categoryId: "",
    carrier_latitude_to: null,
    carrier_to_location: '',
    frequency_id: null,
    from_city: null,
    to_city: null,
    travelling_frequency: '',
    from_date: null,
    from_time: null,
    to_date: null,
    to_time: null,
    weight: null,
    categoryIds: [],
    traveling_by_id: null,
    payment: null,
    user_id: null,
    custome_date: null,
    custome_time: null,
    category_ids: null,
    keyword_ids: [],
  };

  /* new sender ad object */
  todayDate = moment(new Date()).format("YYYY-MM-DD");

  customDT = false;
  modalAlreadyCheck = false;
  zoomIn: any;
  form: FormGroup;
  disablefrontbtn: boolean = false;
  disabledbackbtn: boolean = true;
  frontSelfie: boolean = false;
  backSelfie: boolean = true;
  lat = 24.912877841368648;
  lng = 67.0235158710789;

  getLocations: any = [
    {
      lat: 51.678418,
      lng: 7.809007,
    },
    {
      lat: 24.914061349967604,
      lng: 67.01480114312658,
    },
    {
      lat: 24.919082143179956,
      lng: 67.03243934897807,
    },
    {
      lat: 24.924920017804457,
      lng: 67.0288773755336,
    },
    {
      lat: 24.91351644538728,
      lng: 67.02325546563934,
    },
  ];
  l = {
    hasProgressBar: true,
    loaderId: "loader-01",
    logoSize: 80,
    isMaster: false,
    spinnerType: "ball-scale-multiple",
  };
  userDetails: any = [];
  verifiedProfile = true;

  mapclickdetails: any;

  filterSearch = true;
  textSearch = false;
  allUsers = [];
  Senders = [];
  Carriers = [];

  senderclass: boolean = true;
  carrierclass: boolean = false;
  allclass: boolean = false;

  // Multiple Divs For Header Navigation
  senderDiv = true;
  carrierDiv = false;
  allDiv = false;

  // Bottom User Details
  getUserDetails = false;
  array = [];
  // Modal Reference
  modalReference: any;
  uploadfile = [];
  frontselfiearray = [];
  backselfiearray = [];
  clientkey = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  @ViewChild("CNIC", { static: true }) cnic: ElementRef;
  hideverify: boolean;
  btnverify: string = "Verify Your Profile";
  hideprofile: boolean;
  filteredMarkers: any[];
  markers: any;
  Sendericon = {
    url: "https://img.icons8.com/bubbles/2x/user-male.png",
    scaledSize: { height: 50, width: 50 },
  };
  UserLogin: any;
  /* map data end */

  notifictionClass = "BellIconSpan";
  searchcontrol: FormControl;
  categoryarrays =[];
  keywordsarrays = [];
  DaysArray = [];
  address;
  web_site;
  names;
  zip_code;
  zoom;
  selecteddays = [];
  progress = "30%";
  SenderForm: FormGroup;
  CarrierForm: FormGroup;
  uploadfile1 = [];
  deliveryPty: any = [];
  locationchange = false;
  activeStatusClass = 'profile-avatar'
  statusClass = 'profile-avatar';

  username;
  userId;
  @ViewChild("Search", { static: true }) Search: ElementRef;
  // Is Login
  isLogin: boolean;

  // Ad types

  adtypes = [];
  adTypeId;

  public currentLocation;

  // Travelling Type
  travellingTypes = [];

  // Categirues
  categories = [];
  Careirkeywords = [];
  deliverypriority = [];
  showHeaderFooterComponent: true;
  routerurl;
  title = "Pacsend";
  settings = [];
  // Object Values
  id;
  name;
  meta_description;
  footer_content;
  logo;
  favicon;
  notification_switch;
  footer_logo;
  footer_description;
  footer_copy_right;
  fb_link;
  twitter_link;
  linkden_link;
  youtube_link;
  home_img_1;
  home_img_2;
  created_at;
  updated_at;
  Image: any;
  carrier: any;
  Favicon: any;
  latitude: any;
  longitude: any;

  @ViewChild("searchmap", { static: true }) public searchmap: ElementRef;
  Title: any;
  BellMenuClass = "BellMenuinActive";
  category_ids: number;
  weight: number;
  traveling_by_id: number;
  custom_date: any;
  delivery_priority_id: any = null;
  custom_time: any;
  Name: any;
  number: any;
  payment: any;
  LocationArray = [];
  priorityid: any;
  travellingid: any;
  carrierdate: any;
  carrierdaily: any;
  carryfromdate: any;
  carryfromtime: any;
  carrytodate: any;
  carrytotime: any;
  categorykg: any;
  carrytravellingid: any;
  carriertravlleing: any;
  carrieramount: any;
  userimage: any;

  hideuser: boolean;
  hidesec: boolean;
  travelType: any = [];
  avatar_image =
    "http://searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png";
  userVerfy: any;
  user: any;

  // add zoom value

  latitude1: any = 24.912877841368648;
  longitude1: any = 67.0235158710789;
  nicNo: any = null;
  latitude2:any = 24.912877841368648;
  longitude2:any = 67.0235158710789;
  showNotification: boolean = false;
  scrollImage: boolean = true;
  scrollImageSec: boolean = false;
  clickMap: boolean = false;
  clickAllAds: boolean = false;
  clickMyProfle: boolean = false;
  clickMyAds: boolean = false;
  clickChat: boolean = false;
  clickFavourites: boolean = false;
  clickNotification: boolean = false;

  cityData: any = [];
  cityDataSubscription: Subscription;
  public loginsession: Boolean = false
  googleAdsImage: string;
  googleAdsImageVerifyLeft: string;
  googleAdsImageVerifyRight: string;
  googleAdsScript: (SafeHtml | any);
  uploadedImagesSender: any[];
  travellingTypes2: any;
  travelType2: any;
  public intervalStart;
  onRecivedApproved = false;
  keywords: any;
  termsReaded: boolean = false;
  adPostClicked: boolean = false;
  selfy: string;
  page: string;
  aboutPacsendLCP: boolean = true;
  is_verify: boolean = false;
  notequalsOne: boolean = false;
  equalsOne: boolean = false;
  equalzero: boolean = false;
  equaltwo: boolean = false;
  default: boolean = false;
  dataTerms: string;
  userLogout: boolean = false;
  clicked: boolean = false;
  checked: boolean;
  countryLongName: string;
  countryShortName = 'PK';
  imageIndex: number=0;
  customeCategory: any;
  customeCategoryList = [];
  categoryDropdownSettings:IDropdownSettings={};
  senderCutomeCategory: boolean;
  carrierCustomeCategory: boolean;
  isSenderAd: boolean = false;
  isCarryAd: boolean = false;
  selectedTag = [];
  changeTravellingFrequency = false;
  constructor(
    private googlAdsService: GoogleAdsService,
    private theme: LyTheme2,
    private settingService1: UserProfileService,
    private loader: NgxUiLoaderService,
    private dataService: MapsService,
    private _router: Router,
    private spinner: NgxSpinnerService,
    private _notification: NzNotificationService,
    private settingService: SettingService,
    private modalService: NgbModal,
    public router: Router,
    private ngZone: NgZone,
    private db: AngularFirestore,
    private _MapService: MapsService,
    private fb: FormBuilder,
    private _myadds: MyAdService,
    private SettingService: SettingService,
    private datacity: DataService,
    private dataServiceTerm: TermsAndConditionService,
    private sharedService: SharedService,
    private presenseService: PresenceService,
  ) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.longitude1 = +pos.coords.longitude;
        this.latitude1 = +pos.coords.latitude;
      });
    }

    this.cityDataSubscription = this._myadds.doAlladsRed().subscribe(() => {
      this.alladsActive();
    })
  }

  ngOnDestroy() {
    clearInterval(this.intervalStart);
  }
  /* cropper */
  ngAfterViewInit() {
    if (Platform.isBrowser) {
      const config = {
        scale: 0.745864772531767,
        position: {
          x: 642.380608078103,
          y: 236.26357452128866,
        },
      };


      if (this.cropper != undefined) {
        this.cropper.setImageUrl(
          "https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Flarm-rmah-47685-unsplash-1.png?alt=media&token=96a29be5-e3ef-4f71-8437-76ac8013372c",
          () => {
            this.cropper.setScale(config.scale, true);
            this.cropper.updatePosition(config.position.x, config.position.y);
          }
        );

      }
    }
    this.dataTerms = localStorage.getItem('dataTerms');
    if (!this.dataTerms) {
      this.dataServiceTerm.getTermsCondition().subscribe((data: any) => {
        this.dataTerms = data['data'].description;
        localStorage.setItem('dataTerms', this.dataTerms);

      })
    }
    else { 
      this.dataTerms = localStorage.getItem('dataTerms');
    }

  }

  showhidepregnant: boolean;

  b64toBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  }


  changeFreq(index1) {
    this.travellingFreq.forEach((element, index) => {
      if (index == index1) {
        this.travellingFreq[index].check = true;
        this.carriarAd.frequency_id = index + 1;
      } else {
        this.travellingFreq[index].check = false;
      }
    });
    if (index1 == 0 || index1 == 2) {
      this.changeTravellingFrequency = true;
      this.selecteddays = [];
    }
    else { 
      this.changeTravellingFrequency = false;
    }
  }

  alladsActive() {
    this.allAds();
  }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    let name: any = Guid.create();
    let file = new File([this.b64toBlob(e.dataURL)], name.toString(), {
      type: e.type,
    });
    this.senderAd.image.push(file);
  }
  onloaded(e: ImgCropperEvent) {
  }
  onerror(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }
  /* cropper */
  croperModal(CropperModal) {
    this.modalService.dismissAll();
    this.modalReference = this.modalService.open(CropperModal, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: 'static',
      centered: true
    });
  }

  croperModalDismis(CropperModal) {
    this.croppedImage = null;
  }
  ngOnInit() {
    this.categoryDropdownSettings = { 
      idField: 'id',
      textField: 'title',
      enableCheckAll: false,
      defaultOpen: true,
      itemsShowLimit: 3,
    }
    this.user = JSON.parse(localStorage.getItem('user'));
    
    if (this.user) {
      if (this.user.is_verify != 1) {
        this.notequalsOne = true;
      }

      if (this.user.is_verify == 1) {
        this.equalsOne = true;
      }

      if (this.user.is_verify == 0) {
        this.equalzero = true;
      }

      if (this.user.is_verify == 2) {
        this.equaltwo = true;
      }
    }
    this.googlAdsService.getAds().subscribe(data => {
      for (let element of data.data) {
        if (element.slot_name == "VerifyLeft") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageVerifyLeft = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }

        if (element.slot_name == "VerifyRight") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageVerifyRight = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }
      }
    });

    this.todayDate;
    this.setLOcation();
    this.initform();
    this.filterSearch = false;
    if (localStorage.getItem("user") && localStorage.getItem("user") != null) {
      let user: any = JSON.parse(localStorage.getItem("user"));
      this.UserLogin = user;
      this.userDetails = user;
      if (user != undefined && user != null) {
        this.getUserProfile(user.id);
        this.getOnlineUser(user.id);
      }
    } else {
    }

    this.checkUser();
    this.router.events.subscribe((val) => {
      if (val) {
      }
    });
    let user: any = JSON.parse(localStorage.getItem("user"));
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    if (user == undefined || user == null) {
      this.hidesec = true;
      this.isLogin = false;
      this.avatar_image =
        "http://searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png";
    } else {
      this.hidesec = false;
      this.isLogin = true;
      if (user.image == null) {
        this.avatar_image = "../../../assets/default.jpg";
      } 
      else {
        this.avatar_image = user.provider != 'PACSEND' ? user.image : this.mrcURL + "/public/uploads/users/" + user.image;
      }
    }
    this.getDays();
    this.setLOcation();
    this.InitForm();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.routerurl = e.url;
        this.getHeader();
      }
    });

    this.getadTypes();
    this.getTravellingTypes();
    this.getTravellingTypes2();
    this.getCategoriesType();
    this.getdeliveryPriority();
    this.GetNotification();
    this.GetMessage();
    this.getSetting();
    this.notificationBell();

    if (localStorage.getItem("user")) {
      let user: any = JSON.parse(localStorage.getItem("user"));
      if (user.id != undefined) {
        this.getOnlineUser(user.id);

        this.userId = user.id;
        this.userimage = user.image;
      }
    } else {
    }

    this.intervalStart = setInterval(() => {

      if (this.user && this.user.hasOwnProperty('is_verified') && this.user.is_verified == '1') {

        
        if (!localStorage.getItem("user") || !localStorage.getItem("userId")) {
          this.userLogout = true;
          
          this.navigationLoginPopup();
        }
      }

      else {

        if (this.userVerfy != undefined) {

          if (this.userVerfy && this.userVerfy.hasOwnProperty('is_verified') && this.userVerfy.is_verified == '0' || this.userVerfy.is_verified == '2') {
            this.getUserProfile(this.userVerfy.id);

          }
          else if (this.userVerfy && this.userVerfy.hasOwnProperty('is_verified') && this.userVerfy.is_verified == '1') {
            this.navigationLoginPopup();

          }
        }

      }
    }, 10000);
    this.dataTerms = localStorage.getItem('dataTerms');

    this.sharedService.onProfileImageGet().subscribe((res) => { 
      if (res) {
        this.avatar_image = "https://pacsend.app/public/uploads/users/" + res.ProfileImage;
      }
      
    })

  }

  checkUserVerify() {
    clearInterval(this.intervalStart);
    this.onRecivedApproved = true;
  }
  backToLogin() {
    this.checkUserVerify();
    this.modalService.dismissAll();
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }

  navigationLoginPopup() {
    if (!this.loginsession) {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(this.navigationLogin, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width', backdrop: 'static' });
      this.loginsession = true;
    }
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude1 = position.coords.latitude;
        this.longitude1 = position.coords.longitude;
        this.zoomNum = 8;
        this.getAddress(this.latitude1, this.longitude1);
      });
    }
  }

  //Carier work
  getAddress(latitude, longitude) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);
    const request: any = {
      latLng: latlng
    };
    geocoder.geocode(request, (results, status) => {
      this.ngZone.run(() => {
        this.carriarAd['carrier_from_location'] = results.length > 0 ? results[0].formatted_address : ''
      });
      this.loader.stop();
    });
  }

  getAddressTo(latitude, longitude) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);
    const request: any = {
      latLng: latlng
    };
    geocoder.geocode(request, (results, status) => {
      this.ngZone.run(() => {
        this.carriarAd['carrier_to_location'] = results.length > 0 ? results[0].formatted_address : ''
      });
      this.loader.stop();
    });
  }


  ///carier Map work

  markerDragEnd($event: MouseEvent) {
    this.loader.start();
    this.latitude1 = $event.coords.lat;
    this.longitude1 = $event.coords.lng;
    localStorage.setItem("FromLongtitude",JSON.stringify(this.longitude1));
    localStorage.setItem("Fromlatitude",JSON.stringify(this.latitude1));
    this.getAddress(this.latitude1, this.longitude1);
  }

  markerDragEndTo($event: MouseEvent) {
    this.loader.start();
    this.latitude2 = $event.coords.lat;
    this.longitude2 = $event.coords.lng;
    localStorage.setItem("ToLongtitude", JSON.stringify(this.longitude2));
    localStorage.setItem("Tolatitude",JSON.stringify(this.latitude2));
    this.getAddressTo(this.latitude2, this.longitude2);
  }
  //Sender Map Work

  markerDragEndSender($event: MouseEvent) {
    this.loader.start();
    this.latitude1 = $event.coords.lat;
    this.longitude1 = $event.coords.lng;
    localStorage.setItem("SendLongtitude",JSON.stringify(this.longitude1));
    localStorage.setItem("SendLatitude",JSON.stringify(this.latitude1));
    this.getAddressSender(this.latitude1, this.longitude1);
  }



  markerDragEndToSender($event: MouseEvent) {
    this.loader.start();
    this.latitude2 = $event.coords.lat;
    this.longitude2 = $event.coords.lng;
    localStorage.setItem("ReceiverLongtitude",JSON.stringify(this.longitude2));
    localStorage.setItem("Receiveratitude",JSON.stringify(this.latitude2));
    this.getAddressToSender(this.latitude2, this.longitude2);
  }

  getAddressSender(latitude, longitude) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);
    const request: any = {
      latLng: latlng
    };
    geocoder.geocode(request, (results, status) => {
      this.ngZone.run(() => {
        this.senderAd['fromLocation'] = results.length > 0 ? results[0].formatted_address : ''
      })
      localStorage.setItem("SendLocation", this.senderAd['fromLocation']);
      this.loader.stop();
    });

  }

  getAddressToSender(latitude, longitude) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);
    const request: any = {
      latLng: latlng
    };
    geocoder.geocode(request, (results, status) => {
      this.ngZone.run(() => {
        this.senderAd['location'] = results.length > 0 ? results[0].formatted_address : ''
      });
      localStorage.setItem("ReceiverLocation", this.senderAd['location']);
      this.loader.stop();
    });
  }
  verificationbtn(user) {
    if (user.is_verified == "0") {
      this.btnverify = "Verify Your Profile";
    } else if (user.is_verified == "2") {
      this.btnverify = "Your profile is pending to approval!";
    } else {
      this.btnverify = null;
    }
  }

  @HostListener("window:scroll")
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition > 0) {
      this.scrollImageSec = true;
      this.scrollImage = false;
    } else {
      this.scrollImage = true;
      this.scrollImageSec = false;
    }
  }

  GetNotification() {
    this.db
      .collection("Notification", (ref) =>
        ref
          .where("toUserId", "==", +localStorage.getItem("userId"))
          .where("isRead", "==", 0)
          .orderBy("createdAt", "asc")
      )
      .snapshotChanges()
      .subscribe((querySnapshot) => {
        if (querySnapshot.length > 0) {
          this.showNotification = true;
        } else {
          this.showNotification = false;
        }
      });
  }

  GetMessage() {
    this.db.collection("Notification", ref => ref.where("toUserId", "==", +localStorage.getItem("userId"))
      .where("isRead", "==", 0)
      .orderBy("createdAt", "asc"))
      .snapshotChanges().subscribe((querySnapshot) => {
        if (querySnapshot.length > 0) {
          this.showNotification = true
        }
        else {
          this.showNotification = false
        }
      })
  }

  GetChat() {
    this.db.collection("Notification", ref => ref.where("toUserId", "==", +localStorage.getItem("userId"))
      .where("isRead", "==", 0)
      .orderBy("createdAt", "asc"))
      .snapshotChanges().subscribe((querySnapshot) => {
        if (querySnapshot.length > 0) {
          this.showNotification = true
        }
        else {
          this.showNotification = false
        }
      })
  }

  dropdown() {
    if (this.BellMenuClass == "BellMenuinActive") {
      this.BellMenuClass = "BellMenuActive";
    } else {
      this.BellMenuClass = "BellMenuinActive";
    }
  }
  getUserProfile(id) {
    this.settingService1.getUserProfile(id).subscribe((x: any) => {
      if (x.userData.custom_profile_photo) { 
        this.equalsOne = true;
        this.notequalsOne = false;
        this.isLogin = true;
        this.avatar_image = "https://pacsend.app/public/uploads/users/" + x.userData.custom_profile_photo;
      }
     else if (x.userData.image) {
        this.equalsOne = true;
        this.notequalsOne = false;
        this.isLogin = true;
        this.avatar_image = "https://pacsend.app/public/uploads/users/" + x.userData.image;
      }
      else {
        this.equalsOne = true;
        this.notequalsOne = false
        this.avatar_image = "../../../assets/default.jpg";
      }

      this.userVerfy = x.userData;
      localStorage.setItem("userVerfy", this.userVerfy.is_verified);
    });
  }
  notificationBell() {
    this.notifictionClass = "BellIconSpan1 box bounce-4";
  }
  travelTypeSelect(i) {

    this.travellingTypes.forEach((element, index) => {
      this.travelType[index] = false;
    });
    this.travelType[i] = true;
  }
  InitForm() {
    this.SenderForm = this.fb.group({
      client_key: [],
      image: [],
      title: [],
      weight: [],
      traveling_type_id: [],
      longitude: [],
      latitude: [],
      location: [],
      delivery_priority_id: [],
      custom_date: [],
      custom_time: [],
      payment: [],
      user_id: [],
      category_ids: [],
      point_of_contact_name: [],
      point_of_contact_number: [],
      from_longitude: [],
      from_latitude: [],
      from_location: [],
      keyword_ids: [],
    });

    this.CarrierForm = this.fb.group({
      title:'',
      client_key: [],
      carrier_longitude_from: [],
      carrier_latitude_from: [],
      carrier_longitude_to: [],
      carrier_latitude_to: [],
      travelling_frequency: [],
      from_date: [],
      from_time: [],
      to_date: [],
      to_time: [],
      weight: [],
      traveling_by_id: [],
      payment: [],
      user_id: [],
      category_ids: [],
      frequency_id: [],
      from_city: [],
      to_city: [],
      carrier_from_location: [],
      carrier_to_location: [],
      keyword_ids: [],
      customCategories:[]
    });
  }

  checkUser() {
    let user: any = JSON.parse(localStorage.getItem("user"));
    if (user && user.is_verified) {
      if (user.is_verified == "1" && user.is_verified !== undefined) {
        this.hideuser = true;
        this.isLogin = false;
        this.hidesec = false;
      } else {
        this.hideuser = false;
        this.isLogin = true;
        this.hidesec = false;
      }
    } else {
      this.isLogin = true;
      this.hidesec = false;
      this.hideuser = false;
    }
  }

  getId(id) {
    this.clickMyProfle = true;
    this.clickMap = false;
    this.clickAllAds = false;
    this.clickMyAds = false;
    this.clickChat = false;
    this.clickFavourites = false;
    this.clickNotification = false;
    this.statusClass = 'activeProfile';
    this.notequalsOne = false;
    if (this.user.is_verified == '0' || this.user.is_verified == '2') {
      this.navigationRestrictionPopup();
    } else {
      this.router.navigate(["user-profile/" + id]);
      this.ngOnInit();
    }
  }


  notification() {
    if (this.user.is_verified == '0' || this.user.is_verified == '2')
      this.navigationRestrictionPopup();
      this.clickNotification = true;
      this.clickAllAds = false;
      this.clickMyAds = false;
      this.clickFavourites = false;
      this.clickChat = false;
      this.clickMap = false;


  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    let docId = localStorage.getItem('documentId');
    this.userLogout = true
    this.user = null
    this.isLogin=false;
    this.userVerfy = undefined
    this.router.navigateByUrl("");
    this.presenseService.setUserStatusOfflineAndOnline(docId, 'offline');
  }

  onSelectNewAdType(type, packageInfo, whereAreYouTravellingFrom) {
    if (type == 1) {
      this.isSenderAd = true;
      this.isCarryAd = false;
      this.adTypeId = type;
      this.modalService.dismissAll();
      this.loader.start();
      this.modalReference = this.modalService.open(packageInfo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
      setTimeout(() => {
        this.loader.stop();
      }, 1000);
    } else if (type == 2) {
      this.isCarryAd = true;
      this.isSenderAd = false;
      this.adTypeId = type;
      this.modalService.dismissAll();
      this.loader.start();
      this.modalReference = this.modalService.open(whereAreYouTravellingFrom, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
      setTimeout(() => {
        this.loader.stop();
      }, 1000);
    } else { 
      this.SettingService.Info('Please select ad type');
    }
  }

  newAdNext() { }


  RouteToAllAds() {
    this.loader.start();
    this.modalService.dismissAll();
    setTimeout(() => {
      this.loader.stop();
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/all-ads'])
    }, 1000);
  }



  closeFirstModal() {
    this.adPostClicked = false;
    this.isDisabled = false;
  }

  openNewAd(newAd, param) {
    if (param == 1) {
      this.navMenu = false;
    }
    this.setLOcation();
    this.zoom_adcarry_from = 17;
    this.zoom_adcarry_to = 17;
    this.zoom_adsender_from = 17;
    this.zoom_adsener_to = 17;
    this.carriarAd.carrier_from_location = '';
    if (this.user.is_verified == '0' || this.user.is_verified == '2') {
      this.navigationRestrictionPopup();
    } else {
      this.isDisabled = true;
      this.modalReference = this.modalService.open(newAd, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        keyboard: false,
        centered: true
      });
    }
  }

  removeSelectedImage(index, url) {
    this.showImages = this.showImages.filter(a => a !== url);
    const temporary = [];
    for (let i = 0; i < this.images.length; i++) {
      if (i !== index) {
        temporary.push(this.images[i]);
      }
    }
    this.images = temporary;
    this.senderAd.image = this.images;
  }

  openSizeOfPackage(sizeOfPackage) {
    this.senderAd.image = this.images;
    if (
      this.senderAd.title == "" ||
      this.senderAd.categoryIds.length <= 0 ||
      this.senderAd.weight == "" ||
      !this.senderAd.image.length
    ) {
      this.SettingService.Error('Please fill all the fields!')
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(sizeOfPackage, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
      setTimeout(() => {
        this.aboutPacsendLCP = false;
      }, 500);
    }
  }

  openPackageInfo(packageInfo, whereAreYouTravellingFrom) {
    if (this.adTypeId == "1") {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(packageInfo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    } else if (this.adTypeId == "2") {
      this.modalService.dismissAll();
      this.loader.start();
      this.modalReference = this.modalService.open(whereAreYouTravellingFrom, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
      setTimeout(() => {
        this.loader.stop();
      }, 1500);

    } else {
      this.SettingService.Info('Please select ad type');
    }
  }

  opendeliveryPriority(deliveryPriority) {
    let lat = null;
    let lng = null;
    let loc = null;
    loc = localStorage.getItem("ReceiverLocation");
    lat = localStorage.getItem("Receiveratitude");
    lng = localStorage.getItem("ReceiverLongtitude");
    if (!this.senderAd.location) {
      this.SettingService.Error('Please add receiver address');
    }
    else {
      this.senderAd.latitude = lat;
      this.senderAd.longitude = lng;
      this.senderAd.location = loc;
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(deliveryPriority, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }

  openreveiverlocation(receiverlocation) {
    let lat = null;
    let lng = null;
    let loc = null;
    loc = localStorage.getItem("SendLocation");
    lat = localStorage.getItem("SendLatitude");
    lng = localStorage.getItem("SendLongtitude");
    if (!this.senderAd.fromLocation) {
      this.SettingService.Error('Please add sender address!');
    }
    else {
      this.senderAd.fromLatitude = lat;
      this.senderAd.fromLongitude = lng;
      this.senderAd.fromLocation = loc;
      this.SettingService.Info('Please Wait Map Is Loading...');
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(receiverlocation, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }

  openPreviousModal(Modal) {
    this.modalService.dismissAll();
    this.modalReference = this.modalService.open(Modal, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: 'static',
      centered: true
    });
  }

  openPackageDestination(packageDestination, packageinfo?) {
    this.traveling_by_id = Number(packageinfo);
    if (this.senderAd.travelingTypeId == null) {
      this.SettingService.Error('Please select size type');
    } else {
      this.modalService.dismissAll();
      this.SettingService.Info('Please Wait Map Is Loading...');
      this.modalReference = this.modalService.open(packageDestination, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }
  getTravellingType(id) {
    this.senderAd.travelingTypeId = id;
    this.travellingid = id;
  }

  openpaymentcarrier(carrierPayment) {
    this.aboutPacsendLCP = true;
    if (this.carriarAd.traveling_by_id == null) {
      this.SettingService.Info('Please Select Package Size');
    }
    else {

      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(carrierPayment, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }

  }

  getcarrygetTravellingType(id) {
    this.carrytravellingid = id;
    this.carriarAd.traveling_by_id = id;
    this.travellingTypes2.forEach((element) => {
      element.clicked = false;
    });
    this.travellingTypes2
      .filter((x) => x.id == id)
      .map((x) => {
        x.clicked = true;
      });
  }
  onSelectCustame_DT() {
    this.deliverypriority.forEach((element, index) => {
      this.deliveryPty[index] = false;
    });
    this.senderAd.PriorityId = "4";
    this.customDT = true;
  }

  openPointOfContact(pointOfContact) {
    if (this.senderAd.PriorityId == null) {
      this.SettingService.Error('Please select any priority');
    } else {
      if (
        this.senderAd.PriorityId == "4" &&
        !this.senderAd.customDate &&
        !this.senderAd.customTime
      ) {
        this.SettingService.Error('Please add custom date and time!');
        return null;
      }
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(pointOfContact, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }

  openPayment(payment?) {
    this.aboutPacsendLCP = true;
    if (!this.senderAd.receiverName) {
      this.SettingService.Error('Please enter receiver name!');
    }

    else if (!this.senderAd.receivernumber) {
      this.SettingService.Error('Please enter receiver contact!');
    }

    else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(payment, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }

  }

  sendImages(packageInfo, whereAreYouTravellingFrom) {

    let imageForm = new FormData();

    for (var i = 0; i <= this.images.length - 1; i++) {
      imageForm.append('image[]', this.images[i]);
    }

    this._myadds.sendImages(imageForm).subscribe((res: any) => {
      this.uploadedImagesSender = []
      this.uploadedImagesSender = res.images;

    });
    if (this.adTypeId == "1") {
      this.modalService.dismissAll();


      this.modalReference = this.modalService.open(packageInfo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    } else if (this.adTypeId == "2") {
      this.modalService.dismissAll();
      this.loader.start();
      this.modalReference = this.modalService.open(whereAreYouTravellingFrom, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });


      setTimeout(() => {
        this.loader.stop();
      }, 1500);

    } else {
      this.SettingService.Info('Please select ad type');
    }
  }

  openIwantToSendSuccess(sendSuccess, payment) {
    this.loader.start();
    if (this.senderAd.payment == null) {
      this.SettingService.Error('Please enter payment value!');
      this.loader.stop();
      return null;
    }
    this.senderAd.categoryIds.forEach((cat, index) => {  
      let abc = this.senderAd.categoryIds.length - 1 == index ? "" : ",";
      if (!this.senderAd.categoryId || this.senderAd.categoryId == '') {
        this.senderAd.categoryId = cat;
      }
      else {
        this.senderAd.categoryId = this.senderAd.categoryId + "," + cat;
      }
    });

    this.sharedService.deleteEmptyCategoryIds(this.customeCategoryList,this.categories);

    let formData = new FormData();
    localStorage.setItem("payment", payment);
    let image = this.uploadfile[0];
    formData.append("title", this.senderAd.title);
    formData.append("weight", this.senderAd.weight);
    formData.append("traveling_type_id", this.senderAd.travelingTypeId);
    formData.append("longitude", this.senderAd.longitude);
    formData.append("latitude", this.senderAd.latitude);
    formData.append("location", this.senderAd.location);
    formData.append("delivery_priority_id", this.senderAd.PriorityId);
    formData.append("custom_date", this.senderAd.customDate);
    formData.append("custom_time", this.senderAd.customTime);
    formData.append("payment", this.senderAd.payment);
    formData.append("user_id", localStorage.getItem("userId"));
    formData.append("category_ids", this.senderAd.categoryId);
    formData.append("keyword_ids", this.senderAd.keywordId);
    formData.append("from_longitude", this.senderAd.fromLongitude);
    formData.append("from_latitude", this.senderAd.fromLatitude);
    formData.append("customCategories", JSON.stringify(this.customeCategoryList))
    // formData.append("customCategories", this.customeCategoryList)

    if (this.senderAd.fromLocation == null) {
      formData.append("from_location", this.senderAd['fromLocation']);
    }
    else {
      formData.append("from_location", this.senderAd.fromLocation);
    }

    formData.append("point_of_contact_name", this.senderAd.receiverName);
    formData.append("point_of_contact_number", this.senderAd.receivernumber);
    const leng = this.uploadedImagesSender.length;
    for (var i = 0; i < leng; i++) {
      formData.append("imageName[]", this.uploadedImagesSender[i].imageName);
    }

    if (!this.clicked) {
      this._myadds.PostSenderAdnew(formData).subscribe(
        (res) => {
          if (res) {
            this.loader.stop();
            this.reset();
            this.SettingService.Success('Ad Post Successfully.');
            this.modalService.dismissAll();
            this.modalReference = this.modalService.open(sendSuccess, {
              ariaLabelledBy: "modal-basic-title",
              windowClass: "modal-width",
              backdrop: 'static',
              centered: true
            });
            this.customeCategoryList = [];
            this.selectedTag = [];
            this.senderCutomeCategory = false;
            this.isSenderAd = false;
            this.customeCategory = ''
            setTimeout(() => {
              this.aboutPacsendLCP = false;
            }, 800);
          }
        },
        (err: HttpErrorResponse) => {
          this.loader.stop();
          this.SettingService.Error(err.message);
        }
      );
      this.clicked = true
    }
    setTimeout(() => {
      this.clicked = false;
    }, 500);
  }


  openWhereAreYouTravellngTo(openWhereAreYouTravellngTo) {

    this.carriarAd.carrier_longitude_from = localStorage.getItem(
      "FromLongtitude"
    );
    if (!this.carriarAd.carrier_from_location) {
      this.SettingService.Info('Please select Location');
    }
    else if (this.carriarAd.carrier_longitude_from != null && this.carriarAd.carrier_longitude_from != '') {
      this.carriarAd.carrier_latitude_from = localStorage.getItem("Fromlatitude");
      this.carriarAd.carrier_from_location = localStorage.getItem("FromLocation");
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(openWhereAreYouTravellngTo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }

  openTravellingFrequency(travellingFrequency) {
    this.carriarAd.carrier_longitude_to = localStorage.getItem("ToLongtitude");
    this.carriarAd.carrier_latitude_to = localStorage.getItem("Tolatitude");
    if (!this.carriarAd.carrier_to_location) {
      this.SettingService.Info('Please select Location');
    }
    else if(this.carriarAd.carrier_longitude_to != '' && this.carriarAd.carrier_longitude_to != null){
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(travellingFrequency, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }
  openWhenAreYouTravelling(whenAreYouTravelling, date) {
    if (this.carriarAd.frequency_id == null) {

      this.SettingService.Info('Please Select Travelling Frequency');

    }
    else {

      this.modalService.dismissAll();
      this.carrierdate = date;
      this.carriarAd.custome_date = date;
      this.modalReference = this.modalService.open(whenAreYouTravelling, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }

  }

  opencarrierPackageInfo(carrierPackageInfo, fromtime, totime) {
    if (fromtime.length == 0) {

      this.SettingService.Info('Please select From Time');

    }
    else if (totime.length == 0) {
      this.SettingService.Info('Please select To Time');
    }

    else {

      this.carriarAd.from_time = fromtime;
      this.carriarAd.to_time = totime;

      this.modalService.dismissAll();

      this.modalReference = this.modalService.open(carrierPackageInfo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });

    }

  }

  opencarrierSizeOfPackage(carrierSizeOfPackage, category) {

    if (category.length == 0) {
      this.SettingService.Info('Please Enter Capacity');
    }
    else if (this.carriarAd.categoryIds.length == 0) {
    // else if (this.categoryarrays.length == 0) {
      this.SettingService.Info('Please Select Category');
    }
    else {

      this.carriarAd.weight = category;
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(carrierSizeOfPackage, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
    setTimeout(() => {
      this.aboutPacsendLCP = false;
    }, 500);
  }

  opencarrierPayment(carrierPayment) {
    this.modalReference = this.modalService.open(carrierPayment, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: 'static',
      centered: true
    });
  }

  opencarrierSuccess(carrierSuccess, amount) {
    this.loader.start();
    this.carriarAd.payment = amount;
    if (this.carriarAd.payment.length == 0) {
      this.SettingService.Info('Please Enter Amount');
      this.loader.stop();
    }
    else {
      this.modalService.dismissAll();
      this.carriarAd.categoryIds.forEach((cat, index) => {
        let abc =  this.carriarAd.categoryIds.length - 1 == index ? "" : ",";
        if (!this.carriarAd.categoryId ||  this.carriarAd.categoryId == '') {
          this.carriarAd.categoryId = cat;
        }
        else {
          this.carriarAd.categoryId = this.carriarAd.categoryId + "," + cat;
        }
        });


      this.sharedService.deleteEmptyCategoryIds(this.customeCategoryList,  this.categories);

      this.getTravellingFreq(
        this.carriarAd.frequency_id,
        this.carriarAd.custome_date
      );

      this.CarrierForm.controls["title"].setValue(this.carriarAd.title);
      this.CarrierForm.controls["client_key"].setValue(this.clientkey);
      this.CarrierForm.controls["carrier_longitude_from"].setValue(
        this.carriarAd.carrier_longitude_from
      );

      this.CarrierForm.controls["carrier_latitude_from"].setValue(
        this.carriarAd.carrier_latitude_from
      );
      this.CarrierForm.controls["carrier_longitude_to"].setValue(
        this.carriarAd.carrier_longitude_to
      );
      this.CarrierForm.controls["carrier_latitude_to"].setValue(
        this.carriarAd.carrier_latitude_to
      );
      this.CarrierForm.controls["travelling_frequency"].setValue(
        this.carriarAd.travelling_frequency
      );
      this.CarrierForm.controls["from_date"].setValue(1 / 1 / 1199);
      this.CarrierForm.controls["to_date"].setValue(1 / 1 / 1199);
      this.CarrierForm.controls["weight"].setValue(this.carriarAd.weight);
      this.CarrierForm.controls["traveling_by_id"].setValue(
        this.carriarAd.traveling_by_id
      );
      this.CarrierForm.controls["payment"].setValue(this.carriarAd.payment);
      this.CarrierForm.controls["user_id"].setValue(
        localStorage.getItem("userId")
      );
      this.CarrierForm.controls["category_ids"].setValue(this.carriarAd.categoryId);


      this.CarrierForm.controls["carrier_from_location"].setValue(
        this.carriarAd.carrier_from_location
      );
      this.CarrierForm.controls["carrier_to_location"].setValue(
        this.carriarAd.carrier_to_location
      );
      this.CarrierForm.controls["frequency_id"].setValue(
        this.carriarAd.frequency_id
      );
      this.CarrierForm.controls["from_city"].setValue(
        this.carriarAd.from_city
      );
      this.CarrierForm.controls["to_city"].setValue(
        this.carriarAd.to_city
      );
      this.CarrierForm.controls["customCategories"].setValue(
        this.customeCategoryList)


      if (!this.clicked) {
        this._myadds.PostCarrierAdnew(this.CarrierForm.value).subscribe(
          (res) => {
            this.loader.stop();
            this.SettingService.Success('Ad Post Successfully.');
            this.modalReference = this.modalService.open(carrierSuccess, {
              ariaLabelledBy: "modal-basic-title",
              windowClass: "modal-width",
              backdrop: 'static',
              centered: true
            });
            this.customeCategoryList = [];
            this.selectedTag = [];
            this.carrierCustomeCategory = false;
            this.isCarryAd = false;
            this.customeCategory = '';
            setTimeout(() => {
              this.aboutPacsendLCP = false;
            }, 800);
          },
          (err: HttpErrorResponse) => {
            this.loader.stop();
            this.SettingService.Error('Ad Post Failed.');
          }
        );

        this.clicked = true
      }

    }
    setTimeout(() => {
      this.clicked = false;
    }, 500);

  }

  getTravellingFreq(id, date?) {
    if (id == 1) {
      this.carriarAd.travelling_frequency = "Daily";
    } else if (id == 2) {
      this.selecteddays.forEach((element, index) => {
        this.carriarAd.travelling_frequency =
          index == 0
            ? element.toString()
            : this.carriarAd.travelling_frequency + "," + element.toString();
      });
    } else {
      this.carriarAd.travelling_frequency = date;
    }
  }

  termsClicked() {
    this.termsReaded = true;
  }

  getHeader() {
  }

  getSetting() {
    this.settingService.getSettings().subscribe((data: any[]) => {
      this.settings = data["data"];
      this.id = data["data"].id;
      this.name = data["data"].name;
      this.meta_description = data["data"].meta_description;
      this.footer_content = data["data"].footer_content;
      this.logo = data["data"].logo;
      this.favicon = data["data"].favicon;
      this.notification_switch = data["data"].notification_switch;
      this.footer_logo = data["data"].footer_logo;
      this.footer_description = data["data"].footer_description;
      this.footer_copy_right = data["data"].footer_copy_right;
      this.fb_link = data["data"].fb_link;
      this.twitter_link = data["data"].twitter_link;
      this.linkden_link = data["data"].linkden_link;
      this.youtube_link = data["data"].youtube_link;
      this.home_img_1 = data["data"].home_img_1;
      this.home_img_2 = data["data"].home_img_2;
      this.created_at = data["data"].created_at;
      this.updated_at = data["data"].updated_at;
    });
  }

  getadTypes() {
    this.settingService.getAdTypes().subscribe((data: any[]) => {
      this.adtypes = data["data"];
    });
  }

  getTravellingTypes() {
    this.settingService.getTravellingTypes().subscribe((data: any[]) => {
      this.travellingTypes = data["data"];
      this.travellingTypes.forEach((element, index) => {
        this.travelType[index] = false;
      });
      this.travellingTypes.forEach((element) => {
        element.clicked = false;
      });
    });
  }
  getTravellingTypes2() {
    this.settingService.getTravellingTypes2().subscribe((data: any[]) => {
      this.travellingTypes2 = data["data"];
      this.travellingTypes2.forEach((element, index) => {
        if (element[index] != undefined) {
          this.travelType2[index] = false;
        };
      });
      this.travellingTypes2.forEach((element) => {
        element.clicked = false;
      });
    });
  }

  getCategoriesType() {
    this.settingService.getCategories().subscribe((data: any[]) => {
      this.categories = data["data"];
      this.categories.forEach((element) => {
        element.clicked = false;
      });
    });
  }


  getkeywordsType() {
    this.settingService.getkeywords().subscribe((data: any[]) => {
      this.keywords = data['data'];
      this.keywords.forEach(element => {
        element.clicked = false;
      });
    })
  }

  getdeliveryPriority() {
    this.settingService.getDeliveryPriorities().subscribe((data: any[]) => {
      this.deliverypriority = data["data"];
      this.deliverypriority.forEach((element, index) => {
        this.deliveryPty[index] = false;
      });
    });
  }

  navigationRestrictionPopup() {
    if (this.user && (this.user.is_verified == '0' || this.user.is_verified == '2')) {
      this.modalReference = this.modalService.open(this.navigationRestricted, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });
    }
  }


  onClickPriority(i) {
    this.deliverypriority.forEach((element, index) => {
      this.deliveryPty[index] = false;
    });
    this.customDT = false;
    this.deliveryPty[i] = true;
  }
  map() {
    this.clickMap = true;
    this.clickAllAds = false;
    this.clickMyAds = false;
    this.clickFavourites = false;
    this.clickChat = false;
    this.adPostClicked = false;
    this.clickMyProfle = false;
    this.clickNotification = false;
  }

  allAds() {
    this.page = localStorage.getItem('page');
    if (this.page == 'adDetail') {
      this.clickAllAds = false;
      this.clickMyAds = false;
      this.clickFavourites = false;
      this.clickChat = false;
      this.clickMap = false;
      this.clickMyProfle = false;
      this.clickNotification = false;
    }
    else {
      this.clickAllAds = true;
      this.clickMyAds = false;
      this.clickFavourites = false;
      this.clickNotification = false;
      this.clickChat = false;
      this.clickMap = false;
      this.clickMyProfle = false;
    }

  }

  allAdsActive() {
    localStorage.removeItem('page');
    this.clickAllAds = true;
    this.clickMyAds = false;
    this.clickFavourites = false;
    this.clickChat = false;
    this.clickMap = false;
    this.adPostClicked = false;
    this.clickMyProfle = false;
  }

  myAds() {
    if (this.user.is_verified == '0' || this.user.is_verified == '2')
      this.navigationRestrictionPopup();
    this.clickAllAds = false;
    this.clickMyAds = true;
    this.clickFavourites = false;
    this.clickChat = false;
    this.clickMap = false;
    this.adPostClicked = false;
    this.clickMyProfle = false;
    this.clickNotification = false;
  }
  // Footer Routings
  onClickAbout() {
    this.router.navigateByUrl("about");
  }
  onClickFaqs() {
    this.router.navigateByUrl("faqs");
  }
  onClickTerms() {
    this.router.navigateByUrl("terms-and-condition");
  }
  onClickPrivacy() {
    this.router.navigateByUrl("privacy-policy");
  }
  onClickLogin() {
    this.router.navigateByUrl("login");
  }
  onClickMap() {
    this.router.navigateByUrl("map");
  }
  onClickMyAds() {
    this.router.navigateByUrl("my-ads");
  }
  onClickAllAds() {
    this.router.navigateByUrl("all-ads");
  }
  onClickChat(param?) {
    if (param == 1) {
      this.navMenu = false;
      document.getElementById("menu").style.transform = "rotate(180deg)";
    }
    if (this.user.is_verified == '0' || this.user.is_verified == '2')
      this.navigationRestrictionPopup();
    this.clickAllAds = false;
    this.clickMyAds = false;
    this.clickFavourites = false;
    this.clickMap = false;
    this.clickChat = true;
    localStorage.removeItem("ChatAdId");
    this.adPostClicked = false;
    this.clickMyProfle = false;
    this.clickNotification = false;
  }
  onClickFav() {
    this.router.navigateByUrl("favourites");
  }
  favourites() {
    if (this.user.is_verified == '0' || this.user.is_verified == '2')
      this.navigationRestrictionPopup();
    this.clickAllAds = false;
    this.clickMyAds = false;
    this.clickFavourites = true;
    this.clickChat = false;
    this.clickMap = false;
    this.adPostClicked = false;
    this.clickMyProfle = false;
    this.clickNotification = false;
  }


  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }


  UploadImageFrontandBack() {
    this.loader.start();
    let formData = new FormData();
    formData.append("client_key", this.clientkey);
    formData.append("user_id", localStorage.getItem("userId"));
    let file1 = this.frontselfiearray[0];
    let file2 = this.backselfiearray[0];
    formData.append("id_card_front", file1);
    formData.append("id_card_back", file2);

    this._MapService.PostverificationStepTwo(formData).subscribe(
      (res) => {
        this.loader.stop();
        this.SettingService.Success('National ID Image uploaded successfully');
      },
      (err: HttpErrorResponse) => {
        this.loader.stop();
        this.SettingService.Error(err.message);
      }
    );
  }
  UploadImage() {
    this.loader.start();
    let formData = new FormData();
    formData.append("client_key", this.clientkey);
    formData.append("user_id", localStorage.getItem("userId"));
    let file = this.uploadfile[0];
    formData.append("image", file);
    this._MapService.PostverificationStepone(formData).subscribe(
      (res) => {
        if (this.uploadfile.length > 0) {
          this.loader.stop();
          this.SettingService.Success('Image uploaded successfully');
        }
      },
      (err: HttpErrorResponse) => {
        this.loader.stop();
        this.SettingService.Error(err.message);
      }
    );
  }

  onSelect($event) {
    this.uploadfile.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.uploadfile = []
      this.SettingService.Error("Only 1 Image Is Allowed..");
    } else {
    }
  }


  onEnter(type: any, condi) {
    if (type == 'carry') {
      if (condi) {
        this.latitude2 = +localStorage.getItem("Tolatitude");
        this.longitude2 = +localStorage.getItem("ToLongtitude");
        this.zoom_adcarry_to = 17;
      } else if (!condi) {
        this.latitude1 = +localStorage.getItem("Fromlatitude");
        this.longitude1 = +localStorage.getItem("FromLongtitude");
        this.zoom_adcarry_from = 17;
      } else {
        this.latitude1;
        this.longitude1;
      }
    }
    else {
      if (condi) {
        this.latitude2 = +localStorage.getItem("Receiveratitude");
        this.longitude2 = +localStorage.getItem("ReceiverLongtitude");
        this.zoom_adsener_to = 17;
      } else if (!condi) {
        this.latitude1 = +localStorage.getItem("SendLatitude");
        this.longitude1 = +localStorage.getItem("SendLongtitude");
        this.senderAd.location = localStorage.getItem('ReceiverLocation');
        this.zoom_adsender_from = 17;
      } else {
        this.latitude1;
        this.longitude1;
      }
    }
  }


  findCity() {
    this.datacity.getAllCity().subscribe(data => {
      this.cityData = data['data'];
    })
  }

  findRecAdress(search) {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });
    var Input = document.getElementById("searchmaps");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(Input);
    var autocomplete = new google.maps.places.Autocomplete(search);
    autocomplete.bindTo("bounds", map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
    });
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      var address = "";
      if (place.address_components) {
        for (let i = 0; i < place.address_components.length; i++) { 
          let type = place.address_components[i].types.find((x) => x == 'country');
          if (type) {
            this.countryLongName = place.address_components[i].long_name;
            this.countryShortName = place.address_components[i].short_name;
            break;
          }
        }
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          "",
        ].join(" ");
      }
      infowindow.setContent(
        "<div><strong>" + place.name + "</strong><br>" + address
      );
      infowindow.open(map, marker);

      localStorage.setItem("ReceiverLocation", place.formatted_address);
      localStorage.setItem(
        "ReceiverLongtitude",
        JSON.stringify(place.geometry.location.lng())
      );
      localStorage.setItem(
        "Receiveratitude",
        JSON.stringify(place.geometry.location.lat())
      );
      this.onEnter('sender', true);
    });

  }

  setLOcation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.array.push({
          longitude: +pos.coords.longitude,
          latitude: +pos.coords.latitude,
        });
      });
      this.setOtherLocation();
    }
  }

  setOtherLocation() {
    this.LocationArray.push({
      longitude: localStorage.getItem("MapLongtitude"),
      latitude: localStorage.getItem("SendLatitude"),
    });
  }

  getPriorityid(id) {
    this.senderAd.PriorityId = id;
    this.senderAd.customDate = null;
    this.senderAd.customTime = null;
  }
  getTravellingFrom(search) {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });
    var Input = document.getElementById("searchmap12");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(Input);
    var autocomplete = new google.maps.places.Autocomplete(search);
    autocomplete.bindTo("bounds", map);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
    });
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      var address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          "",
        ].join(" ");
      }
      infowindow.setContent("<div><strong>" + place.name + "</strong><br>" + address);
      infowindow.open(map, marker);
      localStorage.setItem("FromLocation", place.formatted_address);
      localStorage.setItem("FromLongtitude",JSON.stringify(place.geometry.location.lng()));
      localStorage.setItem("Fromlatitude",JSON.stringify(place.geometry.location.lat()));
      this.onEnter('carry', false);
    });
  }

  getTravellingto(search) {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });
    var Input = document.getElementById("searchmapsss");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(Input);
    var autocomplete = new google.maps.places.Autocomplete(search);
    autocomplete.bindTo("bounds", map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();

      var address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          "",
        ].join(" ");
      }

      infowindow.setContent(
        "<div><strong>" + place.name + "</strong><br>" + address
      );

      infowindow.open(map, marker);
      localStorage.setItem("ToLocation", place.formatted_address);
      this.carriarAd.carrier_to_location = place.formatted_address;
      localStorage.setItem("ToLongtitude", JSON.stringify(place.geometry.location.lng()));
      localStorage.setItem("Tolatitude", JSON.stringify(place.geometry.location.lat()));
      this.onEnter('carry', true);
    });
  }

  PushDays(item) {
    if (this.selecteddays.length > 0) {
      let filter: any = this.selecteddays.findIndex((x) => x == item);
      if (filter < 0 || filter == null || filter == undefined) {
        this.selecteddays.push(item);
      } else {
        this.selecteddays.splice(filter, 1);
      }
    } else {
      this.selecteddays.push(item);
    }
  }


  PushKeywords(item) {
    if (this.keywordsarrays.length > 0) {
      let filter: any = this.keywordsarrays.findIndex((x) => x == item);
      if (filter < 0 || filter == null || filter == undefined) {
        this.keywordsarrays.push(item);
      } else {
        this.keywordsarrays.splice(filter, 1);
      }
    } else {
      this.keywordsarrays.push(item);
    }
    this.keywords.forEach((element) => {
      element.clicked = false;
    });
    this.keywordsarrays.forEach((element) => {
      this.keywords
        .filter((x) => x.id == element)
        .map((x) => {
          x.clicked = true;
        });
    });
  }

  getDays() {
    this.DaysArray.push(
      {
        id: 1,
        day_name: "SUN",
        full_name: "Sunday",
        selected: false,
        class: "checkbox-button-opt-s",
      },
      {
        id: 2,
        day_name: "MON",
        full_name: "Monday",
        selected: false,
        class: "checkbox-button-opt-m",
      },
      {
        id: 3,
        day_name: "TUE",
        full_name: "Tuesday",
        selected: false,
        class: "checkbox-button-opt-t",
      },
      {
        id: 4,
        day_name: "WED",
        full_name: "Wednesday",
        selected: false,
        class: "checkbox-button-opt-w",
      },
      {
        id: 5,
        day_name: "THR",
        full_name: "Thursday",
        selected: false,
        class: "checkbox-button-opt-th",
      },
      {
        id: 6,
        day_name: "FRI",
        full_name: "Friday",
        selected: false,
        class: "checkbox-button-opt-f",
      },
      {
        id: 7,
        day_name: "SAT",
        full_name: "Saturday",
        selected: false,
        class: "checkbox-button-opt-sa",
      }
    );
  }

  viewprofile() {
    if (this.user.is_verified == '0' || this.user.is_verified == '2') {
      this.navigationRestrictionPopup();
    }

    else {
      const userid = localStorage.getItem("userId");
      this.router.navigate(["user-profile/", userid]);
      this.clickAllAds = false;
      this.clickMyAds = false;
      this.clickChat = false;
      this.clickFavourites = false;
      this.clickNotification = false;
    }
  }

  findAdress(search) {
    var map = new google.maps.Map(document.getElementById("map1"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 25,
    });
    var Input = document.getElementById("searchmap");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(Input);
    var autocomplete = new google.maps.places.Autocomplete(search);
    autocomplete.bindTo("bounds", map);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      position: { lat: this.latitude, lng: this.longitude }
    });
    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      var address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          "",
        ].join(" ");
      }
      infowindow.setContent(
        "<div><strong>" + place.name + "</strong><br>" + address
      );
      infowindow.open(map, marker);
      localStorage.setItem("SendLocation", place.formatted_address);
      localStorage.setItem(
        "SendLongtitude",
        JSON.stringify(place.geometry.location.lng())
      );
      localStorage.setItem(
        "SendLatitude",
        JSON.stringify(place.geometry.location.lat())
      );
      this.onEnter("sender", false);
    });
  }

  OpenFeedback(feedback) {
    this.modalReference = this.modalService.open(feedback, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: 'static',
      centered: true
    });
  }
  onClick() {
    this.router.navigateByUrl("spinner");
  }
  /* ///////////////////////////////////////////////modal logics ////////////////////////////////////////////////////////// */



  initform() {
    this.form = this.fb.group({
      CNIC: [],
    });
  }

  getOnlineUser(id) {
    this.settingService1.getUserProfile(id).subscribe((data: any[]) => {
      this.userDetails = data["userData"];
      this.username = this.userDetails['fname']
    });
  }

  getallUsers() {
    this.dataService.getALlUsers().subscribe((data: any[]) => {
      this.allUsers = data["data"];
    });
  }

  verifyProfile(verifyProfileStepOne) {
    if (this.userDetails.is_verified == "0") {
      this.modalReference = this.modalService.open(verifyProfileStepOne, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    } else {
      this.SettingService.Info('Your profile is under verification process!');
    }
  }
  verificationstepTwo(verifyProfileStepTwo, profile?) {
    this.UploadImage();
    if (this.uploadfile.length == 0) {
      this.SettingService.Error('Profile Image cannot be empty');
      this.loader.stop();
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(verifyProfileStepTwo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }
  verificationstepThree(verifyProfileStepThree) {

    if (!this.clicked) {
      if (this.frontselfiearray.length == 0) {
        this.SettingService.Error('Front Selfie cannot be empty.');
      }
      if (this.backselfiearray.length == 0) {
        this.SettingService.Error('Back Selfie cannot be empty.');
      }
      else {
        this.modalService.dismissAll();
        this.modalReference = this.modalService.open(verifyProfileStepThree, {
          ariaLabelledBy: "modal-basic-title",
          windowClass: "modal-width",
          backdrop: 'static',
          centered: true
        });
      }
      this.clicked = true
    }
    setTimeout(() => {
      this.clicked = false;
    }, 500);

  }
  verificationsuccessfull(verificationSuccessful) {
    if (this.clicked) this.clicked = false;
    if (!this.clicked) { 
      this.loader.start();
      if (this.nicNo == null) {
        this.loader.stop();

        this.SettingService.Error('National Id number cannot be empty.');
      } else if (this.nicNo.toString().length < 8) {
        this.loader.stop();
        this.SettingService.Error('National Id number is too short.');
      } else if (this.nicNo.toString().length > 15) { 
        this.loader.stop();
        this.SettingService.Error('National Id number is not greater than 15.');
      }
      else {
        let formData = new FormData();
        formData.append("client_key", this.clientkey);
        formData.append("user_id", localStorage.getItem("userId"));
        formData.append("nic_no", this.nicNo.toString());
        this._MapService.PostverificationStepThree(formData).subscribe(
          (res) => {
            this.SettingService.Success('National Id Number Saved Successfully..');
            if (res) {
              this.loader.stop();
              this.settingService1
                .getUserProfile(this.UserLogin.id)
                .subscribe((obj: any) => {
                  this.userVerfy = obj.userData;
                  localStorage.setItem("user", JSON.stringify(obj.userData));
                });
            }
            this.btnverify = "Your profile is pending to approval!";
            this.modalService.dismissAll();
            this.modalReference = this.modalService.open(verificationSuccessful, {
              ariaLabelledBy: "modal-basic-title",
              windowClass: "modal-width",
              backdrop: 'static',
              centered: true
            });
          },
          (err: HttpErrorResponse) => {
            this.loader.stop();
            this.SettingService.Error(err.message);
          }
        );
      }
      this.clicked = true;
      this.loader.start();
    }
    this.clicked = false;    
  }

  onRemove(event) {
    this.uploadfile.splice(this.uploadfile.indexOf(event), 1);
  }
  onSelectFront($event) {
    this.frontSelfie = true;
    this.backSelfie = false;
    this.disablefrontbtn = true;
    this.disabledbackbtn = false;
    this.frontselfiearray.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.modalService.dismissAll();
      this.SettingService.Error('Only Single Image Allowed..');
    }
  }

  onSelectBack($event) {
    this.frontSelfie = true;
    this.backSelfie = true;
    this.disablefrontbtn = true;
    this.disabledbackbtn = true;
    this.backselfiearray.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.modalService.dismissAll();
      this.SettingService.Error('Only Single Image Allowed..');
    } else {
      this.UploadImageFrontandBack();
    }
  }

  onRemovefront(event) {
    this.frontselfiearray.splice(this.uploadfile.indexOf(event), 1);
  }

  onRemoveback(event) {
    this.backselfiearray.splice(this.uploadfile.indexOf(event), 1);
  }

  frontImage() {
    if (this.frontselfiearray.length == 0) {
      this.SettingService.Error('Front Selfie cannot be empty.');
    } else {
      this.frontSelfie = true;
      this.backSelfie = false;
    }
  }

  backImage() {
    if (this.backselfiearray.length == 0) {
      this.SettingService.Error('Back Selfie cannot be empty.');
    } else {
      this.frontSelfie = true;
      this.backSelfie = true;
    }
  }

  hidebutton() {
    this.statusClass = 'activeProfile';
    this.ngOnInit();
    this.hideverify = true;
  }
  reset() {
    this.adPostClicked = false;
    this.carriarAd = {
      title: "",
      carrier_longitude_from: null,
      carrier_latitude_from: null,
      carrier_from_location: '',
      carrier_longitude_to: null,
      categoryId: "",
      carrier_latitude_to: null,
      carrier_to_location: '',
      frequency_id: null,
      from_city: null,
      to_city: null,
      travelling_frequency: '',
      from_date: null,
      from_time: null,
      to_date: null,
      to_time: null,
      weight: null,
      categoryIds: [],
      traveling_by_id: null,
      payment: null,
      user_id: null,
      custome_date: null,
      custome_time: null,
      category_ids: null,
      keyword_ids: [],
    };
    this.senderAd = {
      title: "",
      weight: "",
      image: null,
      categoryId: "",
      keywordId: "0",
      travelingTypeId: null,
      longitude: null,
      latitude: null,
      location: null,
      PriorityId: null,
      customDate: null,
      customTime: null,
      payment: null,
      toCity: null,
      userId: null,
      categoryIds: [],
      keyword_ids: [],
      fromLongitude: null,
      fromLatitude: null,
      fromLocation: null,
      fromCity: null,
      receiverName: null,
      receivernumber: null,
      terms: false
    };
    this.selectedTag = [];
    this.travellingTypes.forEach((element, index) => {
      this.travelTypeSelect[index] = false;
    });
    this.travellingTypes2.forEach((element) => {
      element.clicked = false;
    });
    this.images = [];
    this.showImages = [];
    localStorage.removeItem("ReceiverLocation");
    localStorage.removeItem("Receiveratitude");
    localStorage.removeItem("ReceiverLongtitude");
    localStorage.removeItem("SendLocation");
    localStorage.removeItem("SendLatitude");
    localStorage.removeItem("SendLatitude");
    this.croppedImage = null;
  }

  OpacityZero() {

    document.getElementById("close-nav").style.transform = '0';
  }
  openNav(param?) {
    if (param != undefined)
      this.navMenu = false;
    else
      this.navMenu = true;
  }

  images = [];
  showImages = [];
  filesAmount
  allowImg = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']

  onFileChange(event) {

    let myForm: FormGroup;

    if (event.target.files.length + this.showImages.length > 5) {
      this.SettingService.Error("Only 5 images are allowed.");
      return;
    }
    for (let file of event.target.files) {
      if (!this.allowImg.find((ext) => ext === file.type)) {
        this.SettingService.Error("Only images are allowed.");
        return;
      }
    }

    if (event.target.files && event.target.files[0]) {
      this.images = event.target.files;
      this.filesAmount = event.target.files.length > 5 ? 5 : event.target.files.length;
      //limit the no files

      for (let i = 0; i < this.filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.showImages.push(event.target.result);
        }

        reader.readAsDataURL(event.target.files[i]);
      }

    }
  }
  getUrl(url: any) {

    let hello = null;
    hello = URL.createObjectURL(url);
    return URL.createObjectURL(url)
  }


  public onScrollbyID(elementId: string): void {

    this.router.navigate(['/'])
    setTimeout(() => {
      const yOffset = -80;
      const element = document.getElementById(elementId);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 500);

  }

  nextSlide(index){
    if(index<this.showImages.length-1){
      this.imageIndex=index+1;
       }
       else{
      this.imageIndex=this.showImages.length-1;
       }
    }
  
    previousSlide(index){
      if(index>0){
        this.imageIndex=index-1;
         }
         else{
        this.imageIndex=0;
  
         }
  }

  selectCategory(event) {
    if (this.isSenderAd) {
      let id = this.senderAd.categoryIds.find((x) => x == event.id);
      if (!id) {
        this.senderAd.categoryIds.push(event.id);
      }
    } else {
      let id = this.carriarAd.categoryIds.find((x) => x == event.id);
      if (!id) {
        this.carriarAd.categoryIds.push(event.id);
      }
    }
  }
  deSelectCategory(event) { 
    let cusomteTagIdx =  this.customeCategoryList.findIndex(x => x.tempId == event.id);
    if (this.isSenderAd) {
      let idx = this.senderAd.categoryIds.findIndex(x => x == event.id);
      this.senderAd.categoryIds.splice(idx, 1);
      this.customeCategoryList.splice(cusomteTagIdx, 1);
      this.selectedTag.splice(idx, 1);
    } else { 
      let idx = this.carriarAd.categoryIds.findIndex(x => x == event.id);
      this.carriarAd.categoryIds.splice(idx, 1);
      this.customeCategoryList.splice(cusomteTagIdx, 1);
      this.selectedTag.splice(idx, 1);
    }
  }

  openCustomeCategoryField(value) { 
    if (value == 'sender') {
      this.senderCutomeCategory = true;
      this.carrierCustomeCategory = false;
    }
    else { 
      this.senderCutomeCategory = false;
      this.carrierCustomeCategory = true;
    }    
  }

  closeCustomeCategoryField() {
    if (this.senderCutomeCategory && this.customeCategory == '') {
      this.senderCutomeCategory = false;
    }
    else if (this.carrierCustomeCategory && this.customeCategory =='') {
      this.carrierCustomeCategory = false;
    }
    else { 
      this.carrierCustomeCategory = true;
      this.senderCutomeCategory = true;
    }
   }
  addCustomeCategory() { 
    if (this.customeCategory == '' || !this.customeCategory) {
      this.settingService.Error("Enter tag value first!")
    }
    else {
      let category = {
        tempId: Math.floor(Math.random() * 10000),
        id: null,
        image: '',
        slug: this.customeCategory,
        title:this.customeCategory
      }
  
      category.id = category.tempId;
      this.categories = [...this.categories, category];
      this.selectedTag = [...this.selectedTag, category]
      if (this.senderCutomeCategory) {
        this.senderAd.categoryIds.push(category.id);
      }
      else {
        this.carriarAd.categoryIds.push(category.id);
       }
      this.customeCategoryList.push(category);
      
      if (this.customeCategory != '' || this.customeCategory) {
        this.customeCategory = '';
      }
    }

  }
}

interface PlaceData {
  description: string;
  lat: number;
  lng: number;
}
