import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { CoachRouteDropdownVM } from '../view-models/coachRoute-dropdown-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CoachRouteService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/coachRoutes')
    }

    //#region public methods

    public getActive(): Observable<CoachRouteDropdownVM[]> {
        return this.http.get<CoachRouteDropdownVM[]>(environment.apiUrl + '/coachRoutes/getActive')
    }

    //#endregion

}
