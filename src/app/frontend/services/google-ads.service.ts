import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAdsService {

  googleAds$: Subject<GoogleAds> = new Subject();

  constructor(private http: HttpClient) {
    // this.getAds().subscribe(data => {
    //  });
  }

  getAds(): Observable<GoogleAds> {
    return this.http.get<GoogleAds>("http://pacsend.uk/api/v1/slot/settings?client_key=Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
  }

}

export class GoogleAds {
  status: string;
  data: {
    id: number;
    slot_name: string;
    width_size: number;
    height_size: number;
    size: string;
    script: string;
    image: string;
    status: number;
    created_at: string;
    updated_at: string;
  }[];
}
