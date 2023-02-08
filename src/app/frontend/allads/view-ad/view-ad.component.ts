
import { SettingService } from './../../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationService } from 'ng-zorro-antd';
import { DataService } from '../allads.service';
import { Subscription} from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { SafeHtml } from '@angular/platform-browser';
import { GoogleAdsService } from '../../services/google-ads.service';
import { MyAdService } from '../../myads/myads.service'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-view-ad',
  templateUrl: './view-ad.component.html',
  styleUrls: ['./view-ad.component.css']
})
export class ViewAdComponent implements OnInit, AfterViewInit {
  @ViewChild("feedback", { static: true }) feedback: ElementRef;
  mrcURL: string = 'https://pacsend.app';
  myStatus = false;
  reports: any;
  selectedId: any;
  alreadyReported: boolean=false;
  ratingSubmit: boolean=false;
  cancelAccepted: any;
  imageIndex: number=0;
  hideLCP: boolean;
  imageBaseUrl = 'https://pacsend.app/public/uploads/users/';
  pickUpAlert: boolean;
  deliveryAlert: boolean;
  notificationMessage: any;

  GetWishlList() {
    this.myStatus = false
    this.dataService.GetAllWishlist().subscribe(res => {
      res['data'].sender.map(add => {
        if (add['ad_id'] == this.adID) {
          this.myStatus = true
        }
      })
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message);
    })
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

  RatingClick(){
    this.ratingSubmit=true;
  }

  travelTypeSelect(i) {
    this.selectedId=i;
    this.travellingTypes.forEach((element, index) => {
      this.travelType[index] = false;
    });
    this.travelType[i] = true;
  }

  adReport(id) {
    this.loader.start();
    this.dataService.addReport(this.adID,1,id).subscribe((res: any) => {
      this.SettingService.Success(res.message)
      this.alreadyReported=true
      this.hideReport = !this.hideReport;
      this.loader.stop();
    }, (error) => { 
      this.loader.stop();
      this.SettingService.Error('Report not submittd')
    });
    this.cdRef.detectChanges();
  }

  clientid = "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G";
  btntext = "Connect";
  ad_id;
  adID: any; //Getting id from URL
  adData: any; //Getting details
  userData: any; //User Data
  addTypes: any // Ad Type
  travellingTypes: any //Travelling type
  deliveryPriority: any // Delivery Priority
  assignedCategories: any // Assigned Categories
  form: FormGroup;
  imageGallary: any;
  disbaled: boolean = true;
  pointofcontactname: any;
  pointofcontactnumber: any;
  abc: string;
  btnStatus = "Picked Up"
  hidetrack: boolean = true;
  feedbackDetail: any;
  pickupstatus: any;
  isoffer: any;
  cancelRequested = false;
  showCancelBtn = false;
  disableCancelBtn = false;
  offererid: any;
  userid: any;
  socialShare: boolean = false;
  hidestatus: boolean = true;
  hideyes: boolean = true
  modalReference: any;
  reached: any;
  VerificationForem: FormGroup
  is_deliver: any;
  cancelDealWith: string;
  showCancelCard: boolean = false;

  hidereachedli: boolean = false;
  hideverifypinli: boolean = false;
  hidedelieveredli: boolean = false;
  hidedealdoneli: boolean = false;
  hidepickedupli: boolean = false;
  hidedealdone: boolean = false

  hideconnect: boolean = false
  Deliveries = []
  disabledstatusbutton: boolean;
  hidedileverybtn: boolean = true
  subscription: Subscription
  loginuserid: string;
  FeedbackForm: FormGroup;
  hidefeedback: boolean = true;
  userimage: any;
  loginuser: any;
  counter: any;
  packagesCarried: any;
  packagesSent: any;
  NotificationsArray: any[];
  wishliststatus: any;
  totalAmount: number;

  googleAdsImage: string;
  googleAdsScript: (SafeHtml | any);
  firstImage: any;
  othterImage: any;
  googleAdsImageSenderAdRight: string;
  hideShareButtons: boolean = false;
  hideReport: boolean = false;
  rating: any;
  fback: any;
  fbtitle: any;
  iSfeedback: boolean;
  fbuserId: any;
  travelType: any = [];
  page_url : any;

  constructor(private loader: NgxUiLoaderService,private actRoute: ActivatedRoute,
    private dataService: DataService,
    private fb: FormBuilder,
    private _notificaton: NzNotificationService,
    private router: Router,
    private modalService: NgbModal,
    private db: AngularFirestore,
    private SettingService: SettingService,
    private googlAdsService: GoogleAdsService,
    private cdRef: ChangeDetectorRef,private myAdService:MyAdService
  ) {
    this.page_url = this.router['location']._platformLocation.location.origin+router.url;
    this.imageGallary = [];
    this.loginuser = JSON.parse(localStorage.getItem("user"));
    // console.log('this.actRoute.snapshot.params',this.actRoute.snapshot.params['title'])
    // this.adID = this.actRoute.snapshot.params['title'];
    this.adID = localStorage.getItem("senderDetailsId");
    if(this.adID == ''){
      this.adID = this.actRoute.snapshot.params['title'];
    }
    if (!this.loginuser) { 
      this.getAdDetails(this.adID, '');
      this.getGoogleAdImage();
    }
  }

  async ngOnInit() {
    setTimeout(() => {
      this.hideLCP=true;
      window.scrollTo(0, 1);
    }, 2000);
    setTimeout(() => {
      localStorage.removeItem("filterSendLocation");
      localStorage.removeItem("filterSendLongtitude");
      localStorage.removeItem("filterSendLatitude");
      localStorage.removeItem("filterLocation");
      localStorage.removeItem("filterLongtitude");
      localStorage.removeItem("filterLatitude");
    }, 60000);


    this.loader.start();
    setTimeout(() => {
      this.loader.stop();
    }, 1500);

    this.loginuser = JSON.parse(localStorage.getItem("user"))
    this.disabledstatusbutton = true
    let userId = localStorage.getItem("userId")
    this.loginuserid = userId;
    this.adID = localStorage.getItem("senderDetailsId");
    if(this.adID == ''){
      this.adID = this.actRoute.snapshot.params['title'];
    }
    this.initform();
    this.GetWishlList();

    this.GetNotificationFirebase();

    if (this.loginuser) { 
      this.getAdDetails(this.adID, userId);
    }
    this.getGoogleAdImage();

    localStorage.setItem("page","adDetail");
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


  getGoogleAdImage() { 
    this.googlAdsService.getAds().subscribe(data => {
      for (let element of data.data) {
        if (element.slot_name == "SenderViewTop") {
          if (element.image != null && element.script == null) {
            this.googleAdsImage = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }
        if (element.slot_name == "SenderViewRight") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageSenderAdRight = element.image;
          }
          else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
        }
      }
    })
  }
  ngAfterViewInit() {

  }

  initform() {
    this.form = this.fb.group({
      user_id: [],
      client_key: [],
      ad_id: []
    });

    this.VerificationForem = this.fb.group({
      verification: []
    });

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


  nextSlide(index){
  if(index<this.othterImage.length-1){
    this.imageIndex=index+1;
     }
     else{
    this.imageIndex=this.othterImage.length-1;
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


  GetNotificationFirebase() {
    this.db.collection("Notification", ref => ref.where("toUserId", "==", +localStorage.getItem("userId"))
      .where("isRead", "==", 0)
      .orderBy("createdAt", "asc"))
      .snapshotChanges().subscribe((querySnapshot) => {
        let userId = localStorage.getItem("userId")
        this.getAdDetails(this.adID, userId);
      })
  }


  PostSenderConnectFirebase(message: string) {
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.userid,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 1,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    })
  }

  PostSenderConnectyesFirebase(message: string) {
    let user: any = JSON.parse(localStorage.getItem("user"))
    let obj = {
      adId: +this.adID,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +this.offererid,
      fromUserName: user.fname + ' ' + user.lname,
      notificationText: message,
      createdAt: new Date(),
      updatedAt: "",
      adType: 1,
      isRead: 0,
    }
    this.db.collection("Notification").add(obj).then(() => {
    }).catch((err) => {
      this.SettingService.Error(err)
    })
  }

  checkFeedback() {
    let index = this.adData.offerer_data.length;
    if (this.adData.carrier_feedbacks != null) {
      this.iSfeedback = true;
      this.hidefeedback = true;
      this.fbtitle = this.adData.carrier_feedbacks.title;
      this.fbuserId = this.adData.carrier_feedbacks.user_id;
    }
    if (+localStorage.getItem('userId') == +this.adData.creater.id && this.adData.ad_type == 1 && !this.adData.is_feedback && this.adData.is_deliver == 2) {

      this.hidefeedback = false;
      if (this.adData.carrier_feedbacks) { 
      this.hidefeedback = true;
      this.fbtitle = this.adData.carrier_feedbacks;
      this.fbtitle = this.adData['carrier_feedbacks'].title;
      }
      
      this.adData.is_feedback
    }
    else {

      if (+localStorage.getItem('userId') == +this.adData.creater.id && this.showCancelCard == false && this.cancelRequested == false) {

        if (this.showCancelBtn) {
          this.hidefeedback = true;
        }
        else {
          if ((this.fback == null || this.fback == 0) && (this.adData.is_deliver == 2)) {
            this.hidefeedback = false;
            if (this.fback != null || this.fback != 0) {
              this.hidefeedback = true;
            }

          }
          else if (this.adData.is_deliver == 2) {
            this.hidefeedback = false;
            if (this.fback != null || this.fback != 0) {
              this.hidefeedback = true;
              this.iSfeedback = true;

            }

          }
          // else if ((this.adData.is_cancel == 1 || this.adData.is_cancel_status == 1)  && (this.adData.is_deliver == 0)) {
          //   if (this.adData.carrier_feedbacks) {
          //     let checkUserFeedback = this.adData.offerer_data.find((x) => x.cancel_user_id == this.adData.carrier_feedbacks.user_id);
          //     if (checkUserFeedback && (this.adData.carrier_feedbacks.ad_id == this.adData.ad_id) &&
          //     this.adData.offerer_data[index - 1].cancel_user_id == this.adData.carrier_feedbacks.user_id) {
          //       this.hidefeedback = true;
          //     }
          //     else { 
          //       this.hidefeedback = false;
          //     }
          //   }
          //   else { 
          //     this.hidefeedback = false;
          //   }
          // }
        }
      }
      else {
        // if (this.adData.offerer_data[index - 1].is_cancel == 1 && this.adData.offerer_data[index - 1].cancel_user_id == localStorage.getItem('userId')) {
        //   // if (!this.adData.carrier_feedbacks || this.adData.offerer_data[index - 1].is_cancel_status != 1) { 
        //   if (this.adData.carrier_feedbacks) {
        //     this.adData.offerer_data.forEach(ele => {
        //       if (ele.user_id == this.adData.carrier_feedbacks.user_id) {
        //         this.hidefeedback = true;
        //       }
        //       else {
        //         this.hidefeedback = false;
        //       }
        //     });
        //   }
        //   else { 
        //     this.hidefeedback = false;
        //   }
        // }
        // else {
          this.hidefeedback = true;
        //  }
      }

    }

  }

  async getAdDetails(adID, userId) {

    this.dataService.viewSenderAd(adID)
      .subscribe((product: any) => {
        this.adData = product['data'];
        this.firstImage = product['data']['ad_image'];
        this.othterImage = product['adGallery'];
        this.counter = product.count;
        this.packagesCarried = product.packagesCarried;
        this.packagesSent = product.packagesSent;
        this.userimage = this.adData['user_image']
        this.userData = this.adData['get_user']
        this.addTypes = this.adData['add_types'];
        this.travellingTypes = this.adData['types'];
        this.pointofcontactname = this.adData['point_of_contact_name']
        this.pointofcontactnumber = this.adData['point_of_contact_number']
        this.offererid = this.adData['offeror'];
        this.isoffer = this.adData['is_offer'];
        this.pickupstatus = this.adData['pickup_status'];
        this.userid = this.adData['user_id']
        this.reached = this.adData['reached']
        this.is_deliver = this.adData['is_deliver']
        this.wishliststatus = this.adData['wishlist']
        this.totalAmount = +this.adData['weight'] * +this.adData['payment']
        this.fback = this.adData['avgFeedBack'];
        const offererIndex = this.adData.offerer_data;
        let index = offererIndex.length;
        if (this.loginuser) {
          localStorage.setItem("adCreater._id", this.adData.creater.id);
          if (this.adData.get_feedback_data) {
            this.rating = this.adData.get_feedback_data["rating"];
          }
          let userId = localStorage.getItem("userId");
          this.cancelAccepted = this.adData.offerer_data[index - 1].is_cancel;
          if (this.userid == userId) {
            this.hideconnect = true;
            this.hidestatus = true;
          } else {
            this.hideconnect = false;
            this.hidestatus = true;
          }

          if (
            this.adData["is_offer"] == "1" &&
            this.adData["pickup_status"] == "0" &&
            this.adData.offerer_data[index - 1].is_cancel == "1" &&
            this.adData.offerer_data[index - 1].is_cancel_status == "0" &&
            this.adData.offerer_data[index - 1].cancel_user_id != this.loginuser.id
          ) {
            this.cancelRequested = true;
            if (
              this.adData.offerer_data[index - 1].is_cancel == "1" &&
              this.adData.offerer_data[index - 1].cancel_user_id == this.loginuser.id
            ) {
              this.showCancelCard = true;
            } else {
              this.showCancelCard = false;
            }
          } else if (
            this.adData["is_offer"] == "1" &&
            this.adData["pickup_status"] == "0" &&
            this.adData.offerer_data[index - 1].is_cancel == "1" &&
            this.adData.offerer_data[index - 1].is_cancel_status == "0" &&
            this.adData.offerer_data[index - 1].cancel_user_id == this.loginuser.id
          ) {
            this.cancelRequested = false;

            if (
              this.adData.offerer_data[index - 1].is_cancel == "1" &&
              this.adData.offerer_data[index - 1].cancel_user_id == this.loginuser.id
            ) {
              this.showCancelCard = true;
            } else {
              this.showCancelCard = false;
            }
          } else {
            this.cancelRequested = false;
            if (this.cancelRequested == false) {
              this.showCancelCard = false;
            } else {
              this.showCancelCard = true;
            }
          }
          if (
            this.adData.is_offer == "1" &&
            this.adData.pickup_status == "0" &&
            this.adData.offerer_data[index - 1].is_cancel == "0"
          ) {
            this.showCancelBtn = true;
          } else if (
            this.adData.offerer_data[index - 1].cancel_user_id == this.loginuser.id
          ) {
            this.showCancelBtn = false;
          } else {
            this.showCancelBtn = false;
          }

          ///////////// HIDE CONNECT CONDITION IF AD USERID EQUAL TO LOGIN USERID /////////////

          /////////////// SHOW TRACK CONDITION IF AD USERID EQUAL TO LOGIN USERID ////////////////

          this.hidetrack = true;
          if (
            this.pickupstatus == 2 &&
            this.reached == null &&
            this.isoffer == 1 &&
            this.is_deliver == 0
          ) {
            this.hidepickedupli = true;
            this.hidetrack = false;
          } else if (
            this.pickupstatus == 2 &&
            this.reached != null &&
            this.isoffer == 1 &&
            this.is_deliver == 0
          ) {
            this.hidereachedli = true;
            this.hidepickedupli = true;
            this.hidetrack = false;
          } else if (
            this.pickupstatus == 2 &&
            this.reached != null &&
            this.isoffer == 1 &&
            this.is_deliver == 0
          ) {
            this.hideverifypinli = true;
            this.hidereachedli = true;
            this.hidepickedupli = true;
            this.hidetrack = false;
          } else if (
            this.pickupstatus == 2 &&
            this.reached != null &&
            this.isoffer == 1 &&
            this.is_deliver == 1
          ) {
            this.hideverifypinli = true;
            this.hidereachedli = true;
            this.hidepickedupli = true;
            this.hidetrack = false;
            this.hidedileverybtn = false;
          } else if (
            this.pickupstatus == 2 &&
            this.reached != null &&
            this.isoffer == 1 &&
            this.is_deliver == 2
          ) {
            this.hidedelieveredli = true;
            this.hideverifypinli = true;
            this.hidereachedli = true;
            this.hidepickedupli = true;
            this.hidedealdone = true;
            this.hidetrack = false;
          }
          /////////////// SHOW Dilevery CONDITION FOR CARRIER ////////////////

          if (this.pickupstatus == "1" && this.isoffer == "1" && (this.userid == userId || this.offererid == userId)) {
            if (this.userid == userId) {
              this.hideyes = false;
              this.pickUpAlert = false;
            }
            else { 
              this.pickUpAlert = true;
            }
            this.hidetrack = false;
          }

          if (
            this.pickupstatus == 0 &&
            this.isoffer == 1 &&
            this.userid == userId &&
            this.reached == null &&
            this.is_deliver != 0 &&
            this.btnStatus != "Picked Up"
          ) {
            this.hidetrack = false;
          } else if (
            this.pickupstatus == 0 &&
            this.isoffer == 1 &&
            this.offererid == userId &&
            this.reached == null &&
            this.is_deliver == 0 &&
            this.adData.offerer_data[index - 1].is_cancel == "0"
          ) {
            this.btnStatus = "Picked Up";
            this.hidestatus = false;
            this.disabledstatusbutton = false;
          } else if (
            this.isoffer == 1 &&
            this.pickupstatus == 2 &&
            this.offererid == userId &&
            this.reached == null &&
            this.is_deliver == 0
          ) {
            this.btnStatus = "Reached the destination";
            this.hidestatus = false;
            this.pickUpAlert = false;
            this.disabledstatusbutton = false;
          } else if (
            this.isoffer == 1 &&
            this.pickupstatus == 2 &&
            this.offererid == userId &&
            this.reached !== null &&
            this.is_deliver == 0
          ) {
            this.btnStatus = "Verify PIN";
            this.hidestatus = false;
            this.disabledstatusbutton = false;
          }
          else if (
            this.isoffer == 1 &&
            this.pickupstatus == 2 &&
            this.offererid == userId &&
            this.reached !== null &&
            this.is_deliver == 1
          ) { 
            this.deliveryAlert = true;
          }
          else if (
            this.isoffer == 1 &&
            this.pickupstatus == 2 &&
            this.userid == userId &&
            this.reached !== null &&
            this.is_deliver == 1
          ) {
            this.btnStatus = "Confirm Delivery";
            this.hidestatus = false;
            this.disabledstatusbutton = false;
            this.deliveryAlert = false;
          }
          if (
            this.isoffer == 1 &&
            this.pickupstatus == 2 &&
            this.adData.creater.id == userId &&
            this.reached !== null &&
            this.is_deliver == 2
          ) {
            this.checkFeedback();
            this.btnStatus = "Deal Closed";
            this.hidestatus = false;
            this.disabledstatusbutton = true;
            this.deliveryAlert = false;
          } else {
            this.checkFeedback();
          }

          this.abc = " , ";
          this.deliveryPriority = this.adData["delivery_priority"];
          this.assignedCategories = this.adData["assigned_categories"];
          if (this.adData.is_accepted == null && this.adData.offeror == null) {
            this.btntext = "Connect";
            this.disbaled = false;
          }
          if (this.adData.is_accepted == null && this.adData.offeror != null) {
            this.btntext = "Ad already offered to another person!";
            this.disbaled = true;
          }
          if (this.adData.is_accepted == 0) {
            this.btntext = "Requested";
            this.disbaled = true;

            if (this.adData.carrier_feedbacks != null) {
              this.btntext = "Chat";
            }
          }
          if (this.adData.is_accepted == 3) {
            this.btntext = "Request Rejected";
            this.disbaled = true;
          } else if (this.adData.is_accepted == 1) {
            this.btntext = "Chat";
            this.disbaled = false;
          } else if (this.adData.is_accepted == 2) {
            this.btntext = "Requested has been rejected";
            this.disbaled = false;
          }

          this.cdRef.detectChanges();
        }
      }, (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message)
      });
  }

  CheckTest() {
    const adId = localStorage.getItem("AdId");
    const value = localStorage.getItem("SenderRequest");
    if (value && this.adID == adId) {
      this.btntext = "Requested"
      this.disbaled = true;
    }
    else {
      this.btntext = "Connect"
      this.disbaled = false
    }
  }
  CancelRequestAcceptens(status) {
    this.dataService.CancelRequestSenderAdAccept(this.adID, this.userid, this.offererid, status).subscribe((res: any) => {
      let index = this.adData.offerer_data.length;
      if (status == 0) {
        this.cancelRequested = false;
        this.showCancelBtn = true;
        this.showCancelCard = false;
        if (this.userid != this.loginuser.id)
          this.hidestatus = false;
        this.disabledstatusbutton = false;
      }
      else {
        // if (this.adData.offerer_data[index - 1].cancel_user_id != this.loginuser.id
        //   && this.adData.creater.id == this.loginuser.id
        //   && this.adData.carrier_feedbacks == null) {
        //   this.hidefeedback = true;
        // }
        // else { 
        //   if (!this.cancelRequested) this.hidefeedback = false;
        //   else this.hidefeedback = true;
        // }
        this.showCancelCard = false;
        this.cancelRequested = false;
      }
      this.cancelFirebaseNotification();
      this.SettingService.Success(res.message)
      this.cdRef.detectChanges();
    });
    this.showCancelCard = false;
  }
  SendCancelRequest(cancelRequestSent) {
    this.showCancelBtn = false;
    this.showCancelCard = true;
    this.hidestatus=true;
    let user_type_id
    if (this.userid == this.loginuserid) {
      user_type_id = 1;
    } else {
      user_type_id = 0;
    }
    this.dataService.SendCancelRequest(this.adID, this.userid, this.offererid, user_type_id).subscribe((res: any) => {
      this.modalReference = this.modalService.open(cancelRequestSent, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
      this.showCancelCard = true;
      this.showCancelBtn = false;
      this.hidestatus = true;
      this.disableCancelBtn = true;
      this.hideconnect = false;
      this.SettingService.Success('Cancel request has been sent')
      this.cancelFirebaseNotification();
      this.cdRef.detectChanges();
    });
  }
  updateWishlist() {
      let user: any = JSON.parse(localStorage.getItem('user'));
      let form = new FormData();
      form.append('client_key', 'Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G');
      form.append('ad_id', this.adID);
      form.append('ad_type', '1');
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


  postSenderConnect() {
    var btnname = document.getElementById("button1");
    if (this.btntext == "Chat") {
      localStorage.setItem('ChatAdId', this.adData.ad_id);
      // this.router.navigateByUrl("/chat");
      this.router.navigate(["/chat"], { queryParams: { adType:this.adData.ad_type, userChatId: this.adID } });
    }
    else if (this.btntext == "Requested has been rejected") {
      this.router.navigateByUrl("/all-ads")
    }
    else if (this.btntext == "Connect") {
      let userid = localStorage.getItem("userId")
      this.form.controls['user_id'].setValue(userid);
      this.form.controls['client_key'].setValue(this.clientid);
      this.form.controls['ad_id'].setValue(Number(this.adID));
      this.dataService.postSenderConnect(this.form.value).subscribe(res => {
        localStorage.setItem("SenderRequest", JSON.stringify(1))
        localStorage.setItem("AdId", this.adID);
        this.btntext = "Requested";
        this.disbaled = true
        this.SettingService.Success("Request Sent Successfully..")
        this.btntext = "Requested";
        this.PostSenderConnectFirebase('Connection request received from');
        this.cdRef.detectChanges();
      }, (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message)
      })
    }

  }

  HideTrack() {
    this.hidetrack = false;
  }

  check(event) { 
    if (event == 'open') {
      this.hideShareButtons = false;
    }
    else { 
      this.hideShareButtons = true
    }
  }

  PostDealProcessYes() {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    this.notificationMessage = 'You pickup for ad ' + this.adData.ad_title + ' on ' + todayDate + ' is confirmed by ' + user.fname + ' ' + user.lname;
    this.dataService.PostDealProcess(this.adID, "0").subscribe(res => {
      this.hidetrack = false;
      this.hidestatus = true;
      this.hideyes = true
      this.hidepickedupli = true;
      this.disabledstatusbutton = false;
      this.pickUpAlert = false;
      this.btnStatus = "Reached the destination";
      this.SettingService.Success("Success");
      this.PostSenderConnectyesFirebase(this.notificationMessage);
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    });
  }
  PostDealProcessNo() {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    this.notificationMessage = 'Pickup unverified by sender for ' + this.adData.ad_title + ' on ' + todayDate + ' by ' + user.fname + ' ' + user.lname;
    this.dataService.PostDealProcess(this.adID, "1").subscribe(res => {
      this.hidetrack = false;
      this.hidestatus = true;
      this.hideyes = true
      this.disabledstatusbutton = false;
      this.pickUpAlert = false;
      this.btnStatus = "Picked Up";
      this.SettingService.Success("PickUp request rejected!");
      this.PostSenderConnectyesFirebase(this.notificationMessage);
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    });
    
  }

  postVerify() {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    var textvalue = this.VerificationForem.controls['verification'].value;
    this.notificationMessage = 'Pin verified by carrier for ad ' + this.adData.ad_title + ' on ' + todayDate + ' by ' + user.fname + ' ' + user.lname
    this.dataService.PostVerificationAPI(this.adID, textvalue).subscribe(res => {
      this.SettingService.Success("Success");
      this.disabledstatusbutton = true;
      this.btnStatus = "Confirm Delivery";
      this.hideverifypinli = true
      this.hidetrack = false;
      this.deliveryAlert = true;
      this.PostSenderConnectFirebase(this.notificationMessage);
      this.pinVerifyForCarrier('You have verified the pin for ad ');
      this.adDeliverdNotificationForSender('Your package has marked as delivered for ad ');
      this.modalService.dismissAll();
      this.cdRef.detectChanges();
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error("   Invalid PIN !")
    });
  }



  PostDealProcess(verificationmodal) {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.btnStatus == "Picked Up") {
      this.notificationMessage = 'Your package is picked up by' + ' ' + user.fname + ' ' + user.lname + ' on ' + todayDate + ' for ' + this.adData.ad_title + '.  Please confirm Pickup.'
      this.dataService.PostDealProcess(this.adID).subscribe(res => {
        this.showCancelBtn = false;
        this.disabledstatusbutton = true;
        this.hidepickedupli = false;
        this.hidetrack = false;
        this.pickUpAlert = true;
        this.SettingService.Success("Success")
        this.PostSenderConnectFirebase(this.notificationMessage);
        // this.adFlowFirebaseNotification(this.notificationMessage, todayDate, this.adData.user_id);
        this.cdRef.detectChanges();
      }, (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message)
      });
    }
    else if (this.btnStatus == "Reached the destination") {
      this.notificationMessage = 'Your package on ad ' + this.adData.ad_title + ' has reached the destinaion.';
      this.dataService.PostReachedDestination(this.adID).subscribe(res => {
        this.btnStatus = "Verify PIN";
        this.hidereachedli = true;
        this.hidetrack = false;
        this.pickUpAlert = false;  
        this.SettingService.Success("Success")
        this.PostSenderConnectFirebase(this.notificationMessage);
        this.pinVerifyForCarrier('Please verify pin for ad ');
        this.cdRef.detectChanges();
      }, (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message)
      });
    }

    else if (this.btnStatus == "Verify PIN") {
      this.modalReference = this.modalService.open(verificationmodal, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width', backdrop: 'static', centered: true });
    }
    else if (this.btnStatus == "Confirm Delivery") {
      this.notificationMessage = 'Delivery confirmed by sender on ' + todayDate + ' for ad ' + this.adData.ad_title + ' by ' + user.fname + ' ' + user.lname
      this.dataService.PostDilevered(this.adID, this.offererid).subscribe(res => {
        this.btnStatus = "Deal Closed";
        if (+localStorage.getItem('userId') == +this.adData.creater.id && this.adData.ad_type == 1 && this.adData.carrier_feedbacks ==null) {
          this.hidefeedback = false;
        }
        this.hidedelieveredli = true;
        this.hidedileverybtn = true;
        this.hidedealdone = true;
        this.hidestatus = true;
        this.deliveryAlert = false;
        this.disabledstatusbutton = true;
        this.SettingService.Success("Success")
        this.PostSenderConnectyesFirebase(this.notificationMessage);
        this.PostSenderConnectFirebase('Deal Done Successfully for ad ' + this.adData.ad_title + ' on ' + todayDate + '. Please rate carrier.');
        this.notificationForCarrier('Deal Done Successfully for ad ' + this.adData.ad_title + ' on ' + todayDate);
        this.cdRef.detectChanges();
      }, (err: HttpErrorResponse) => {
        this.SettingService.Error(err.message)
      })
    }

    else if (this.btnStatus == "Deal Closed") {
      this.hidestatus = true;
      this.hidetrack = true
      this.hidedealdoneli = false
    } else {
    }

  }

  PostDelieverd() {
    let userId = localStorage.getItem("userId")
    this.dataService.PostDilevered(this.adID, userId).subscribe(res => {
      this.btnStatus = "Deal Closed";
      this.hidedelieveredli = false
      this.hidedileverybtn = true;
      this.hidetrack = true
      this.hidestatus = true
      this.PostSenderConnectFirebase("Deal marked as Done!")
      this.SettingService.Success("Success")
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    })
  }

  OpenFeedback(feedback) {
    this.modalReference = this.modalService.open(feedback, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
  }

  openCancelModal(verifyCancel) {
    if (this.userid != this.loginuser.id)
      this.cancelDealWith = this.adData.first_name;
    else
      this.cancelDealWith = this.adData.offerorName;

    this.modalReference = this.modalService.open(verifyCancel, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
  }

  openConfirmationCancelModal(confirmCancel) {
    if (this.userid != this.loginuser.id)
      this.cancelDealWith = this.adData.first_name;
    else
      this.cancelDealWith = this.adData.offerorName;

    this.modalReference = this.modalService.open(confirmCancel, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-width' })
  }

  PostFeedback() {

    this.loader.start();
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    var textvalue = this.VerificationForem.controls['verification'].value;
    this.hidefeedback=true;
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
    this.notificationMessage = 'You have been rated with ' + this.ratingValue + ' Stars & ' + "'"+ this.FeedbackForm.controls['review'].value + "'" + ' comment, by ' + user.fname + ' ' + user.lname + ' for ad ' + this.adData.ad_title + ' on ' + todayDate;
    let ad_type = 1;
    this.dataService.Feedbacks(this.adID, this.FeedbackForm.controls['review'].value, this.ratingValue, this.offererid, ad_type).subscribe(res => {
      this.loader.stop();
      let loginuserId = localStorage.getItem("userId")
      localStorage.setItem("ratingadId", this.adID);
      localStorage.setItem("ratinguserId", loginuserId)
      this.modalService.dismissAll();
      this.hidefeedback = true;
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

  pinVerifyForCarrier(message:string) {
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.adData.ad_type == 1) {
      obj = {
        adId: +this.adID,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +this.offererid,
        fromUserName: user.fname + " " + user.lname,
        notificationText: message + this.adData.ad_title + ' ' + (todayDate ? todayDate: ''),
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

  adDeliverdNotificationForSender(message:string) { 
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.adData.ad_type == 1) {
      obj = {
        adId: +this.adID,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +this.userid,
        fromUserName: user.fname + " " + user.lname,
        notificationText: message + this.adData.ad_title + ' ' + todayDate + ' by ' + user.fname + ' ' + user.lname + '. Plese confirm delivery.',
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

  notificationForCarrier(message:string) {
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.adData.ad_type == 1) {
      obj = {
        adId: +this.adID,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +this.offererid,
        fromUserName: user.fname + " " + user.lname,
        notificationText: message ,
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
  cancelFirebaseNotification() {
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    let toId: any;
    if (user.id == this.offererid) toId = this.adData.user_id;
    else toId = this.offererid;
    if (this.adData.ad_type == 1) {
      obj = {
        adId: +this.adID,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +toId,
        fromUserName: user.fname + " " + user.lname,
        notificationText: 'Cancellation request received by ' + user.fname + ' ' + user.lname + ' for Sender Ad' + ' ' + this.adData.ad_title + ' on ' + todayDate,
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
        this.cancelFirebaseNotificationFOrOwner();
      })
      .catch((err) => {
      });
  }

  cancelFirebaseNotificationFOrOwner() { 
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.adData.ad_type == 1) {
      obj = {
        adId: +this.adID,
        // fromUserId: +localStorage.getItem("userId"),
        toUserId: +localStorage.getItem("userId"),
        fromUserName: user.fname + " " + user.lname,
        notificationText: 'Cancellation request sent by you for Sender Ad' + ' ' + this.adData.ad_title + ' on ' + todayDate,
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
function tab(arg0: (data: any) => void): import("rxjs").OperatorFunction<Object, unknown> {
  throw new Error('Function not implemented.');
}

