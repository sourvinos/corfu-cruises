import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
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
