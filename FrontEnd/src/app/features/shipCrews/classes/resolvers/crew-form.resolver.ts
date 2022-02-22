import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { CrewService } from '../services/crew.service'

@Injectable({ providedIn: 'root' })

export class CrewFormResolver {

    constructor(private crewService: CrewService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.crewService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
