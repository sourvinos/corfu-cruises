import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { RouteDropdownVM } from '../view-models/route-dropdown-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class RouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/routes')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<RouteDropdownVM[]> {
        return this.http.get<RouteDropdownVM[]>(environment.apiUrl + '/routes/getActiveForDropdown')
    }

    //#endregion

}
