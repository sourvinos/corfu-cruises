import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { LedgerListResolved } from './ledger-list-resolved'
import { LedgerService } from '../services/ledger.service'

@Injectable({ providedIn: 'root' })

export class LedgerListResolver {

    constructor(private ledgerService: LedgerService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<LedgerListResolved> {
        return this.ledgerService.get(route.params.fromDate, route.params.toDate, route.params.customerId, route.params.destinationId, route.params.shipId)
            .pipe(
                map((ledgerList) => new LedgerListResolved(ledgerList)),
                catchError((err: any) => of(new LedgerListResolved(null, err)))
            )
    }

}
