import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { EmbarkationListResolved } from './embarkation-list-resolved'
import { EmbarkationService } from '../services/embarkation.service'

@Injectable({ providedIn: 'root' })

export class EmbarkationListResolver {

    constructor(private embarkationService: EmbarkationService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<EmbarkationListResolved> {
        return this.embarkationService.get(route.params.date, route.params.destinationId, route.params.portId, route.params.shipId)
            .pipe(
                map((embarkationList) => new EmbarkationListResolved(embarkationList)),
                catchError((err: any) => of(new EmbarkationListResolved(null, err)))
            )
    }

}
