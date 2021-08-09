import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class ManifestService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/manifest')
    }

    get(date: string, destinationId: number, portId: number, vesselId: number): Observable<any> {
        return this.http.get<any>(this.url + '/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId + '/vesselId/' + vesselId)
    }

}
