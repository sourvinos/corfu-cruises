import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { CustomerService } from '../services/customer.service'

@Injectable({ providedIn: 'root' })

export class CustomerFormResolver {

    constructor(private customerService: CustomerService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.customerService.getSingle(route.params.id)
    }

}
