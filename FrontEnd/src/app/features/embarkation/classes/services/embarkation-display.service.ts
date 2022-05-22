import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { EmbarkationReservationVM } from '../view-models/embarkation-reservation-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class EmbarkationDisplayService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/embarkation')
    }

    get(date: string, destinationId: number, portId: number, shipId: number): Observable<EmbarkationReservationVM> {
        return this.http.get<any>(this.url + '/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId + '/shipId/' + shipId)
    }

    embarkSinglePassenger(id: number): Observable<any> {
        const params = new HttpParams().set('id', id.toString())
        return this.http.patch(this.url + '/embarkSinglePassenger?', null, { params: params })
    }

    embarkAllPassengers(id: number[]): Observable<any> {
        let params = new HttpParams().set('id', id[0])
        id.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element)
            }
        })
        return this.http.patch(this.url + '/embarkAllPassengers?', null, { params: params })
    }


    getShipIdFromDesciption(description: string): Observable<number> {
        return this.http.get<any>(this.url + '/getShipIdFromDescription/' + description)
    }

}
