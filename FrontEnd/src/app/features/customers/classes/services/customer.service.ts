import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { CustomerDropdownVM } from 'src/app/features/customers/classes/view-models/customer-dropdown-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CustomerService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/customers')
    }

    //#region public methods

    public getActive(): Observable<CustomerDropdownVM[]> {
        return this.http.get<CustomerDropdownVM[]>(environment.apiUrl + '/customers/getActive')
    }

    //#endregion

}
