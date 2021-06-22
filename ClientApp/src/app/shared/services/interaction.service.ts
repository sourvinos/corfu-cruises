import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables

    private _record = new Subject<string[]>()
    private _reservation = new Subject<string[]>()
    private _checked = new Subject<number>()
    private _refreshReservationList = new Subject<any>()
    private _refreshBoardingList = new Subject<any>()
    private _tableRow = new Subject()
    private _calendarNavigation = new Subject<any>()
    private _refreshMenus = new Subject<any>()

    public record = this._record.asObservable()
    public reservation = this._reservation.asObservable()
    public checked = this._checked.asObservable()
    public refreshReservationList = this._refreshReservationList.asObservable()
    public refreshBoardingList = this._refreshBoardingList.asObservable()
    public tableRow = this._tableRow.asObservable()
    public calendarNavigation = this._calendarNavigation.asObservable()
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
     *  custom-table.component.ts
     *
     * Subscriber(s):
     *  customer-list.ts
     *  destination-list.ts
     *  driver-list.ts
     *  pickupPoint-list.ts
     *  port-list.ts
     *  route-list.ts
     *  user-list.ts
     *
     * Description:
     *  The caller(s) send the selected item so that the subscribers call the edit method
     *
    */
    public sendObject(record: any): void {
        this._record.next(record)
    }

    /** 
     * Caller(s):
     *  passenger-table.component.ts
     * 
     * Subscriber(s):
     *  passenger-list.ts
     *
     * Description:
     *  The caller(s) send the selected item so that the subscribers call the edit method
     *
    */
    public sendReservation(record: any): void {
        this._reservation.next(record)
    }

    /**
     * Caller(s):
     *  reservation-list.ts
     *  custom-table.ts
     *
     * Subscriber(s):
     *  reservation-list.ts
     *
     * Description:
     *  The callers send the sum of checked persons so that the subscriber can display it
     *
     * @param total
     */
    public setCheckedTotalPersons(total: number): void {
        this._checked.next(total)
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
     *  boarding-list.component.ts
     * 
     * Subscriber(s):
     *  boarding-wrapper.component.ts
     * 
     * Description:
     *  The caller tells the subscriber to refresh the passenger totals after each boarding is saved
     */
    public mustRefreshBoardingList(): void {
        this._refreshBoardingList.next()
    }

    /**
     * Caller(s):
     *  calendar.component.ts
     * 
     * Subscriber(s):
     *  schedule-wrapper.component.ts
     * 
     * Description:
     *  The caller tells the subscriber to move to the next or previous month
     */

    public changeCalendarMonth(month: any): void {
        this._calendarNavigation.next(month)
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
