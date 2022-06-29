import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { InvoicingListResolved } from './invoicing-list-resolved'
import { InvoicingService } from '../services/invoicing.service'

@Injectable({ providedIn: 'root' })

export class InvoicingListResolver {

    constructor(private invoicingService: InvoicingService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<InvoicingListResolved> {
        return this.invoicingService.get(route.params.fromDate, route.params.toDate, route.params.customerId, route.params.destinationId, route.params.shipId)
            .pipe(
                map((invoicingList) => new InvoicingListResolved(invoicingList)),
                catchError((err: any) => of(new InvoicingListResolved(null, err)))
            )
    }

}
