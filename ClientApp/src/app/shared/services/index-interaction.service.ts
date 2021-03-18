import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class IndexInteractionService {

    //#region variables

    private _data = new Subject<unknown>()
    private _dialogMustClose = new Subject<boolean>()

    public data = this._data.asObservable()
    public dialogMustClose = this._dialogMustClose.asObservable()

    //#endregion

    //#region public methods

    public sendObject(data: any): void {
        this._data.next(data)
    }

    public action(action: boolean): void {
        this._dialogMustClose.next(action)
    }

    //#endregion

}
