import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { ManifestListResolved } from './manifest-list-resolved'
import { ManifestService } from '../services/manifest.service'

@Injectable({ providedIn: 'root' })

export class ManifestListResolver {

    constructor(private localStorageService: LocalStorageService, private manifestService: ManifestService) { }

    resolve(): Observable<ManifestListResolved> {
        const criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
        const portIds = []
        criteria.ports.forEach((port: { id: any }) => {
            portIds.push(port.id)
        })
        return this.manifestService.get(criteria.date, criteria.destination.id, criteria.ship.id, criteria.shipRoute.id, portIds).pipe(
            map((manifestList) => new ManifestListResolved(manifestList)),
            catchError((err: any) => of(new ManifestListResolved(null, err)))
        )
    }

}
