import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { ScheduleService } from '../services/schedule.service'

@Injectable({ providedIn: 'root' })

export class ScheduleEditFormResolver {

    constructor(private routeService: ScheduleService) { }

    resolve(schedule: ActivatedRouteSnapshot): any {
        const response = this.routeService.getSingle(schedule.params.id)
        if (response) {
            response.subscribe(() => {
                return response
            })
        }
    }

}
