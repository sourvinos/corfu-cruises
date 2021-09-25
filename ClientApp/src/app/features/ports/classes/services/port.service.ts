import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { PortDropdownResource } from 'src/app/features/reservations/classes/resources/form/dropdown/port-dropdown-resource'

@Injectable({ providedIn: 'root' })

export class PortService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/ports')
    }

    //#region public methods

    public getActiveForDropdown(): Observable<PortDropdownResource[]> {
        return this.http.get<PortDropdownResource[]>('/api/ports/getActiveForDropdown')
    }

    public createPDF(): Observable<HttpResponse<Blob>> {
        return this.http.get('pdf/create', { responseType: 'blob', observe: 'response' })
    }

    //#endregion

}



