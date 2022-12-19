import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AboutService } from '../about/about.service';
import { TermsAndConditionService } from './termsandcondition.service';

@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.component.html',
  styleUrls: ['./termsandconditions.component.css']
})
export class TermsandconditionsComponent implements OnInit {

  dataTerms;
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
  filteredMarkers: any[];

  agmIcon = { url: 'https://img.icons8.com/bubbles/2x/user-male.png', scaledSize: { height: 50, width: 50 } }
  home_img_1: any;
  home_img_2: any;
  dataTerm:boolean = true;

  constructor(private dataService: TermsAndConditionService, private _AboutService: AboutService, private mapsAPILoader: MapsAPILoader) { }
  @ViewChild('terms', { static: false })
  terms: ElementRef;

  ngOnInit() {
    // this.getTerms();
    this.dataTerms=localStorage.getItem('dataTerms');
    this.getSetting();
    this.getMarkers(50);

    setTimeout(() => {
      this.dataTerm= false;
    }, 2000);

  }

  // getTerms() {
  //   this.dataService.getTermsCondition().subscribe((data: any) => {
  //     this.dataTerms = data['data'].description;
  //     this.terms.nativeElement.scrollIntoView({ top: 1, behavior: 'smooth' });

  //   })
  // }


  getMarkers(area: number) {
    this.markers = this.getLocations; //original list of markers data

    this.mapsAPILoader.load().then(() => {
      const center = new google.maps.LatLng(this.lat, this.lng);

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
