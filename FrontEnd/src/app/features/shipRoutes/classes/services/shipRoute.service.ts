import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ShipRouteDropdownVM } from '../view-models/shipRoute-dropdown-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipRouteService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipRoutes')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<ShipRouteDropdownVM[]> {
        return this.http.get<ShipRouteDropdownVM[]>(environment.apiUrl + '/shipRoutes/getActiveForDropdown')
    }

    //#endregion

}
