import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { CoachRouteDropdownVM } from '../view-models/coachRoute-dropdown-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CoachRouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/coachRoutes')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<CoachRouteDropdownVM[]> {
        return this.http.get<CoachRouteDropdownVM[]>(environment.apiUrl + '/coachRoutes/getActiveForDropdown')
    }

    //#endregion

}
