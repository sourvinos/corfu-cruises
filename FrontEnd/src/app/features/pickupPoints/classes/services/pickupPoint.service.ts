import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'
import { PickupPoint } from '../models/pickupPoint'

@Injectable({ providedIn: 'root' })

export class PickupPointService extends DataService {

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
