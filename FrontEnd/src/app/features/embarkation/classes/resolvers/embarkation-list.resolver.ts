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

    resolve(): Observable<EmbarkationListResolved> {
        const criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
        return this.embarkationDisplayService.get(
            criteria.date,
            this.buildIds(criteria, 'destinations'),
            this.buildIds(criteria, 'ports'),
            this.buildIds(criteria, 'ships')).pipe(
                map((embarkationList) => new EmbarkationListResolved(embarkationList)),
                catchError((err: any) => of(new EmbarkationListResolved(null, err)))
            )
    }

    private buildIds(criteria: any, array: string): number[] {
        const ids = []
        criteria[array].forEach((element: { id: any }) => {
            ids.push(element.id)
        })
        return ids
    }

}
