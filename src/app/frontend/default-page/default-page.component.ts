import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultPageComponent implements OnInit {
  footer: boolean;
  header: boolean;
  footerBoolean: boolean = true;
  activatedRoute: any;
  visibility: boolean;
  mob_view_none: any;

  constructor(private loader: NgxUiLoaderService, private spinner: NgxSpinnerService, private router: Router,
    private modalService: NgbModal) {
  }

  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.modalService.dismissAll();
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
        setTimeout(() => {

          this.loader.stopLoader("master");
        }, 2000);
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
        }
      })
    }

  }
  checkIfUserLoggedIn(url: any) {
    let user: any = JSON.parse(localStorage.getItem('user'));
    if ((user == undefined || user == null) && !(url === '/login')) {
      this.router.navigateByUrl("/login");
    }
  }

}
