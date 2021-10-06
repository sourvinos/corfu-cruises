import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ListResolved } from '../../../shared/classes/list-resolved'
import { GenderService } from './gender.service'

@Injectable({ providedIn: 'root' })

export class GenderListResolver  {

    constructor(private genderService: GenderService) { }

    resolve(): Observable<ListResolved> {
        return this.genderService.getAll()
            .pipe(
                map((genderList) => new ListResolved(genderList)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
