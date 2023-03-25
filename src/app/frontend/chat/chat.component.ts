import { SharedService } from './../services/shared.service';
import { SettingService } from './../../app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription, timer } from 'rxjs';
import { ChatService } from './chat.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { transition, trigger, useAnimation } from '@angular/animations';
import { zoomIn } from 'ng-animate';
import { AngularFirestore } from '@angular/fire/firestore';
import { GoogleAdsService } from './../services/google-ads.service';
import { SafeHtml } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ScrollToBottomDirective } from '../../scroll-to-bottom.directive';
import { DeviceDetectorService } from 'ngx-device-detector';
import datetimeDifference from "datetime-difference";
import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { PresenceService } from 'src/app/shared/presence.service';
@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
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
export class ChatComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild(ScrollToBottomDirective, { static: true })
  scroll: ScrollToBottomDirective;

  @ViewChild("scrollMe", { static: false }) private scrollMe: ElementRef;
  @ViewChild("scrollBottom", { static: true }) private scrollBottom: ElementRef;

  mrcURL: string = "https://pacsend.tech";
  buttondisable:boolean = false;

  ChatForm: FormGroup;
  modalReference: any;
  clickSender: boolean = true;
  clickAttachmentClip: boolean = false;
  hidenomsg: boolean = true;
  clickCarrier: boolean = false;
  hidebutton: boolean = false;
  asSender = true;
  asCarrier = false;
  carrierChats = false;
  searchText;
  senderChats = true;
  Carrier = [];
  Sender: any = [];
  Chat: any = [];
  name: any;
  files: any = null;
  lastame: any;
  fromlocation: any;
  tolocation: any;
  weight: any;
  date: any;
  image: any;
  hidechat: boolean = true;

  Message = [];
  chatheadid: any;
  adId: any;
  userid: string;
  hideicon: boolean = false;
  hidetext: boolean = false;
  distance: any;
  Categories = [];
  hidekey: boolean = true;
  hideshield: boolean = true;
  carrier_id: any;
  sender_id: any;
  offerer_id: any;
  pin: any;
  is_offer: any;
  chatname: any;
  is_accepted: any;
  ad_type: any;
  requester: any;
  requestername: any;
  requesterimage: any;
  zoomIn: any;
  subscription: Subscription;
  offeror: any;
  hidecontact: boolean = true;
  Name: any;
  number: any;
  ChatUser = [];
  ad_id: any;
  senderSelect: any = [];
  chatAdId: string;
  adType: any;
  hidenochat: boolean = false;
  hideaward: boolean;
  container: HTMLElement;
  adImage: any;
  carrierSelect: any = [];
  checkChatShow: boolean = false;
  chatPicOpend: boolean = false;
  googleAdsImage: string;
  googleAdsImageChatTop: string;
  googleAdsScript: SafeHtml | any;
  hideAttachmentModal: boolean = false;
  adDetails: any;
  chathide: any;
  l = {
    hasProgressBar: false,
    loaderId: "my-ads",
    logoSize: 80,
    isMaster: false,
    spinnerType: "ball-scale-multiple",
  };

  options = {
    componentRestrictions: {},
  };
  addressGmap: any;
  lat: number = 25.2048; //intial marker
  lng: number = 55.2708; //intial marker
  fileToUpload: File | null = null;
  fileAttachmentType: string;
  showChatMobile: boolean;
  device: string;
  deviceInfo = null;
  checkChatShowSender: any;
  chatShowDisable: boolean = false;
  imageOPen: string;
  fileEvent: any;
  msgType: any;
  modalReference1: any;
  isMobileScreen = false;
  imageBaseUrl = "https://pacsend.tech/public/uploads/users/";
  tagImgUrl = "https://pacsend.tech/public/uploads/category/";
  adBaseImgUrl = "https://pacsend.tech/public/uploads/adds/";
  selectedSenderIndex: any;
  selectedCarrierIndex: any;
  private geoCoder;
  // @Input() uid = '805046';
  uid = 'XGxIV8DpFwT3pmXU4D5A';
  presence:any = [];
  userStatus = 'offline';
  isUserActive = false;
  chatUserId: any;
  docId: any;
  constructor(
    private route: Router,
    private _chatservice: ChatService,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private db: AngularFirestore,
    private settingService: SettingService,
    private googlAdsService: GoogleAdsService,
    private loader: NgxUiLoaderService,
    private sharedService: SharedService,
    private deviceService: DeviceDetectorService,
    private cdRef: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader,
    private presenseService: PresenceService,
    private fireBaseDb: AngularFireDatabase,
  ) {
    this.epicFunction();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.device = this.deviceInfo.os;
    if (this.device == "Android" || this.device == "iOS") {
      this.showChatMobile = false;
      this.isMobileScreen = true;
    }
  }
  inc = 0;
  @HostListener("document:click", ["$event"]) onDocumentClick(event) {
    // this.hideAttachmentModal = false;
    var value = document.querySelector(".card-atatchment");
    if (value && this.hideAttachmentModal) {
      this.inc++;
      if (this.inc > 1) {
        this.hideAttachmentModal = false;
        this.inc = 0;
      } else {
        this.hideAttachmentModal = true;
      }
    }
  }
  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      if (params.userChatId) {
        this.chatAdId = params.userChatId;
      }
      if (params.adType) {
        this.adType = params.adType;
      }
    });
    this.userid = localStorage.getItem("userId");
    this.docId = localStorage.getItem('documentId');
    this.presenseService.setUserStatusOfflineAndOnline(this.docId, 'online');
    this.initform();
    this.GetSenderchatList();
    this.GetCarrierchatList();

    if (this.checkChatShowSender) {
      this.chatShowDisable = true;
    }
    this.GetMessageFireBase();
    this.googlAdsService.getAds().subscribe((data) => {
      for (let element of data.data) {
        if (element.slot_name == "ChatTop") {
          if (element.image != null && element.script == null) {
            this.googleAdsImageChatTop = element.image;
          } else if (element.script != null) {
            this.googleAdsScript = element.script;
          }
          break;
        }
      }
    });
    this.getLocation();
    // get online user status
    this.sharedService.getUserStatusData().subscribe((res) => {
      if (res) {
        this.presence = res.userData;
        this.getChatMessages(this.chatheadid);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  ngAfterViewInit(): void {
    this.getCurrentLocation();
  }

  getLocation() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  private getCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((possition: any) => {
        this.lat = possition.coords.latitude;
        this.lng = possition.coords.longitude;
      });
    }
  }

  scrollToBottom() {
    try {
      this.scrollMe.nativeElement.scrollTop =
        this.scrollMe.nativeElement.scrollHeight;
    } catch (err) {}
  }

  updateScroll() {
    var element = document.getElementById("myDIV");
    element.scrollTop = element.scrollHeight;
  }

  chatPicOpen(chatpicopend, pic) {
    this.imageOPen = "https://pacsend.tech/public/uploads/chat/" + pic;
    this.chatPicOpend = true;
    this.modalReference = this.modalService.open(chatpicopend, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
    });
  }

  findLocation($event) {
    this.addressGmap = $event.name + " - " + $event.formatted_address;
    this.lat = $event.geometry.location.lat();
    this.lng = $event.geometry.location.lng();
    this.hideAttachmentModal = false;
    let msg = this.lat + "+" + this.lng;
    this.GetSendMessaged(msg, 4);
    this.modalReference1.close();
    this.cdRef.detectChanges();
  }

  // this.modalReference.close();
  handleFileInput(event, msgType) {
    this.fileEvent = event;
    this.msgType = msgType;
  }

  okSend() {
    if (this.fileEvent.target.files && this.fileEvent.target.files[0]) {
      this.modalReference1.close();
      this._chatservice
        .GetSendMessages(
          this.sender_id,
          this.chatheadid,
          "",
          this.msgType,
          this.fileEvent.target.files[0]
        )
        .subscribe((res: any) => {
          this.ClickChat(this.chatheadid, false);
          this.hideAttachmentModal = false;
          this.SendMessageFirebase(res.data.attachment, true);
          this.msgType = "";
        });
      this.fileEvent = "";
    }
  }

  initform() {
    this.ChatForm = this.fb.group({
      message: [],
    });
  }

  GetSenderchatList() {
    this._chatservice.getSenderChatlist().subscribe(
      (res) => {
        if (res) {
          let openChat = true;
          this.Sender = res["data"];
          if (this.Sender.length > 0) {
            this.checkChatShow = true;
            this.checkChatShowSender = true;
          } else {
          }
          if (this.Sender != null) {
            let ele = this.Sender.find((x) => x.sender_ad_id == this.chatAdId);
            let idx = this.Sender.findIndex(
              (x) => x.sender_ad_id == this.chatAdId
            );
            if (ele) {
              this.senderSelect1(idx);
              this.clickSenderHow();
              this.ClickChat(ele.chat_head_id);
            }
            if (openChat == true && this.Sender.length > 0) {
              this.ClickChat(this.Sender[0].chat_head_id);
              setTimeout(() => this.senderSelect1(0));
              this.senderSelect1(0);
            }
          }
          this.ChatUser = this.Sender["chat_user"];
          this.cdRef.detectChanges();
        }
      },
      (err: HttpErrorResponse) => {
        this.settingService.Error(err.message);
      }
    );
  }
  GetCarrierchatList() {
    this._chatservice.getCarrierChatlist().subscribe(
      (res) => {
        if (res) {
          this.Carrier = res["data"];

          if (this.Carrier.length > 0) {
            this.checkChatShow = true;
            // this.Carrier.forEach((ele, index) => {
            let ele = this.Carrier.find(
              (x) => x.carrier_ad_id == this.chatAdId
            );
            let idx = this.Carrier.findIndex(
              (x) => x.carrier_ad_id == this.chatAdId
            );
            if (ele) {
              this.carrierSelect1(idx);
              this.clickCarrierHow();
              this.ClickChat(ele.chat_head_id);
            }
          }
          this.cdRef.detectChanges();
        }
      },
      (err: HttpErrorResponse) => {
        this.settingService.Error(err.message);
      }
    );
  }

  senderSelect1(i) {
    this.selectedSenderIndex = i;
    if (this.Sender != null) {
      this.Sender.forEach((element, index) => {
        this.senderSelect[index] = false;
      });
      this.senderSelect[i] = true;
      this.carrierSelect[this.selectedCarrierIndex] = false;
    }
  }

  carrierSelect1(i) {
    this.selectedCarrierIndex = i;
    if (this.Carrier != null) {
      this.Carrier.forEach((element, index) => {
        this.carrierSelect[index] = false;
      });
      this.carrierSelect[i] = true;
      this.senderSelect[this.selectedSenderIndex] = false;
    }
  }

 

  ImageClick(attahcment, type: any) {
    this.fileAttachmentType = type;
    this.fileToUpload = type;

    this.modalReference1 = this.modalService.open(attahcment, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
    });
    setTimeout(() => {
      this.loader.stop();
    }, 1500);
  }

  Openattahcmentmodal(attahcment) {
    this.hideAttachmentModal = !this.hideAttachmentModal;
    this.clickAttachmentClip = !this.clickAttachmentClip;
  }

  clickSenderHow() {
    if (this.device == "Android" || this.device == "iOS")
      this.showChatMobile = false;
    this.adType = 1;
    this.asSender = true;
    this.asCarrier = false;
    this.clickSender = true;
    this.clickCarrier = false;
    this.carrierChats = false;
    this.senderChats = true;
    if (this.selectedCarrierIndex) {
      this.carrierSelect[this.selectedCarrierIndex] = false;
    }
  }

  clickCarrierHow() {
    if (this.device == "Android" || this.device == "iOS")
      this.showChatMobile = false;
    this.adType = 2;
    this.asCarrier = true;
    this.asSender = false;
    this.clickSender = false;
    this.clickCarrier = true;
    this.senderChats = false;
    this.carrierChats = true;
    if (this.selectedSenderIndex) {
      this.senderSelect[this.selectedSenderIndex] = false;
    }
  }

  getmessage() {
    // this.loader.startLoader('');
    let id = localStorage.getItem("usermsgid");
    if (id) {
      this._chatservice.GetChatMesages(id).subscribe((result) => {
        this.Message = result["data"].messages;
        this.adDetails = result["data"].ad;

        if (this.Message && this.Message.length > 0) {
          let chatDateTime;
          let dateTime;
          this.Message.forEach((mess) => {
            dateTime = mess.dateTime.split(" ");
            chatDateTime = this.calculateMessageDateTime(
              dateTime[0].split("-")[1] +"/" + dateTime[0].split("-")[2] +"/" + dateTime[0].split("-")[0] + "," + dateTime[1]
            );
            mess.chatDateTime = chatDateTime;
            if (mess.message_type == 2)
              mess.extension = mess.attachment.split(".")[1];

            if (mess.message_type == 4) {
              mess.lat = mess.message.split("+")[0];
              mess.lng = mess.message.split("+")[1];
            }
          });
          this.hidenochat = false;
          this.hidechat = true;
        } else {
          this.hidenochat = true;
          this.hidechat = false;
        }

        this.cdRef.detectChanges();

        this.loader.stopLoader("my-ads");
      });
    }
  }
  SeeAdDetail() {
    if (this.Chat.ad_type == 2) {
      this.sharedService.getCarrierDetail(this.Chat);
      // this.route.navigate(['/all-ads/carrier-details/' + this.ad_id]);
    } else if (this.Chat.ad_type == 1) {
      this.sharedService.getSenderDetail(this.Chat);
      // this.route.navigate(['/all-ads/sender-details/' + this.ad_id]);
    }
  }
  async ClickChat(id, noLoader?) {
    if (noLoader == undefined) this.loader.start();
    await this.presenseService.getUserStatus();
    this.chatheadid = id;
    this.hidechat = false;
    this.hidenochat = false;
    this.hideshield = true;
    this.hidekey = true;
    localStorage.setItem("usermsgid", id);
    this.getChatMessages(id);
  }

  private getChatMessages(id) {
    this._chatservice.GetChatMesages(id).subscribe(
      (res) => {
        this.Chat = res["data"].ad;
        this.adImage = this.Chat["ad_image"];
        this.offeror = this.Chat["offeror"];
        this.name = this.Chat["fname"];
        this.lastame = this.Chat["lname"];
        this.fromlocation = this.Chat["ad_from_location"];
        this.ad_id = this.Chat["ad_id"];
        this.tolocation = this.Chat["ad_to_location"];
        this.weight = this.Chat["ad_weight"];
        this.date = this.Chat["date"];
        this.image = this.Chat["image"];
        this.Message = res["data"].messages;
        this.adId = this.Chat["ad_id"];
        this.distance = this.Chat["distance"];
        this.Categories = this.Chat["categories"];
        this.offerer_id = res["data"].carrier_id;
        this.is_accepted = res["data"].is_accepted;
        this.is_offer = this.Chat["is_offer"];
        this.sender_id = this.Chat["sender_id"];
        this.carrier_id = res['data'].carrier_id;
        this.chatUserId = res['data'].chatter.userId;
        this.ad_type = res["data"].ad_type;
        this.requester = res["data"].chatter;
        this.requestername = this.requester["chatter_name"];
        this.requesterimage = this.requester["chatter_image"];
        let userId = localStorage.getItem("userId");
        this.checkUserChatUserStatus();
        let chatDateTime;
        let dateTime;
        this.Message.forEach((mess) => {
          dateTime = mess.dateTime.split(" ");
          chatDateTime = this.calculateMessageDateTime(
            dateTime[0].split("-")[1] +"/" + dateTime[0].split("-")[2] +"/" + dateTime[0].split("-")[0] + "," + dateTime[1]
          );
          mess.chatDateTime = chatDateTime;
          if (mess.message_type == 2)
            mess.extension = mess.attachment.split(".")[1];

          if (mess.message_type == 4) {
            mess.lat = mess.message.split("+")[0];
            mess.lng = mess.message.split("+")[1];
          }
        });
        if (
          this.sender_id == userId &&
          this.is_offer == 0 &&
          this.is_accepted == 0
        ) {
          // if (this.is_offer == 0 && this.is_accepted == 0) {
          this.hidebutton = false;
          this.hidetext = true;
          this.hideshield = false;
          this.hideaward = false;
        } else {
          this.hidebutton = true;
          this.hidetext = false;
          this.hideshield = true;
          this.hideaward = false;
          if (this.is_accepted == 1) {
            this.hideaward = true;
          }
        }

        if (this.is_offer == 0 && this.is_accepted == 0) {
          this.hidetext = true;
        } else {
          this.hidetext = false;
        }

        if (this.ad_type == 1) {
          if (this.sender_id == userId) {
            if (this.is_offer == 1) {
              this.hideshield = true;
              this.hidekey = false;
            } else {
              this.hideshield = false;
              this.hidekey = true;
            }
          }
        } else if (this.ad_type == 2) {
          if (this.offerer_id == userId) {
            if (this.is_offer == 1) {
              this.hideshield = true;
              this.hidekey = false;
            } else {
              this.hideshield = false;
              this.hidekey = true;
            }
          } else {
            this.hideshield = true;
            this.hidekey = true;
          }
        }
        this.chatheadid = id;
        if (this.device == "Android" || this.device == "iOS")
          this.showChatMobile = true;
        this.cdRef.detectChanges();
      },
      (err) => {
        // this.presenseService.setUserStatusOfflineAndOnline(this.docId, 'offline')
        // this.settingService.Error(err.message);
      }
    );
    this.loader.stop();
    this.chatShowDisable = true;
  }

  private checkUserChatUserStatus() { 
    this.userStatus = '';
    if (this.presence.length) {
      for (let i = 0; i < this.presence.length; i++) {
        if (this.presence[i].data.userId == this.chatUserId) {
          this.userStatus = this.presence[i].data.status;
          this.isUserActive = this.userStatus == 'online' ? true : false;
          break;
        } else {
          this.isUserActive = false;
          this.userStatus = "offline";
        }
      }
    }
  }

  PostAccept() {
    if(this.buttondisable == true){
      return false;
    }
    this.buttondisable = true;
    if (this.ad_type == 1) {
      this._chatservice
        .PostActionRequest(1, this.adId, this.offerer_id)
        .subscribe(
          (res) => {
            this.buttondisable = false;
            this.settingService.Success("Request Accepted Succesfully");
            this.hidebutton = true;
            this.hidetext = false;
            if (this.sender_id == this.userid) {
              this.hideaward = true;
              this.hideshield = false;
            }
            this.cdRef.detectChanges();
          },
          (err: HttpErrorResponse) => {
            this.settingService.Error(err.message);
          }
        );
    } else {
      this._chatservice
        .PostActionRequestCarrier(1, this.adId, this.offerer_id)
        .subscribe(
          (res) => {
            this.buttondisable = false;
            this.settingService.Success("Request Accepted Succesfully");
            this.hidebutton = true;
            this.hidetext = false;
            if (this.sender_id == this.userid) {
              this.hideaward = false;
              this.hideshield = false;
            }

            this.cdRef.detectChanges();
          },

          (err: HttpErrorResponse) => {
            this.settingService.Error(err.message);
          }
        );
    }
  }

  PostReject() {
    this._chatservice
      .PostActionRequest(2, this.adId, this.offerer_id)
      .subscribe(
        (res) => {
          this.settingService.Success("Request Reject Succesfully");
          this.hidebutton = true;
          this.hidetext = true;
        },
        (err: HttpErrorResponse) => {
          this.settingService.Error(err.message);
        }
      );
  }

  PostAward(pointOfContact) {
    if(this.buttondisable == true){
      return false;
    }
    this.buttondisable = true;
    if (this.ad_type == 1) {
      this._chatservice
        .PostOfferAcceptance(this.adId, this.offerer_id)
        .subscribe(
          (res) => {
            this.pin = res["data"].pin;
            this.hideaward = true;
            this.hideshield = true;
            this.hidekey = false;
            this.buttondisable = false;
            this.settingService.Success("Offer Awarded Successfully");
            this.assignJobFirebaseNotification(this.Chat);
            setTimeout(() => {
              this.assignOwnerJobNotification(this.Chat);
            }, 300);
            this.cdRef.detectChanges();
          },
          (err: HttpErrorResponse) => {
            this.settingService.Error(err.message);
            this.hidekey = true;
            this.hideshield = false;
            this.cdRef.detectChanges();
          }
        );
    } else if (this.ad_type == 2) {
      this.buttondisable = false;
      this.modalReference = this.modalService.open(pointOfContact, {
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-width",
      });
    }
  }

  OpenPinModal(pinmodal) {
    this.modalReference = this.modalService.open(pinmodal, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "modal-width",
    });
  }

  PostVerificationPIN(pinmodal) {
    if (this.ad_type == 1) {
      this._chatservice.PostVerificationPIN(this.adId).subscribe(
        (res) => {
          this.pin = res["verfication_pin"];
          if (this.pin) {
            this.OpenPinModal(pinmodal);
          }
          this.hidekey = false;
          this.hideshield = true;
          this.cdRef.detectChanges();
        },
        (err: HttpErrorResponse) => {
          this.settingService.Error(err.message);
          this.hidekey = true;
          this.hideshield = false;
          this.cdRef.detectChanges();
        }
      );
    } else if (this.ad_type == 2) {
      this._chatservice.PostVerificationPinfoprCarrier(this.adId).subscribe(
        (res) => {
          this.pin = res["verfication_pin"];
          if (this.pin) {
            this.OpenPinModal(pinmodal);
          }
          this.hidekey = false;
          this.hideshield = true;
        },
        (err: HttpErrorResponse) => {
          this.settingService.Error(err.message);
          this.hidekey = true;
          this.hideshield = false;
        }
      );
    }
  }

  PostPointofContact(pointcontactnumber, pointcontactname) {
    this.loader.start();
    if (pointcontactnumber.length > 20) {
      this.settingService.Error("Contact number is too long!");
      this.loader.stop();
    } else {
      this.loader.stop();
      this._chatservice
        .PostAwardForCarrier(
          this.adId,
          this.offerer_id,
          pointcontactnumber,
          pointcontactname
        )
        .subscribe(
          (res) => {
            this.loader.stop();
            this.settingService.Success("Offer Awarded Successfully");
            this.hidekey = false;
            this.hideshield = true;
            this.cdRef.detectChanges();
            this.assignJobFirebaseNotification(this.Chat);
            setTimeout(() => {
              this.assignOwnerJobNotification(this.Chat);
            }, 300);
          },
          (err: HttpErrorResponse) => {
            this.settingService.Error(err.message);
            this.hidekey = true;
            this.hideshield = false;
            this.loader.stop();
          }
        );
    }
  }

  PostSenderConnectFirebase(type: string) {
    let obj = {};
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (this.ad_type == 1) {
      obj = {
        adId: +this.adId,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +this.offerer_id,
        fromUserName: user.fname + " " + user.lname,
        notificationText:
          type +
          " Sender ad " +
          this.Chat.ad_title +
          " is accepted by " +
          user.fname +
          " " +
          user.lname +
          " on " +
          todayDate,
        createdAt: new Date(),
        updatedAt: "",
        message: "",
        adType: +this.ad_type ? this.ad_type : 0,
        isRead: 0,
      };
    } else if (this.ad_type == 2) {
      obj = {
        adId: +this.adId,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +this.offerer_id,
        fromUserName: user.fname + " " + user.lname,
        notificationText:
          type +
          " Carrier ad " +
          this.Chat.ad_title +
          " is accepted by " +
          user.fname +
          " " +
          user.lname +
          " on " +
          todayDate,
        createdAt: new Date(),
        updatedAt: "",
        message: "",
        adType: +this.ad_type ? this.ad_type : 0,
        isRead: 0,
      };
    }

    this.db
      .collection("Notification")
      .add(obj)
      .then(() => {})
      .catch((err) => {
        this.settingService.Error(err);
      });
  }

  onEnter() {
    this.GetSendMessaged(this.ChatForm.controls["message"].value);
    window.scrollTo(0, document.querySelector(".chatbox").scrollHeight);
  }

  GetSendMessaged(message, msgType?) {
    let type;
    if (msgType != undefined) type = msgType;
    else type = 0;

    if (!message && type == 0) {
      this.settingService.Info("Type message .........");
    } else {
      this._chatservice
        .GetSendMessages(this.sender_id, this.chatheadid, message, type)
        .subscribe(
          (res: any) => {
            let messageDateTime = res.data.date.split("-")[1] +"/" + res.data.date.split("-")[2] +"/" + res.data.date.split("-")[0] + "," + res.data.time;
            this.calculateMessageDateTime(messageDateTime);
            this.ClickChat(this.chatheadid, false);
            this.Message.push();
            this.SendMessageFirebase(message);
            this.ChatForm.reset();
            this.ChatForm.controls["message"].setValue("");
          },
          (err: HttpErrorResponse) => {
            this.settingService.Error(err.message);
          }
        );
    }
  }

  assignJobFirebaseNotification(chat: any) {
    let obj = {};
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    let user: any = JSON.parse(localStorage.getItem("user"));
    if (chat.ad_type == 1) {
      obj = {
        adId: +this.adId,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +this.offerer_id,
        fromUserName: user.fname + " " + user.lname,
        notificationText:
          user.fname +
          " " +
          user.lname +
          " has awarded you the Sender ad" +
          " " +
          chat.ad_title +
          " on " +
          todayDate,
        createdAt: new Date(),
        updatedAt: "",
        adType: chat.ad_type,
        isRead: 0,
      };
    } else {
      obj = {
        adId: +this.adId,
        fromUserId: +localStorage.getItem("userId"),
        toUserId: +this.Chat.sender_id,
        fromUserName: user.fname + " " + user.lname,
        notificationText:
          user.fname +
          " " +
          user.lname +
          " has awarded you the Carrier ad" +
          " " +
          chat.ad_title +
          " on " +
          todayDate,
        createdAt: new Date(),
        updatedAt: "",
        adType: chat.ad_type,
        isRead: 0,
      };
    }
    this.db
      .collection("Notification")
      .add(obj)
      .then(() => {})
      .catch((err) => {
        this.settingService.Error(err);
      });
  }
  assignOwnerJobNotification(chat: any) {
    let adOwner = {};
    let ad = "";
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    if (chat.ad_type == 1) ad = "Sender Ad";
    else ad = "Carrier Ad";
    // if (user.id == chat.sender_id) {
    adOwner = {
      adId: +this.adId,
      fromUserId: +localStorage.getItem("userId"),
      toUserId: +localStorage.getItem("userId"),
      fromUserName: user.fname + " " + user.lname,
      notificationText:
        "You have awarded to " +
        this.requestername +
        " on the " +
        ad +
        " " +
        chat.ad_title +
        " on " +
        todayDate,
      createdAt: new Date(),
      updatedAt: "",
      adType: chat.ad_type,
      isRead: 0,
    };
    this.db
      .collection("Notification")
      .add(adOwner)
      .then(() => {})
      .catch((err) => {
        this.settingService.Error(err);
      });
    // }
  }

  SendMessageFirebase(message: string, isAttachment?) {
    let user: any = JSON.parse(localStorage.getItem("user"));
    let today = new Date();
    let pip = new DatePipe("en-US");
    let todayDate = pip.transform(today, "dd/MM/yyyy");
    let obj: any;
    if (this.Chat.ad_type == 1) {
      obj = {
        fromUserId: +user.id,
        adId: this.ad_id,
        toUserId:
          +this.offerer_id == +localStorage.getItem("userId")
            ? +this.sender_id
            : +this.offerer_id,
        fromUserName: user.fname + " " + user.lname,
        message: !isAttachment ? message : "",
        adType: !isAttachment ? 3 : this.msgType,
        isRead: 0,
        notificationText:
          "A new message reply received from " +
          " " +
          user.fname +
          " " +
          user.lname +
          " on " +
          todayDate +
          " for Sender ad " +
          this.Chat.ad_title,
        createdAt: new Date(),
        updatedAt: "",
      };
      if (isAttachment) {
        obj.attachment = message;
      }
    } else if (this.Chat.ad_type == 2) {
      obj = {
        fromUserId: +user.id,
        adId: this.ad_id,
        toUserId:
          +this.offerer_id == +localStorage.getItem("userId")
            ? +this.sender_id
            : +this.offerer_id,
        fromUserName: user.fname + " " + user.lname,
        message: !isAttachment ? message : "",
        adType: !isAttachment ? 3 : this.msgType,
        isRead: 0,
        notificationText:
          "A new message reply received from " +
          " " +
          user.fname +
          " " +
          user.lname +
          " on " +
          todayDate +
          " for Carrier ad " +
          this.Chat.ad_title,
        createdAt: new Date(),
        updatedAt: "",
      };
      if (isAttachment) {
        obj.attachment = message;
      }
    }
    this.db
      .collection("Notification")
      .add(obj)
      .then((res) => {})
      .catch((err) => {});
  }

  GetMessageFireBase() {
    this.db
      .collection("Notification")
      .snapshotChanges()
      .subscribe((querySnapshot) => {
        let userId = localStorage.getItem("userId");
        if (querySnapshot.length > 0) {
          this.getmessage();
        }
      });
  }

  calculateMessageDateTime(date) {
    return '';
    var time = new Date().toLocaleTimeString();
    var datee = new Date().toLocaleDateString();
    const date1 = new Date(datee + "," + time);
    const date2 = new Date(date);
    const result = datetimeDifference(date1, date2);
    
    let chatDateTime;
    if (result.years != 0 && result.months != 0) {
      if (result.months == 1) {
        chatDateTime =
          result.years + "_year, " + result.months + " _month ago.";
      } else {
        chatDateTime =
          result.years + " _year, " + result.months + " _months ago.";
      }
      return chatDateTime;
    } else if (result.years != 0) {
      if (result.years == 1) {
        chatDateTime = result.years + " year ago.";
      } else {
        chatDateTime = result.years + " years ago.";
      }
      return chatDateTime;
    } else if (result.months != 0) {
      if (result.months == 1) {
        chatDateTime = result.months + " month ago.";
      } else {
        chatDateTime = result.months + " months ago.";
      }
      return chatDateTime;
    } else if (result.days != 0) {
      if (result.days == 1) {
        chatDateTime = result.days + " day ago.";
      } else {
        chatDateTime = result.days + " days ago.";
      }
      return chatDateTime;
    } else if (result.hours != 0) {
      if (result.hours == 1) {
        chatDateTime = result.hours + " hour ago.";
      } else {
        chatDateTime = result.hours + " hours ago.";
      }
      return chatDateTime;
    } else if (result.minutes != 0) {
      if (result.minutes == 1) {
        chatDateTime = result.minutes + " minute ago.";
      } else {
        chatDateTime = result.minutes + " minutes ago.";
      }
      return chatDateTime;
    } else if (result.seconds != 0) {
      if (result.seconds == 10) {
        chatDateTime = result.seconds + " seconds ago.";
      } else {
        chatDateTime = "just now.";
      }
      return chatDateTime;
    }
  }
 
}
