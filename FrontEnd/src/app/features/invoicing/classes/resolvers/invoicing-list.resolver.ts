import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { InvoicingDisplayService } from '../services/invoicing-display.service'
import { InvoicingListResolved } from './invoicing-list-resolved'

@Injectable({ providedIn: 'root' })

export class InvoicingListResolver {

    constructor(private invoicingDisplayService: InvoicingDisplayService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<InvoicingListResolved> {
        return this.invoicingDisplayService.get(route.params.date, route.params.customerId, route.params.destinationId, route.params.shipId)
            .pipe(
                map((invoicingList) => new InvoicingListResolved(invoicingList)),
                catchError((err: any) => of(new InvoicingListResolved(null, err)))
            )
    }

}
