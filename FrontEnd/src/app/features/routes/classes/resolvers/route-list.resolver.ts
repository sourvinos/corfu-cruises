import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { RouteService } from '../services/route.service'

@Injectable({ providedIn: 'root' })

export class RouteListResolver  {

    constructor(private routeService: RouteService) { }

    resolve(): Observable<ListResolved> {
        return this.routeService.getAll()
            .pipe(
                map((routeList) => new ListResolved(routeList)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
