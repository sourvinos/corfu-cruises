import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipDropdownResource } from 'src/app/features/reservations/classes/resources/form/dropdown/ship-dropdown-resource'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/ships')
    }

    //#region public methods

    getActiveForDropdown(): Observable<ShipDropdownResource[]> {
        return this.http.get<ShipDropdownResource[]>(environment.apiUrl + '/ships/getActiveForDropdown')
    }

    //#endregion

}
