import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Booking } from 'src/app/features/bookings/classes/booking'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    //#region variables

    private _record = new Subject<string[]>()
    private _booking = new Subject<string[]>()
    private _checked = new Subject<number>()
    private _refreshList = new Subject<any>()
    private _tableRow = new Subject()
    private _passengerNames = new Subject<any>()

    public record = this._record.asObservable()
    public booking = this._booking.asObservable()
    public checked = this._checked.asObservable()
    public refreshList = this._refreshList.asObservable()
    public tableRow = this._tableRow.asObservable()
    public passengerNames = this._passengerNames.asObservable()

    //#endregion

    //#region public methods

    /**
     * Caller(s):
     *  booking-form.ts
     *
     * Subscribers(s):
     *  booking-list.ts
     *
     * Description:
     *  The form tells the list to refresh when a record is saved
     */
    public mustRefreshList(): void {
        this._refreshList.next()
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
    public sendBooking(record: any): void {
        this._booking.next(record)
    }

    /**
     * Caller(s):
     *  booking-list.ts
     *  custom-table.ts
     *
     * Subscriber(s):
     *  booking-list.ts
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
     *  booking-form.component.ts
     * 
     * Subscriber(s):
     *  booking-list.component.ts
     * 
     * Description:
     *  The caller(s) send the id of the deleted record so that the subscriber(s) can find the table row and remove it
     */
    public removeTableRow(rowIndex: number): void {
        this._tableRow.next(rowIndex)
    }

    /**
     * 
     * Caller(s)
     *  booking-detail-form.ts
     * 
     * Subscriber(s)
     *  booking-form.component.ts
     * 
     * Description
     *  The caller(s) send the new passenger details to the subscriber(s) to show in the table
     */
    public sendPassengerToPassengerList(names: Booking[]): void {
        this._passengerNames.next(names)
    }

    //#endregion

}
