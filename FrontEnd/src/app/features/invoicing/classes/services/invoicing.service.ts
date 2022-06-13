import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { InvoicingVM } from '../view-models/invoicing-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class InvoicingService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/invoicing')
    }

    //#region public methods

    get(date: string, customerId: string, destinationId: string, shipId: string): Observable<InvoicingVM> {
        return this.http.get<InvoicingVM>(this.url + '/date/' + date + '/customerId/' + customerId + '/destinationId/' + destinationId + '/shipId/' + shipId)
    }

    //#endregion

}