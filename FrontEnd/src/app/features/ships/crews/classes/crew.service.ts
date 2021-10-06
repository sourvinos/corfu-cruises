import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { Crew } from './crew'
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CrewService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/crews')
    }

    //#region public methods

    public getAllActive(): Observable<Crew[]> {
        return this.http.get<Crew[]>(environment.apiUrl + '/crews/getActive')
    }

    //#endregion

}
