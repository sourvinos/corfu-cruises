import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { RouteDropdownResource } from '../resources/route-dropdown-resource'

@Injectable({ providedIn: 'root' })

export class RouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/routes')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<RouteDropdownResource[]> {
        return this.http.get<RouteDropdownResource[]>('/api/routes/getActiveForDropdown')
    }

    //#endregion

}
