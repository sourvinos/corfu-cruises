import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { NationalityAutocompleteVM } from '../view-models/nationality-autocomplete-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class NationalityService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/nationalities')
    }

    //#region public methods

    getActiveForDropdown(): Observable<NationalityAutocompleteVM[]> {
        return this.http.get<NationalityAutocompleteVM[]>(environment.apiUrl + '/nationalities/getActiveForDropdown')
    }

    //#endregion

}
