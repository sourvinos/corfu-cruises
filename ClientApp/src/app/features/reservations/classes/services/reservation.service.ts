import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ReservationGroupResource } from '../resources/list/reservation-group-resource'

@Injectable({ providedIn: 'root' })

export class ReservationService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/reservations')
    }

    get(date: string): Observable<ReservationGroupResource> {
        return this.http.get<ReservationGroupResource>(this.url + '/date/' + date)
    }

    assignToDriver(driverId: string, records: any[]): Observable<any> {
        let params = new HttpParams().set('driverId', driverId).set('id', records[0].reservationId)
        records.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element.reservationId)
            }
        })
        return this.http.patch(this.url + '/assignToDriver?', null, { params: params })
    }

    assignToShip(shipId: string, records: any[]): Observable<any> {
        let params = new HttpParams().set('shipId', shipId).set('id', records[0].reservationId)
        records.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element.reservationId)
            }
        })
        return this.http.patch(this.url + '/assignToShip?', null, { params: params })
    }

}
