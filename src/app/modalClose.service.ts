import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ModalCloseService {
    private _closeModal = new Subject();
    closeModal$: Observable<any> = this._closeModal.asObservable();

    closeModal(event) {
        this._closeModal.next({from : event});
    }
}