import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { ReservationByDate } from '../view-models/reservation-by-date'
import { ReservationViewModel } from '../view-models/reservation-view-model'

@Injectable({ providedIn: 'root' })

export class ReservationService extends DataService {

    constructor(http: HttpClient, private helperService: HelperService) {
        super(http, '/api/reservations')
    }

    assignToDriver(driverId: string, ids: string[]): Observable<any> {
        let params = new HttpParams().set('driverId', driverId).set('id', ids[0])
        ids.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element)
            }
        })
        return this.http.patch(this.url + '/assignToDriver?', null, { params: params })
    }

    assignToShip(shipId: string, ids: string[]): Observable<any> {
        let params = new HttpParams().set('shipId', shipId).set('id', ids[0])
        ids.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element)
            }
        })
        return this.http.patch(this.url + '/assignToShip?', null, { params: params })
    }

    get(date: string): Observable<ReservationViewModel> {
        return this.http.get<ReservationViewModel>(this.url + '/userId/' + this.helperService.readItem('userId') + '/date/' + date)
    }

    getByDate(destinationId: number): Promise<any> {
        return this.http.get<ReservationByDate>(this.url + '/getForDestination' + '/destinationId/' + destinationId).toPromise()
    }

    getByDateDestinationPort(date: string, destinationId: number, portId: number): Promise<any> {
        return this.http.get<any>(this.url + '/getForDateAndDestinationAndPort/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId).toPromise()
    }

}
