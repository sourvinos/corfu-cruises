import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { BoardingListResolved } from './boarding-list-resolved'
import { BoardingService } from '../services/boarding.service'

@Injectable({ providedIn: 'root' })

export class BoardingListResolver {

    constructor(private boardingService: BoardingService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BoardingListResolved> {
        return this.boardingService.get(route.params.date, route.params.destinationId, route.params.portId, route.params.shipId)
            .pipe(
                map((boardingList) => new BoardingListResolved(boardingList)),
                catchError((err: any) => of(new BoardingListResolved(null, err)))
            )
    }

}
