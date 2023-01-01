import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { LedgerCriteriaVM } from '../view-models/ledger-criteria-vm'
import { LedgerListResolved } from './ledger-list-resolved'
import { LedgerService } from '../services/ledger.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'

@Injectable({ providedIn: 'root' })

export class LedgerListResolver {

    constructor(private ledgerService: LedgerService, private localStorageService: LocalStorageService) { }

    resolve(): Observable<LedgerListResolved> {
        let criteria: LedgerCriteriaVM = null
        criteria = JSON.parse(this.localStorageService.getItem('ledger-criteria'))
        const customerIds = []
        const destinationIds = []
        const shipIds = []
        criteria.customers.forEach((customer: { id: any }) => {
            customerIds.push(customer.id)
        })
        criteria.destinations.forEach((destination: { id: any }) => {
            destinationIds.push(destination.id)
        })
        criteria.ships.forEach((ship: { id: any }) => {
            shipIds.push(ship.id)
        })
        return this.ledgerService.get(criteria.fromDate, criteria.toDate, customerIds, destinationIds, shipIds).pipe(
            map((ledgerList) => new LedgerListResolved(ledgerList)),
            catchError((err: any) => of(new LedgerListResolved(null, err)))
        )
    }

}
