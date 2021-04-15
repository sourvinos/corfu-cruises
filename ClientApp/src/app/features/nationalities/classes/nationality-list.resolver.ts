// Base
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from '../../../shared/classes/list-resolved'
import { NationalityService } from './nationality.service'

@Injectable({ providedIn: 'root' })

export class NationalityListResolver  {

    constructor(private nationalityService: NationalityService) { }

    resolve(): Observable<ListResolved> {
        return this.nationalityService.getAll()
            .pipe(
                map((nationalityList) => new ListResolved(nationalityList)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
