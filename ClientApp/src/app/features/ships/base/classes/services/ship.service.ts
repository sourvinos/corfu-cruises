import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipDropdownResource } from 'src/app/features/reservations/classes/resources/form/dropdown/ship-dropdown-resource'

@Injectable({ providedIn: 'root' })

export class ShipService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/ships')
    }

    //#region public methods

    getActiveForDropdown(): Observable<ShipDropdownResource[]> {
        return this.http.get<ShipDropdownResource[]>('/api/ships/getActiveForDropdown')
    }

    //#endregion

}
