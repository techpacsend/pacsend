import { element } from "protractor";
import { DataService } from "./../frontend/allads/allads.service";
import { DataService as DataService1 } from "./../frontend/allcarrierads/data.service";
import { MyAdService } from "./../frontend/myads/myads.service";
import { AboutService } from "./../frontend/about/about.service";
import { MapsService } from "./../frontend/maps/maps.service";
import { UserProfileService } from "./../frontend/user-profile/user-profile.service";
import { GoogleAdsService } from "./../frontend/services/google-ads.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NzNotificationService } from "ng-zorro-antd";
import { NgxSpinnerService } from "ngx-spinner";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SettingService } from "src/app/app.service";
import { ModalCloseService } from "src/app/modalClose.service";
import * as moment from "moment";
import { Guid } from "guid-typescript";
import {
  LyResizingCroppingImages,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
} from "@alyle/ui/resizing-cropping-images";
import { LyTheme2, Platform } from "@alyle/ui";
import { Observable, Subscription } from "rxjs";
import { SafeHtml } from "@angular/platform-browser";
import { NgSelectComponent } from "@ng-select/ng-select";
import { SharedService } from "../frontend/services/shared.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";

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
  selector: "app-ad-edit",
  templateUrl: "./ad-edit.component.html",
  styleUrls: ["./ad-edit.component.css"],
})
export class AdEditComponent implements OnInit {
  public checkbox1: boolean = true;

  @ViewChild(NgSelectComponent, { static: false }) ngSelect: NgSelectComponent;

  @ViewChild("navigationRestricted", { static: false })
  navigationRestricted: TemplateRef<any>;
  @ViewChild("navigationLogin", { static: false })
  navigationLogin: TemplateRef<any>;

  mrcURL: string = "http://pacsend.uk";

  isDisabled: boolean = false;
  usable: boolean = true;
  isclicked: boolean = false;
  isModalOpen = false;
  navMenu: boolean = false;

  lati: number;
  longi: number;
  zoomNum: any;

  @ViewChild("searchInMap", { static: true })
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

  sender: any;
  carier: any;

  senderAd = {
    title: "",
    types: null,
    weight: "",
    image: [],
    categoryId: "0",
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
    fromLongitude: null,
    fromLatitude: null,
    custom_date_to: null,
    custom_time_to: null,
    fromLocation: null,
    receiverName: null,
    receivernumber: null,
    terms: false,
    to_city: null,
    from_city: null,
    delivery_location: null,
    pickup_location: null,
    point_of_contact_name: null,
    point_of_contact_number: null,
  };
  zoom_adcarry_from: any = 20;
  zoom_adcarry_to: any = 20;
  zoom_adsender_from: any = 20;
  zoom_adsener_to: any = 20;
  carriarAd = {
    title: "",
    adID: 0,
    carrier_longitude_from: null,
    carrier_latitude_from: null,
    carrier_from_location: "",
    carrier_longitude_to: null,
    carrier_latitude_to: null,
    carrier_to_location: "",
    frequency_id: null,
    from_city: "",
    to_city: "",
    from_date: null,
    from_time: null,
    to_date: null,
    to_time: null,
    weight: null,
    traveling_by_id: null,
    payment: null,
    user_id: null,
    custome_date: null,
    custome_time: null,
    category_ids: null,
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
  senderDiv = true;
  carrierDiv = false;
  allDiv = false;

  getUserDetails = false;
  array = [];
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
  categoryarrays = [];
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

  username;
  userId;
  @ViewChild("Search", { static: true }) Search: ElementRef;
  isLogin;
  adtypes = [];
  adTypeId;
  public currentLocation;
  travellingTypes = [];
  categories = [];
  deliverypriority = [];
  showHeaderFooterComponent: true;
  routerurl;
  title = "Pacsend";
  settings = [];
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
  latitude1: any = 24.912877841368648;
  longitude1: any = 67.0235158710789;
  nicNo: any = null;
  // latitude2: any = 24.912877841368648;
  // longitude2: any = 67.0235158710789;
  latitude2: any;
  longitude2: any;
  showNotification: boolean = false;
  scrollImage: boolean = true;
  scrollImageSec: boolean = false;
  clickMap: boolean = false;
  clickAllAds: boolean = false;
  clickMyAds: boolean = false;
  clickChat: boolean = false;
  clickFavourites: boolean = false;

  cityData: any = [];
  cityDataSubscription: Subscription;
  public loginsession: Boolean = false;
  googleAdsImage: string;
  googleAdsImageVerifyLeft: string;
  googleAdsImageVerifyRight: string;
  googleAdsScript: SafeHtml | any;
  uploadedImagesSender: any[] = [];
  travellingTypes2: any;
  travelType2: any;
  public intervalStart;
  onRecivedApproved = false;
  adData: any = {
    custom_date_to: "",
    custom_time_to: "",
  };
  adID: any;
  type: any;
  selectedHigh: boolean;
  CarUpdatebtnDisable: any;
  SendUpdatebtnDisable: any;
  toLocationSame: boolean = true;
  isCutomeCategory: boolean;
  customeCategoryList = [];
  catIds: any;
  customeCategory: string;
  imageIndex: number = 0;
  images = [];
  showImages = [];
  adImageBaseUrl = "http://pacsend.uk/public/uploads/adds/";
  filesAmount;
  allowImg = ["image/jpeg", "image/png", "image/jpg", "image/bmp"];
  countryShortName = 'PK';
   categoryDropdownSettings:IDropdownSettings={};
  selectedTag = [];

  constructor(
    private actRoute: ActivatedRoute,
    private dataService1: DataService,
    private googlAdsService: GoogleAdsService,
    private theme: LyTheme2,
    private settingService1: UserProfileService,
    private loader: NgxUiLoaderService,
    private dataService: MapsService,
    private spinner: NgxSpinnerService,
    private settingService: SettingService,
    private modalService: NgbModal,
    public router: Router,
    private db: AngularFirestore,
    private _MapService: MapsService,
    private fb: FormBuilder,
    private _myadds: MyAdService,
    private SettingService: SettingService,
    private datacity: DataService1,
    private sharedService: SharedService
  ) {
    this.getCategoriesType('');
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
        this.CarrierForm.patchValue({
          frequency_id: index + 1,
          travelling_frequency:
            index1 == 0 ? "Daily" : index1 == 1 ? "Some Days" : this.todayDate,
        });
      } else {
        this.travellingFreq[index].check = false;
      }
    });
  }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    let name: any = Guid.create();
    let file = new File([this.b64toBlob(e.dataURL)], name.toString(), {
      type: e.type,
    });
    this.senderAd.image.push(file);
  }
  onloaded(e: ImgCropperEvent) {}
  onerror(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }
  /* cropper */
  croperModal(CropperModal) {
    this.modalService.dismissAll();
    this.modalReference = this.modalService.open(CropperModal, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: "static",
      centered: true,
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
      itemsShowLimit: 5,
    }
    let value = JSON.parse(localStorage.getItem("value"));
    if (value == "sender") {
      this.sender = true;
    } else if (value == "carier") {
      this.carier = true;
    }

    let userId = localStorage.getItem("userId");
    this.adID = this.actRoute.snapshot.params["id"];

    if (this.carier) {
      this.getAdDetailsCarier(this.adID);
    } else {
      this.getAdDetails(this.adID, userId);
    }

    this.user = JSON.parse(localStorage.getItem("user"));
    this.googlAdsService.getAds().subscribe((data) => {
      for (let element of data.data) {
        if (element.slot_name == "VerifyLeft") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageVerifyLeft = element.image;
          } else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }
        if (element.slot_name == "VerifyRight") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageVerifyRight = element.image;
          } else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }
      }
    });

    this.todayDate;
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
    this.notificationBell();
    this.checkUser();
    this.router.events.subscribe((val) => {
      if (val) {
      }
    });
    let user: any = JSON.parse(localStorage.getItem("user"));
    this.spinner.show();

    setTimeout(() => {
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
        this.avatar_image =
          "http://searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png";
      } else {
        this.avatar_image = this.mrcURL + "/public/uploads/users/" + user.image;
      }
    }
    this.getDays();

    this.InitForm();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.routerurl = e.url;
      }
    });
    this.getSetting();
    this.getadTypes();
    if (localStorage.getItem("user")) {
      let user: any = JSON.parse(localStorage.getItem("user"));
      if (user.id != undefined) {
        this.getOnlineUser(user.id);
        this.userId = user.id;
        this.userimage = user.image;
      }
    } else {
    }
    this.GetNotification();
    this.GetMessage();

    this.intervalStart = setInterval(() => {
      if (
        this.user &&
        this.user.hasOwnProperty("is_verified") &&
        this.user.is_verified == "1"
      ) {
        this.checkUserVerify();
      } else {
        if (
          (this.userVerfy &&
            this.userVerfy.hasOwnProperty("is_verified") &&
            this.userVerfy.is_verified == "0") ||
          this.userVerfy.is_verified == "2"
        ) {
          this.getUserProfile(this.userVerfy.id);
        } else if (
          this.userVerfy &&
          this.userVerfy.hasOwnProperty("is_verified") &&
          this.userVerfy.is_verified == "1"
        ) {
          this.navigationLoginPopup();
        }
      }
    }, 10000);
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
      this.modalReference = this.modalService.open(this.navigationLogin, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
      });
      this.loginsession = true;
    }
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

  GetChat() {
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

  dropdown() {
    if (this.BellMenuClass == "BellMenuinActive") {
      this.BellMenuClass = "BellMenuActive";
    } else {
      this.BellMenuClass = "BellMenuinActive";
    }
  }
  getUserProfile(id) {
    this.settingService1.getUserProfile(id).subscribe((x: any) => {
      this.userVerfy = x.userData;
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
    });

    this.CarrierForm = this.fb.group({
      title: "",
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
      traveling_by: [],
      payment: [],
      user_id: [],
      category_ids: [],
      frequency_id: [],
      customCategories: [],
      carrier_from_location: [],
      carrier_to_location: [],
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
    if (this.user.is_verified == "0" || this.user.is_verified == "2") {
      this.navigationRestrictionPopup();
    } else {
      this.router.navigate(["user-profile/" + id]);
    }
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.reload();
  }

  onSelectNewAd(option, event) {
    this.adTypeId = option.id;
  }

  newAdNext() {}

  RouteToAllAds() {
    this.modalService.dismissAll();
    this.router.navigateByUrl("all-ads");
  }

  closeFirstModal() {
    this.isDisabled = false;
  }

  openNewAd(newAd, param) {
    if (param == 1) {
      this.navMenu = false;
    }
    this.zoom_adcarry_from = 17;
    this.zoom_adcarry_to = 17;
    this.zoom_adsender_from = 17;
    this.zoom_adsener_to = 17;
    this.carriarAd.carrier_from_location = "";
    if (this.user.is_verified == "0" || this.user.is_verified == "2") {
      this.navigationRestrictionPopup();
    } else {
      this.isDisabled = true;
      this.modalReference = this.modalService.open(newAd, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        keyboard: false,
        centered: true,
      });
    }
  }

  removeSelectedImage(index, url) {
    this.showImages = this.showImages.filter((a) => a !== url);
    const temporary = [];
    for (let i = 0; i < this.images.length; i++) {
      if (i !== index) {
        temporary.push(this.images[i]);
      }
    }
    this.images = temporary;
    this.senderAd.image = this.images;
    if (this.uploadedImagesSender.length) {
      this.uploadedImagesSender.splice(index, 1);
    }
  }

  openSizeOfPackage(sizeOfPackage) {
    this.senderAd.image = this.images;
    if (
      this.senderAd.title == "" ||
      this.senderAd.categoryIds.length <= 0 ||
      this.senderAd.weight == "" ||
      !this.senderAd.image.length
    ) {
      this.SettingService.Error("Please fill all the fields!");
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(sizeOfPackage, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  openPackageInfo(packageInfo, whereAreYouTravellingFrom) {
    if (this.adTypeId == "1") {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(packageInfo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    } else if (this.adTypeId == "2") {
      this.modalService.dismissAll();
      this.loader.start();
      this.modalReference = this.modalService.open(whereAreYouTravellingFrom, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });

      setTimeout(() => {
        this.loader.stop();
      }, 1500);
    } else {
      this.SettingService.Info("Please select ad type");
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
      this.SettingService.Error("Please add sender address!");
    } else {
      this.senderAd.latitude = lat;
      this.senderAd.longitude = lng;
      this.senderAd.location = loc;

      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(deliveryPriority, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
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
      this.SettingService.Error("Please add sender address!");
    } else {
      this.senderAd.fromLatitude = lat;
      this.senderAd.fromLongitude = lng;
      this.senderAd.fromLocation = loc;
      this.SettingService.Info("Please Wait Map Is Loading...");
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(receiverlocation, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  openPreviousModal(Modal) {
    this.modalService.dismissAll();
    this.modalReference = this.modalService.open(Modal, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: "static",
      centered: true,
    });
  }

  openPackageDestination(packageDestination, packageinfo?) {
    this.traveling_by_id = Number(packageinfo);
    if (this.senderAd.travelingTypeId == null) {
      this.SettingService.Error("Please select size type");
    } else {
      this.modalService.dismissAll();
      this.SettingService.Info("Please Wait Map Is Loading...");
      this.modalReference = this.modalService.open(packageDestination, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }
  getTravellingType(id) {
    this.senderAd.travelingTypeId = id;
    this.travellingid = id;
  }

  openpaymentcarrier(carrierPayment) {
    if (this.carriarAd.traveling_by_id == null) {
      this.SettingService.Info("Please Select Package Size");
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(carrierPayment, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  getcarrygetTravellingType(id) {
    this.carrytravellingid = id;
    this.travellingTypes2.map((res) => {
      if (res["id"] == id) {
        res["clicked"] = true;
        this.CarrierForm.patchValue({
          traveling_by: res["title"],
          traveling_by_id: res["id"],
        });
      } else {
        res["clicked"] = false;
      }
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
      this.SettingService.Error("Please select any priority");
    } else {
      if (
        this.senderAd.PriorityId == "4" &&
        !this.senderAd.customDate &&
        !this.senderAd.customTime
      ) {
        this.SettingService.Error("Please add custom date and time!");
        return null;
      }
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(pointOfContact, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  openPayment(payment?) {
    if (!this.senderAd.receiverName || !this.senderAd.receivernumber) {
      this.SettingService.Error("Please enter receiver name and contact!");
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(payment, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }
  sendImages() {
    let imageForm = new FormData();
    for (var i = 0; i <= this.images.length - 1; i++) {
      imageForm.append("image[]", this.images[i]);
    }
    this.loader.start();
    this._myadds.sendImages(imageForm).subscribe(
      (res: any) => {
        this.loader.stop();
        this.settingService.Success(res.message);
        if (this.uploadedImagesSender.length) {
          this.uploadedImagesSender.forEach((ele) => {
            if (ele.imageName == undefined) {
              this.uploadedImagesSender = [];
            }
          });
        }

        if (res.images.length) {
          res.images.forEach((ele) => {
            this.uploadedImagesSender.push(ele);
          });
        }
      },
      (error) => {
        this.loader.stop();
        this.settingService.Error("Upload image failed!");
      }
    );
  }

  openIwantToSendSuccess(payment) {
    this.loader.start();
    this.categoryIdsCheck();
    this.deleteEmptyCategoryIds();
    let formData = new FormData();
    localStorage.setItem("payment", payment);
    formData.append("title", this.senderAd.title);
    formData.append("weight", this.senderAd.weight);
    formData.append("traveling_type_id", this.senderAd.travelingTypeId);
    formData.append("longitude", this.longitude1);
    formData.append("latitude", this.latitude1);
    formData.append("location", this.senderAd.delivery_location);
    formData.append("delivery_priority_id", this.senderAd.PriorityId);
    formData.append("custom_date", this.senderAd.custom_date_to);
    formData.append("custom_time", this.senderAd.custom_time_to);
    formData.append("payment", this.senderAd.payment);
    formData.append("user_id", localStorage.getItem("userId"));
    formData.append("category_ids", this.catIds);
    formData.append(
      "customCategories",
      JSON.stringify(this.customeCategoryList)
    );
    formData.append("from_longitude", this.longitude2);
    formData.append("from_latitude", this.latitude2);
    formData.append("from_location", this.senderAd.pickup_location);
    formData.append(
      "point_of_contact_name",
      this.senderAd.point_of_contact_name
    );
    formData.append(
      "point_of_contact_number",
      this.senderAd.point_of_contact_number
    );

    if (this.uploadedImagesSender != undefined) {
      const leng = this.uploadedImagesSender.length;
      for (var i = 0; i < leng; i++) {
        formData.append("imageName[]", this.uploadedImagesSender[i].imageName);
      }
    }
    this._myadds.PostSenderAdEdit(this.adID, formData).subscribe(
      (res) => {
        this.loader.stop();
        if (this.SendUpdatebtnDisable == undefined) {
          this.isCutomeCategory = false;

          this.SettingService.Success("Ad Updated Successfully");
          this.SendUpdatebtnDisable++;
        }
        this.router.navigateByUrl("all-ads");
      },
      (err: HttpErrorResponse) => {
        this.loader.stop();
        this.SettingService.Error(err.message);
      }
    );
  }

  openWhereAreYouTravellngTo(openWhereAreYouTravellngTo) {
    this.carriarAd.carrier_longitude_from =
      localStorage.getItem("FromLongtitude");
    if (!this.carriarAd.carrier_from_location) {
      this.SettingService.Info("Please select Location");
    } else if (
      this.carriarAd.carrier_longitude_from != null &&
      this.carriarAd.carrier_longitude_from != ""
    ) {
      this.carriarAd.carrier_latitude_from =
        localStorage.getItem("Fromlatitude");
      this.carriarAd.carrier_from_location =
        localStorage.getItem("FromLocation");

      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(openWhereAreYouTravellngTo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  openTravellingFrequency(travellingFrequency) {
    this.carriarAd.carrier_longitude_to = localStorage.getItem("ToLongtitude");
    this.carriarAd.carrier_latitude_to = localStorage.getItem("Tolatitude");
    if (!this.carriarAd.carrier_to_location) {
      this.SettingService.Info("Please select Location");
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(travellingFrequency, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }
  openWhenAreYouTravelling(whenAreYouTravelling, date) {
    if (this.carriarAd.frequency_id == null) {
      this.SettingService.Info("Please Select Travelling Frequency");
    } else {
      this.modalService.dismissAll();
      this.carrierdate = date;
      this.carriarAd.custome_date = date;
      this.modalReference = this.modalService.open(whenAreYouTravelling, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  opencarrierPackageInfo(carrierPackageInfo, fromtime, totime) {
    if (fromtime.length == 0) {
      this.SettingService.Info("Please select From Time");
    } else if (totime.length == 0) {
      this.SettingService.Info("Please select To Time");
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(carrierPackageInfo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  opencarrierSizeOfPackage(carrierSizeOfPackage, category) {
    if (category.length == 0) {
      this.SettingService.Info("Please Enter Capacity");
    } else if (this.categoryarrays.length == 0) {
      this.SettingService.Info("Please Select Category");
    } else {
      this.carriarAd.weight = category;
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(carrierSizeOfPackage, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }

  opencarrierPayment(carrierPayment) {
    this.modalReference = this.modalService.open(carrierPayment, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: "static",
      centered: true,
    });
  }

  opencarrierSuccess(amount) {
    this.loader.start();

    this.carriarAd.payment = amount;
    if (this.carriarAd.payment.length == 0) {
      this.SettingService.Info("Please Enter Amount");
    } else {
      this.modalService.dismissAll();
      this.categoryIdsCheck();
      this.sharedService.deleteEmptyCategoryIds(
        this.customeCategoryList,
        this.categories
      );
      this.CarrierForm.patchValue({
        carrier_longitude_from: this.longitude1,
        carrier_latitude_from: this.latitude1,
        carrier_longitude_to: this.longitude2,
        carrier_latitude_to: this.latitude2,
        from_date: 1 / 1 / 1199,
        to_date: 1 / 1 / 1199,
        weight: this.carriarAd.weight,
        payment: this.carriarAd.payment,
        user_id: localStorage.getItem("userId"),
        category_ids: this.catIds,
        customCategories: this.customeCategoryList,
        carrier_from_location: this.carriarAd.carrier_from_location,
        carrier_to_location: this.carriarAd.carrier_to_location,
        title: this.carriarAd.title,
      });

      let obj = {
        ...this.CarrierForm.value,
      };
      this._myadds.EditCarrierAd(this.adID, obj).subscribe(
        (res) => {
          this.loader.stop();
          this.isCutomeCategory = false;
          if (this.CarUpdatebtnDisable == undefined) {
            this.SettingService.Success("Ad Updated Successfully");
            this.CarUpdatebtnDisable++;
          }
          this.router.navigateByUrl("all-ads");
        },
        (err: HttpErrorResponse) => {
          this.loader.stop();
          this.SettingService.Error("Ad Post Failed.");
        }
      );
    }
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

  getTravellingTypes(param) {
    this.settingService.getTravellingTypes().subscribe((data: any[]) => {
      this.travellingTypes = data["data"];
      data["data"].map((res) => {
        if (res["title"] == param) {
          this.travelType.push(true);
          this.senderAd.travelingTypeId = res["id"];
        } else {
          this.travelType.push(false);
        }
      });
    });
  }

  getTravellingTypes2(param) {
    this.settingService.getTravellingTypes2().subscribe((data: any[]) => {
      data["data"].map((res) => {
        if (res["title"] == param) {
          res["clicked"] = true;
          this.CarrierForm.patchValue({
            traveling_by: res["title"],
            traveling_by_id: res["id"],
          });
        } else {
          res["clicked"] = false;
        }
      });

      this.travellingTypes2 = data["data"];
    });
  }

  
  category_config: any = {
    labelField: "title",
    valueField: "id",
    searchField: ["title"],
    maxItems: 10,
  };

  getCategoriesType(params) {
    this.settingService.getCategories().subscribe((data: any[]) => {
      this.categories = data["data"];

      data["data"].map((res, i) => {
        if (params) { 
        params.map((p) => {
          if (res["title"] == p["type_name"]) {
            this.category_idsList.push(res["id"]);
          }
        });
      }
      });
    });
  }

  getdeliveryPriority(param) {
    this.settingService.getDeliveryPriorities().subscribe((data: any[]) => {
      this.deliverypriority = data["data"];
      data["data"].map((res) => {
        if (res["id"] == Number(param)) {
          if (res["id"] == 1) {
            this.selectedHigh = true;
          }

          this.deliveryPty.push(true);
          this.senderAd.PriorityId = res["id"];
        } else {
          this.deliveryPty.push(false);
        }
      });
      if (param == "4") {
        this.customDT = true;
      }
    });
  }

  navigationRestrictionPopup() {
    if (
      this.user &&
      (this.user.is_verified == "0" || this.user.is_verified == "2")
    ) {
      this.modalReference = this.modalService.open(this.navigationRestricted, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
      });
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
  }

  allAds() {
    this.clickAllAds = true;
    this.clickMyAds = false;
    this.clickFavourites = false;
    this.clickChat = false;
    this.clickMap = false;
  }
  myAds() {
    if (this.user.is_verified == "0" || this.user.is_verified == "2")
      this.navigationRestrictionPopup();
    this.clickAllAds = false;
    this.clickMyAds = true;
    this.clickFavourites = false;
    this.clickChat = false;
    this.clickMap = false;
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
    if (this.user.is_verified == "0" || this.user.is_verified == "2")
      this.navigationRestrictionPopup();
    this.clickAllAds = false;
    this.clickMyAds = false;
    this.clickFavourites = false;
    this.clickMap = false;
    this.clickChat = true;
    localStorage.removeItem("ChatAdId");
  }
  onClickFav() {
    this.router.navigateByUrl("favourites");
  }
  favourites() {
    if (this.user.is_verified == "0" || this.user.is_verified == "2")
      this.navigationRestrictionPopup();
    this.clickAllAds = false;
    this.clickMyAds = false;
    this.clickFavourites = true;
    this.clickChat = false;
    this.clickMap = false;
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }

  UploadImageFrontandBack() {
    let formData = new FormData();
    formData.append("client_key", this.clientkey);
    formData.append("user_id", localStorage.getItem("userId"));
    let file1 = this.frontselfiearray[0];
    let file2 = this.backselfiearray[0];
    formData.append("id_card_front", file1);
    formData.append("id_card_back", file2);

    this._MapService.PostverificationStepTwo(formData).subscribe(
      (res) => {
        this.SettingService.Success("ID Image Upload Successfully..");
      },
      (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message);
      }
    );
  }
  UploadImage() {
    let formData = new FormData();
    formData.append("client_key", this.clientkey);
    formData.append("user_id", localStorage.getItem("userId"));
    let file = this.uploadfile[0];
    formData.append("image", file);
    this._MapService.PostverificationStepone(formData).subscribe(
      (res) => {
        if (this.uploadfile.length > 0) {
          this.SettingService.Success("Image Upload Successfully..");
        }
      },
      (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message);
      }
    );
  }

  onSelect($event) {
    this.uploadfile.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.uploadfile = [];
      this.SettingService.Error("Only 1 Image Is Allowed..");
    } else {
    }
  }

  findCity() {
    this.datacity.getAllCity().subscribe((data) => {
      this.cityData = data;
    });
  }

  findSenderPicupAddress(search) {
    var map = new google.maps.Map(document.getElementById("map1"), {
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
      animation: google.maps.Animation.DROP,
    });
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      localStorage.setItem("ReceiverLocation", place.formatted_address);
      localStorage.setItem(
        "ReceiverLongtitude",
        JSON.stringify(place.geometry.location.lng())
      );
      localStorage.setItem(
        "Receiveratitude",
        JSON.stringify(place.geometry.location.lat())
      );

      this.senderAd.fromLongitude = place.geometry.location.lng();
      this.senderAd.fromLatitude = place.geometry.location.lat();
      this.senderAd.pickup_location = place.formatted_address;

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

      localStorage.setItem("ReceiverLocation", place.formatted_address);
      localStorage.setItem(
        "ReceiverLongtitude",
        JSON.stringify(place.geometry.location.lng())
      );
      localStorage.setItem(
        "Receiveratitude",
        JSON.stringify(place.geometry.location.lat())
      );
      this.onEnter("sender", true);
    });
  }
  findAdress(search) {
    var map = new google.maps.Map(document.getElementById("map"), {
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
      position: { lat: this.latitude, lng: this.longitude },
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
      this.senderAd.delivery_location = place.formatted_address;
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
    this.toLocationSame = false;
  }

  onEnter(type: any, condi) {
    if (type == "carry") {
      if (condi) {
        this.latitude2 = +localStorage.getItem("Tolatitude");
        this.longitude2 = +localStorage.getItem("ToLongtitude");
        this.zoom_adcarry_to = 17;
      } else if (!condi) {
        this.latitude1 = +localStorage.getItem("Fromlatitude");
        this.longitude1 = +localStorage.getItem("FromLongtitude");
        this.carriarAd.carrier_from_location =
          localStorage.getItem("FromLocation"); // FromLocation
        this.zoom_adcarry_from = 17;
      } else {
        this.latitude1;
        this.longitude1;
      }
    } else {
      if (condi) {
        this.latitude2 = +localStorage.getItem("Receiveratitude");
        this.longitude2 = +localStorage.getItem("ReceiverLongtitude");
        this.senderAd.pickup_location =
          localStorage.getItem("ReceiverLocation");
        this.zoom_adsener_to = 17;
      } else if (!condi) {
        this.latitude1 = +localStorage.getItem("SendLatitude");
        this.longitude1 = +localStorage.getItem("SendLongtitude");
        this.senderAd.location = localStorage.getItem("SendLocation");
        this.zoom_adsender_from = 17;
      } else {
        this.latitude1;
        this.longitude1;
      }
    }
    this.toLocationSame = false;
  }

  getPriorityid(id) {
    this.selectedHigh = false;
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
      infowindow.setContent(
        "<div><strong>" + place.name + "</strong><br>" + address
      );
      infowindow.open(map, marker);
      localStorage.setItem("FromLocation", place.formatted_address);
      localStorage.setItem(
        "FromLongtitude",
        JSON.stringify(place.geometry.location.lng())
      );
      localStorage.setItem(
        "Fromlatitude",
        JSON.stringify(place.geometry.location.lat())
      );
      this.onEnter("carry", false);
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
      localStorage.setItem(
        "ToLongtitude",
        JSON.stringify(place.geometry.location.lng())
      );
      localStorage.setItem(
        "Tolatitude",
        JSON.stringify(place.geometry.location.lat())
      );
      this.onEnter("carry", true);
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

  PushSenderCategory(item) {
    if (this.senderAd.categoryIds.length > 0) {
      let filter: any = this.senderAd.categoryIds.findIndex((x) => x == item);
      if (filter < 0 || filter == null || filter == undefined) {
        this.senderAd.categoryIds.push(item);
      } else {
        this.senderAd.categoryIds.splice(filter, 1);
      }
    } else {
      this.senderAd.categoryIds.push(item);
    }
  }
  PushCategory(item) {
    if (this.categoryarrays.length > 0) {
      let filter: any = this.categoryarrays.findIndex((x) => x == item);
      if (filter < 0 || filter == null || filter == undefined) {
        this.categoryarrays.push(item);
      } else {
        this.categoryarrays.splice(filter, 1);
      }
    } else {
      this.categoryarrays.push(item);
    }
    this.categories.forEach((element) => {
      element.clicked = false;
    });
    this.categoryarrays.forEach((element) => {
      this.categories
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
        class: "checkbox-button-opt-s",
      },
      {
        id: 2,
        day_name: "MON",
        full_name: "Monday",
        class: "checkbox-button-opt-m",
      },
      {
        id: 3,
        day_name: "TUE",
        full_name: "Tuesday",
        class: "checkbox-button-opt-t",
      },
      {
        id: 4,
        day_name: "WED",
        full_name: "Wednesday",
        class: "checkbox-button-opt-w",
      },
      {
        id: 5,
        day_name: "THR",
        full_name: "Thursday",
        class: "checkbox-button-opt-th",
      },
      {
        id: 6,
        day_name: "FRI",
        full_name: "Friday",
        class: "checkbox-button-opt-f",
      },
      {
        id: 7,
        day_name: "SAT",
        full_name: "Saturday",
        class: "checkbox-button-opt-sa",
      }
    );
  }

  viewprofile() {
    if (this.user.is_verified == "0" || this.user.is_verified == "2")
      this.navigationRestrictionPopup();
    const userid = localStorage.getItem("userId");
    this.router.navigate(["user-profile/", userid]);
    this.clickAllAds = false;
    this.clickMyAds = false;
    this.clickChat = false;
    this.clickFavourites = false;
  }

  OpenFeedback(feedback) {
    this.modalReference = this.modalService.open(feedback, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
      backdrop: "static",
      centered: true,
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
      this.username = this.userDetails["fname"];
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
        backdrop: "static",
        centered: true,
      });
    } else {
      this.SettingService.Info("Your profile is under verification process!");
    }
  }
  verificationstepTwo(verifyProfileStepTwo, profile?) {
    this.UploadImage();
    if (this.uploadfile.length == 0) {
      this.SettingService.Error("Profile Image cannot be empty.");
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(verifyProfileStepTwo, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }
  verificationstepThree(verifyProfileStepThree) {
    if (this.frontselfiearray.length == 0) {
      this.SettingService.Error("Front Selfie cannot be empty.");
    }
    if (this.backselfiearray.length == 0) {
      this.SettingService.Error("Back Selfie cannot be empty.");
    } else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(verifyProfileStepThree, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: "static",
        centered: true,
      });
    }
  }
  verificationsuccessfull(verificationSuccessful) {
    if (this.nicNo == null) {
      this.SettingService.Error("National Id number cannot be empty.");
    } else if (this.nicNo.toString().length < 8) {
      this.SettingService.Error("National Id number is too short.");
    } else {
      let formData = new FormData();

      formData.append("client_key", this.clientkey);
      formData.append("user_id", localStorage.getItem("userId"));
      formData.append("nic_no", this.nicNo.toString());
      this._MapService.PostverificationStepThree(formData).subscribe(
        (res) => {
          this.SettingService.Success("National Id Number Saved Successfully.");
          if (res) {
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
            backdrop: "static",
            centered: true,
          });
        },
        (err: HttpErrorResponse) => {
          this.SettingService.Error(err.message);
        }
      );
    }
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
      this.SettingService.Error("Only Single Image Allowed..");
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
      this.SettingService.Error("Only Single Image Allowed..");
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
      this.SettingService.Error("Front Selfie cannot be empty.");
    } else {
      this.frontSelfie = true;
      this.backSelfie = false;
    }
  }

  backImage() {
    if (this.backselfiearray.length == 0) {
      this.SettingService.Error("Back Selfie cannot be empty.");
    } else {
      this.frontSelfie = true;
      this.backSelfie = true;
    }
  }

  hidebutton() {
    this.hideverify = true;
  }
  reset() {
    this.carriarAd = {
      title: "",
      adID: 0,
      carrier_longitude_from: null,
      carrier_latitude_from: null,
      carrier_from_location: "",
      carrier_longitude_to: null,
      carrier_latitude_to: null,
      carrier_to_location: "",
      frequency_id: null,
      from_city: "",
      to_city: "",
      from_date: null,
      from_time: null,
      to_date: null,
      to_time: null,
      weight: null,
      traveling_by_id: null,
      payment: null,
      user_id: null,
      custome_date: null,
      custome_time: null,
      category_ids: null,
    };
    this.senderAd = {
      types: null,
      to_city: null,
      from_city: null,
      point_of_contact_name: null,
      point_of_contact_number: null,
      delivery_location: null,
      pickup_location: null,
      title: "",
      weight: "",
      image: null,
      categoryId: "0",
      travelingTypeId: null,
      custom_date_to: null,
      custom_time_to: null,

      longitude: null,
      latitude: null,
      location: null,
      PriorityId: null,
      customDate: null,
      customTime: null,
      payment: null,
      userId: null,
      categoryIds: [],
      fromLongitude: null,
      fromLatitude: null,
      fromLocation: null,
      receiverName: null,
      receivernumber: null,
      terms: false,
    };
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
    document.getElementById("close-nav").style.transform = "0";
  }
  openNav(param?) {
    if (param != undefined) this.navMenu = false;
    else this.navMenu = true;
  }

  onFileChange(event) {
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
      this.filesAmount =
        event.target.files.length > 5 ? 5 : event.target.files.length;
      for (let i = 0; i < this.filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          if (event.target.result) {
            this.showImages.push(event.target.result);
          }
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  getUrl(url: any) {
    let hello = null;
    hello = URL.createObjectURL(url);
    return URL.createObjectURL(url);
  }

  async getAdDetailsCarier(adID) {
    this.dataService1.viewCarrierAdd(adID).subscribe(
      (product: any) => {
        this.carriarAd = product["data"];

        // this.sharedService.getPicuptLocation(this.carriarAd.carrier_from_location).subscribe((res) => {
          
          // this.longitude1 = res.geometry.location.lng();
          // this.latitude1 = res.geometry.location.lat();
        var latlng = new google.maps.LatLng(product["data"].carrier_latitude_from, product["data"].carrier_longitude_from);
        this.longitude1 = latlng.lng();
          this.latitude1 = latlng.lat();
          var map = new google.maps.Map(document.getElementById("map"), {
            center:  { lat: -33.8688, lng: 151.2195 },
            zoom: 13,
          });
          var infowindow = new google.maps.InfoWindow();
          var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(latlng.lat(), latlng.lng()),
            // position: new google.maps.LatLng(res.geometry.location.lat(), res.geometry.location.lng()),
            anchorPoint: new google.maps.Point(0, -29),
            animation: google.maps.Animation.DROP,
          });
          infowindow.close();
          marker.setVisible(false);
        // });
        // this.sharedService.getReceiverLocation(this.carriarAd.carrier_to_location).subscribe((res) => {
        //   this.longitude2 = res.geometry.location.lng();
        //   this.latitude2 = res.geometry.location.lat();
        var latlng2 = new google.maps.LatLng(product["data"].carrier_latitude_to, product["data"].carrier_longitude_to);
        this.longitude2 = latlng2.lng();
        this.latitude2 = latlng2.lat();
          var map = new google.maps.Map(document.getElementById("map"), {
            center:  { lat: -33.8688, lng: 151.2195 },
            zoom: 13,
          });
          var infowindow = new google.maps.InfoWindow();
          var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(latlng2.lat(), latlng2.lng()),
            // position: new google.maps.LatLng(res.geometry.location.lat(), res.geometry.location.lng()),
            anchorPoint: new google.maps.Point(0, -29),
            animation: google.maps.Animation.DROP,
          });
          infowindow.close();
          marker.setVisible(false);
        // });

        this.getTravellingTypes2(product["data"].traveling_by);
        this.getCategoriesType(product["data"].types);
        let catList = [];
        product["data"].types.forEach(ele => {
          let name = this.categories.find(x => x.title == ele.type_name);
          if (name) { 
            catList.push(name);
          }
        });
        this.selectedTag = catList;
        setTimeout(() => {}, 1000);
        if (product["data"].travelling_frequency == "Daily") {
          this.changeFreq(0);
        } else if (product["data"].travelling_frequency == "Some Days") {
          this.changeFreq(1);
        } else {
          this.changeFreq(2);
        }
      },
      (err: HttpErrorResponse) => {
      }
    );
  }

  PaymentAmount = "";
  Weight = "";
  category_idsList = [];
  selected_category = [];
  async getAdDetails(adID, userId) {
    this.dataService1.viewSenderAd(adID).subscribe(
      (product: any) => {
        this.adData = product["data"];
        this.senderAd = product["data"];
        localStorage.setItem("SendLocation", this.senderAd.delivery_location);
        // this.sharedService
        //   .getReceiverLocation(this.adData.delivery_location)
        //   .subscribe((res) => {
        //     this.longitude1 = res.geometry.location.lng();
        //     this.latitude1 = res.geometry.location.lat();
            
        var latlng = new google.maps.LatLng(this.adData.to_latitude, this.adData.to_longitude);
        this.longitude1 =latlng.lng();
            this.latitude1 = latlng.lat();
            var map = new google.maps.Map(document.getElementById("map1"), {
              center: { lat: -33.8688, lng: 151.2195 },
              zoom: 13,
            });
            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
              map: map,
              position: new google.maps.LatLng(latlng.lat(), latlng.lng()),
              // position: new google.maps.LatLng(res.geometry.location.lat(), res.geometry.location.lng()),
              anchorPoint: new google.maps.Point(0, -29),
              animation: google.maps.Animation.DROP,
            });
            infowindow.close();
            marker.setVisible(false);
          // });

        this.sharedService
          .getPicuptLocation(this.adData.pickup_location)
          .subscribe((res) => {
            
            for (let i = 0; i < res.address_components.length; i++) {
              let type = res.address_components[i].types.find((x) => x == 'country');
              if (type) {
                this.countryShortName = res.address_components[i].short_name;
                break;
               }
            }
            
            // this.latitude2 = res.geometry.location.lat();
            // this.longitude2 = res.geometry.location.lng();
            var latlng2 = new google.maps.LatLng(this.adData.from_latitude, this.adData.from_longitude);
            
            this.latitude2 = latlng2.lat();
            this.longitude2 = latlng2.lng();
            var map = new google.maps.Map(document.getElementById("map1"), {
              center: { lat: -33.8688, lng: 151.2195 },
              zoom: 13,
            });
            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
              map: map,
              position: new google.maps.LatLng(latlng2.lat(), latlng2.lng()),
              // position: new google.maps.LatLng(res.geometry.location.lat(), res.geometry.location.lng()),
              anchorPoint: new google.maps.Point(0, -29),
              animation: google.maps.Animation.DROP,
            });
            infowindow.close();
            marker.setVisible(false);
          });

        this.getTravellingTypes(product["data"].traveling_type);
        this.getdeliveryPriority(product["data"].delivery_priority_id);
        this.getCategoriesType(product["data"].types);
        let catList = [];
        product["data"].types.forEach(ele => {
          let name = this.categories.find(x => x.title == ele.type_name);
          if (name) { 
            catList.push(name);
          }
        });
        
        this.selectedTag = catList;
        if (this.adData.delivery_priority_id == "1") {
          this.onClickPriority(0);
        } else if (this.adData.delivery_priority_id == "2") {
          this.onClickPriority(1);
        } else if (this.adData.delivery_priority_id == "3") {
          this.onClickPriority(2);
        } else if (this.adData.delivery_priority_id == "4") {
          this.onClickPriority(3);
        }

        // let adImages = `http://pacsend.uk/public/uploads/adds/${product['data'].ad_image}`;
        if (product.adGallery) {
          let images = {
            imageName: "",
          };
          product.adGallery.forEach((img) => {
            if (img.image) {
              let adImages = `http://pacsend.uk/public/uploads/adds/${img.image}`;
              images.imageName = img.image;
              this.uploadedImagesSender.push(images);
              this.showImages.push(adImages);
            }
          });
        }

        this.PaymentAmount = product["data"].payment;
        this.Weight = product["data"].weight;
        this.type = this.adData.types[0].type_name;
        this.SenderForm.patchValue({
          title: this.adData.ad_title,
          category_ids: this.adData.types[0].type_name,
        });
      },
      (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message);
      }
    );
  }


  selectCategory(event) { 
    if (this.carier) {
      let id = this.category_idsList.find(x => x == event.id);
      if (!id) { 
        this.category_idsList.push(event.id);
      }
    } else { 
      let id = this.category_idsList.find(x => x == event.id);
      if (!id) { 
        this.category_idsList.push(event.id);
      }
    }
  }
  deSelectCategory(event) {
    let cusomteTagIdx =  this.customeCategoryList.findIndex(x => x.tempId == event.id);
    let idx = this.category_idsList.findIndex(x => x == event.id);
    this.customeCategoryList.splice(cusomteTagIdx, 1);
    this.category_idsList.splice(idx, 1);

    this.selectedTag.splice(idx, 1);
   }

  openCustomeCategoryField() {
    if (!this.isCutomeCategory) this.isCutomeCategory = true;
    else this.isCutomeCategory = false;
  }
  addCustomeCategory() {
    if (this.customeCategory == "" || !this.customeCategory) {
      this.settingService.Error("Enter tag value first!");
    } else {
      let category = {
        tempId: Math.floor(Math.random() * 10000),
        id: null,
        image: "",
        slug: this.customeCategory,
        title: this.customeCategory,
      };
      category.id = category.tempId;
      this.categories = [...this.categories, category];
      // this.categories.push(category);
      this.category_idsList.push(category.id);
      this.selectedTag = [...this.selectedTag, category];
      this.customeCategoryList.push(category);
      if (this.customeCategory != "" || this.customeCategory) {
        this.customeCategory = "";
      }
    }
  }

  private categoryIdsCheck() {
    if (this.category_idsList.length > 0) {
      this.category_idsList.forEach((element, index) => {
        let check = this.categories.find((ele) => ele.tempId == element);

        if (!check) {
          this.customeCategoryList = [];
        } else {
          if (this.customeCategoryList.length) {
            let cate = this.customeCategoryList.find(
              (x) => x.title == check.title
            );
            this.customeCategoryList.forEach((ele) => {
              if ((ele.tempId || ele.title) !== (check.tempId || check.title)) {
                this.customeCategoryList.push(check);
              }
            });
          } else {
            this.customeCategoryList.push(check);
          }
        }
        this.catIds =
          index == 0
            ? element.toString()
            : this.catIds + "," + element.toString();
      });
    }
  }

  private deleteEmptyCategoryIds() {
    if (this.customeCategoryList.length) {
      this.customeCategoryList.forEach((ele) => {
        delete ele.id;
      });
    }
    if (this.categories.length) {
      this.categories.forEach((ele) => {
        if (ele.id == "" || ele.id == null || ele.id == 0) {
          delete ele.id;
        }
      });
    }
  }

  DeleteImage() {
    this.showImages = [];
    this.images = [];
  }

  nextSlide(index) {
    if (index < this.showImages.length - 1) {
      this.imageIndex = index + 1;
    } else {
      this.imageIndex = this.showImages.length - 1;
    }
  }

  previousSlide(index) {
    if (index > 0) {
      this.imageIndex = index - 1;
    } else {
      this.imageIndex = 0;
    }
  }
}

interface PlaceData {
  description: string;
  lat: number;
  lng: number;
}
