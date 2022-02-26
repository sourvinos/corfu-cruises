import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ReservationListResolved } from './reservation-list-resolved'
import { ReservationService } from '../services/reservation.service'

@Injectable({ providedIn: 'root' })

export class ReservationListResolverByRefNo {

    constructor(private reservationService: ReservationService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ReservationListResolved> {
        return this.reservationService.getByRefNo(route.params.refNo)
            .pipe(
                map((reservationList) => new ReservationListResolved(reservationList)),
                catchError((err: any) => of(new ReservationListResolved(null, err)))
            )
    }

}
