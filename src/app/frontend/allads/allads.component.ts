import { SettingService } from './../../app.service';
import { ChangeDetectorRef, Component, HostListener, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from './allads.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AngularFirestore } from '@angular/fire/firestore';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserProfileService } from '../user-profile/user-profile.service'
import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { transition, trigger, useAnimation } from '@angular/animations';
import { zoomIn } from 'ng-animate';
import { MyAdService } from '../myads/myads.service';
import { interval } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SharedService } from '../services/shared.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-allads',
  templateUrl: './allads.component.html',
  styleUrls: ['./allads.component.css'],
  animations: [
    trigger("zoomIn", [
      transition(
        "* => *",
        useAnimation(zoomIn, {
          params: { timing: 0.5 },
        })
      ),
    ]),
  ],
})
export class AlladsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('navigationRestricted', { static: false }) navigationRestricted: TemplateRef<any>;
  @ViewChild('navigationLogin', { static: false }) navigationLogin: TemplateRef<any>;
  zoomIn: any;
  mrcURL: string = 'https://pacsend.app';
  userDetails: any;
  userVerfy: any;
  boolval: boolean = false;
  disabled: boolean = false
  Carrierform: FormGroup
  form: FormGroup
  longitude1 = 67.0235158710789;
  latitude1 = 24.912877841368648;
  latitude2 = 24.912877841368648;
  longitude2 = 67.0235158710789;
  products = [];
  carriers = [];
  senders = [];
  filter = {
    toLongitude: '',
    toLatitude: '',
    fromLongitude: '',
    fromLatitude: '',
    state: '',
    city: '',
    sender: '',
    carrier: '',
    custom_date: '',
    capacity: '',
    type: null,
    user_id: null,
    categories:[]
  }
  AllSenders = [];
  AllCarrier = [];
  scrollDistance = 6;
  scrollUpDistance = 2;
  throttle = 30;
  direction = '';
  scrollDisable: boolean = true;
  senderads = false;
  allads = true;
  carrierads = false;
  searchForm;
  clickSender = false;
  l = {
    hasProgressBar: false,
    loaderId: 'Ad-Loader',
    logoSize: 80,
    isMaster: false,
    overlayColor: "rgba(40,40,40,0)",
    spinnerType: "ball-scale-multiple"
  }
  clickCarrier = false;
  clickAll = true;
  clientid = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  userId: number;
  tags = []
  btntext = "Connect"
  btntextcarry = "Connect"
  user: any;
  private _fb: any;
  ExactData: any = [];
  NonExactData: any = [];
  page: number = 1;
  pageSize: any;
  type: number;
  NonExactDataCarrier = []
  ExactDataCarrier = []
  NonExactDataCarrierAll = []
  ExactDataCarrierAll = []
  ExactDataSenderAll = []
  NonExactDataSenderAll = []
  btnText = [];
  device: string;
  deviceInfo = null;
  showCarrierMobile: boolean;
  modalReference: any;
  carrier_feedback: any;
  rating: any;
  ratingSender: any;
  actRout: any;
  SearchFrom: string;
  result: any;
  login: string;
  fillLocation: boolean;
  searched: any;
  count: number;
  cTotal: any;
  sTotal: any;
  preTotalSender: any;
  preTotalCarier: any;
  imageUrl = "https://pacsend.app/public/uploads/users/";
  tagImgUrl = "https://pacsend.app/public/uploads/category/";
  adBaseImgUrl = 'https://pacsend.app/public/uploads/adds/';
  categoryDropdownSettings:IDropdownSettings={};
  categories = [];
  isSearch:boolean = false;
  senderDataBackup: any[];
  carrierDataBackup: any[];

  constructor(private httpClient: HttpClient,
    private loader: NgxUiLoaderService,
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder,
    private SettingService: SettingService,
    private db: AngularFirestore,
    private sharedService: SharedService,
    private UserProfileService: UserProfileService,
    private deviceService: DeviceDetectorService,
    private modalService: NgbModal,
    private settingService: SettingService,
    private cdRef: ChangeDetectorRef,
    private myAdService:MyAdService) {
    this.epicFunction();
  }

  ngOnDestroy(): void {
  }
  
  ngOnInit() {
    this.categoryDropdownSettings = { 
      idField: 'id',
      textField: 'title',
      allowSearchFilter: true,
      limitSelection: 4
    }
    this.newDataCheck();
    localStorage.removeItem("search");
    this.login=localStorage.getItem("reload");;

    if (this.login == "1") {
      localStorage.setItem("reload", "0");
      window.location.reload();
    }
    this.initForm1();
    this.initform();

    this.getsenderadsMethod();
    this.getcarreradsMethod();
    this.getCategoriesType();
    this.CheckNotificationFromFireStore();
    this.dataService.alladRequest().subscribe((data) => {
      window.scrollTo(0, 30);
    })

    this.user = JSON.parse(localStorage.getItem("user"));

    this.myAdService.getAlladsActive();
    this.userId = Number(localStorage.getItem("userId"))
    this.UserProfileService.getUserProfile(this.userId).subscribe((x: any) => {
      this.userDetails = x.userData;
    })
    this.dataService.getPosition().then(pos => {
      localStorage.setItem("longitude", pos.lng)
      localStorage.setItem("latitude", pos.lat)
    });
   setTimeout(() => {
    window.scroll(0,0);
    this.onScroll();
    },1000)
   localStorage.removeItem("longitude");
   localStorage.removeItem("latitude");

   localStorage.removeItem("filterSendLongtitude");
   localStorage.removeItem("filterSendLatitude");
  }

  getCategoriesType() {
    this.settingService.getCategories().subscribe((res: any[]) => {
      this.categories = res["data"];
    });
  }
  navigationRestrictionPopup() {
    if (this.user && (this.user.is_verified == '0' || this.user.is_verified == '2')) {
      this.modalReference = this.modalService.open(this.navigationRestricted, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' });
    }
  }
  ngOnChanges() {
    this.cdRef.detectChanges();
    this.getcarreradsMethod();
    this.getsenderadsMethod();

  }
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.device = this.deviceInfo.os;
    if (this.device == 'Android' || this.device == 'iOS')
      this.showCarrierMobile = false;
  }
  getsenderadsMethod() {
    if (this.allAds || this.senderads) {
      this.dataService.allsenderRequest(this.page).subscribe((data) => {
        var sendertmpData = data['data'];
        this.preTotalSender=data['total'];
        sendertmpData.forEach((sender) => {
          let checkAdIdx = this.senders.findIndex((ad) => ad.ad_id == sender.ad_id);
          if (checkAdIdx != -1) { 
            this.senders[checkAdIdx] = sender;
          }
          else {
            this.senders.push(sender);
          }
        });
        if (!this.type) { 
          this.senderDataBackup = this.senders;
        }
        if (this.senders.length % 10 !== 0) {
          this.scrollDisable = true;
        } else {
          this.scrollDisable = false;
        }
      })
    }
    this.cdRef.detectChanges();
  }
  getcarreradsMethod() {
    if (this.allAds || this.carrierads) {
      this.dataService.allcarrierRequest(this.page).subscribe((data) => {
        let tmpData = data['data'];
        this.preTotalCarier=data['total'];
        tmpData.forEach((carrier) => {
          let checkAdIdx = this.carriers.findIndex((ad) => ad.ad_id == carrier.ad_id);
          if (checkAdIdx != -1) {
            this.carriers[checkAdIdx] = carrier;
          }
          else { 
            this.carriers.push(carrier);
          }
        });
        if (!this.type) { 
          this.carrierDataBackup = this.carriers;
        }
        if (this.carriers.length % 10 !== 0) {
          this.scrollDisable = true;
        } else {
          this.scrollDisable = false;
        }
      })
    }
    this.cdRef.detectChanges();
  }

  newDataCheck(){
    let longitude1 = localStorage.getItem("longitude");
    let latitude2 = localStorage.getItem("latitude");
     let form = new FormData();
     form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
     form.append("longitude", longitude1);
     form.append("latitude", latitude2);
     form.append("page", "1");
      //  const checkNewData= interval(15000);
      //  checkNewData.subscribe(res=>{
         const data= this.httpClient.post('https://pacsend.app/api/v1/carier-sender-total', form);
         data.subscribe(x=>{
           this.cTotal=x['total carrier'];
           this.sTotal = x['total sender'];  
      //  })
     })
     }

  onScroll() {
    this.searched=localStorage.getItem("search");
    if(this.searched!=1){
    this.page = (this.page + 1);
    this.getcarreradsMethod();
    this.getsenderadsMethod();
  }
   else{
    }
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
      carrier: '',
      custom_date: '',
      capacity: '',
      type: null,
      user_id: null,
      categories:[]
    }
    this.dataService.allsenderRequest(this.page).subscribe(data => {
      this.NonExactData = [];
      this.ExactData = [];
      this.senders = data['data'];
    });
    this.dataService.allcarrierRequest(this.page).subscribe((data) => {
      this.NonExactDataCarrier = [];
      this.ExactDataCarrier = [];
      this.carriers = data['data'];
    });
    this.isSearch = false;
    this.NonExactDataCarrierAll = [];
    this.ExactDataCarrierAll = [];
    this.ExactDataSenderAll = [];
    this.NonExactDataSenderAll = [];
    localStorage.removeItem("filterSendLocation");
    localStorage.removeItem("filterSendLongtitude");
    localStorage.removeItem("filterSendLatitude");
    localStorage.removeItem("filterLocation");
    localStorage.removeItem("filterLongtitude");
    localStorage.removeItem("filterLatitude");
    localStorage.removeItem("search");
    window.location.reload();
  }
  initForm1() {
    this.searchForm = this.fb.group({
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      senderId: ['', Validators.required],
      PriorityId: ['', Validators.required],
      date: ['', Validators.required]
    })
    this.form = this.fb.group({
      user_id: [],
      client_key: [],
      ad_id: []
    })
  }
  initform() {
    this.form = this.fb.group({
      user_id: [],
      client_key: [],
      ad_id: []
    })

    this.Carrierform = this.fb.group({
      user_id: [],
      client_key: [],
      ad_id: []
    })
  }

  getSenderId(item) {
    if (item.ad_id === '') {
      this.router.navigate(["404/"]);
    } else {
      if (this.user && (this.user.is_verified == 2 || this.user.is_verified == 0)) {
        this.navigationRestrictionPopup();
      } else {
        this.sharedService.getSenderDetail(item)
        // this.router.navigate(['all-ads/sender-details/' + id]);

      }
    }
  }

  getCarrierId(item) {
    if (item.ad_id === '') {
      this.router.navigate(["404/"]);
    } else {
      if (this.user && (this.user.is_verified == 2 || this.user.is_verified == 0)) {
        this.navigationRestrictionPopup();
      } else {
        this.sharedService.getCarrierDetail(item)
        // this.router.navigate(['all-ads/carrier-details/' + id]);
      }
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

  onEnter(condi) {
    if (condi) {
      this.latitude2 = +localStorage.getItem("Receiveratitude");
      this.longitude2 = +localStorage.getItem("ReceiverLongtitude");
    } else if (!condi) {
      this.latitude1 = +localStorage.getItem("SendLatitude");
      this.longitude1 = +localStorage.getItem("SendLongtitude");
    } else {
      this.latitude1;
      this.longitude1;
    }
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
    this.isSearch = true;
    this.loader.start();
    if (this.type == 1) {
      this.filter.type = 2
    }
    else if (this.type == 2) {
      this.filter.type = 1
    }
    else {
      this.filter.type = 3
    }
    this.filter.toLongitude = localStorage.getItem("filterLongtitude");
    this.filter.toLatitude = localStorage.getItem("filterLatitude");
    this.filter.fromLongitude = localStorage.getItem("filterSendLongtitude");
    this.filter.fromLatitude = localStorage.getItem("filterSendLatitude");
    this.filter.user_id = localStorage.getItem('userId');
  
  if (this.filter.toLongitude==null && this.filter.toLatitude==null && this.filter.fromLongitude==null && this.filter.fromLatitude==null){
    this.SettingService.Info("Please fill From or To Laction");
   }
  else {
    this.dataService.senderFilterData(this.filter).subscribe((res: any) => {
     if (this.type == 2) {
        if (res.sender_data.length == 0) {
          this.SettingService.Info(
            " oops!!! we did not find your suitable search, please try refining your critirea."
          );
        } else {
          this.SettingService.Info("Success!");
          this.wantToSendSearchResult(res);
        }
      }
      else if(this.type == 1){ 
        if (res.carrier_data.length == 0) {
          this.SettingService.Info(
            " oops!!! we did not find your suitable search, please try refining your critirea."
          );
        }
        else {
          this.SettingService.Info("Success!");
          this.wantToCarrySearchResult(res);
        }
      }
      else {
        if (res.carrier_data.length == 0 && res.sender_data.length == 0) {
          this.SettingService.Info(
            " oops!!! we did not find your suitable search, please try refining your critirea."
          );
        }
        else {
          this.SettingService.Info("Success!");
          this.allAdsSearchResult(res);
        }
      }
      this.cdRef.detectChanges();
    })
    }
    setTimeout(() => {
      this.loader.stop();
    }, 1000);
  }

  allAdsSearchResult(res) {
    this.carriers = [];
    this.senders = [];
      this.NonExactDataCarrierAll = res.carrier_data.filter(
        (x) => x.is_exact == false
      );
      this.ExactDataCarrierAll = res.carrier_data.filter(
        (x) => x.is_exact == true
      );
      this.NonExactDataSenderAll = res.sender_data.filter(
        (x) => x.is_exact == false
      );
      this.ExactDataSenderAll = res.sender_data.filter(
        (x) => x.is_exact == true
      );
      this.cdRef.detectChanges();
  }
  wantToCarrySearchResult(res) {
    this.ExactDataCarrierAll = [];
    this.NonExactDataCarrierAll = [];
    this.ExactDataSenderAll = [];
    this.NonExactDataSenderAll = [];
    this.carriers = [];
    this.senders = [];
    if (res.carrier_data) { 
      this.NonExactDataCarrier = res.carrier_data.filter(
        (x) => x.is_exact == false
      );
      this.ExactDataCarrier = res.carrier_data.filter(
        (x) => x.is_exact == true
      );
    }
   
    this.cdRef.detectChanges();
  }

  wantToSendSearchResult(res) {
    this.ExactDataCarrierAll = [];
    this.NonExactDataCarrierAll = [];
    this.ExactDataSenderAll = [];
    this.NonExactDataSenderAll = [];
    this.carriers = [];
    this.senders = [];
    if (res.sender_data) {
      this.NonExactData = res.sender_data.filter(
        (x) => x.is_exact == false
      );
      this.ExactData = res.sender_data.filter(
        (x) => x.is_exact == true
      );
     }
   
    this.cdRef.detectChanges();
 
  }

  carrierAds() {
    this.loader.start();
    // this.loader.startLoader('Ad-Loader');
    this.allads = false;
    this.senderads = false;
    this.carrierads = true;
    this.clickSender = false;
    this.clickCarrier = true;
    this.clickAll = false;
    this.type = 1;
    this.ExactData = [];
    this.NonExactData = [];
    this.getcarreradsMethod();
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.loader.stop();
      // this.loader.stopLoader('Ad-Loader')
    }, 1000);
  }
  senderAds() {
    this.loader.start();
    // this.loader.startLoader('Ad-Loader');
    this.allads = false;
    this.senderads = true;
    this.carrierads = false;
    this.clickSender = true;
    this.clickCarrier = false;
    this.clickAll = false;
    this.type = 2;
    this.NonExactDataCarrier = [];
    this.ExactDataCarrier = [];
    this.getsenderadsMethod();
    setTimeout(() => {
      this.loader.stop();
      // this.loader.stopLoader('Ad-Loader')
    }, 1000);
  }
  allAds() {
    // this.loader.startLoader('Ad-Loader');
    this.loader.start();
    this.allads = true;
    this.senderads = false;
    this.carrierads = false;
    this.type = 3;
    this.clickSender = false;
    this.clickCarrier = false;
    this.clickAll = true;
    this.senders = this.senderDataBackup;
    this.carriers = this.carrierDataBackup;
    this.ExactDataCarrierAll = [];
    this.NonExactDataCarrierAll = [];
    this.ExactDataSenderAll = [];
    this.NonExactDataSenderAll = [];
    setTimeout(() => {
      // this.loader.stopLoader('Ad-Loader')
      this.loader.stop();
    }, 1500);
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

  postSenderConnect(item) {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.user) {
      this.navigationLoginPopup()
    } else {
      if (this.user && (this.user.is_verified == 2 || this.user.is_verified == 0)) {
        this.navigationRestrictionPopup();
      } else {
        if (item.requested_is_connect == 1) {
          this.SettingService.Info("Request already sent")
        }
        else {
          this.loader.start()

          this.disabled = true;

          this.UserProfileService.getUserProfile(this.userId).pipe(
            finalize(() => {
              this.loader.stop();
            })
          )
            .subscribe((x: any) => {
              this.userVerfy = x.userData;
              if (this.userVerfy.is_verified == 1) {
                let userid = localStorage.getItem("userId")
                let obj = {
                  user_id: userid,
                  client_key: this.clientid,
                  ad_id: Number(item.ad_id)
                }
                this.dataService.postSenderConnect(obj).subscribe(
                  (res) => {
                    localStorage.setItem("SenderRequest", JSON.stringify(1));
                    localStorage.setItem("AdId", item.ad_id);
                    this.SettingService.Success("Request Sent Successfully");
                    if (this.isSearch) {
                      if (this.NonExactDataSenderAll.length) {
                        for (let i = 0; i < this.NonExactDataSenderAll.length; i++) {
                          if (
                            this.NonExactDataSenderAll[i].ad_id == item.ad_id
                          ) {
                            this.NonExactDataSenderAll[i].requested_is_connect = "1";
                            this.cdRef.detectChanges();
                          }
                        }
                      }
                      if (this.ExactDataSenderAll.length) {
                        for ( let i = 0; i < this.ExactDataSenderAll.length; i++) {
                          if (this.ExactDataSenderAll[i].ad_id == item.ad_id) {
                            this.ExactDataSenderAll[i].requested_is_connect = "1";
                            this.cdRef.detectChanges();
                          }
                        }
                      }
                    }
                    else {
                      this.dataService
                        .allsenderRequest(this.page)
                        .subscribe((data) => {
                          this.senders = data["data"];
                          this.cdRef.detectChanges();
                        });
                    }
                    this.disabled = false;
                  },
                  (err: HttpErrorResponse) => {
                    this.SettingService.Error(err.message);
                  }
                );
              }
              else {
                this.SettingService.Error("Ad Does not Exist")
                this.router.navigate(["404/"]);
              }
            });

        }
      }
    }
  }

  postcarrierConnect(item) {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.user) {
      this.navigationLoginPopup()
    }
    else {
      if (item.requested_is_connect == 1) {
        this.SettingService.Info("Request already sent")
      }
      else {
        this.loader.start()

        this.disabled = true;

        this.UserProfileService.getUserProfile(this.userId).pipe(
          finalize(() => {
            this.loader.stop();
          })
        )
          .subscribe((x: any) => {
            this.userVerfy = x.userData;
            if (this.userVerfy.is_verified == 1) {
              let userid = localStorage.getItem("userId")
              let obj = {
                user_id: userid,
                client_key: this.clientid,
                ad_id: Number(item.ad_id)
              }
              this.dataService.postcarrierConnect(obj)
                .subscribe(res => {
                  this.SettingService.Success("Request Sent Successfully");
                  if (this.isSearch) {
                    if (this.NonExactDataCarrierAll.length) {
                      for (let i = 0; i < this.NonExactDataCarrierAll.length; i++) { 
                        if (this.NonExactDataCarrierAll[i].ad_id == item.ad_id) { 
                          this.NonExactDataCarrierAll[i].requested_is_connect = "1";
                          this.cdRef.detectChanges();
                        }
                      }
                    }
                    if (this.ExactDataCarrierAll.length) {
                      for (let i = 0; i < this.ExactDataCarrierAll.length; i++) { 
                        if (this.ExactDataCarrierAll[i].ad_id == item.ad_id) { 
                          this.ExactDataCarrierAll[i].requested_is_connect = "1";
                          this.cdRef.detectChanges();
                        }
                      }
                     }
                  }
                  else { 
                    this.dataService.allcarrierRequest(this.page).subscribe((data) => {
                      this.carriers = data['data'];
                      this.cdRef.detectChanges();
                    });
                  }
                });
            }
            else {
              if (this.user && (this.user.is_verified == 2 || this.user.is_verified == 0)) {
                this.navigationRestrictionPopup();
              } else {
                this.router.navigate(["404/"]);
              }
            }
          });
      }
    }
  }

  navigationLoginPopup() {
      this.modalService.dismissAll();
      this.modalReference = this.modalService.open(this.navigationLogin, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width', backdrop: 'static' });
    }
  
  backToLogin() {
    this.loader.start();
    setTimeout(() => {
      this.loader.stop();
      this.router.navigateByUrl("/login");  
    }, 500);
    
  }
  selectCategory(event) { 
    this.filter.categories.push(event.id);
    // this.filter.categories.push(event);
  }
  deSelectCategory(event) { 
    let index = this.filter.categories.findIndex(x => x == event.id); 
    this.filter.categories.splice(index, 1)
  }
}
