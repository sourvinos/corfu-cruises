import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { Customer } from './customer'

@Injectable({ providedIn: 'root' })

export class CustomerService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/customers')
    }

    //#region public methods

    public getAllActive(): Observable<Customer[]> {
        return this.http.get<Customer[]>('/api/customers/getActive')
    }

    public getSelectedFields(): Observable<any> {
        return this.http.get<any[]>('/api/customers/GetFieldSubset')
    }

    //#endregion

}
