// Base
import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { NationalityService } from './nationality.service'

@Injectable({ providedIn: 'root' })

export class NationalityFormResolver {

    constructor(private nationalityService: NationalityService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.nationalityService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
