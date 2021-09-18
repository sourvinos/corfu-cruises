import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables

    private _record = new Subject<string[]>()
    private _reservation = new Subject<string[]>()
    private _refreshReservationList = new Subject<any>()
    private _tableRow = new Subject()
    private _refreshMenus = new Subject<any>()

    public record = this._record.asObservable()
    public reservation = this._reservation.asObservable()
    public refreshReservationList = this._refreshReservationList.asObservable()
    public tableRow = this._tableRow.asObservable()
    public refreshMenus = this._refreshMenus.asObservable()

    //#endregion

    //#region public methods

    /**
     * Caller(s):
     *  reservation-form.ts
     *
     * Subscribers(s):
     *  reservation-list.ts
     *
     * Description:
     *  The form tells the list to refresh when a record is saved
     */
    public mustRefreshReservationList(): void {
        this._refreshReservationList.next()
    }

    /**
     * Caller(s):
     *  reservation-form.component.ts
     * 
     * Subscriber(s):
     *  reservation-list.component.ts
     * 
     * Description:
     *  The caller(s) send the id of the deleted record so that the subscriber(s) can find the table row and remove it
     */
    public removeTableRow(rowIndex: number): void {
        this._tableRow.next(rowIndex)
    }

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
