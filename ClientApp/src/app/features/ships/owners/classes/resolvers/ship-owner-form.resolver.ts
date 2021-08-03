import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { ShipOwnerService } from '../services/ship-owner.service'

@Injectable({ providedIn: 'root' })

export class ShipOwnerFormResolver {

    constructor(private shipOwnerService: ShipOwnerService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.shipOwnerService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
