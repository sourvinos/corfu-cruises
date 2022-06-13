import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { PickupPoint } from '../models/pickupPoint'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class PickupPointService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/pickupPoints')
    }

    getActiveForDropdown(): Observable<PickupPoint[]> {
        return this.http.get<PickupPoint[]>(environment.apiUrl + '/pickupPoints/getActiveForDropdown')
    }

    getAllForRoute(routeId: string): Observable<PickupPoint[]> {
        return this.http.get<PickupPoint[]>(environment.apiUrl + '/pickupPoints/routeId/' + routeId)
    }

    updateCoordinates(pickupPointId: string, coordinates: string): Observable<any> {
        const params = new HttpParams().set('pickupPointId', pickupPointId).set('coordinates', coordinates)
        return this.http.patch(this.url + '/updateCoordinates?', null, { params: params })
    }

}
