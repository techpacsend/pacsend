import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PresenceService } from './shared/presence.service';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  
  footer = true;
  header = true;
  mob_view_none: any;

  constructor(private loader: NgxUiLoaderService,
    private spinner: NgxSpinnerService, private router: Router,
    private modalService: NgbModal,
    // public presence: PresenceService,
    // public auth: AngularFireAuth
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.modalService.dismissAll();
        const url = event.urlAfterRedirects;
        this.checkIfUserLoggedIn(url);
      }
      if (event instanceof NavigationStart) {
        this.modalService.dismissAll();
        const url = event;
        this.checkIfUserLoggedIn(url);
      }
    })
    let user: any = JSON.parse(localStorage.getItem('user'));
    if ((user == undefined || user == null) && !(this.router.url === '/login')) {
      //TODO: remove later on
      // this.router.navigateByUrl("/");
      return
    }
    else {
      this.router.events.subscribe(event => {
        this.loader.startLoader("master");
        if (event instanceof NavigationEnd) {

          const url = event.urlAfterRedirects;
          if (url == '/chat') {
            this.mob_view_none = 'mob-view-none'
           }
          if (url === '/login' || url === '/sign-up' || url === '/map' || url === '/' || url === '/change-password' || url == '/chat') {
            this.footer = false;
          } else {
            let abs = url.split('/');
            if (abs[1] == "verification") {
              this.footer = false;
              this.header = false;
            } else if (abs[1] == "user-profile") {
              this.footer = false;
            }
            else if (abs[1] == 'verification') {
              this.footer = false;
            }
            else {
              this.footer = true;
              this.header = true;
              this.mob_view_none=''
            }
            this.mob_view_none=''
          }
          this.loader.stopLoader("master");
        }
      })
    }

  }
  checkIfUserLoggedIn(url: any) {
  }

  
}



