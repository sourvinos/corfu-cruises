import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Common
import { DataService } from 'src/app/shared/services/data.service'
import { ShipRoute } from './shipRoute'

@Injectable({ providedIn: 'root' })

export class ShipRouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/shipRoutes')
    }

    //#region public methods

    public getAllActive(): Observable<ShipRoute[]> {
        return this.http.get<ShipRoute[]>('/api/shipRoutes/getActive')
    }

    //#endregion

}
