import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { CustomerService } from './customer.service'

@Injectable({ providedIn: 'root' })

export class CustomerFormResolver {

    constructor(private customerService: CustomerService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.customerService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
