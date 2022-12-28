import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { LedgerVM } from '../view-models/ledger-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class LedgerService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/ledger')
    }

    //#region public methods

    get(fromDate: string, toDate: string, customerId: string, destinationId: string, shipId: string): Observable<LedgerVM> {
        return this.http.get<LedgerVM>(this.url + '/fromDate/' + fromDate + '/toDate/' + toDate + '/customerId/' + customerId + '/destinationId/' + destinationId + '/shipId/' + shipId)
    }

    //#endregion

}