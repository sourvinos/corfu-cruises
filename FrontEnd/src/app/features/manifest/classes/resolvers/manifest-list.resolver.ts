import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ManifestListResolved } from './manifest-list-resolved'
import { ManifestService } from '../services/manifest.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'

@Injectable({ providedIn: 'root' })

export class ManifestListResolver {

    private criteria: any

    constructor(private localStorageService: LocalStorageService, private manifestService: ManifestService) {
        this.criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
    }

    resolve(): Observable<ManifestListResolved> {
        return this.manifestService.get(this.criteria.date, this.criteria.destinationId, this.criteria.shipId, this.criteria.portIds).pipe(
            map((manifestList) => new ManifestListResolved(manifestList)),
            catchError((err: any) => of(new ManifestListResolved(null, err)))
        )
    }

}
