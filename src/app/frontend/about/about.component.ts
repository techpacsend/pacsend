
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AboutService } from './about.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {

  dataAbout;
  @ViewChild('h1', { static: false }) h1: ElementRef;
  aboutimage: string;

  constructor(
    private dataService: AboutService,
  ) { }
  ngOnInit() {
    this.dataAbout=localStorage.getItem('databout');
    this.aboutimage=localStorage.getItem('aboutimage');
    if (!this.aboutimage || !this.dataAbout) {
      this.dataService.GetAbout().subscribe((data: any[]) => {
        this.dataAbout = data['data'].description;
        this.aboutimage = data['data'].image;
        localStorage.setItem('databout', this.dataAbout);
        localStorage.setItem('aboutimage', this.aboutimage);
      });
    }
  }

}
