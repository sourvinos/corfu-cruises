import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { ReservationService } from '../services/reservation.service'

@Injectable({ providedIn: 'root' })

export class ReservationFormResolver {

    constructor(private ReservationService: ReservationService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.ReservationService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
