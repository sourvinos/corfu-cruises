import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables

    private _refreshDateAdapter = new Subject<any>()
    private _refreshMenus = new Subject<any>()
    private _updateLogoImage = new Subject<any>()

    public refreshDateAdapter = this._refreshDateAdapter.asObservable()
    public refreshMenus = this._refreshMenus.asObservable()
    public updateLogoImage = this._updateLogoImage.asObservable()

    //#endregion

    //#region public methods

    public mustRefreshDateAdapters(): void {
        this._refreshDateAdapter.next(null)
    }

    public mustRefreshMenus(): void {
        this._refreshMenus.next(null)
    }

    public mustUpdateLogoImage(): void {
        this._updateLogoImage.next(null)
    }

    //#endregion

}
