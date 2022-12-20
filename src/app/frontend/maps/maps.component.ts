import { GoogleAdsService } from './../services/google-ads.service';
import { MapsAPILoader } from "@agm/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { zoomIn } from "ng-animate";
import { NzNotificationService } from "ng-zorro-antd";
import { NgxSpinnerService } from "ngx-spinner";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { SettingService } from '../../app.service';
import { UserProfileService } from "../user-profile/user-profile.service";
import { MapsService } from "./maps.service";
import { ChangeDetectorRef } from '@angular/core';
import { NgxStarsComponent } from 'ngx-stars';
import { SharedService } from '../services/shared.service';
@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"],
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
export class MapsComponent implements OnInit {
  @ViewChild(NgxStarsComponent, { static: false }) starsComponent: NgxStarsComponent;

  mrcURL: string = 'https://pacsend.app';

  form: FormGroup;
  zoomIn: any;
  disablefrontbtn: boolean = false;
  disabledbackbtn: boolean = true;
  frontSelfie: boolean = false;
  backSelfie: boolean = true;
  mapZoom: number = 13;
  lat: number = 25.0763802; //intial marker
  lng: number = 54.9468636; //intial marker
  rangeData: any;
  rangeData1: any;
  getLocations: any = [
    {
      latitude: 51.678418,
      longitude: 7.809007,
    },
    {
      latitude: 24.914061349967604,
      longitude: 67.01480114312658,
    },
    {
      latitude: 24.919082143179956,
      longitude: 67.03243934897807,
    },
    {
      latitude: 24.924920017804457,
      longitude: 67.0288773755336,
    },
    {
      latitude: 24.91351644538728,
      longitude: 67.02325546563934,
    },
  ];
  l = {
    hasProgressBar: false,
    loaderId: "mapLoader",
    logoSize: 80,
    isMaster: false,
    spinnerType: "ball-scale-multiple",
  };
  TagClass: string = "btn btn-info btn_tag_clicked m-t-b-5 font-bold mr-1 ";
  TagClass1: string = "btn btn-info btn-tag m-t-b-5 font-bold mr-1";
  userDetails = [];
  verifiedProfile = true;
  searchMap: any = null;
  mapclickdetails: any;

  location: any;

  filterSearch: boolean;
  textSearch = false;
  allUsers = [];
  Senders = [];
  Carriers = [];
  adType: number

  senderclass: boolean = false;
  carrierclass: boolean = false;
  allclass: boolean = false;

  // Multiple Divs For Header Navigation
  senderDiv = true;
  carrierDiv = false;
  allDiv = false;

  filter = {
    capacity: "",
    travelingTypeId: null,
    categories: [],
    payment: "",
  };

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
  AllSenderAds: any;
  AllCarrierAds: any;
  AllAds: any = [];
  singleAd: any;
  filterData: any;
  minWeight: number;
  maxWeight: number;
  minPayment: number;
  maxPayment: number;
  filterCat: any = [];
  selectedCat: any = [];
  searchFilterResult: number;

  //Ads
  googleAdsImage: string;
  googleAdsImageMapTop: string;
  googleAdsScript: (SafeHtml | any);
  options = {
    componentRestrictions: {}
  }
  addressGmap: any;
  googleAdsImageVerifyLeft: string;
  googleAdsImageVerifyRight: string;
  baseImageUrl = "https://pacsend.app/public/uploads/users/";
  mapBaseImageUrl = "https://pacsend.app/public/uploads/slots/";
  tagImgUrl = "https://pacsend.app/public/uploads/category/";
  adBaseImgUrl = 'https://pacsend.app/public/uploads/adds/';
  private geoCoder;
  address: any;
  loginUser:any
  constructor(
    private userProfileService: UserProfileService,
    private loader: NgxUiLoaderService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private dataService: MapsService,
    private modalService: NgbModal,
    private _notification: NzNotificationService,
    private _MapService: MapsService,
    private fb: FormBuilder,
    private SettingService: SettingService,
    private sharedService: SharedService,
    private router: Router,
    private googlAdsService: GoogleAdsService,
    private cdRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
  ) {
    this.loginUser = JSON.parse(localStorage.getItem("user"));
    if (!this.loginUser) { 
      this.getAllAds(400, 1);
      this.getAllAds(400, 2);
    }
   }

  ngOnInit() {
    let user: any = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.getAllAds(400, 1);
      this.getAllAds(400, 2);
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

    this.getPosition().then(pos => {
      this.lat = pos.lat;
      this.lng = pos.lng;
    });
    this.initform();
    this.filterSearch = false;

   
    if (localStorage.getItem("user") != null) {
      this.UserLogin = user;
      this.verificationbtn(user);
      if (user.id != undefined) {
        this.getOnlineUser(user.id);
      }
    } else {
    }

    //Look for Ads based of slot names
    this.googlAdsService.getAds().subscribe(data => {
      for (let element of data.data) {
        if (element.slot_name == "MapTop") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageMapTop = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
          break;
        }
      }
    });
    this.activeRoute.queryParams.subscribe((params) => {
      if (params.location) {
        this.location = params.location;
        this.textSearch = true;
        this.addressGmap = params.location;
        this.findAdress(params.location);
      }
    });

  }
  showLoder(id) {
    this.loader.startLoader(id);
    setTimeout(() => {
      this.loader.stopLoader(id);
    }, 1000);
  }
  usericon(item) {
    let Sendericon12 = {
      url:
        "https://pacsend.app/public/uploads/users/" +
        item.creater.image,
      scaledSize: { height: 50, width: 50 },
    };
    return Sendericon12;
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

  findLocation($event) {
    this.addressGmap = $event.name + " - " + $event.formatted_address;
    this.lat = $event.geometry.location.lat();
    this.lng = $event.geometry.location.lng();
    let change = true;
    localStorage.setItem("mapChange", JSON.stringify(change));
    localStorage.setItem("mapSearchLocation", $event.formatted_address);
    localStorage.setItem("mapSearchLongtitude", JSON.stringify($event.geometry.location.lng()));
    localStorage.setItem("mapSearchLatitude", JSON.stringify($event.geometry.location.lat()));

    if (this.senderclass == true) {
      this.getMarkers(10, this.AllSenderAds);
    } else if (this.carrierclass == true) {
      this.getMarkers(10, this.AllCarrierAds);
    } else if (this.allclass == true) {
      this.getMarkers(10, this.AllAds);
    }
  }
  findAdress(search) {

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autoComplete = new google.maps.places.Autocomplete(search)
      autoComplete.addListener("place_changed", () => {
        let place = autoComplete.getPlace();
        if (place.geometry === undefined || place.geometry === null) { 
          return;
        }

        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.zoomIn = 12;
      });
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoomIn = 8;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoomIn = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  refreshMap() {
    let change = localStorage.getItem("mapChange");
    this.lat = +localStorage.getItem("mapSearchLatitude");
    this.lng = +localStorage.getItem("mapSearchLongtitude");
    if (this.senderclass == true) {
      this.getMarkers(10, this.AllSenderAds);
    } else if (this.carrierclass == true) {
      this.getMarkers(10, this.AllCarrierAds);
    } else if (this.allclass == true) {
      this.getMarkers(10, this.AllAds);
    }

  }
  onEnter() {
    this.refreshMap();
  }
  postSendConnect(item) {
    this.modalService.dismissAll();
    let user: any = JSON.parse(localStorage.getItem("user"));
    if (user.is_verified == "0" || user.is_verified == "2") {
      this.SettingService.Info("Your account is not verified!!");
    } else {
      if (item) {
        this.router.navigate(["all-ads/sender-details/" + item]);
      } else {
        this.SettingService.Error("User Does not Exist");
        this.router.navigate(["404/"]);
      }
    }
  }
  postcarrierConnect(item) {
    this.modalService.dismissAll();
    let user: any = JSON.parse(localStorage.getItem("user"));
    if (user.is_verified == "0" || user.is_verified == "2") {

      this.SettingService.Info("Your account is not verified!!");

    } else {
      if (item) {
        this.router.navigate(["all-ads/carrier-details/" + item]);
        // this.router.navigate(['all-ads/sender-details/' + item]);
      } else {
        this.SettingService.Error("User Does not Exist");
        this.router.navigate(["404/"]);
      }
    }
  }

  goToProfilePage() {
    this.router.navigate(["/user-profile/" + this.UserLogin.id]);
  }

  getAllAds(count, type) {
    let body = {
      adsCount: count,
      adsType: type,
    };
    this._MapService.getAllSenderAds(body).subscribe((x: any) => {
      this.filteredMarkers = x.data;
      if (type == 2) {
        let location = [];
        let location1 = [];
        this.AllCarrierAds = x.data;
        x.data.forEach((element, index) => {
          if (element.carrier_from_location) {
            location = element.carrier_from_location.split(/[\s, ]+/);
            location1 = element.carrier_to_location.split(/[\s, ]+/);
            this.AllCarrierAds[index].from_Location = location[0];
            this.AllCarrierAds[index].to_Location = location1[0];
          }
        });
        x.data.forEach((element) => {
          this.AllAds.push(element);
        });

      }
      if (type == 1) {
        let location = [];
        let location1 = [];
        this.AllSenderAds = x.data;
        x.data.forEach((element, index) => {
          if (element.from_location) {
            location = element.from_location.split(/[\s, ]+/);
            location1 = element.location.split(/[\s, ]+/);
            this.AllSenderAds[index].fromLocation = location[0];
            this.AllSenderAds[index].toLocation = location1[0];
          }
        });
        x.data.forEach((element) => {
          this.AllAds.push(element);
        });
      }
    });
  }
  getSenderData(close?) {
    this.adType = 2;

    if(close == undefined){
      this.reset();
      if(this.filterSearch){
        this.filterModalData();
      }
    }
    this.senderclass = true;
    this.carrierclass = false;
    this.allclass = false;
    this.getMarkers(15, this.AllSenderAds);
    this.spinner.show();
  }
  getCarrierData(close?) {
    this.adType = 1;

    if(close == undefined){
      this.reset();
      if(this.filterSearch){
        this.filterModalData();
      }
    }
    this.senderclass = false;
    this.carrierclass = true;
    this.allclass = false;
    this.getMarkers(15, this.AllCarrierAds);
  }
  getAllData() {
    this.filterSearch = false;
    this.senderclass = false;
    this.carrierclass = false;
    this.allclass = true;
    this.getMarkers(15, this.AllAds);
  }
  getMarkers(area: number, markers?: any) {
    this.markers = markers; //original list of markers data
    this.mapsAPILoader.load().then(() => {
      const center = new google.maps.LatLng(this.lat, this.lng);
      //markers located within 50 km distance from center are included
      this.filteredMarkers = [];
      this.markers.filter((m) => {
        const distanceInKm =
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(+m.from_latitude, +m.from_longitude),
            center
          ) / 1000;
        if (distanceInKm < area) {
          this.filteredMarkers.push(m);
          return;
        }
      });
      this.mapZoom = 11.5;
      this.searchFilterResult = this.filteredMarkers.length;
      this.cdRef.detectChanges();
    });

  }

  initform() {
    this.form = this.fb.group({
      CNIC: [],
    });
  }

  setLOcation() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.array.push({
          lat: +pos.coords.longitude,
          lng: +pos.coords.latitude,
        });
      });
    }
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });

  }

  setVerification() {
    if (this.userDetails["is_verified"] == "0") {
      this.verifiedProfile = false;
    } else {
      this.verifiedProfile = true;
    }
  }
  getOnlineUser(id) {
    this.dataService.getUser(id).subscribe((data: any[]) => {
      this.userDetails = data["data"];
    });
  }

  getUserByMapClick(id) {
    this.dataService.getUser(id).subscribe((data: any[]) => {
      this.mapclickdetails = data["data"];
    });
  }

  clickedMarker(label: string, index: number) {
    alert(`User Id Is:` + label);
    this.getUserByMapClick(label);
  }

  getallUsers() {
    this.dataService.getALlUsers().subscribe((data: any[]) => {
      this.allUsers = data["data"];
    });
  }

  getsenderAds() {
    this.dataService.getsenderAds().subscribe((data: any[]) => {
      this.Senders = data["data"];
    });
  }

  getcarrierAds() {
    this.dataService.getcarrierAds().subscribe((data: any[]) => {
      this.Carriers = data["data"];
    });
  }

  mapSend() {
    this.allclass = false;
    this.senderclass = true;
    this.carrierclass = false;
    this.getsenderAds();
    this.senderDiv = true;
    this.carrierDiv = false;
    this.allDiv = false;
  }

  mapCarry() {
    this.allclass = false;
    this.senderclass = false;
    this.carrierclass = true;
    this.getcarrierAds();
    this.senderDiv = false;
    this.carrierDiv = true;
    this.allDiv = false;
  }

  mapAll() {
    this.allclass = true;
    this.senderclass = false;
    this.carrierclass = false;
    this.getallUsers();
    this.senderDiv = false;
    this.carrierDiv = false;
    this.allDiv = true;
  }

  verifyProfile(verifyProfileStepOne) {
    if (this.btnverify == "Verify Your Profile") {
      this.modalReference = this.modalService.open(verifyProfileStepOne, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    } else {
      this.SettingService.Info("Your profile is under verification process!");
    }
  }
  verificationstepTwo(verifyProfileStepTwo, profile?) {
    this.loader.startBackgroundLoader("saveButton");
    if (this.uploadfile.length == 0) {
      this.SettingService.Error("Profile Image cannot be empty");
      this.loader.stopBackgroundLoader("saveButton");
    } else {
      this.loader.stopBackgroundLoader("saveButton");
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
    this.loader.startBackgroundLoader("saveButton");

    if (this.frontselfiearray.length == 0) {
      this.SettingService.Error("Front Selfie cannot be empty.");
      this.loader.stopBackgroundLoader("saveButton");
    }
    if (this.backselfiearray.length == 0) {
      this.SettingService.Error("Back Selfie cannot be empty.");

      this.loader.stopBackgroundLoader("saveButton");
    } else {
      this.loader.stopBackgroundLoader("saveButton");
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(verifyProfileStepThree, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdrop: 'static',
        centered: true
      });
    }
  }
  verificationsuccessfull(verificationSuccessful) {
    this.loader.startBackgroundLoader("saveButton");

    if (this.form.controls["CNIC"].value == undefined) {
      this.SettingService.Error("National Id Number cannot be empty.");

      this.loader.stopBackgroundLoader("saveButton");
    }

    else {
      let formData = new FormData();

      formData.append("client_key", this.clientkey);
      formData.append("user_id", localStorage.getItem("userId"));
      formData.append("nic_no", this.form.controls["CNIC"].value);
      this._MapService.PostverificationStepThree(formData).subscribe(
        (res) => {
          this.SettingService.Success("National Id Number Saved Successfully..");
          if (res) {
            this.userProfileService
              .getUserProfile(this.UserLogin.id)
              .subscribe((res: any) => {
                localStorage.setItem("user", JSON.stringify(res["userData"]));
              });
            this.loader.stopBackgroundLoader("saveButton");
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
          this.SettingService.Error(err.message);
          this.loader.stopBackgroundLoader("saveButton");
        }
      );
    }
  }

  onClickFilter() {

    if (this.filterSearch == true) {
      this.filterSearch = false;
    } else {
      this.filterSearch = true;
     }
  }

  onClickSearch() {
    if (this.textSearch == true) {
      this.textSearch = false;
    } else {
      this.textSearch = true;
    }
  }

  onRemove(event) {
    this.uploadfile.splice(this.uploadfile.indexOf(event), 1);
  }
  UploadImage() {
    let formData = new FormData();
    formData.append("client_key", this.clientkey);
    formData.append("user_id", localStorage.getItem("userId"));
    var file = this.uploadfile[0];
    formData.append("image", file);
    this._MapService.PostverificationStepone(formData).subscribe(
      (res) => {
        this.loader.stopBackgroundLoader("saveButton");
        this.SettingService.Success("Image Upload Successfully..");
      },
      (err: HttpErrorResponse) => {
        this.loader.stopBackgroundLoader("saveButton");

        this.SettingService.Error(err.message);

      }
    );
  }

  onSelect($event) {
    this.loader.startBackgroundLoader("saveButton");
    this.uploadfile = [];
    this.uploadfile.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.SettingService.Error("Only Single Image Is Allowed..");
      this.uploadfile = [];
      this.loader.stopBackgroundLoader("saveButton");
    } else {
      this.UploadImage();
    }
  }

  onSelectFront($event) {
    this.loader.startBackgroundLoader("saveButton");

    this.frontSelfie = true;
    this.backSelfie = false;
    this.disablefrontbtn = true;
    this.disabledbackbtn = false;
    this.frontselfiearray.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.modalService.dismissAll();
      this.SettingService.Error("Only Single Image Is Allowed..");

      this.loader.stopBackgroundLoader("saveButton");
    } else {
      this.UploadImage();
    }
  }

  onSelectBack($event) {
    this.loader.startBackgroundLoader("saveButton");

    this.frontSelfie = true;
    this.backSelfie = true;
    this.disablefrontbtn = true;
    this.disabledbackbtn = true;
    this.backselfiearray.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.modalService.dismissAll();
      this.SettingService.Error("Only Single Image Is Allowed..");
      this.loader.stopBackgroundLoader("saveButton");
    } else {
      this.UploadImage();
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
    window.location.reload();
  }
  openSingleAd(singleAdView, ad) {
    this.loader.start();
    let body = {
      client_key: '',
      ad_id: ad.id,
      user_id: this.UserLogin.id
    };

    if(ad.ad_type == 1){
      this.adType = 2;
      this._MapService.getSenderAdDetail(body).subscribe((res: any) => {
        this.loader.stop();
        this.singleAd = res['data'];
      }, (error) => { 
        this.loader.stop();
        this.SettingService.Error(error.statusText + ': ' + error.error.message);
      });
  
    }else{
      this.adType = 1;
      this._MapService.getCarrierAdDetail(body).subscribe((res: any) => {
        this.loader.stop();
        this.singleAd = res['data'];
      }, (error) => { 
        this.loader.stop();
        this.SettingService.Error(error.statusText + ': ' + error.error.message);
      });
    }
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(singleAdView, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
        backdropClass: "backdrop-class",
        centered: true
      });


  }

  hideMe(){
    this.modalReference = this.modalService.dismissAll();
  }

  selectFilterCat(item, i) {
    if (this.filter.categories.length > 0) {
      let filter: any = this.filter.categories.findIndex((x) => x == item);
      if (filter < 0 || filter == null || filter == undefined) {
        this.filter.categories.push(item);
        this.filterCat[i] = true;
      } else {
        this.filter.categories.splice(filter, 1);
        this.filterCat[i] = false;
      }
    } else {
      this.filter.categories.push(item);
      this.filterCat[i] = true;
    }
  }

  filterModalData() {
    this._MapService.getFilterItemOnAdType(this.adType, this.lat, this.lng).subscribe((res) => {
      this.filterData = res;
      this.minWeight = +this.filterData.minWeight;
      this.maxWeight = +this.filterData.maxWeight;
      this.filter.capacity = this.filterData.minWeight;
      this.minPayment = +this.filterData.minPayment;
      this.maxPayment = +this.filterData.maxPayment;
      this.filter.payment = this.filterData.minPayment;

      this.filterData.categories.forEach((item, index) => {
        this.filterCat[index] = false;
      });
    this.filterSearch = true;
    this.cdRef.detectChanges();
    });
  }
  getTravelingTypeId(id) {
    this.filter.travelingTypeId = id;
  }
  search() {
    let filterDetail = {
      'client_key' : "",
      'how_many_ads' : "200",
      'ad_type' : this.adType,
      'filterstatus' : "0",
      'capacity' : this.filter.capacity,
      'catagory' : this.filter.categories,
      'latitude' : this.lat,
      'longitude' : this.lng,
      'traveling_type_id' : null,
      'traveling_by_id' : null
    }

    if(this.adType == 1){
      filterDetail.traveling_by_id = this.filter.travelingTypeId;
    }else{
      filterDetail.traveling_type_id = this.filter.travelingTypeId;
    }

    this._MapService.getALLFilteredSenderData(filterDetail).subscribe((res: any) => {
      let location = [];
      let location1 = [];
      if(this.adType == 1){
        this.AllCarrierAds = res.data;
        res.data.forEach((element, index) => {
          if (element.carrier_from_location) {
            location = element.carrier_from_location.split(/[\s, ]+/);
            location1 = element.carrier_to_location.split(/[\s, ]+/);
            this.AllCarrierAds[index].fromLocation = location[0];
            this.AllCarrierAds[index].toLocation = location1[0];
          }
        });
      }else {
        this.AllSenderAds = res.data;
        res.data.forEach((element, index) => {
          if (element.from_location) {
            location = element.from_location.split(/[\s, ]+/);
            location1 = element.location.split(/[\s, ]+/);
            this.AllSenderAds[index].from_Location = location[0];
            this.AllSenderAds[index].to_Location = location1[0];
          }
        });
      }
      this.filteredMarkers = res.data;
      res.data.forEach((element) => {
        this.AllAds.push(element);
      });

      if(this.adType == 1)
        this.getCarrierData(1);
      else
        this.getSenderData(1);

      this.filterSearch = false;
    });
  }
  reset() {
    this.searchFilterResult = undefined
    this.filter.categories = []
    this.filter.travelingTypeId = null
    this.filterModalData();
  }
  cancel() { 
    if (this.filterSearch == true) {
      this.filterSearch = false;
    } else {
      this.filterSearch = true;
     }
  }

  getCarrierAdsId(singleAd) {
    if (singleAd.as_id === '' || singleAd.as_id == undefined) {
      this.router.navigate(["map"]);
    } else {
      this.sharedService.getCarrierDetail(singleAd);
      // this.router.navigate(['all-ads/carrier-details/' + id]);
    }
  }
  getSenderAdsId(singleAd) {
    if (singleAd.ad_id === '' || singleAd.ad_id == undefined) {
      this.router.navigate(["map"]);
    } else {
      this.sharedService.getSenderDetail(singleAd);
      // this.router.navigate(['all-ads/sender-details/' + id]);
    }
  }
}
