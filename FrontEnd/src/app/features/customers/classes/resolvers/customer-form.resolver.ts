import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { CustomerService } from '../services/customer.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'

@Injectable({ providedIn: 'root' })

export class CustomerFormResolver {

    constructor(private customerService: CustomerService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.customerService.getSingle(route.params.id).pipe(
            map((customerForm) => new FormResolved(customerForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
        // this.customerService.getSingle(route.params.id).pipe(takeUntil(this.unsubscribe)).subscribe(response => {
        //     return response
        // })
    }
    // return this.customerService.getSingle(route.params.id).pipe(takeUntil(this.unsubscribe))

    // this.customerService.getSingle(12).pipe(takeUntil(this.unsubscribe)).subscribe(response => {
    //     this.customer = response
    // })

}
