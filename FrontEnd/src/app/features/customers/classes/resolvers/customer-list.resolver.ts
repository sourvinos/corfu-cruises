import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ListResolved } from '../../../../shared/classes/list-resolved'
import { CustomerService } from '../services/customer.service'

@Injectable({ providedIn: 'root' })

export class CustomerListResolver {

    constructor(private customerService: CustomerService) { }

    resolve(): Observable<ListResolved> {
        return this.customerService.getAll().pipe(
            map((customerList) => new ListResolved(customerList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
