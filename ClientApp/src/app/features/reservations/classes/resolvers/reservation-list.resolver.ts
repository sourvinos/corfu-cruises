import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ReservationListResolved } from './reservation-list-resolved'
import { ReservationService } from '../services/reservation.service'

@Injectable({ providedIn: 'root' })

export class ReservationListResolver  {

    constructor(private reservationService: ReservationService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ReservationListResolved> {
        return this.reservationService.get(route.params.dateIn)
            .pipe(
                map((reservationList) => new ReservationListResolved(reservationList)),
                catchError((err: any) => of(new ReservationListResolved(null, err)))
            )
    }

}
