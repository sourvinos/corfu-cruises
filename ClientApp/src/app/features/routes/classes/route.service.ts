import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { Route } from './route'

@Injectable({ providedIn: 'root' })

export class RouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/routes')
    }

    //#region public methods

    public getAllActive(): Observable<Route[]> {
        return this.http.get<Route[]>('/api/routes/getActive')
    }

    //#endregion

}
