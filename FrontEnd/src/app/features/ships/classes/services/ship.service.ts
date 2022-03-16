import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipDropdownVM } from 'src/app/features/ships/classes/view-models/ship-dropdown-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/ships')
    }

    //#region public methods

    getActiveForDropdown(): Observable<ShipDropdownVM[]> {
        return this.http.get<ShipDropdownVM[]>(environment.apiUrl + '/ships/getActiveForDropdown')
    }

    //#endregion

}
