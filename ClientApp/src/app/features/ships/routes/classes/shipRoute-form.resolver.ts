import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { ShipRouteService } from './shipRoute.service'

@Injectable({ providedIn: 'root' })

export class ShipRouteFormResolver {

    constructor(private shipRouteService: ShipRouteService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.shipRouteService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
