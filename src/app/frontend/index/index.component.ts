import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MapsAPILoader } from '@agm/core';
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { IndexService } from './index.service';
import { LyResizingCroppingImages, ImgCropperConfig, ImgCropperEvent, ImgCropperErrorEvent } from '@alyle/ui/resizing-cropping-images';
import { LyTheme2, ThemeVariables, Platform } from '@alyle/ui';
import { NzNotificationService } from 'ng-zorro-antd';
import { HttpErrorResponse } from '@angular/common/http';
import { MapsService } from '../maps/maps.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { NavigationEnd, Router,Event as NavigationEvent,NavigationStart } from '@angular/router';
import { SettingService } from 'src/app/app.service';
import { MyAdService } from '../myads/myads.service';
import { Guid } from "guid-typescript";
import { zoomIn } from 'ng-animate';
import { transition, trigger, useAnimation } from '@angular/animations';
import { GoogleAds, GoogleAdsService } from '../services/google-ads.service';
import { TemplateRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FaqsService } from '../faqs/faqs.service';
import { TermsAndConditionService } from '../termsandconditions/termsandcondition.service';
import { PrivacyPolicyService } from '../privacypolicy/privacypolicy.service';
import { DOCUMENT } from '@angular/common';
// import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
const styles = ({
  actions: {
    display: 'flex'
  },
  cropping: {
    maxWidth: '825px',
    height: '400px',

  },
  flex: {
    flex: 1
  },
  range: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '14px'
  }
});
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  animations: [
    trigger('zoomIn', [transition('* => *', useAnimation(zoomIn, {
      // Set the duration to 5seconds and delay to 2seconds
      params: { timing: 0.5 }
    }))])
  ],
})
export class IndexComponent implements OnInit, AfterViewInit {

  aboutPacsendOptions: OwlOptions = {
    loop: true,
    lazyLoad: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    smartSpeed: 1000,
    autoplayTimeout: 7000,
    margin: 20,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  aboutPacsendLCP:boolean=true;
  HowContent:boolean=true;
  mrcURL: string = 'https://pacsend.app';
  // code for how to use tabs
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab4: boolean = false;
  tabCarrier1: boolean = true;
  tabCarrier2: boolean = false;
  tabCarrier3: boolean = false;
  tabCarrier4: boolean = false;
  @ViewChild('bannerTesting', { static: true }) content: TemplateRef<any>;
  //  modalRef: BsModalRef;
  @ViewChild('dashboardPopupBanner', { static: false }) dashboardPopupBanner: TemplateRef<any>;
  readonly classes = this.theme.addStyleSheet(styles);
  croppedImage?: string;
  result: string;
  scale: number;
  @ViewChild(LyResizingCroppingImages, { static: false }) cropper: LyResizingCroppingImages;
  myConfig: ImgCropperConfig = {
    autoCrop: true, // Default `false`
    width: 823, // Default `250`
    height: 400, // Default `200`

    fill: '#ff2997', // Default transparent if type = png else #000
    type: 'image/png' // Or you can also use `image/jpeg`
  };
  travellingFreq = [
    {
      check: false,
      class: 'col-12 text-left borderTravelling00'
    },
    {
      check: false,
      class: 'col-12 text-left borderTravelling11'
    },
    {
      check: false,
      class: 'col-12 text-left borderTravelling11'
    }];
  /* new sender ad object */

  senderVideoLink = 'https://www.youtube.com/embed/fd9LkXX9t3s';
  carrierVideoLink = 'https://www.youtube.com/embed/fd9LkXX9t3s';
  senderVidArray = ["https://www.youtube.com/embed/fd9LkXX9t3s", "https://www.youtube.com/embed/1OQ0gqJyKv0", "https://www.youtube.com/embed/vwp6uFFqgm8","https://www.youtube.com/embed/n6MAhvWgVbM"];
  carrierVidArray = ["https://www.youtube.com/embed/fd9LkXX9t3s", "https://www.youtube.com/embed/vwp6uFFqgm8", "https://www.youtube.com/embed/67Ok8diAqLw","https://www.youtube.com/embed/n6MAhvWgVbM"];


  /* new sender ad object */
  todayDate = moment(new Date()).format("YYYY-MM-DD")
  customDT = false;
  zoomIn: any;
  form: FormGroup
  disablefrontbtn: boolean = false
  disabledbackbtn: boolean = true
  frontSelfie: boolean = false;
  backSelfie: boolean = true;
  lat = 25.0763802;
  lng = 54.9468636;

  getLocations: any = [
    {
      lat: 51.678418,
      lng: 7.809007
    },
    {
      lat: 24.914061349967604,
      lng: 67.01480114312658
    },
    {
      lat: 24.919082143179956,
      lng: 67.03243934897807
    },
    {
      lat: 24.924920017804457,
      lng: 67.0288773755336,
    },
    {
      lat: 24.91351644538728,
      lng: 67.02325546563934
    },

  ]
  l = {
    hasProgressBar: true,
    loaderId: 'loader-01',
    logoSize: 80,
    isMaster: false,
    spinnerType: "ball-scale-multiple"
  }
  userDetails: any = [];
  verifiedProfile = true;

  mapclickdetails: any;

  filterSearch = true;
  textSearch = false;
  allUsers = [];
  Carriers = [];
  senderclass: boolean = false;
  carrierclass: boolean = false;
  allclass: boolean = false;
  carrierDiv = false;
  allDiv = false;
  getUserDetails = false;
  array = [];
  modalReference: any;
  uploadfile = [];
  frontselfiearray = [];
  backselfiearray = [];
  clientkey = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  @ViewChild('CNIC', { static: true }) cnic: ElementRef;
  hideverify: boolean;
  btnverify: string = "Verify Your Profile";
  hideprofile: boolean;
  filteredMarkers: any[];
  Sendericon = { url: 'https://img.icons8.com/bubbles/2x/user-male.png', scaledSize: { height: 50, width: 50 } }
  UserLogin: any;
  notifictionClass = 'BellIconSpan'
  searchcontrol: FormControl;
  categoryarrays = []
  DaysArray = []
  address;
  web_site;
  names;
  zip_code;
  zoom;
  selecteddays = []
  progress = '30%';
  SenderForm: FormGroup;
  CarrierForm: FormGroup;
  uploadfile1 = []
  deliveryPty: any = [];
  locationchange = false;
  username;
  userId;
  @ViewChild('Search', { static: true }) Search: ElementRef;
  isLogin;
  adtypes = [];
  adTypeId;
  public currentLocation;
  // Travelling Type
  travellingTypes = [];
  // Categirues
  categories = [];
  // Modal Reference
  // delivery priorities
  deliverypriority = [];
  showHeaderFooterComponent;
  routerurl;
  title = 'Pacsend';
  // settings = [];
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
  updated_at
  Image: any;
  carrier: any;
  Favicon: any;
  latitude: any;
  longitude: any;

  @ViewChild('searchmap', { static: true }) public searchmap: ElementRef;
  Title: any;
  BellMenuClass = 'BellMenuinActive'
  category_ids: number;
  weight: number;
  traveling_type_id: number;
  custom_date: any;
  delivery_priority_id: any = null;
  custom_time: any;
  Name: any;
  number: any;
  payment: any;
  LocationArray = []
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

  hideuser: boolean
  hidesec: boolean;
  travelType: any = [];
  avatar_image = "http://searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png"
  userVerfy: any;
  latitude1 = 24.912877841368648;
  longitude1 = 67.0235158710789;
  nicNo: any = null;
  latitude2 = 24.912877841368648;
  longitude2 = 67.0235158710789;

  dataAbout;
  dataWhyPacsend;
  dataHowContent;
  settings = [];
  agmIcon = { url: 'https://img.icons8.com/bubbles/2x/user-male.png', scaledSize: { height: 50, width: 50 } }
  asSender = true;
  asCarrier = false;
  clickSender: boolean = true;
  clickCarrier: boolean = false;
  showkmodal = false;
  sendertitle1;
  senderdesc_1;
  sendertitle2;
  senderdesc_2;
  sendertitle3;
  senderdesc_3;
  sendertitle4;
  senderdesc_4;
  carriertitle1;
  carrierdesc_1;
  carriertitle2;
  carrierdesc_2;
  carriertitle3;
  carrierdesc_3;
  carriertitle4;
  carrierdesc_4;
  carrier_image;
  sender_image;
  // Why Pacsend
  title1;
  desc_1;
  title2;
  desc_2;
  title3;
  desc_3;
  title4;
  desc_4;
  title5;
  desc_5;
  title6;
  desc_6;
  // Map
  @ViewChild('mapRef', { static: false }) mapElement: ElementRef;
  markers: any;
  // filteredMarkers: any;
  LoginuserId: number = +localStorage.getItem("userId")
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  map: any;
  clickSenderMap: boolean = false
  clickCarrierMap: boolean = false
  clickAllMap: boolean = false
  //Ads
  googleAdsImage: string;
  googleAdsImageHomeTop: string;
  // googleAdsImagePopupSlot: string;
  googleAdsImageHomeRight: string;
  googleAdsScript: (SafeHtml | any);
  keywords: any;
  senderAd: any;
  products: any;
  dataTerms: any;
  dataPrivacyPolicy: any;
  googleAdsImagePopupSlot: string;
  currentPage: string;
  aboutimage: any;
  AllCarrierAds: any;
  AllAds: any;
  AllSenderAds: any;
  mapZoom: number;
  searchFilterResult: any;
  addressGmap: string;
  imagesss: any;
  adType: number;
  alladsData: boolean;
  active_tab:any = 'all';
  googleAdsImageSenderAdRight: string;
  baseImageUrl = 'https://pacsend.app/public/uploads/users/';
  settingImageUrl = 'https://pacsend.app/public/uploads/setting/';


  constructor(private dataServicePri: PrivacyPolicyService,private dataServiceTerm: TermsAndConditionService,private dataServiceFaq: FaqsService,private dataService: IndexService, private mapsAPILoader: MapsAPILoader, private spinner: NgxSpinnerService,
    private componentFactoryResolver: ComponentFactoryResolver, private modalService: NgbModal, private theme: LyTheme2, private _MapService: MapsService,
    private settingService1: UserProfileService, private fb: FormBuilder, private dataMapService: MapsService, private router: Router, private settingService: SettingService,
    private googlAdsService: GoogleAdsService, private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
      if (localStorage.getItem('user') != null || localStorage.getItem('userId') != null) {
        this.router.navigateByUrl("all-ads");
      }
    localStorage.setItem("index", "indexpage");

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementsByClassName('container-fluid');
      document.getElementsByClassName('about-pacsend-900-1252');
      document.getElementsByClassName('container');
      document.getElementsByName('agm-map');
      document.getElementsByName('iframe');
    }
  }

  ngOnInit() {


    this.getAllAds(400, 1);
    this.getAllAds(400, 2);

    this.getPosition().then(pos => { //current location
      this.lat = pos.lat;
      this.lng = pos.lng;
    });
     window.scroll(0, 0);
    this.getWhyPacsend();
    this.getHowContent();
    this.getSetting();
    this.getAbout();
    this.getVideoLinks();
    this.getDataFaq();
    this.getTerms();
    this.getPrivacy();
    this.getPosition().then(pos => {
      this.lat = pos.lat;
      this.lng = pos.lng;

    });

    setTimeout(() => {
      this.aboutPacsendLCP= false;
    }, 800);

    setTimeout(() => {
      this.HowContent= false;
    }, 3000);

    this.senderVideoLink = "https://www.youtube.com/embed/fd9LkXX9t3s";

    this.renderMap();
    // this.getHowContent();
    // this.openBannerModal();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    // this.InitForms()
    //////////////////////////////////////////////////////
    this.todayDate;
    this.setLOcation();
    this.initform();
    this.filterSearch = false;
    if (localStorage.getItem('user') != null) {
      let user: any = JSON.parse(localStorage.getItem('user'));
      this.UserLogin = user;
      this.userDetails = user;
      if (user != undefined && user != null) {

        this.getUserProfile(user.id);
        this.getOnlineUser(user.id);
      }
    } else {
    }
    // this.notificationBell()
    this.checkUser();
    this.router.events.subscribe((val) => {
      if (val) {

      }
    })
    let user: any = JSON.parse(localStorage.getItem('user'));
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
    if (user == undefined || user == null) {
      this.hidesec = true
      this.isLogin = false
      this.avatar_image = "http://searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png"
    }
    else {
      this.hidesec = false
      this.isLogin = true
      if (user.image == null) {
        this.avatar_image = "http://searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png"
      } else {
        this.avatar_image = 'https://pacsend.app/public/uploads/users/' + user.image;
      }
    }


    // this.getDays();
    this.setLOcation();
    // this.InitForm();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.routerurl = e.url;
        this.getHeader();
      }
    });

    if (localStorage.getItem('user')) {
      let user: any = JSON.parse(localStorage.getItem('user'));
      if (user.id != undefined) {
        this.getOnlineUser(user.id);
        this.userId = user.id;
        this.username = user.username;
        this.userimage = user.image
      }
    } else {
    }

    //Look for Ads based of slot names
  
    this.googlAdsService.getAds().subscribe(data => {
      for (let element of data.data) {
        if (element.slot_name == "HomeTop") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageHomeTop = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
          break;
        }

        if (element.slot_name == "HomeRight") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageHomeRight = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }

        if (element.slot_name == "PopupSlot") {

          if (element.image != null && element.script == null) {
            this.googleAdsImagePopupSlot = element.image;

            if (localStorage.getItem('user') == null || localStorage.getItem('userId') == null) {
              setTimeout(() => {
                this.modalService
              const user = {
                id: 10
              };
              this.modalReference = this.modalService.open(this.dashboardPopupBanner, {
            });
              }, 6000);
            }


          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }
      }
    });

  }

  ads(){
     //Look for Ads based of slot names
     this.googlAdsService.getAds().subscribe(data => {
       for (let element of data.data) {
    
        if (element.slot_name == "HomeTop") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageHomeTop = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
          break;
        }

        if (element.slot_name == "HomeRight") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageHomeRight = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }

        if (element.slot_name == "PopupSlot") {

          if (element.image != null && element.script == null) {
            this.googleAdsImagePopupSlot = element.image;

            // if (localStorage.getItem('user') == null || localStorage.getItem('userId') == null) {
            //   setTimeout(() => {
            //     this.modalService
            //   const user = {
            //     id: 10
            //   };
            //   this.modalReference = this.modalService.open(this.dashboardPopupBanner, {
            // });
            //   }, 6000);
            // }


          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }
      }
    });
  }


  getVideoLinks() {
    this.carrierVidArray = [];
    this.senderVidArray = [];
    this.dataService.GetVideoLink().subscribe((res: any) => {
      if (res) {
        this.carrierVidArray.push(res.data.c_imbed_link_1);
        this.carrierVidArray.push(res.data.c_imbed_link_2);
        this.carrierVidArray.push(res.data.c_imbed_link_3);
        this.carrierVidArray.push(res.data.c_imbed_link_4);
        this.senderVidArray.push(res.data.s_imbed_link_1);
        this.senderVidArray.push(res.data.s_imbed_link_2);
        this.senderVidArray.push(res.data.s_imbed_link_3);
        this.senderVidArray.push(res.data.s_imbed_link_4);
      }

    })
  }

  getPrivacy() {
      this.dataServicePri.getPrivacyPolicy().subscribe((res: any) => {
        this.dataPrivacyPolicy = res['data'].description;
        localStorage.setItem('dataPrivacyPolicy', this.dataPrivacyPolicy);
      })
    }

  getTerms() {
    this.dataServiceTerm.getTermsCondition().subscribe((data: any) => {
      this.dataTerms = data['data'].description;
      localStorage.setItem('dataTerms',this.dataTerms);
      // this.terms.nativeElement.scrollIntoView({ top: 1, behavior: 'smooth' });

    })
  }

  loadMap = () => {
    if (!this.mapElement) {
      return
    }
    
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: { lat: 24.5373, lng: 81.3042 },
      zoom: 8
    });

    var marker = new window['google'].maps.Marker({
      position: { lat: 24.5373, lng: 81.3042 },
      map: map,
      title: 'Hello World!',
      draggable: true,
      animation: window['google'].maps.Animation.DROP,
    });



    var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h3 id="thirdHeading" class="thirdHeading">W3path.com</h3>' +
      '<div id="bodyContent">' +
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' +
      '</div>' +
      '</div>';

    var infowindow = new window['google'].maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function () {
      infowindow.open(map, marker);
    });

  }
  renderMap() {

    window['initMap'] = () => {
      this.loadMap()
      
    }
    if (!window.document.getElementById('google-map-script')) {
      var s = window.document.createElement("script");
      s.id = "google-map-script";
      s.type = "text/javascript";

      window.document.body.appendChild(s);
    } else {
      this.loadMap();
    }
  }


  clickSenderHow() {
    this.asSender = true;
    this.asCarrier = false;
    this.clickSender = true;
    this.clickCarrier = false;
  }
  clickCarrierHow() {
    this.asCarrier = true;
    this.asSender = false;
    this.clickSender = false;
    this.clickCarrier = true;
  }

  getWhyPacsend() {
    // this.ngOnInit();
    this.dataService.GetWhyPacsend().subscribe((data: any[]) => {
      this.dataWhyPacsend = data['data'];

      this.title1 = data['data'].title_1;
      this.desc_1 = data['data'].desc_1;

      this.title2 = data['data'].title_2;
      this.desc_2 = data['data'].desc_2;

      this.title3 = data['data'].title_3;
      this.desc_3 = data['data'].desc_3;

      this.title4 = data['data'].title_4;
      this.desc_4 = data['data'].desc_4;

      this.title5 = data['data'].title_5;
      this.desc_5 = data['data'].desc_5;

      this.title6 = data['data'].title_6;
      this.desc_6 = data['data'].desc_6;

    })
  }

 getHowContent() {
    this.dataService.GetHowContent().subscribe((data: any[] | any) => {

      this.dataHowContent = data['data'];


      this.carriertitle1 = data['data'].c_title_1;
      this.carrierdesc_1 = data['data'].c_desc_1;

      this.carriertitle2 = data['data'].c_title_2;
      this.carrierdesc_2 = data['data'].c_desc_2;

      this.carriertitle3 = data['data'].c_title_3;
      this.carrierdesc_3 = data['data'].c_desc_3;

      this.carriertitle4 = data['data'].c_title_4;
      this.carrierdesc_4 = data['data'].c_desc_4;



      this.sendertitle1 = data['data'].s_title_1;
      this.senderdesc_1 = data['data'].s_desc_1;

      this.sendertitle2 = data['data'].s_title_2;
      this.senderdesc_2 = data['data'].s_desc_2;

      this.sendertitle3 = data['data'].s_title_3;
      this.senderdesc_3 = data['data'].s_desc_3;

      this.sendertitle4 = data['data'].s_title_4;
      this.senderdesc_4 = data['data'].s_desc_4;

      this.carrier_image = data['data'].c_image_4;
      this.sender_image = data['data'].s_image_4;
      this.carrierVidArray.push(data.data.c_imbed_link_1);
      this.carrierVidArray.push(data.data.c_imbed_link_2);
      this.carrierVidArray.push(data.data.c_imbed_link_3);
      this.carrierVidArray.push(data.data.c_imbed_link_4);
      this.senderVidArray.push(data.data.s_imbed_link_1);
      this.senderVidArray.push(data.data.s_imbed_link_2);
      this.senderVidArray.push(data.data.s_imbed_link_3);
      this.senderVidArray.push(data.data.s_imbed_link_4);


    })
  }

  getAbout() {
    this.dataService.GetAbout().subscribe((data: any[]) => {
      this.dataAbout = data['data'].description;
      this.aboutimage = data['data'].image;
      localStorage.setItem('databout', this.dataAbout);
    });
  }

  getDataFaq() {
     this.ads();
  this.dataServiceFaq.sendGetRequest().subscribe((res: any) => {

    this.products = res['data'];
    localStorage.setItem('Faqproducts', JSON.stringify(this.products));
    // this.scrollToBottom()

  })
  }

  ////////////////////////////////////////////////////// CREATE AD FUNCTIONS //////////////////////////////////////////////////////

  ngAfterViewInit() {

    setTimeout(() => {
      window.scroll(0, window.scrollY + 10);
    }, 3000);

    if (Platform.isBrowser) {
      const config = {
        scale: 0.745864772531767,
        position: {
          x: 642.380608078103,
          y: 236.26357452128866
        }
      };
      if(this.cropper != undefined){
      this.cropper.setImageUrl(
        'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Flarm-rmah-47685-unsplash-1.png?alt=media&token=96a29be5-e3ef-4f71-8437-76ac8013372c',
        () => {
          this.cropper.setScale(config.scale, true);
          this.cropper.updatePosition(config.position.x, config.position.y);
          // You can also rotate the image
          // this.cropper.rotate(90);
        }
      );
      }
    }

  }


  dropdown() {
    if (this.BellMenuClass == 'BellMenuinActive') {
      this.BellMenuClass = 'BellMenuActive'
    } else {
      this.BellMenuClass = 'BellMenuinActive'
    }

  }
  getUserProfile(id) {
    this.settingService1.getUserProfile(id).subscribe((x: any) => {
      this.userVerfy = x.userData;
    })
  }


  checkUser() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    if (user && user.is_verified) {
      if (user.is_verified == "1" && user.is_verified !== undefined) {
        this.hideuser = true
        this.isLogin = false
        this.hidesec = false
      }
      else {
        this.hideuser = false
        this.isLogin = true
        this.hidesec = false
      }
    }
    else {
      this.isLogin = true
      this.hidesec = false
      this.hideuser = false
    }

  }



  getId(id) {
    if (id === '') {
    } else {
      this.router.navigate(['user-profile/' + id]);
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = "/";
  }


  onSelectNewAd(option, event) {
    this.adTypeId = option.id;
  }


  getHeader() {
    if (this.routerurl === "/login") {
      this.showHeaderFooterComponent = false;
    } else if (this.routerurl === "/sign-up") {
      this.showHeaderFooterComponent = false;
    } else if (this.routerurl === "/verification") {
      this.showHeaderFooterComponent = false;
    } else {
      this.showHeaderFooterComponent = true;
    }
  }


  onSelect($event) {

    this.uploadfile.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.uploadfile = []
      this.settingService.Error("Only 1 Image Is Allowed..");
    }
    else {
    }
  }


  getSetting() {

    this.settingService.getSettings().subscribe((data: any[]) => {
      this.settings = data['data'];
      this.id = data['data'].id;
      this.name = data['data'].name;
      this.meta_description = data['data'].meta_description;
      this.footer_content = data['data'].footer_content;
      this.logo = data['data'].logo;
      this.favicon = data['data'].favicon;
      this.notification_switch = data['data'].notification_switch;
      this.footer_logo = data['data'].footer_logo
      this.footer_description = data['data'].footer_description;
      this.footer_copy_right = data['data'].footer_copy_right;
      this.fb_link = data['data'].fb_link;
      this.twitter_link = data['data'].twitter_link;
      this.linkden_link = data['data'].linkden_link;
      this.youtube_link = data['data'].youtube_link;
      this.home_img_1 = data['data'].home_img_1;
      this.home_img_2 = data['data'].home_img_2;
      this.created_at = data['data'].created_at;
      this.updated_at = data['data'].updated_at;

    })
  }

  onClickAbout() {
    this.router.navigateByUrl('about');
  }
  onClickFaqs() {
    this.router.navigateByUrl('faqs');
  }
  onClickTerms() {
    this.router.navigateByUrl('terms-and-condition');
  }
  onClickPrivacy() {
    this.router.navigateByUrl('privacy-policy');
  }
  onClickLogin() {
    this.router.navigateByUrl('login');
  }
  onClickMap() {
    this.router.navigateByUrl('map');
  }
  onClickMyAds() {
    this.router.navigateByUrl('my-ads');
  }
  onClickAllAds() {
    this.router.navigateByUrl('all-ads');
  }
  onClickChat() {
    localStorage.removeItem('ChatAdId');
    this.router.navigateByUrl('chat');
  }
  onClickFav() {
    this.router.navigateByUrl('favourites');

  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  UploadImageFrontandBack() {
    let formData = new FormData;
    formData.append("client_key", this.clientkey);
    formData.append("user_id", localStorage.getItem("userId"));
    let file1 = this.frontselfiearray[0];
    let file2 = this.backselfiearray[0];
    formData.append("id_card_front", file1);
    formData.append("id_card_back", file2);

    this._MapService.PostverificationStepTwo(formData).subscribe(res => {
      this.settingService.Success("Id Image Upload Successfully..");

    }, (err: HttpErrorResponse) => {
      this.settingService.Error(err.message);
    })
  }
  UploadImage() {
    let formData = new FormData;
    formData.append("client_key", this.clientkey);
    formData.append("user_id", localStorage.getItem("userId"));
    let file = this.uploadfile[0]
    formData.append("image", file);
    this._MapService.PostverificationStepone(formData).subscribe(res => {
      this.settingService.Success("Image Upload Successfully..");

    }, (err: HttpErrorResponse) => {
      this.settingService.Success(err.message);

    })
  }

  onEnter(condi) {
    if (condi) {
      this.latitude2 = +localStorage.getItem("Receiveratitude")
      this.longitude2 = +localStorage.getItem("ReceiverLongtitude");
    } else if (!condi) {
      this.latitude1 = +localStorage.getItem("SendLatitude")
      this.longitude1 = +localStorage.getItem("SendLongtitude");
    } else {
      this.latitude1;
      this.longitude1;
    }
  }
  setVideo(type: any, id: any) {
    if (type == 'sender') {
      this.senderVideoLink = this.senderVidArray[id];
    }
    else {
      this.carrierVideoLink = this.carrierVidArray[id];
    }
  }

  findRecAdress(search) {

    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13
    });
    var Input = document.getElementById('searchmaps');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(Input);
    var autocomplete = new google.maps.places.Autocomplete(search);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
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

      for (var i = 0; i < place.address_components.length; i++) {
        if (place.address_components[i].types[0] == 'postal_code') {
        }
        if (place.address_components[i].types[0] == 'country') {
        }
      }
      localStorage.setItem("ReceiverLocation", place.formatted_address)
      localStorage.setItem("ReceiverLongtitude", JSON.stringify(place.geometry.location.lng()))
      localStorage.setItem("Receiveratitude", JSON.stringify(place.geometry.location.lat()))

    });
  }

  setLOcation() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.array.push({
          longitude: +pos.coords.longitude,
          latitude: +pos.coords.latitude,
        })
      });
      this.setOtherLocation();
    }
  }



  setOtherLocation() {
    this.LocationArray.push({
      longitude: localStorage.getItem("MapLongtitude"),
      latitude: localStorage.getItem("SendLatitude")
    })
  }

  viewprofile() {
    const userid = localStorage.getItem("userId")
    this.router.navigate(['user-profile/', userid])
  }

  findAdress(search) {
    var map = new google.maps.Map(document.getElementById('map1'), {
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
      localStorage.setItem("SendLocation", place.formatted_address)
      localStorage.setItem("SendLongtitude", JSON.stringify(place.geometry.location.lng()))
      localStorage.setItem("SendLatitude", JSON.stringify(place.geometry.location.lat()))
    });
  }

  OpenFeedback(feedback) {
    this.modalReference = this.modalService.open(feedback, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });
  }
  onClick() {
    this.router.navigateByUrl("spinner")
  }
  /* ///////////////////////////////////////////////modal logics ////////////////////////////////////////////////////////// */


  initform() {
    this.form = this.fb.group({
      CNIC: []
    })
  }

  getOnlineUser(id) {
    this.dataMapService.getUser(id).subscribe((data: any[]) => {
      this.userDetails = data['data'];
    })
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


  getallUsers() {
    this.dataMapService.getALlUsers().subscribe((data: any[]) => {
      this.allUsers = data['data'];
    })
  }

  verifyProfile(verifyProfileStepOne) {
    this.modalReference = this.modalService.open(verifyProfileStepOne, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });
  }
  verificationstepTwo(verifyProfileStepTwo, profile?) {
    if (this.uploadfile.length == 0) {
      this.settingService.Error("Profile Image Cannot Be Empty");
    }
    else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(verifyProfileStepTwo, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });
    }

  }
  verificationstepThree(verifyProfileStepThree) {

    if (this.frontselfiearray.length == 0) {
      this.settingService.Error("Front Selfie Cannot Be Empty.");
    }
    if (this.backselfiearray.length == 0) {
      this.settingService.Error("Back Selfie Cannot Be Empty.");
    }
    else {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(verifyProfileStepThree, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });
    }

  }
  verificationsuccessfull(verificationSuccessful) {
    if (this.nicNo == null) {
      this.settingService.Error("National Id Number Cannot Be Empty.");
    } else if (this.nicNo.toString().length < 8) {
      this.settingService.Error("National Id Number Is Too Short.");
    } else {
      let formData = new FormData;

      formData.append("client_key", this.clientkey);
      formData.append("user_id", localStorage.getItem("userId"));
      formData.append("nic_no", this.nicNo.toString());
      this._MapService.PostverificationStepThree(formData).subscribe(
        (res) => {
          this.settingService.Success("National Id Number Saved Successfully..");
          if (res) {
            this.settingService1
              .getUserProfile(this.UserLogin.id)
              .subscribe((res: any) => {
                localStorage.setItem("user", JSON.stringify(res.userData));
              });
          }
          this.btnverify = "Your profile is pending to approval!";
          this.modalService.dismissAll();
          this.modalReference = this.modalService.open(verificationSuccessful, {
            ariaLabelledBy: "modal-basic-title",
            windowClass: "modal-width",
          });
        }, (err: HttpErrorResponse) => {
          this.settingService.Error(err.message);
        })
    }
  }



  onRemove(event) {
    this.uploadfile.splice(this.uploadfile.indexOf(event), 1);
  }
  onSelectFront($event) {
    this.frontSelfie = true;
    this.backSelfie = false
    this.disablefrontbtn = true;
    this.disabledbackbtn = false;
    this.frontselfiearray.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.modalService.dismissAll();
      this.settingService.Error('Only Single Image Allowed..');
    }
  }

  onSelectBack($event) {
    this.frontSelfie = true;
    this.backSelfie = true
    this.disablefrontbtn = true;
    this.disabledbackbtn = true;
    this.backselfiearray.push(...$event.addedFiles);
    if (this.uploadfile.length > 1) {
      this.modalService.dismissAll();
      this.settingService.Error('Only Single Image Allowed..');
    }
    else {
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
      this.settingService.Error('Front Selfie cannot be empty.');

    } else {
      this.frontSelfie = true;
      this.backSelfie = false;
    }
  }

  backImage() {
    if (this.backselfiearray.length == 0) {
      this.settingService.Error('Back Selfie Cannot Be Empty.');
    } else {
      this.frontSelfie = true;
      this.backSelfie = true
    }

  }

  hidebutton() {
    this.hideverify = true
    window.location.reload();
  }
  reset() {
    localStorage.removeItem('ReceiverLocation');
    localStorage.removeItem('Receiveratitude');
    localStorage.removeItem('ReceiverLongtitude');
    localStorage.removeItem('SendLocation')
    localStorage.removeItem('SendLatitude');
    localStorage.removeItem('SendLatitude');
    this.croppedImage = null;
  }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    let name: any = Guid.create()
    let file = new File([this.b64toBlob(e.dataURL)], name.toString(), { type: e.type });
    this.senderAd.image = file;
  }

  b64toBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  onloaded(e: ImgCropperEvent) {
  }
  onerror(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('mapButtons'));
  }

  croperModal(CropperModal) {
    this.modalReference = this.modalService.open(CropperModal, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });

  }

  RouteToAllAds() {
    this.modalService.dismissAll()
    this.router.navigateByUrl('all-ads');
  }

  changeTab(tab: string) {
    if (tab === 'tab1') {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
    }
    else if (tab == 'tab2') {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tab4 = false;
    }
    else if (tab == 'tab3') {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tab4 = false;
    }
    else {
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = true;
    }
  }

  changeCarrierTab(carrierTab: string) {
    if (carrierTab === 'tab1') {
      this.tabCarrier1 = true;
      this.tabCarrier2 = false;
      this.tabCarrier3 = false;
      this.tabCarrier4 = false;
    }
    else if (carrierTab == 'tab2') {
      this.tabCarrier1 = false;
      this.tabCarrier2 = true;
      this.tabCarrier3 = false;
      this.tabCarrier4 = false;
    }
    else  if (carrierTab == 'tab3') {
      this.tabCarrier1 = false;
      this.tabCarrier2 = false;
      this.tabCarrier3 = false;
      this.tabCarrier4 = false;
    }
    else {
      this.tabCarrier1 = false;
      this.tabCarrier2 = false;
      this.tabCarrier3 = false;
      this.tabCarrier4 = true;
    }
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
        if (!this.AllAds) {
          this.AllAds = []
        }
        this.AllAds.push(element);
      });

    }
    if (type == 1) {
      let location =
      console.log("FilteredMarkersd getAllads11 type 1",this.filteredMarkers);
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
        if (!this.AllAds) {
          this.AllAds = []
        }
        this.AllAds.push(element);
      });
    }
    this.filteredMarkers = x.data;
  });
}

getSenderData(close?) {
  this.active_tab = 'sender';
  this.alladsData=false;
  this.adType = 2;
  this.senderclass = true;
  this.carrierclass = false;
  this.allclass = false;
  this.getMarkers(15, this.AllSenderAds);
  this.spinner.show();
}
getCarrierData(close?) {
  this.active_tab = 'carrier';
  this.alladsData=false;
  this.adType = 1;
  this.senderclass = false;
  this.carrierclass = true;
  this.allclass = false;
  this.getMarkers(15, this.AllCarrierAds);
}

  getAllData() {
    this.active_tab = 'all';
    this.alladsData=true;
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

        this.filteredMarkers.push(m);
        return;
        /*if (distanceInKm < area) {
          this.filteredMarkers.push(m);
          return;
        }*/
      });
      this.mapZoom = 11.5;
      this.searchFilterResult = this.filteredMarkers.length;
      this.cdRef.detectChanges();
      console.log('this.filteredMarkers')
      console.log(this.filteredMarkers)
    });

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
      this.getMarkers(15, this.AllSenderAds);
    } else if (this.carrierclass == true) {
      this.getMarkers(15, this.AllCarrierAds);
    } else if (this.allclass == true) {
      this.getMarkers(15, this.AllAds);
    }
  }
 }

interface PlaceData {
  description: string,
  lat: number,
  lng: number,
}

