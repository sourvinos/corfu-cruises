import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables
    private _isAdmin = new Subject<boolean>()
    private _refreshDateAdapter = new Subject<any>()
    private _refreshMenus = new Subject<any>()
    private _userId = new Subject<any>()
    private _displayedUsername = new Subject<any>()

    public isAdmin = this._isAdmin.asObservable()
    public refreshDateAdapter = this._refreshDateAdapter.asObservable()
    public refreshMenus = this._refreshMenus.asObservable()
    public userId = this._userId.asObservable()
    public displayedUsername = this._displayedUsername.asObservable()

    //#endregion

    //#region public methods

    public updateDateAdapters(): void {
        setTimeout(() => {
            this._refreshDateAdapter.next(null)
        }, 0)
    }

    public updateMenus(): void {
        setTimeout(() => {
            this._refreshMenus.next(null)
        }, 0)
    }

    public updateIsAdmin(isAdmin: boolean): void {
        setTimeout(() => {
            this._isAdmin.next(isAdmin)
        }, 10)
    }

    public updateUserDetails(userId: string, displayedUsername: string): void {
        setTimeout(() => {
            this._userId.next(userId)
            this._displayedUsername.next(displayedUsername)
        }, 500)
    }

    //#endregion

}
