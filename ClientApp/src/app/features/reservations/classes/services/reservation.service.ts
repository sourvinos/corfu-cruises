import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { ReservationGroupResource } from '../resources/list/reservation-group-resource'
import { ReservationByDate } from '../view-models/reservation-by-date'

@Injectable({ providedIn: 'root' })

export class ReservationService extends DataService {

    constructor(http: HttpClient, private helperService: HelperService) {
        super(http, '/api/reservations')
    }

    get(date: string): Observable<ReservationGroupResource> {
        return this.http.get<ReservationGroupResource>(this.url + '/date/' + date)
    }

    getByDate(destinationId: number): Promise<any> {
        return this.http.get<ReservationByDate>(this.url + '/getForDestination' + '/destinationId/' + destinationId).toPromise()
    }

    getByDateDestinationPort(date: string, destinationId: number, portId: number): Promise<any> {
        return this.http.get<any>(this.url + '/getForDateAndDestinationAndPort/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId).toPromise()
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
