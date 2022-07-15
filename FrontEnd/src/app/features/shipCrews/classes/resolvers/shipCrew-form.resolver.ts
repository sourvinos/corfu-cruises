import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { ShipCrewService } from '../services/shipCrew.service'

@Injectable({ providedIn: 'root' })

export class ShipCrewFormResolver {

    constructor(private crewService: ShipCrewService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.crewService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
