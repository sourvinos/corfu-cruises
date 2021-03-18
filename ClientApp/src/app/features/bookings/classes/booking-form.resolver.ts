import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { BookingService } from './booking.service'

@Injectable({ providedIn: 'root' })

export class BookingFormResolver {

    constructor(private bookingService: BookingService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.bookingService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
