import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ManifestService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/manifest')
    }

    //#region public methods

    get(date: string, destinationId: number, portId: number, shipId: number, shipRouteId: number): Observable<any> {
        return this.http.get<any>(this.url + '/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId + '/shipId/' + shipId + '/shipRouteId/' + shipRouteId)
    }

    //#endregion

}
