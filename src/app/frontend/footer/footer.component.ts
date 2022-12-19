import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  settings: any;
  id: any;
  name: any;
  meta_description: any;
  footer_content: any;
  logo: any;
  favicon: any;
  notification_switch: any;
  footer_logo: any;
  footer_description: any;
  footer_copy_right: any;
  fb_link: any;
  twitter_link: any;
  linkden_link: any;
  youtube_link: any;
  home_img_1: any;
  created_at: any;
  updated_at: any;

  constructor(private settingService: SettingService,) { }

  ngOnInit() {
    this.getSetting();
  }
  getSetting() {
    this.settingService.getSettings().subscribe((data: any[]) => {
      this.settings = data['data'];
      // Setting Values To Object
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
      this.home_img_1 = data['data'].home_img_2;
      this.created_at = data['data'].created_at;
      this.updated_at = data['data'].updated_at;

    })
  }

}
