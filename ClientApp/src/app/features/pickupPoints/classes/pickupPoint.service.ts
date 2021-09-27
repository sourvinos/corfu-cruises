import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { PickupPoint } from './pickupPoint'

@Injectable({ providedIn: 'root' })

export class PickupPointService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/pickupPoints')
    }

    getActiveForDropdown(): Observable<PickupPoint[]> {
        return this.http.get<PickupPoint[]>('/api/pickupPoints/getActiveForDropdown')
    }

    getAllForRoute(routeId: string): Observable<PickupPoint[]> {
        return this.http.get<PickupPoint[]>('/api/pickupPoints/routeId/' + routeId)
    }

    updateCoordinates(pickupPointId: string, coordinates: string): Observable<any> {
        const params = new HttpParams().set('pickupPointId', pickupPointId).set('coordinates', coordinates)
        return this.http.patch(this.url + '/updateCoordinates?', null, { params: params })
    }

}
