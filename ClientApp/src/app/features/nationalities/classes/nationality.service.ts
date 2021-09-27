import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { NationalityDropdownResource } from './../../reservations/classes/resources/form/dropdown/nationality-dropdown-resource'


@Injectable({ providedIn: 'root' })

export class NationalityService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/nationalities')
    }

    //#region public methods

    getActiveForDropdown(): Observable<NationalityDropdownResource[]> {
        return this.http.get<NationalityDropdownResource[]>('/api/nationalities/getActiveForDropdown')
    }

    //#endregion

}
