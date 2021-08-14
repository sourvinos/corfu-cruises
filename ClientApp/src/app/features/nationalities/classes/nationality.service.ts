// Base
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { Nationality } from './nationality'

@Injectable({ providedIn: 'root' })

export class NationalityService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/nationalities')
    }

    //#region public methods

    getAllActive(): Observable<Nationality[]> {
        return this.http.get<Nationality[]>('/api/nationalities/getActiveForDropdown')
    }

    //#endregion

}
