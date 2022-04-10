import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { EmbarkationReservationVM } from '../view-models/embarkation-reservation-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class EmbarkationService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/embarkation')
    }

    get(date: string, destinationId: number, portId: number, shipId: number): Observable<EmbarkationReservationVM> {
        return this.http.get<any>(this.url + 'display/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId + '/shipId/' + shipId)
    }

    boardPassenger(id: number): Observable<any> {
        const params = new HttpParams().set('id', id.toString())
        return this.http.patch(this.url + '/doEmbarkation?', null, { params: params })
    }

    getShipIdFromDesciption(description: string): Observable<number> {
        return this.http.get<any>(this.url + 'display/getShipIdFromDescription/' + description)
    }

    createReport(criteria: any): Observable<any> {
        return this.http.post(this.url + 'printer/createreport/', criteria)
    }

    openReport(filename: string): Observable<any> {
        return this.http.get(this.url + 'printer/downloadreport/' + filename, { responseType: 'arraybuffer' })
    }

}
