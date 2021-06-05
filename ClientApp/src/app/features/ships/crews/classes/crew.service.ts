import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Common
import { Crew } from './crew'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })
    
export class CrewService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/crews')
    }

    //#region public methods

    public getAllActive(): Observable<Crew[]> {
        return this.http.get<Crew[]>('/api/crews/getActive')
    }

    //#endregion

}
