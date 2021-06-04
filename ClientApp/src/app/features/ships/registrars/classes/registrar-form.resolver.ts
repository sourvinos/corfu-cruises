import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { RegistrarService } from './registrar.service'

@Injectable({ providedIn: 'root' })

export class RegistrarFormResolver {

    constructor(private registrarService: RegistrarService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.registrarService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
