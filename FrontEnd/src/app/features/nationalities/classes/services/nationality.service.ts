import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'
import { NationalityAutocompleteVM } from '../view-models/nationality-autocomplete-vm'

@Injectable({ providedIn: 'root' })

export class NationalityService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/nationalities')
    }

    //#region public methods

    getActiveForDropdown(): Observable<NationalityAutocompleteVM[]> {
        return this.http.get<NationalityAutocompleteVM[]>(environment.apiUrl + '/nationalities/getActiveForDropdown')
    }

    //#endregion

}
