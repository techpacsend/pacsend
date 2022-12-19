import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { LoginService } from '../login/login.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { SettingService } from "../../app.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  userDetails:any;
  userimage: any;
  constructor(public router: Router,private settingService: UserProfileService, private _notification: NzNotificationService, private _LoginService: LoginService, private SettingService: SettingService) { }
  ngOnInit() {

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.userimage = user.image


    this.getOnlineUser();
  }

  getOnlineUser() {
    let userid = localStorage.getItem("userId")
    this.settingService.getUser(userid).subscribe((data: any[]) => {
      this.userDetails = data['data'];
    }, (err: HttpErrorResponse) => {
      this.SettingService.Error(err.message)
    })
  }

  ChangePassword(currentpassword, newpassword, confirmpassword) {


    if (newpassword.length==0){
      this.SettingService.Error("please enter new new password ");
    }

    if (confirmpassword.length==0) {
      this.SettingService.Error("please enter new confirm password");
    }

     if (currentpassword.length==0) {
      this.SettingService.Error("please enter new Old passsword");
    }

    else if (this.checkPasswords(newpassword, confirmpassword)) {
      this.SettingService.Error("please make sure your passowrds match...");
    }

    else {
      let userid = localStorage.getItem("userId")
      this._LoginService.ChangePassword(currentpassword, newpassword).subscribe(res => {
        this.SettingService.Success("Change Password Successfully...");
        this.router.navigate(["user-profile/" + userid]);
      }, (err: HttpErrorResponse) => {
        this.SettingService.Error( err.message);
      })
    }
  }

  checkPasswords(newpassword, confirmpassword): Boolean {
    return newpassword === confirmpassword ? false : true
  }

}
