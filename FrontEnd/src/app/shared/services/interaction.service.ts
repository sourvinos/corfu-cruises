import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables

    private _refreshDateAdapter = new Subject<any>()
    private _refreshMenus = new Subject<any>()
    private _refreshLogo = new Subject<any>()

    public refreshDateAdapter = this._refreshDateAdapter.asObservable()
    public refreshMenus = this._refreshMenus.asObservable()
    public refreshLogo = this._refreshLogo.asObservable()

    //#endregion

    //#region public methods

    public mustRefreshDateAdapters(): void {
        this._refreshDateAdapter.next()
    }

    public mustRefreshMenus(): void {
        this._refreshMenus.next()
    }

    public mustRefreshLogo(): void {
        this._refreshLogo.next()
    }

    //#endregion

}
