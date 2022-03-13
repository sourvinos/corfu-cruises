import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'
import { ShipOwnerDropdownDTO } from '../dtos/shipOwner-dropdown-dto'

@Injectable({ providedIn: 'root' })

export class ShipOwnerService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipOwners')
    }

    public getActiveForDropdown(): Observable<ShipOwnerDropdownDTO[]> {
        return this.http.get<ShipOwnerDropdownDTO[]>(environment.apiUrl + '/shipOwners/getActiveForDropdown')
    }

}
