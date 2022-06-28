import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { TotalsVM } from '../view-models/simple-user-totals-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class TotalsService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/totals')
    }

    //#region public methods

    get(fromDate: string, toDate: string): Observable<TotalsVM> {
        return this.http.get<TotalsVM>(this.url + '/fromDate/' + fromDate + '/toDate/' + toDate)
    }

    //#endregion

}