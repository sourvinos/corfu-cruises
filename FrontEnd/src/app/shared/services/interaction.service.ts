import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables

    private _refreshDateAdapter = new Subject<any>()
    private _refreshMenus = new Subject<any>()
    private _sideMenuIsClosed = new Subject<any>()
    private _isAdmin = new Subject<boolean>()
    private _connectedUserCount = new Subject<number>()

    public refreshDateAdapter = this._refreshDateAdapter.asObservable()
    public refreshMenus = this._refreshMenus.asObservable()
    public sideMenuIsClosed = this._sideMenuIsClosed.asObservable()
    public isAdmin = this._isAdmin.asObservable()
    public connectedUserCount = this._connectedUserCount.asObservable()

    //#endregion

    //#region public methods

    public mustRefreshDateAdapters(): void {
        this._refreshDateAdapter.next(null)
    }

    public mustRefreshMenus(): void {
        this._refreshMenus.next(null)
    }

    public SideMenuIsClosed(): void {
        this._sideMenuIsClosed.next(null)
    }

    public UpdateSideMenuTogglerState(isAdmin: boolean): void {
        this._isAdmin.next(isAdmin)
    }

    public ConnectedUserCount(count: number): void {
        this._connectedUserCount.next(count)
    }

    //#endregion

}
