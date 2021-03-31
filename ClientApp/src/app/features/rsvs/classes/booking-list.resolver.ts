import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BookingListResolved } from './booking-list-resolved'
import { BookingService } from './booking.service'

@Injectable({ providedIn: 'root' })

export class BookingListResolver  {

    constructor(private bookingService: BookingService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BookingListResolved> {
        return this.bookingService.get(route.params.dateIn)
            .pipe(
                map((bookingList) => new BookingListResolved(bookingList)),
                catchError((err: any) => of(new BookingListResolved(null, err)))
            )
    }

}
