import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { Driver } from './driver'

@Injectable({ providedIn: 'root' })

export class DriverService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/drivers')
    }

    //#region public methods

    getAllActive(): Observable<Driver[]> {
        return this.http.get<Driver[]>('/api/drivers/getActive')
    }

    //#endregion

}
