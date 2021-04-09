import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { Boarding } from './boarding'

@Injectable({ providedIn: 'root' })

export class BoardingService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/boardings')
    }

    get(date: string, destinationId: number, portId: number, shipId: number): Observable<Boarding> {
        const result = this.http.get<any>('/api/boardings/' + date + '/' + destinationId + '/' + portId + '/' + shipId)
        return result
    }

    boardPassenger(id: number): Observable<any> {
        const params = new HttpParams().set('id', id.toString())
        return this.http.patch(this.url + '/doBoarding?', null, { params: params })
    }

}
