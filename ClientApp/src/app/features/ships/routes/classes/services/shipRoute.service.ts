import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipRouteDropdownResource } from '../resources/ship-route-dropdown-resource'

@Injectable({ providedIn: 'root' })

export class ShipRouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/shipRoutes')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<ShipRouteDropdownResource[]> {
        return this.http.get<ShipRouteDropdownResource[]>('/api/shipRoutes/getActiveForDropdown')
    }

    //#endregion

}
