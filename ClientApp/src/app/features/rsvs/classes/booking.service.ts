import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { BookingByDate } from './booking-by-date'
import { BookingViewModel } from './booking-view-model'

@Injectable({ providedIn: 'root' })

export class BookingService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/rsvs')
    }

    get(date: string): Observable<BookingViewModel> {
        return this.http.get<BookingViewModel>('/api/rsvs/date/' + date)
    }

    getByDate(destinationId: number, portId: number): Promise<any> {
        return this.http.get<BookingByDate>('/api/rsvs/destinationId/' + destinationId + '/portId/' + portId).toPromise()
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

    sendVoucher(formData: any): any {
        return this.http.post<any>('/api/rsvs/sendVoucher', formData)
    }

}
