import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { DestinationService } from './destination.service'

@Injectable({ providedIn: 'root' })

export class DestinationFormResolver {

    constructor(private destinationService: DestinationService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.destinationService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
