import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { EmbarkationListResolved } from './embarkation-list-resolved'
import { EmbarkationService } from '../services/embarkation-display.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'

@Injectable({ providedIn: 'root' })

export class EmbarkationListResolver {

    constructor(private embarkationDisplayService: EmbarkationService, private localStorageService: LocalStorageService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<EmbarkationListResolved> {
        const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
        const destinationIds = []
        criteria.destinations.forEach((destination: { id: any }) => {
            destinationIds.push(destination.id)
        })
        const portIds = []
        criteria.ports.forEach((port: { id: any }) => {
            portIds.push(port.id)
        })
        const shipIds = []
        criteria.ships.forEach((ship: { id: any }) => {
            shipIds.push(ship.id)
        })
        return this.embarkationDisplayService.get(criteria.date, destinationIds, portIds, shipIds).pipe(
            map((embarkationList) => new EmbarkationListResolved(embarkationList)),
            catchError((err: any) => of(new EmbarkationListResolved(null, err)))
        )
        return this.embarkationDisplayService.get(route.params.date, route.params.destinationId, route.params.portId, route.params.shipId)
            .pipe(
                map((embarkationList) => new EmbarkationListResolved(embarkationList)),
                catchError((err: any) => of(new EmbarkationListResolved(null, err)))
            )
    }

}
