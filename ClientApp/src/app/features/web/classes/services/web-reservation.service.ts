import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class WebReservationService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/web')
    }

    getByDateDestinationPort(date: string, destinationId: number, portId: number): Promise<any> {
        return this.http.get<any>(this.url + '/getForDateDestinationPort/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId).toPromise()
    }

    sendVoucher(formData: any): any {
        return this.http.post<any>(this.url + '/sendVoucher', formData)
    }

}
