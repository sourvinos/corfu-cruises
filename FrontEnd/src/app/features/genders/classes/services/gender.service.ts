import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { Gender } from '../models/gender'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class GenderService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/genders')
    }

    //#region public methods

    getActiveForDropdown(): Observable<Gender[]> {
        return this.http.get<Gender[]>(environment.apiUrl + '/genders/getActiveForDropdown')
    }

    //#endregion

}
