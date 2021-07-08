import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { Embarkation } from '../view-models/embarkation'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class EmbarkationService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/embarkations')
    }

    get(date: string, destinationId: number, portId: number, shipId: number): Observable<Embarkation> {
        return this.http.get<any>(this.url + '/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId + '/shipId/' + shipId)
    }

    boardPassenger(id: number): Observable<any> {
        const params = new HttpParams().set('id', id.toString())
        return this.http.patch(this.url + '/doEmbarkation?', null, { params: params })
    }

}
