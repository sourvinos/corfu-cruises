import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { PortService } from './port.service'

@Injectable({ providedIn: 'root' })

export class PortFormResolver {

    constructor(private portService: PortService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.portService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
