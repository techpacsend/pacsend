import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Component, OnInit } from "@angular/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { zoomIn } from "ng-animate";
import { NzNotificationService } from "ng-zorro-antd";
import { SharedService } from "../frontend/services/shared.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
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
export class NotificationComponent implements OnInit {
  NotificationsArray = [];
  scrollDistance = 6;
  scrollUpDistance = 2;
  throttle = 100;
  direction = "";
  scrollDisable: boolean = false;
  lastDocs = null;
  constructor(
    private db: AngularFirestore,
    private _notification: NzNotificationService,
    private shareService: SharedService,
    private route: Router
  ) {}

  ngOnInit() {
    this.GetNotificationFirebase();
  }

  GetNotificationFirebase() {
    if(this.NotificationsArray.length == 70 || this.NotificationsArray.length <=70){
      this.db
        .collection("Notification", (ref) =>
          ref
            .where("toUserId", "==", +localStorage.getItem("userId"))
            .where("isRead", "==", 0)
            .orderBy("createdAt", "asc")
            .limit(20)
            .startAfter(this.lastDocs || 0)
        )
        .snapshotChanges()
        .subscribe((querySnapshot) => {
          querySnapshot = querySnapshot.reverse();
          let Array = [];
          querySnapshot.forEach((doc) => {
            let data:any = {
              id: doc.payload.doc.id,
              data: doc.payload.doc.data(),
            };
            Array.push(data);
            Array.forEach((res) => {
              const result:any = {
                fromUserId: res.data.fromUserId,
                toUserId: res.data.toUserId,
                message: res.data.message,
                adId: res.data.adId,
                adType: res.data.adType,
                isRead: res.data.isRead,
                fromUserName: res.data.fromUserName,
                notificationText: res.data.notificationText,
                createdAt: res.data.createdAt,
                updatedAt: res.data.updatedAt,
                docId: res.id,

              };
            let duplicateNotification = this.NotificationsArray.find((x) => x.docId == result.docId);
              if (!duplicateNotification) { 
              this.NotificationsArray.push(result);
            }
            });
          });


          this.lastDocs = querySnapshot[querySnapshot.length - 1].payload.doc;
          if (querySnapshot.length % 10 !== 0) {
            this.scrollDisable = true;
          } else {
            this.scrollDisable = false;
          }
        });
    }
    // console.log('NotificationsArray',this.NotificationsArray)
    // console.log('NotificationsArray',this.NotificationsArray.reverse())
  }

  onScroll() {
    this.GetNotificationFirebase();
  }

  RouteChat(item) {
    this.route.navigateByUrl("/chat");
  }

  Route(item) {
    if (
      item.notificationText.includes("Connection request received") > 0 ||
      item.notificationText.includes("Connection request accepted") > 0
    ) {
      this.route.navigateByUrl("/chat");
    }
    else if (item.adType == 3 || item.notificationText.includes("A New Connection request is received")) {
      this.route.navigate(["/chat"], { queryParams: { adType:item.adType, userChatId: item.adId } });
    }
    else if (item.adType == 1) {
      this.shareService.getSenderDetail(item);
    } else if (item.adType == 2) {
      this.shareService.getCarrierDetail(item);
    } else {
      return false;
    }
  }
}
