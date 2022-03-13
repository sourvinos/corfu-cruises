import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { DriverService } from '../services/driver.service'

@Injectable({ providedIn: 'root' })

export class DriverFormResolver {

    constructor(private driverService: DriverService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.driverService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
