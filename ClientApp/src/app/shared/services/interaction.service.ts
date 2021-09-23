import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables

    private _refreshMenus = new Subject<any>()

    public refreshMenus = this._refreshMenus.asObservable()

    //#endregion

    //#region public methods

    /**
     * Caller(s):
     *  account.service.ts
     * 
     * Subscriber(s):
     *  top-menu.component.ts
     * 
     * Description:
     *  The caller tells the subscriber to show or hide menu elements
     */
    public mustRefreshMenus(): void {
        this._refreshMenus.next()
    }

    //#endregion

}
