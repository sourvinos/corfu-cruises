import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { PickupPointService } from '../services/pickupPoint.service'

@Injectable({ providedIn: 'root' })

export class PickupPointFormResolver {

    constructor(private pickupPointService: PickupPointService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.pickupPointService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
