import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { CrewResource } from './crew-resource'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })
    
export class CrewService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/crews')
    }

    //#region public methods

    public getAllActive(): Observable<CrewResource[]> {
        return this.http.get<CrewResource[]>('/api/crews/getActive')
    }

    //#endregion

}
