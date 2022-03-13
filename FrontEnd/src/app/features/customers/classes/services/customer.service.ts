import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { CustomerDropdownDTO } from 'src/app/features/customers/classes/dtos/customer-dropdown-dto'
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CustomerService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/customers')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<CustomerDropdownDTO[]> {
        return this.http.get<CustomerDropdownDTO[]>(environment.apiUrl + '/customers/getActiveForDropdown')
    }

    //#endregion

}
