import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { CustomerDropdownResource } from 'src/app/features/reservations/classes/resources/form/dropdown/customer-dropdown-resource'
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CustomerService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/customers')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<CustomerDropdownResource[]> {
        return this.http.get<CustomerDropdownResource[]>(environment.apiUrl + '/customers/getActiveForDropdown')
    }

    //#endregion

}