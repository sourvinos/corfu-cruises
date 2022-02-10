import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ScheduleService } from '../calendar/schedule.service'

@Injectable({ providedIn: 'root' })

export class ScheduleListResolver {

    constructor(private scheduleService: ScheduleService) { }

    resolve(): Observable<ListResolved> {
        return this.scheduleService
            .getForList()
            .pipe(map((scheduleList) => new ListResolved(scheduleList)), catchError((err: any) => of(new ListResolved(null, err))))
    }

}
