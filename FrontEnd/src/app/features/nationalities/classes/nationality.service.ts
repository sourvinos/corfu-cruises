import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { NationalityDropdownResource } from './../../reservations/classes/resources/form/dropdown/nationality-dropdown-resource'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class NationalityService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/nationalities')
    }

    //#region public methods

    getActiveForDropdown(): Observable<NationalityDropdownResource[]> {
        return this.http.get<NationalityDropdownResource[]>(environment.apiUrl + '/nationalities/getActiveForDropdown')
    }

    //#endregion

}
