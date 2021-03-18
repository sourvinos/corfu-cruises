import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { ShipService } from './ship.service'

@Injectable({ providedIn: 'root' })

export class ShipFormResolver {

    constructor(private shipService: ShipService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.shipService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
