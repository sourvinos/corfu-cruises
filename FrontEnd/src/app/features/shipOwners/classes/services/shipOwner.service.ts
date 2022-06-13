import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ShipOwnerDropdownVM } from '../view-models/shipOwner-dropdown-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipOwnerService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipOwners')
    }

    public getActiveForDropdown(): Observable<ShipOwnerDropdownVM[]> {
        return this.http.get<ShipOwnerDropdownVM[]>(environment.apiUrl + '/shipOwners/getActiveForDropdown')
    }

}
