import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { TotalsListResolved } from './totals-list-resolved'
import { TotalsService } from '../services/totals.service'

@Injectable({ providedIn: 'root' })

export class TotalsListResolver {

    constructor(private totalsService: TotalsService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<TotalsListResolved> {
        return this.totalsService.get(route.params.fromDate, route.params.toDate)
            .pipe(
                map((totalsList) => new TotalsListResolved(totalsList)),
                catchError((err: any) => of(new TotalsListResolved(null, err)))
            )
    }

}
