import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Common
import { DataService } from 'src/app/shared/services/data.service'
import { Registrar } from './registrar'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class RegistrarService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/registrars')
    }

    //#region public methods

    public getAllActive(): Observable<Registrar[]> {
        return this.http.get<Registrar[]>(environment.apiUrl + '/registrars/getActive')
    }

    //#endregion

}
