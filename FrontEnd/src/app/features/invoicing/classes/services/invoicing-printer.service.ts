import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from '../../../../shared/services/data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class InvoicingPrinterService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/invoicingprinter')
    }

    createCriteriaObject(date: string, customerId: number): any {
        return {
            date: date,
            customerId: customerId,
        }
    }

    createReport(criteria: any): Observable<any> {
        return this.http.post(this.url + '/createreport/', criteria)
    }

    openReport(filename: string): Observable<any> {
        return this.http.get(this.url + '/openreport/' + filename, { responseType: 'arraybuffer' })
    }

}
