import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { CoachRouteService } from '../services/coachRoute.service'

@Injectable({ providedIn: 'root' })

export class RouteFormResolver {

    constructor(private routeService: CoachRouteService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.routeService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
