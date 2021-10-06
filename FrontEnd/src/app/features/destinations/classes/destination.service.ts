import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { DestinationDropdownResource } from './../../reservations/classes/resources/form/dropdown/destination-dropdown-resource'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class DestinationService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/destinations')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<DestinationDropdownResource[]> {
        return this.http.get<DestinationDropdownResource[]>(environment.apiUrl + '/destinations/getActiveForDropdown')
    }

    //#endregion

}
