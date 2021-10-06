import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { CrewService } from './crew.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'

@Injectable({ providedIn: 'root' })

export class CrewListResolver  {

    constructor(private crewService: CrewService) { }

    resolve(): Observable<ListResolved> {
        return this.crewService.getAll()
            .pipe(
                map((crewList) => new ListResolved(crewList)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
