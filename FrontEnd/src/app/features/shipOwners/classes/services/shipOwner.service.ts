import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'
import { ShipOwnerDropdownVM } from '../view-models/shipOwner-dropdown-vm'

@Injectable({ providedIn: 'root' })

export class ShipOwnerService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipOwners')
    }

    public getActiveForDropdown(): Observable<ShipOwnerDropdownVM[]> {
        return this.http.get<ShipOwnerDropdownVM[]>(environment.apiUrl + '/shipOwners/getActiveForDropdown')
    }

}
