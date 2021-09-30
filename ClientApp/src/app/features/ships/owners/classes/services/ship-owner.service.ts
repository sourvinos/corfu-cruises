import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipOwnerDropdownResource } from '../resources/shipOwner-dropdown-resource'

@Injectable({ providedIn: 'root' })

export class ShipOwnerService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/shipOwners')
    }

    public getActiveForDropdown(): Observable<ShipOwnerDropdownResource[]> {
        return this.http.get<ShipOwnerDropdownResource[]>('/api/shipOwners/getActiveForDropdown')
    }

}
