import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { InvoicingViewModel } from '../view-models/invoicing-view-model'

@Injectable({ providedIn: 'root' })

export class InvoicingService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/invoicing')
    }

    get(date: string, customerId: number, destinationId: number, vesselId: number): Observable<InvoicingViewModel> {
        return this.http.get<InvoicingViewModel>(this.url + '/date/' + date + '/customer/' + customerId + '/destination/' + destinationId + '/vessel/' + vesselId)
    }

}