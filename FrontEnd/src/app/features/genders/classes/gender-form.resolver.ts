import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { GenderService } from './gender.service'

@Injectable({ providedIn: 'root' })

export class GenderFormResolver {

    constructor(private genderService: GenderService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.genderService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
