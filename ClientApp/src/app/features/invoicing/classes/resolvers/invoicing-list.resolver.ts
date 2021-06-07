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
        return this.invoicingService.getByDate(route.params.dateIn)
            .pipe(
                map((reservationList) => new InvoicingListResolved(reservationList)),
                catchError((err: any) => of(new InvoicingListResolved(null, err)))
            )
    }

}
