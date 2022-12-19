import { Injectable } from '@angular/core';
import {map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private static loaderEnabled: boolean;

  constructor() { }

  get loaderEnabled() {
    return LoaderService.loaderEnabled;
  }

  public static showLoader() {
    LoaderService.loaderEnabled = true;
  }

  public static hideLoader() {
    LoaderService.loaderEnabled = false;
  }

}

export function LoaderEnabled(): MethodDecorator {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function () {

      LoaderService.showLoader();

      return original.apply(this, arguments)
        .pipe(
          map((res) => {
            LoaderService.hideLoader();
            return res;
          }),
          catchError((err) => {
            LoaderService.hideLoader();
            throw err;
          })
        );
    };
    return descriptor;
  };

}
