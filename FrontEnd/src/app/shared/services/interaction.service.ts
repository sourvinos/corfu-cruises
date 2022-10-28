import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables
    private _isAdmin = new Subject<boolean>()
    private _refreshDateAdapter = new Subject<any>()
    private _refreshMenus = new Subject<any>()

    public isAdmin = this._isAdmin.asObservable()
    public refreshDateAdapter = this._refreshDateAdapter.asObservable()
    public refreshMenus = this._refreshMenus.asObservable()

    //#endregion

    //#region public methods

    public mustRefreshDateAdapters(): void {
        this._refreshDateAdapter.next(null)
    }

    public mustRefreshMenus(): void {
        this._refreshMenus.next(null)
    }

    public mustRefreshUserRole(isAdmin: boolean): void {
        setTimeout(() => {
            this._isAdmin.next(isAdmin)
        }, 10)
    }

    //#endregion

}
