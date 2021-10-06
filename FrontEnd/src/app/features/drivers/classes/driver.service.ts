import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { Driver } from './driver'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class DriverService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/drivers')
    }

    //#region public methods

    getActiveForDropdown(): Observable<Driver[]> {
        return this.http.get<Driver[]>(environment.apiUrl + '/drivers/getActiveForDropdown')
    }

    getDefault(): Observable<number> {
        return this.http.get<number>(environment.apiUrl + '/drivers/getDefault')
    }

    //#endregion

}
