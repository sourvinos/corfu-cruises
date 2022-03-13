import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipRouteDropdownDTO } from '../dtos/shipRoute-dropdown-dto'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipRouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipRoutes')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<ShipRouteDropdownDTO[]> {
        return this.http.get<ShipRouteDropdownDTO[]>(environment.apiUrl + '/shipRoutes/getActiveForDropdown')
    }

    //#endregion

}
