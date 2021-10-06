import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipRouteDropdownResource } from '../resources/ship-route-dropdown-resource'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipRouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipRoutes')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<ShipRouteDropdownResource[]> {
        return this.http.get<ShipRouteDropdownResource[]>(environment.apiUrl + '/shipRoutes/getActiveForDropdown')
    }

    //#endregion

}
