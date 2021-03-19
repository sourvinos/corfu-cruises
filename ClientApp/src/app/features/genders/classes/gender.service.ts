import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { Gender } from './gender'

@Injectable({ providedIn: 'root' })

export class GenderService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/genders')
    }

    //#region public methods

    getAllActive(): Observable<Gender[]> {
        return this.http.get<Gender[]>('/api/genders/getActive')
    }

    //#endregion

}
