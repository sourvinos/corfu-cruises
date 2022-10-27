import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'
import { PickupPointVM } from '../view-models/pickupPoint-vm'

@Injectable({ providedIn: 'root' })

export class PickupPointService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/pickupPoints')
    }

    getActive(): Observable<PickupPointVM[]> {
        return this.http.get<PickupPointVM[]>(environment.apiUrl + '/pickupPoints/getActive')
    }

    getAllForRoute(routeId: string): Observable<PickupPointVM[]> {
        return this.http.get<PickupPointVM[]>(environment.apiUrl + '/pickupPoints/routeId/' + routeId)
    }

    updateCoordinates(pickupPointId: string, coordinates: string): Observable<any> {
        const params = new HttpParams().set('pickupPointId', pickupPointId).set('coordinates', coordinates)
        return this.http.patch(this.url + '/updateCoordinates?', null, { params: params })
    }

}
