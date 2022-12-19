import { MapsAPILoader } from '@agm/core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AboutService } from '../about/about.service';
import { PrivacyPolicyService } from './privacypolicy.service';
@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.css']
})
export class PrivacypolicyComponent implements OnInit {

  // @ViewChild('privacy', { static: false }) privacy: ElementRef;
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  dataPrivacyPolicy;
  lat = 24.912877841368648;
  lng = 67.0235158710789;


  getLocations: any = [
    {
      lat: 51.678418,
      lng: 7.809007
    },
    {
      lat: 24.914061349967604,
      lng: 67.01480114312658
    },
    {
      lat: 24.919082143179956,
      lng: 67.03243934897807
    },
    {
      lat: 24.924920017804457,
      lng: 67.0288773755336,
    },
    {
      lat: 24.91351644538728,
      lng: 67.02325546563934
    },

  ]

  Image: any;
  carrier: any;
  markers: any;
  filteredMarkers: any;
  agmIcon = { url: 'https://img.icons8.com/bubbles/2x/user-male.png', scaledSize: { height: 50, width: 50 } }
  home_img_2: any;
  home_img_1: any;
  dataPrivacy: boolean=true;

  constructor(private dataService: PrivacyPolicyService,
    private _AboutService: AboutService, private mapsAPILoader: MapsAPILoader) { }
 
  ngOnInit() {

    this.dataPrivacyPolicy=localStorage.getItem('dataPrivacyPolicy')
    if (this.dataPrivacyPolicy) {
      this.dataPrivacy = false;
    }
    else { 
      this.getPrivacy();
    }
    this.getSetting();
    this.getMarkers(10);
  }

  getPrivacy() {
    this.dataService.getPrivacyPolicy().subscribe((res: any) => {
      this.dataPrivacyPolicy = res['data'].description;
      localStorage.setItem('dataPrivacyPolicy', this.dataPrivacyPolicy);
      // this.dataPrivacy = false;
    });
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollIntoView({ top: 1, behavior: 'smooth' });
    } catch (err) { }
  }

  getMarkers(area: number) {
    this.markers = this.getLocations; //original list of markers data

    this.mapsAPILoader.load().then(() => {
      const center = new google.maps.LatLng(this.lat, this.lng);
      //markers located within 50 km distance from center are included
      this.filteredMarkers = [];
      this.markers.filter(m => {
        const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(m.lat, m.lng), center) / 1000;
        if (distanceInKm < area) {

          this.filteredMarkers.push(m);
          return

        }
      });
    });


  }
  getSetting() {
    this._AboutService.getSetting().subscribe((data: any) => {
      this.Image = data['data'].home_img_1;
      this.carrier = data['data'].home_img_2;
      this.home_img_1 = data['data'].home_img_1;
      this.home_img_2 = data['data'].home_img_2;
    })
  }

}
