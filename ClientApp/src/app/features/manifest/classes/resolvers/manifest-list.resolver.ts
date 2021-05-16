import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ManifestService } from '../services/manifest.service'
import { ManifestListResolved } from './manifest-list-resolved'

@Injectable({ providedIn: 'root' })

export class ManifestListResolver {

    constructor(private manifestService: ManifestService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ManifestListResolved> {
        return this.manifestService.get(route.params.date, route.params.shipId, route.params.portId)
            .pipe(
                map((boardingList) => new ManifestListResolved(boardingList)),
                catchError((err: any) => of(new ManifestListResolved(null, err)))
            )
    }

}
