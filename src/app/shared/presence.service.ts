import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { first, map, switchMap, tap } from "rxjs/operators";
import * as firebase from "firebase/app";
import { Observable, of } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { SharedService } from "../frontend/services/shared.service";
@Injectable({
  providedIn: "root",
})
export class PresenceService {
  obj: any = {};
  user: any;
  userStatusdata = [];
  docId: any;

  constructor(
    private afAuth: AngularFireAuth,
    private fireBaseDb: AngularFireDatabase,
    private db: AngularFirestore,
    private sharedService: SharedService
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.docId = localStorage.getItem('documentId');
    // this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }

  setUserStatusOnline() {
    this.obj = {
      status: "online",
      timestamp: "",
      userId: this.user.id,
    };
    this.db
      .collection("UserStatus")
      .add(this.obj)
      .then((res) => {
      })
      .catch((err) => {
      });
  }

  setUserStatusOfflineAndOnline(docId, status) {
    this.obj = {
      status: status,
      timestamp: "",
      userId: this.user.id,
    };
    this.db.doc(`UserStatus/${docId}`).update(this.obj);
  }

  getUserStatus() {
    let userData: any = [];
    this.db
      .collection("UserStatus",
        // (ref) => ref.where("status", "==", "online").where("status", "==", "offline")
      )
      .snapshotChanges()
      .subscribe((res) => {
        if (res.length) {
          res.forEach((doc) => {
            userData = {
              id: doc.payload.doc.id,
              data: doc.payload.doc.data(),
            };
            if (this.user.id == userData.data.userId) {
              localStorage.setItem("documentId", userData.id);
            }
            if (this.userStatusdata.length) {
              let dataIdx = this.userStatusdata.findIndex(
                (val) => val.data.userId == userData.data.userId
              );
              if (dataIdx != -1) {
                this.userStatusdata[dataIdx] = userData;
              } else {
                this.userStatusdata.push(userData);
              }
            } else {
              this.userStatusdata.push(userData);
            }
            this.sharedService.setUserStatusData(this.userStatusdata);
          });
          let checkValue = this.userStatusdata.find(
            (val) => val.data.userId == this.user.id
          );
          if (!checkValue) {
            this.setUserStatusOnline();
          }
        } else {
          this.setUserStatusOnline();
        }
      });
  }

  deleteUserStatus(id) {
    this.db.doc(`UserStatus/${id}`).delete();
  }
  updateOnAway() {
    document.onvisibilitychange = (e) => {
      if (document.visibilityState === "hidden") {
        this.setUserStatusOfflineAndOnline(this.docId,"offline");
      } else {
        this.setUserStatusOfflineAndOnline(this.docId,"online");
      }
    };
  }

  updateOnDisconnect() {
    return this.afAuth.authState.pipe(
      tap((user) => {
        if (user) {
          this.fireBaseDb
            .object(`UserStatus/${this.docId}`)
            .query.ref.onDisconnect()
            .update({
              status: 'offline',
              timestamp: "",
              userId: this.user.id,
            });
        }
      })
    );
  }
}
