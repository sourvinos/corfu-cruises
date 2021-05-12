import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { WebReservationService } from '../services/web-reservation.service'

@Injectable({ providedIn: 'root' })

export class WebReservationFormResolver {

    constructor(private webReservationService: WebReservationService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.webReservationService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
