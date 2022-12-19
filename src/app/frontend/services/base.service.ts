import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

        signupSubject = new BehaviorSubject(null);
        currentSignup = this.signupSubject.asObservable();

        constructor(){}

        changeValue(Signup:any){
            this.signupSubject.next(Signup);
        }

}
