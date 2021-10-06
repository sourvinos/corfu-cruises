import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ListResolved } from '../../../shared/classes/list-resolved'
import { DriverService } from './driver.service'

@Injectable({ providedIn: 'root' })

export class DriverListResolver  {

    constructor(private driverService: DriverService) { }

    resolve(): Observable<ListResolved> {
        return this.driverService.getAll()
            .pipe(
                map((driverList) => new ListResolved(driverList)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
