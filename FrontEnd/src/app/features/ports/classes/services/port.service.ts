import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'
import { PortDropdownDTO } from '../dtos/port-dropdown-dto'

@Injectable({ providedIn: 'root' })

export class PortService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/ports')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<PortDropdownDTO[]> {
        return this.http.get<PortDropdownDTO[]>(environment.apiUrl + '/ports/getActiveForDropdown')
    }

    public createPDF(): Observable<HttpResponse<Blob>> {
        return this.http.get('pdf/create', { responseType: 'blob', observe: 'response' })
    }

    //#endregion

}