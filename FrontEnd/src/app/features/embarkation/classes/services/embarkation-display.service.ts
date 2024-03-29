import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { EmbarkationVM } from '../view-models/embarkation-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class EmbarkationService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/embarkation')
    }

    get(date: string, destinationId: number, portId: number, shipId: number): Observable<EmbarkationVM> {
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

}
