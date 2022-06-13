import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ReservationGroupVM } from '../resources/list/reservation-group-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ReservationService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/reservations')
    }

    getByDate(date: string): Observable<ReservationGroupVM> {
        return this.http.get<ReservationGroupVM>(this.url + '/byDate/' + date)
    }

    getByDateAndDriver(date: string, driverId: number): Observable<any> {
        return this.http.get<any>(this.url + '/byDate/' + date + '/byDriver/' + driverId)
    }

    getByRefNo(refNo: string): Observable<ReservationGroupVM> {
        return this.http.get<ReservationGroupVM>(this.url + '/byRefNo/' + refNo)
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

    isDestinationOverbooked(date: string, destinationId: number): Observable<boolean> {
        return this.http.get<boolean>(this.url + '/isOverbooked/date/' + date + '/destinationid/' + destinationId)
    }

}
