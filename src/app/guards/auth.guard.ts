import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  client_key: string;
  email: any;
  authCheck: string="http://pacsend.uk/api/v1/email-exists";
  userData:any; //User Data

  constructor(
  private httpClient: HttpClient,private _router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let currentUser = JSON.parse(localStorage.getItem('user'));

    let form = new FormData();
    form.append("client_key", "Q4thTfwL6E8qAyKo68hW0e8EVeTpCn9YHO91oO5G");
    if (currentUser) { 
      form.append("email", currentUser.email);
    }
    
    this.httpClient.post(this.authCheck, form).subscribe((data) => {
      this.userData = data;
      
    if(this.userData.status=="failed"){
       this.logout();
      }
      if (this.userData.status == "error") {
        this._router.navigate(['/login'])
      }
    })

    if (currentUser && (currentUser.is_verified == "0" || currentUser.is_verified == "2")) {
      return false;
    } else{
      return true;
    }
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.reload();
  }

}
