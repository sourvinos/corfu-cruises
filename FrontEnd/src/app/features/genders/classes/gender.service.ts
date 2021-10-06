import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { Gender } from './gender'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class GenderService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/genders')
    }

    //#region public methods

    getActiveForDropdown(): Observable<Gender[]> {
        return this.http.get<Gender[]>(environment.apiUrl + '/genders/getActiveForDropdown')
    }

    //#endregion

}
