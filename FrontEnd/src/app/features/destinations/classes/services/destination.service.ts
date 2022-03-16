import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { DestinationDropdownVM } from '../view-models/destination-dropdown-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class DestinationService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/destinations')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<DestinationDropdownVM[]> {
        return this.http.get<DestinationDropdownVM[]>(environment.apiUrl + '/destinations/getActiveForDropdown')
    }

    //#endregion

}
