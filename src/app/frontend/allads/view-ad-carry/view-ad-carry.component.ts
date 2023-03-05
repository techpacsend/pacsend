import { SettingService } from './../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataService } from '../allads.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { GoogleAdsService } from '../../services/google-ads.service';
import { SafeHtml } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxStarsComponent } from 'ngx-stars';
import { MyAdService } from '../../myads/myads.service'
import { SharedService } from '../../services/shared.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-view-ad-carry',
  templateUrl: './view-ad-carry.component.html',
  styleUrls: ['./view-ad-carry.component.css']
})
export class ViewAdCarryComponent implements OnInit, AfterViewInit {

  mrcURL: string = 'https://pacsend.app';
  @ViewChild("feedback", { static: true }) feedback: ElementRef;
  @ViewChild(NgxStarsComponent, { static: false }) starsComponent: NgxStarsComponent;
  buttondisable:boolean = false;
  myStatus = false;
  clicked: any;
  alreadyReported: boolean = false;
  ratingSubmit: boolean = false;
  forUserDetails: any;
  hideLCP: boolean;
  imageBaseUrl = 'https://pacsend.app/public/uploads/users/';
  notificationMessage: any;

  GetWishlList() {
    this.myStatus = false
    this.dataService.GetAllWishlist().subscribe(res => {
      res['data'].carrier.map(add => {
        if (add['ad_id'] == this.adID) {
          this.myStatus = true
        }
      })
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message);
    })
  }

  reports: any;
  selectedId: any;

  RatingClick() {
    this.ratingSubmit = true;
  }

  travelTypeSelect(i) {
    this.selectedId = i;
    this.travellingTypes.forEach((element, index) => {
      this.travelType[index] = false;
    });
    this.travelType[i] = true;
  }


  GetaddRepot() {
    if (this.hideReport) {
      this.hideReport = false;
    } else {
      this.loader.start();
      this.dataService.getReport().subscribe(res => {
        this.hideReport = true;
        this.myStatus = false
        this.reports = res['data'];
        this.loader.stop();
      }, (err: HttpErrorResponse) => {
        this.loader.stop();
        this.SettingService.Error(err.message);
      });
    }
  }
  adReport(id) {
    this.dataService.addReport(this.adID, 2, id).subscribe((res: any) => {
      this.SettingService.Success(res.message)
      this.alreadyReported=true
      this.hideReport = !this.hideReport;
      this.loader.stop();
    },
    (error) => { 
      this.loader.stop();
      this.SettingService.Error('Report not submitted')
    });
    this.cdRef.detectChanges();
  }
  clientid = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  btntextcarry = "";
  connectBtn = '';
  set = ""
  adID: any; //Getting id from URL
  adData: any; //Getting details
  userData: any; //User Data
  addTypes: any // Ad Type
  travellingTypes: any //Travelling type
  deliveryPriority: any // Delivery Priority
  assignedCategories: any // Assigned Categories
  form: FormGroup
  hideconenct: boolean;
  hiderequest: boolean = true
  firstname: any;
  disbaled: boolean;
  btnStatus = "Picked Up"
  hideyes: boolean = true
  hidetrack: boolean = true;
  hidestatus: boolean = true;
  Deliveries = []
  isoffer: number;
  userid: string;
  reached: any;
  is_deliver: number;
  offererid: string;
  pickupstatus: number;
  receiverid: any;
  modalReference: any;
  VerificationForem: FormGroup;
  receiver_id: any;
  track_status: any;
  user_id: any;
  disbaledstatusbtn: boolean
  carrierfromlocation: any;
  carriertolocation: any;
  fromtime: any;
  totime: any;
  weight: any;
  aduser_id: any;
  interestedcard: boolean;
  initerestedlist = []
  senderDetail: any;
  packagesCarried: any;
  packagesSent: any;

  cancelRequested = false;
  showCancelBtn = false;
  disableCancelBtn = false;
  hidewaitingtoaccept: boolean = false;
  hidepickedupli: boolean = false;
  hidereachedli: boolean = false;
  hideverifypinli: boolean = false;
  hidedelieveredli: boolean = false;
  hidedealdoneli: boolean = false;
  hidedileverybtn: boolean = true;
  acceptrequest: any;
  condition: boolean;
  FeedbackForm: FormGroup;
  subscription: Subscription
  pointofcontactnumber: any;
  pointofcontactname: any;
  showpointofContact: boolean;
  pickupUserId: number;
  toUserId: number;
  hidemainyes: boolean = true
  hidefeedback: boolean = true;
  googleAdsImage: string;
  googleAdsImageCarrierRight: string;
  googleAdsImageCarrierTop: string;
  userId: number;
  cancelDealWith: string;
  showCancelCard: boolean = false;

  googleAdsScript: (SafeHtml | any);
  counter: any;
  PostSenderConnectFirebase: any;
  hideShareButtons: boolean = false;
  dealcancelled: any;
  heartClicked: string;
  travelType: any = [];
  hideReport: any;
  loginuser: any
  pickUpAlert: boolean;
  deliveryAlert: boolean;
  page_url : any;

  constructor(private actRoute: ActivatedRoute,
    private dataService: DataService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private db: AngularFirestore,
    private SettingService: SettingService,
    private googlAdsService: GoogleAdsService,
    private loader: NgxUiLoaderService,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
    private myAdService: MyAdService)
  {
    this.page_url = this.router['location']._platformLocation.location.origin+router.url;
    this.loginuser = JSON.parse(localStorage.getItem("user"));
    // this.adID = this.actRoute.snapshot.params['id'];
    this.adID = localStorage.getItem("carrierDetailsId")
    if (!this.loginuser) {
      this.getAdDetails(this.adID);
     }
  }
  loginUserId: any;
  ngOnInit() {

    setTimeout(() => {
      localStorage.removeItem("filterSendLocation");
      localStorage.removeItem("filterSendLongtitude");
      localStorage.removeItem("filterSendLatitude");
      localStorage.removeItem("filterLocation");
      localStorage.removeItem("filterLongtitude");
      localStorage.removeItem("filterLatitude");
    }, 60000);

    setTimeout(() => {
      this.hideLCP = true;
      window.scrollTo(0, 1);
    }, 2000);

    this.CheckNotificationFromFireStore('oninit')
    this.showCancelBtn = false
    this.heartClicked = 'CardIcons';
    this.userId = Number(localStorage.getItem("userId"));
    this.loginuser = JSON.parse(localStorage.getItem("user"));
    this.googlAdsService.getAds().subscribe(data => {
      for (let element of data.data) {
        if (element.slot_name == "CarrierViewTop") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageCarrierTop = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }

          break;
        }
      }
    });

    this.googlAdsService.getAds().subscribe(data => {
      for (let element of data.data) {
        
        if (element.slot_name == "CarrierViewRight") {
          if (element.image != null && element.script == null) {
            this.googleAdsImage = element.image;
            
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
          break;
        }
      }
    });
    this.adID = localStorage.getItem("carrierDetailsId");
    this.initform();
    this.GetWishlList()
    // this.getAdDetails(this.adID)
    this.GetInterestedLIst();
    this.GetNotificationFirebase();
    localStorage.setItem("page", "adDetail");
    this.myAdService.getAlladsActive();
  }

  copyMessage(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.page_url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngAfterViewInit() {

  }
  check(event) { 
    if (event == 'open') {
      this.hideShareButtons = false;
    }
    else { 
      this.hideShareButtons = true
    }
  }

  initform() {
    this.form = this.fb.group({
      user_id: [],
      client_key: [],
      ad_id: []
    })
    this.VerificationForem = this.fb.group({
      verification: []
    })
    this.FeedbackForm = this.fb.group({
      review: [],
      rating: [],

      rating1: [],
      rating2: [],
      rating3: [],
      rating4: [],
      rating5: [],

    })
  }

  GetNotificationFirebase() {
    this.db.collection("Notification", ref => ref
      .where("isRead", "==", 0)
      .orderBy("createdAt", "asc"))
      .snapshotChanges().subscribe((querySnapshot) => {
        let userId = localStorage.getItem("userId")
        // this.getAdDetails(this.adID);
        this.GetInterestedLIst();

      })
  }


  PostSenderConnectyesFirebase(message: string) {
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.aduser_id,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 2,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    });
  }

  confirmDeliveryNotification(message:any) { 
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.pickupUserId,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 2,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    });
  }

  dealDoneNotificationForSender(message: any) {
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.pickupUserId,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 2,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    });
  }
  dealDoneNotificationForCarrier(message: any) {
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.aduser_id,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 2,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    });
  }
  PostCarryConnectFirebase() {
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.aduser_id,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: "Connection request received from" + ' ' + user.fname + ' ' + user.lname,
      createdAt: new Date(),
      updatedAt: "",
      adType: 2,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    })
  }

  CancelRequestAccept(status) {
    if(this.buttondisable == true){
      return false;
    }
    this.buttondisable = true;
    this.dataService.CancelRequestCarrierAdAccept(this.adID, this.aduser_id, this.toUserId, status).subscribe((res: any) => {
      this.buttondisable = false;
      if (status == 0) {
        this.cancelFirebaseNotification();
        this.cancelRequested = false;
        this.showCancelBtn = true;
        if (this.userid == this.user_id)
          this.hidestatus = false;
        this.disbaledstatusbtn = false;
      }
      else {
        this.hidestatus = true;
        this.cancelRequested = false;
        // this.hidefeedback=false;
      }
      this.SettingService.Success(res.message)
      this.cdRef.detectChanges();
      // this.ngOnInit()
    });
  }

  SendCancelRequest(cancelRequestSent) {
    this.showCancelBtn = false;
    this.showCancelCard = true;
    this.showCancelBtn = false;
    let user_type_id
    if (this.aduser_id == this.userId) {
      user_type_id = 1;
    } else {
      user_type_id = 0;
    }
    if(this.buttondisable == true){
      return false;
    }
    this.buttondisable = true;
    this.dataService.SendCarrierAdCancelRequest(this.adID, this.aduser_id, this.toUserId, user_type_id).subscribe((res: any) => {
      this.buttondisable = false;
      this.modalReference = this.modalService.open(cancelRequestSent, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
      this.showCancelCard = true;
      this.showCancelBtn = false;
      this.hidestatus = true;
      this.disableCancelBtn = true;
      this.SettingService.Success('Cancel request has been sent');
      this.cancelFirebaseNotification();
      this.cdRef.detectChanges();
    });
  }

  postCarryConnect() {
    var btnname = document.getElementById("button");
    if (this.btntextcarry == "Chat") {
      this.router.navigate(["/chat"], { queryParams: { adType:this.adData.ad_type, userChatId: this.adID } });
    }
    else if (this.btntextcarry == "Requested has been rejected") {
      this.router.navigateByUrl("/all-ads")
    }
    else if (this.connectBtn == "Connect") {
      if(this.buttondisable == true){
        return false;
      }
      this.buttondisable = true;
      let userId = localStorage.getItem("userId")
      this.form.controls['user_id'].setValue(userId);
      this.form.controls['client_key'].setValue(this.clientid);
      this.form.controls['ad_id'].setValue(Number(this.adID));
      this.dataService.postcarrierConnect(this.form.value).subscribe(res => {
        this.buttondisable = false;
        this.SettingService.Success("Request Sent Successfully")
        localStorage.setItem("CarrierRequest", JSON.stringify(1))
        localStorage.setItem("CarryAdId", this.adID);
        this.btntextcarry = "Waiting for approval";
        this.disbaled = true;
        this.PostCarryConnectFirebase();
        this.cdRef.detectChanges();
      }, (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message)
      })
    }
  }

  PostDealProcessYes() {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    this.notificationMessage = 'You pickup for ad ' + this.adData.title + ' on ' + todayDate + ' is confirmed by ' + user.fname + ' ' + user.lname;
    if(this.buttondisable == true){
      false;
    }
    this.buttondisable = true;

    this.dataService.POSTPickeuppckageforcarrier(this.adID).subscribe(res => {
      this.buttondisable = false;
      this.hidetrack = false;
      this.hidestatus = true;
      this.hideyes = true
      this.disbaledstatusbtn = false
      this.hidemainyes = false
      this.hidepickedupli = true;
      this.btnStatus = "Reached the destination"
      this.SettingService.Success("Success")
      this.PostSenderConnectyesFirebase(this.notificationMessage);
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    });
  }

  PostDealProcessNo() {
    this.notificationMessage = 'No pickup for ad ' + this.adData.title;  
    if(this.buttondisable == true){
      return false;
    }
    this.buttondisable = true;
    this.dataService.packageNotPickedCarrier(this.adID).subscribe(res => {
      this.buttondisable = false;
      this.hideyes = true
      this.showCancelBtn = true;
      this.disbaledstatusbtn = false
      this.hidemainyes = false
      this.hidepickedupli = false;
      this.SettingService.Success("Success")
      this.PostSenderConnectyesFirebase(this.notificationMessage);
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    });
  }

  PostDealProcessDel(data?) {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    this.notificationMessage = 'Delivery confirmed by sender on ' + todayDate + ' for ad ' + this.adData.title  + ' by ' + user.fname + ' ' + user.lname;
    if(this.buttondisable == true){
      return false
    }
    this.buttondisable = true;
    
    this.dataService.POSTDileveredforcarrier(this.adID, this.user_id).subscribe(res => {
      this.buttondisable = false;
      this.hidedileverybtn = true;
      this.hidestatus = false;
      this.btnStatus = "Deal Done";
      if (+localStorage.getItem('userId') !== +this.aduser_id && this.adData.ad_type == 2) {
        this.hidefeedback = false;
      }
      else {
        this.hidefeedback = true;
      }
      this.disbaledstatusbtn = true
      this.SettingService.Success("Success")
      this.PostSenderConnectyesFirebase(this.notificationMessage);
      this.dealDoneNotificationForSender('Deal Done Successfully for ad ' + this.adData.title + ' on ' + todayDate + '. Please rate carrier');
      this.dealDoneNotificationForSender('Deal Done Successfully for ad ' + this.adData.title + ' on ' + todayDate);
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    });
  }

  CheckNotificationFromFireStore(param) {
    this.db.collection("NotificationTesting", ref => ref
      .orderBy("createdAt", "asc"))
      .valueChanges().subscribe((querySnapshot) => {
        let filteredData = querySnapshot.filter(fill => fill['toUserId'] == +localStorage.getItem("userId"))
        if (filteredData.length > 0) {
          this.GetInterestedLIst()
        }
      })
  }
  PostNotificationFromFireStore(message:any) {
    ///////////////////////////////////////firebase works///////////////////////////////////////
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.pickupUserId,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 2,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    })
    ///////////////////////////////////////firebase works///////////////////////////////////////
  }

  PostDealProcess(verificationmodal) {
    let btnname = document.getElementById("button1");
    let btntext = btnname.textContent;
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    
    switch (this.btnStatus) {
      case "Picked Up":
        this.notificationMessage = 'Your package is picked up by ' + user.fname + ' ' + user.lname + ' on ' + todayDate + ' for ad ' + this.adData.title + '. Please confirm Pickup.';
        this.loginUserId=localStorage.getItem("userId");
        this.pickUpAlert = true;
        if(this.buttondisable == true){
          return false;
        }
        this.buttondisable = true;
        this.dataService.POSTPickeuppckageforcarrierReq(this.adID, this.pickupUserId).subscribe(res => {
          this.buttondisable = false;
          if (res) {
            this.PostNotificationFromFireStore(this.notificationMessage);
            this.showCancelBtn = false;
            this.disbaledstatusbtn = true
            this.btnStatus = "Reached the destination";
            this.SettingService.Success("Success")
            this.hideyes = true
            this.hidemainyes = false
          }
          this.cdRef.detectChanges();
        }, (err: HttpErrorResponse) => {
          this.SettingService.Error(err.message)
        });
        break;

      case "Reached the destination":
        this.notificationMessage = 'Your package on ad ' + this.adData.title + ' has reached the destinaion';
        this.dataService.POSTReachedlocationforcarrier(this.adID, this.receiverid).subscribe(res => {
          if (res) {
            this.btnStatus = "Verification PIN";
            this.SettingService.Success("Success")
            this.hidereachedli = true;
            this.PostNotificationFromFireStore(this.notificationMessage);
            this.PostSenderConnectyesFirebase('Please verify pin for ad ' + this.adData.title);
          }
          this.cdRef.detectChanges();
        }, (err: HttpErrorResponse) => {
          this.SettingService.Error(err.message)
        });
        break;
      case "Verification PIN":
        this.modalReference = this.modalService.open(verificationmodal, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
        break;
      default:
        break;
    }
  }

  postVerify() {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    this.notificationMessage = 'Pin verified by carrier for ad ' + this.adData.title + ' on ' + todayDate + ' by ' + user.fname + ' ' + user.lname;
    var textvalue = this.VerificationForem.controls['verification'].value;
    if(this.buttondisable == true){
      return false;
    }
    this.buttondisable = true;
    this.dataService.POSTVarificationforcarrier(this.adID, this.receiverid, textvalue).subscribe((res: any) => {
      this.buttondisable = false;
      if (res.status === "error") {
        this.SettingService.Error(res.message);
        this.hidestatus = false
      }
      else {
        this.SettingService.Success("Success");
        
        this.hidestatus = true;
        this.deliveryAlert = true;
        // this.hidetrack = true
        this.hideverifypinli = true;
        this.PostNotificationFromFireStore(this.notificationMessage);
        this.PostSenderConnectyesFirebase('You have verified the pin for ad ' + this.adData.title + ' on ' + todayDate);
        this.confirmDeliveryNotification('Your package has marked as delivered for ad ' + this.adData.title + ' on ' + todayDate + ' by ' + user.fname + ' ' + user.lname + '. Plese confirm delivery.');
        this.modalService.dismissAll();
        this.cdRef.detectChanges();
      }
    }
      , (err: HttpErrorResponse) => {
        this.SettingService.Error('Invalid Pin Code')
      });
  }

  ClickDelieveryUser(userDetail, userid,i) {

    if(i==0){
      this.clicked = 0;
    }
   else if(i==1){
      this.clicked = 1;
    }
    else if(i==2){
      this.clicked = 2;
    }
    else if(i==3){
      this.clicked = 3;
    }
    else if(i==4){
      this.clicked = 4;
    }
    if (this.adData.carrier_feedbacks.length) {
      for (let i = 0; i < this.adData.carrier_feedbacks.length; i++) {
        if (this.adData.carrier_feedbacks[i].user_id === userid) {
          this.senderDetail = this.adData.carrier_feedbacks[i];
          this.SenderScroll();
          break;
        }
        else {
          this.senderDetail = null;
          this.SenderScroll();
        }
      }

    }
     else {
      window.scrollTo(0, document.body.scrollHeight);
    }
    this.disbaledstatusbtn = false
    this.hideconenct = true
    this.toUserId = +userid
    let obj = userDetail;
    this.pointofcontactname = obj.point_of_contact_name;
    this.pointofcontactnumber = obj.point_of_contact_number;
    this.pickupUserId = +userid
    this.receiverid = obj.user_id
    if (obj && obj !== undefined) {
      this.hidestatus = true;
      this.showpointofContact = true;
      this.hidedelieveredli = false;
      this.hideverifypinli = false;
      this.hidereachedli = false;
      this.hidepickedupli = false;
      this.hidewaitingtoaccept = false;
      this.cancelDealWith = obj.fname;

      if (obj.is_offer == 1 && obj.pickup_status == 1 && (obj.user_id == userid)) {
        this.pickUpAlert = true;
      } else { 
        this.pickUpAlert = false;
      }
      if (obj.is_offer == '1' && obj.is_deliver == '1' && obj.pickup_status == '2' && (obj.user_id == userid)) { 
        this.deliveryAlert = true;
      }
      if (
        obj.is_offer == "1" &&
        obj.is_deliver == "2" &&
        obj.pickup_status == "2" &&
        obj.user_id == userid
      ) {
        this.deliveryAlert = false;
      }

      if (obj.is_offer == 1 && obj.pickup_status == 0 && obj.offerer_data.is_cancel == '1' && obj.offerer_data.is_cancel_status == '0' && obj.offerer_data.cancel_user_id != this.userId) {
        this.cancelRequested = true;
      } else {
        this.cancelRequested = false;
      }

      if (Number(obj.is_offer) == 1 && Number(obj.pickup_status) == 0 && obj.offerer_data.is_cancel == '0') {
        this.showCancelBtn = true;
        this.disableCancelBtn = false;
      } else if (obj.offerer_data.cancel_user_id == this.userId) {
        this.showCancelBtn = false;
        this.showCancelCard = true;
      } else {
        this.showCancelBtn = false;
        this.showCancelCard = false;
      }
      if (obj.user_id == userid && obj.is_offer == 1 && obj.track_status == 1 && obj.pickup_status == 0 && obj.offerer_data.is_cancel == '0') {
        this.btnStatus = "Picked Up"
        this.hidestatus = false
      }
      else if (obj.user_id == userid && obj.is_offer == 1 && obj.track_status == 2 && obj.pickup_status == 1) {
        this.disbaledstatusbtn = true;
        this.btnStatus = "Reached the destination"
        this.hidestatus = false
      }
      else if (obj.user_id == userid && obj.is_offer == 1 && obj.track_status == 3) {
        this.btnStatus = "Reached the destination"
        this.hidestatus = false
      }
      else if (obj.user_id == userid && obj.is_offer == 1 && obj.track_status == 4) {
        this.btnStatus = "Verification PIN"
        this.hidestatus = false
      }
      else if (obj.user_id == userid && obj.is_offer == 1 && obj.track_status == 5) {
        this.btnStatus = "Delivered"
        this.hidestatus = false
      }
      else if (obj.user_id == userid && obj.is_offer == 1 && obj.track_status == 6) {
        this.btnStatus = "Deal Closed"
        this.hidestatus = false
        this.disbaledstatusbtn = true
      }

      this.trackingDetails(obj);
    }
    else {
      this.showpointofContact = false
      this.btnStatus = ""
    }
    this.cdRef.detectChanges();
    if (this.senderDetail) { 
      this.starsComponent.setRating(this.senderDetail.isfeedbackData.rating);
    }
      
  }

  SenderScroll() { 
    window.scrollTo(0, document.body.scrollHeight);
    const scroll = document.getElementById("targetdiv");
    if (scroll) {
      scroll.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
     }
  }

  trackingDetails(userTrackingDetail) {

    this.hidetrack = false;
    if ((userTrackingDetail.pickup_status == 0 || userTrackingDetail.pickup_status == 1) && userTrackingDetail.reached == null && userTrackingDetail.is_offer == 1 && userTrackingDetail.is_deliver == 0) {
      this.hidewaitingtoaccept = true
    }
    else if (userTrackingDetail.pickup_status == 2 && userTrackingDetail.reached == null && userTrackingDetail.is_offer == 1 && userTrackingDetail.is_deliver == 0) {
      this.hidepickedupli = true
      this.hidewaitingtoaccept = true
    }
    else if (userTrackingDetail.track_status == 4 && userTrackingDetail.reached != null && userTrackingDetail.is_offer == 1 && userTrackingDetail.is_deliver == 0) {
      this.hidereachedli = true
      this.hidepickedupli = true
      this.hidewaitingtoaccept = true
    }
    else if (userTrackingDetail.track_status == 5 && userTrackingDetail.reached != null && userTrackingDetail.is_offer == 1 && userTrackingDetail.is_deliver == 1) {
      this.hideverifypinli = true
      this.hidereachedli = true
      this.hidepickedupli = true
      this.hidewaitingtoaccept = true
    }
    else if (userTrackingDetail.track_status == 6 && userTrackingDetail.reached != null && userTrackingDetail.is_offer == 1 && userTrackingDetail.is_deliver == 1) {
      this.hideverifypinli = true
      this.hidereachedli = true
      this.hidepickedupli = true
      this.hidewaitingtoaccept = true
    }
    else if (userTrackingDetail.track_status == 6 && userTrackingDetail.reached != null && userTrackingDetail.is_offer == 1 && userTrackingDetail.is_deliver == 2) {
      this.hidedelieveredli = true
      this.hideverifypinli = true
      this.hidereachedli = true
      this.hidepickedupli = true
      this.hidewaitingtoaccept = true

      this.hidestatus = false;
      this.disbaledstatusbtn = true;
      this.btnStatus = "Deal Closed"
    }
  }

  GetInterestedLIst() {
    this.dataService.GetInterestedlist(this.adID).subscribe(res => {
      this.getAdDetails(this.adID);
      Object.assign(this.Deliveries, [])
      this.forUserDetails = res['data'];
      if (res['data']) { 
        this.initerestedlist = res['data'].filter(fill => (fill['offerer_data'].is_cancel_status == '0' && fill['is_offer'] == '1'));
      }
      if (this.initerestedlist != null) {
        for (let i = 0; i < this.initerestedlist.length; i++) {
          this.Deliveries.push(this.initerestedlist[i]);
        }
        this.track_status = res['data'].track_status;
        let userId = localStorage.getItem("userId")
        res['data'].map(d => {
          if (d['user_id'] == userId) {
            if (d.pickup_status == '1' && d.is_offer == '1') {
              this.hideyes = false;
              this.showCancelBtn = false;
            }
            if (d.is_offer == '1' && d.pickup_status == '0' && d.offerer_data.is_cancel == '0' && this.hideyes) {
              this.showCancelBtn = true;
            }
            else if (d.offerer_data.cancel_user_id == this.userId) {
              if (d.offerer_data.is_cancel_status == 1) {
                this.showCancelBtn = true;
              }
              else {
                this.showCancelBtn = false;
              }
            }
            else {
              this.showCancelBtn = false;
            }
          }
          else { 
            // if (d.is_offer == '1' && d.pickup_status == '1') {
            //   this.pickUpAlert = true;
            // }
            // if (d.is_offer == '1' && d.pickup_status == '2') {
            //   this.pickUpAlert = false;
            // }
            // if (d.is_offer == '1' && d.is_deliver == '1' && d.pickup_status == '2') {
            //   this.deliveryAlert = true;
            // }
            // if (d.is_offer == '1' && d.is_deliver == '2' && d.pickup_status == '2') { 
            //   this.deliveryAlert = false;
            // }
          }
        })
      }
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    })
  }
  getTimeAdDetails() {
    this.getAdDetails(this.adID)
  }

  getAdDetails(adID){
    this.loader.start();
    this.dataService.viewCarrierAdd(adID).subscribe(product => {
      this.loader.stop();
      this.adData = product['data'];
      this.packagesCarried = product['packagesCarried'];
      this.packagesSent = product['packagesSent'];
      this.acceptrequest = this.adData['is_accepted']
      ///// CARD FIELDS ///////
      this.carrierfromlocation = this.adData['carrier_from_location']
      this.carriertolocation = this.adData['carrier_to_location']
      this.fromtime = this.adData['from_time']
      this.totime = this.adData['to_time']
      this.weight = this.adData['weight']
      this.aduser_id = this.adData['user_id']

      this.firstname = product['data'].first_name;
      this.userData = this.adData['get_user']
      this.addTypes = this.adData['types'];
      this.deliveryPriority = this.adData['delivery_priority'];
      this.assignedCategories = this.adData['assigned_categories'];
      this.user_id = this.adData['user_id']
      this.receiver_id = this.Deliveries['user_id']
      this.counter = this.adData.count;
      this.travellingTypes = this.adData['types'];
      if (this.loginuser) {
        let userId = localStorage.getItem("userId");
        if (userId != this.adData["user_id"] && this.Deliveries.length > 0) {
          let userDetail = this.Deliveries.filter(
            (x) => x.user_id == userId
          )[0];
          if (userDetail.pickup_status == "1" && userDetail.is_offer == "1") {
            this.hideyes = false;
          }

          this.firstname = userDetail.fname;
          this.toUserId = userDetail.user_id;

          if (this.user_id != this.userId)
            this.cancelDealWith = this.adData.first_name;
          else this.cancelDealWith = this.firstname;

          if (
            userDetail.is_offer == 1 &&
            userDetail.pickup_status == 0 &&
            userDetail.offerer_data.is_cancel == "1" &&
            userDetail.offerer_data.is_cancel_status == "0" &&
            userDetail.offerer_data.cancel_user_id != this.userId
          ) {
            this.cancelRequested = true;
          } else {
            this.cancelRequested = false;
          }

          if (
            userDetail.is_offer == 1 &&
            userDetail.pickup_status == 0 &&
            userDetail.offerer_data.is_cancel == "0" &&
            this.hideyes
          ) {
            this.showCancelBtn = true;
          } else if (userDetail.offerer_data.cancel_user_id == this.userId) {
            if (userDetail.offerer_data.is_cancel_status == 1) {
              this.showCancelBtn = true;
              this.showCancelCard = false;
            } else {
              this.showCancelBtn = false;
              this.showCancelCard = true;
            }
          } else {
            this.showCancelBtn = false;
          }
          // if (this.adData.carrier_feedbacks.length) {
          //   this.hidefeedback = true;
          // } else {
          //   this.hidefeedback = false;
          // }
          if (this.adData.requested_user_all.length) { 
            this.checkFeedback();
          }
          if (userDetail.track_status == 5) {
            this.hidedileverybtn = false;
          } else {
            this.hidedileverybtn = true;
          }

          this.trackingDetails(userDetail);
        }

        ///if for feedback btn show hide feedback
        if (this.adData.is_cancel_status == 1 && !this.adData.is_my_feedback) {
          this.showCancelBtn = false;
        }

        if (this.adData.is_accepted == null ||
          this.adData.is_accepted == 0 ||
          this.adData.is_connected == 0 ||
          this.adData.is_cancel_status == 1
        ) {
          this.connectBtn = "Connect";
          this.disbaled = false;
        }
        else if (this.adData.is_accepted == 0) {
          this.btntextcarry = "Waiting for approval";
          this.disbaled = false;
        } else if (this.adData.is_accepted == 1) {
          this.btntextcarry = "Chat";
          this.disbaled = false;
          this.hideconenct = false;
          this.checkFeedback();
        }

        if (this.aduser_id == userId && this.Deliveries.length > 0) {
          this.interestedcard = false;
        } else {
          this.interestedcard = true;
        }

        if (this.user_id == userId) {
          this.hideconenct = true;
        }
        /////////////////// HIDE CONNECT /////////////
        this.cdRef.detectChanges();
      }
    }, (err: HttpErrorResponse) => {
      alert(err.message);
    });
  }

  checkFeedback() { 
    
    if (!this.adData.carrier_feedbacks.length) { 
      this.hidefeedback = true;
    }
    // else{ 
    //   if (this.adData.creater.id == this.userId && this.adData.is_my_feedback) {
    //     // let reOpenFeedback = this.adData.carrier_feedbacks.find((x) => x.user_id == this.user_id);
    //     // if (reOpenFeedback) {
    //     //   this.hidefeedback = true;
    //     // }
    //     // else {
    //       this.hidefeedback = false;
    //     // }
    //   }
    //   else { 
    //     this.hidefeedback = true;
    //   }
    // } 
  }

  updateWishlist() {

    let user: any = JSON.parse(localStorage.getItem('user'));
    let form = new FormData();
    form.append('client_key', 'Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G');
    form.append('ad_id', this.adID);
    form.append('ad_type', '2');
    form.append('user_id', user.id);
    this.dataService.addToWishlist(form).subscribe(res => {
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

  }

  OpenFeedback(feedback) {
    this.modalReference = this.modalService.open(feedback, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
  }

  openCancelModal(verifyCancel) {
    this.modalReference = this.modalService.open(verifyCancel, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
  }

  openConfirmationCancelModal(confirmCancel) {
    this.modalReference = this.modalService.open(confirmCancel, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
  }

  PostFeedback() {
    this.loader.start();
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.FeedbackForm.controls['rating1'].value == true) {
      this.FeedbackForm.controls['rating'].setValue(1);
    }
    else if (this.FeedbackForm.controls['rating2'].value == true) {
      this.FeedbackForm.controls['rating'].setValue(2);
    }
    else if (this.FeedbackForm.controls['rating3'].value == true) {
      this.FeedbackForm.controls['rating'].setValue(3);
    }
    else if (this.FeedbackForm.controls['rating4'].value == true) {
      this.FeedbackForm.controls['rating'].setValue(4);
    }
    else if (this.FeedbackForm.controls['rating5'].value == true) {
      this.FeedbackForm.controls['rating'].setValue(5);
    }
    this.notificationMessage = 'You have been rated with ' + this.ratingValue + ' Stars & ' + "'" +this.FeedbackForm.controls['review'].value + "'  comment, by" + user.fname + ' ' + user.lname + ' for ad ' + this.adData.title + '. Please confirm Pickup.' + ' on ' + todayDate;
    this.dataService.Feedbacks(this.adID, this.FeedbackForm.controls['review'].value, this.ratingValue, this.user_id, 2).subscribe(res => {
      this.loader.stop();
      let loginuserId = localStorage.getItem("userId")
      localStorage.setItem("ratingadId", this.adID);
      localStorage.setItem("ratinguserId", loginuserId)
      this.modalService.dismissAll();
      this.hidefeedback = true
      this.SettingService.Success("Feedback Add Successfully");
      this.PostSenderConnectyesFirebase(this.notificationMessage);
      this.ownerNotificationForSender('You have rated with ' + this.ratingValue + ' Stars & ' + "'" + this.FeedbackForm.controls['review'].value + "'" + ' for ad ' + this.adData.title + ' on ' + todayDate);
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.loader.stop();
      this.SettingService.Error(err.message)
    });
  }

  ownerNotificationForSender(message: any) { 
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      // fromUserId: +localStorage.getItem("userId"),
      toUserId: +localStorage.getItem("userId"),
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 2,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    });
  }

  toggleShareButton() {
    this.hideShareButtons = !this.hideShareButtons;
  }


  ratingValue = 0
  emojis = [
    {
      img: '../assets/Very Mad Emoji.png',
      opacity: 0.7,
      value: 1,
    }, {
      img: '../assets/Angry Emoji.png',
      opacity: 0.7,
      value: 2,
    }, {
      img: '../assets/Smiling Face Emoji with Blushed Cheeks.png',
      opacity: 0.7,
      value: 3,
    }, {
      img: '../assets/Smiling Emoji with Eyes Opened.png',
      opacity: 0.7,
      value: 4,
    }, {
      img: '../assets/Heart Eyes Emoji.png',
      opacity: 0.7,
      value: 5,
    }
  ]

  SelectedEmo(params) {
    this.emojis.map(res => {
      res['value'] == params['value'] ? (res['opacity'] = 1, this.ratingValue = res['value']) : res['opacity'] = 0.7
    })
  }

  cancelFirebaseNotification() {
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    let toId: any;
    if (user.id == this.toUserId) toId = this.adData.user_id;
    else toId = this.toUserId;
    if (this.adData.ad_type == 2) {
      obj = {
        adId: +this.adID,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +toId,
        fromUserName: user.fname + " " + user.lname,
        notificationText: 'Cancellation request received by ' + user.fname + ' ' + user.lname + ' for Carrier Ad' + ' ' + this.adData.title + ' on ' + todayDate,
        createdAt: new Date(),
        updatedAt: "",
        adType: +this.adData.ad_type,
        isRead: 0,
      };
    }
    this.db
      .collection("Notification")
      .add(obj)
      .then(() => {
        this.cancelFirebaseNotificationForOwner();
      })
      .catch((err) => {
      });
  }

  cancelFirebaseNotificationForOwner() { 
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.adData.ad_type == 2) {
      obj = {
        adId: +this.adID,
        // fromUserId: +localStorage.getItem("userId"),
        toUserId: +localStorage.getItem("userId"),
        fromUserName: user.fname + " " + user.lname,
        notificationText: 'Cancellation request sent by you for Carrier Ad' + ' ' + this.adData.title + ' on ' + todayDate,
        createdAt: new Date(),
        updatedAt: "",
        adType: +this.adData.ad_type,
        isRead: 0,
      };
    }
    this.db
      .collection("Notification")
      .add(obj)
      .then(() => {
      })
      .catch((err) => {
      });
  }

}
