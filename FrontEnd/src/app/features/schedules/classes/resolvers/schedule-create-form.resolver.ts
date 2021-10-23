import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { ScheduleService } from '../calendar/schedule.service'

@Injectable({ providedIn: 'root' })

export class ScheduleCreateFormResolver {

    constructor(private routeService: ScheduleService) { }

    resolve(schedule: ActivatedRouteSnapshot): any {
        const response = this.routeService.getSingle(schedule.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
