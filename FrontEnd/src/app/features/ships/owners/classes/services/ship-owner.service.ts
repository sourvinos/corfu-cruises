import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipOwnerDropdownResource } from '../resources/shipOwner-dropdown-resource'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipOwnerService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipOwners')
    }

    public getActiveForDropdown(): Observable<ShipOwnerDropdownResource[]> {
        return this.http.get<ShipOwnerDropdownResource[]>(environment.apiUrl + '/shipOwners/getActiveForDropdown')
    }

}
