import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SlugifyPipe } from 'src/app/pipe/slugify.pipe';

@Injectable({
  providedIn: "root",
})
export class SharedService {
  item = new Subject<any>();
  userStatusData = new Subject<any>();
  
  public userProfileImage: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  constructor(private router: Router, private slugifyPipe: SlugifyPipe) {}

  public onProfileImageSet(image) {
    return this.item.next({ ProfileImage: image });
  }
  public onProfileImageGet(): Observable<any> {
    return this.item.asObservable();
  }

  public setUserStatusData(data:any) { 
    return this.userStatusData.next({userData: data});
  }

  public getUserStatusData(): Observable<any> { 
    return this.userStatusData.asObservable();
  }

  deleteEmptyCategoryIds(customeCategoryList, categories) {
    if (customeCategoryList.length) {
      customeCategoryList.forEach((ele) => {
        delete ele.id;
      });
      return customeCategoryList;
    }
    if (categories.length) {
      categories.forEach((ele) => {
        if (ele.id == "" || ele.id == null || ele.id == 0) {
          delete ele.id;
        }
      });
      return categories;
    }
  }

  openLocation(location) {
    const url = "https://maps.google.com/?q=" + location;
    // https://www.google.com/maps/search/?api=1&query=<lat>,<lng>
    // const url = 'https://www.google.com/maps/search/?api=1&query=' + location;
    window.open(url, "_blank");
  }
  getSenderDetail(item) {
    if (item.title || item.id) {
      localStorage.setItem("senderDetailsId", item.id);
      item.title = this.slugifyPipe.transform(item.title);
      if (item.title)
        this.router.navigate(["all-ads/sender-details/" + item.title]);
      else this.router.navigate(["all-ads/sender-details/" + item.id]);
    }
    else if (item.adId) {
      localStorage.setItem("senderDetailsId", item.adId);
      item.title = this.slugifyPipe.transform(item.title);
      if (item.title)
        this.router.navigate(["all-ads/sender-details/" + item.title]);
      else this.router.navigate(["all-ads/sender-details/" + item.adId]);
     }
    else {
      localStorage.setItem("senderDetailsId", item.ad_id);
      item.ad_title = this.slugifyPipe.transform(item.ad_title);
      if (item.ad_title)
        this.router.navigate(["all-ads/sender-details/" + item.ad_title]);
      else this.router.navigate(["all-ads/sender-details/" + item.ad_id]);
    }
  }

  getCarrierDetail(item) {
    item.title = this.slugifyPipe.transform(item.title);
    if (item.ad_id) {
      localStorage.setItem("carrierDetailsId", item.ad_id);
      if (item.title)
        this.router.navigate(["all-ads/carrier-details/" + item.title]);
      else this.router.navigate(["all-ads/carrier-details/" + item.ad_id]);
    } else if (item.id) {
      localStorage.setItem("carrierDetailsId", item.id);
      if (item.title)
        this.router.navigate(["all-ads/carrier-details/" + item.title]);
      else this.router.navigate(["all-ads/carrier-details/" + item.id]);
    }
    else if (item.adId) {
      localStorage.setItem("carrierDetailsId", item.adId);
      if (item.title)
        this.router.navigate(["all-ads/carrier-details/" + item.title]);
      else this.router.navigate(["all-ads/carrier-details/" + item.adId]);
     }
    else {
      localStorage.setItem("carrierDetailsId", item.as_id);
      if (item.title)
        this.router.navigate(["all-ads/carrier-details/" + item.title]);
      else this.router.navigate(["all-ads/carrier-details/" + item.as_id]);
    }
  }

  getPicuptLocation(address: string): Observable<any> {
    let geocoder = new google.maps.Geocoder();
    return new Observable((observer) => {
      // Observable.create(observer => {
      geocoder.geocode(
        {
          address: address,
        },
        (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            // observer.next(results[0].geometry.location);
            observer.next(results[0]);
            observer.complete();
          } else {
            observer.error();
          }
        }
      );
    });
  }

  getReceiverLocation(address: string): Observable<any> {
    let geocoder = new google.maps.Geocoder();
    return new Observable((observer) => {
      // Observable.create(observer => {
      geocoder.geocode(
        {
          address: address,
        },
        (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {

            // observer.next(results[0].geometry.location);
            observer.next(results[0]);
            observer.complete();
          } else {
            observer.error();
          }
        }
      );
    });
  }
}
