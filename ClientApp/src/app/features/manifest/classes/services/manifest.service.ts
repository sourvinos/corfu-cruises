import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { Manifest } from '../view-models/manifest'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class ManifestService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/manifests')
    }

    get(date: string, shipId: number, shipRouteId: number): Observable<Manifest> {
        return this.http.get<any>(this.url + '/date/' + date + '/shipId/' + shipId + '/shipRouteId/' + shipRouteId)
    }

    boardPassenger(id: number): Observable<any> {
        const params = new HttpParams().set('id', id.toString())
        return this.http.patch(this.url + '/doManifest?', null, { params: params })
    }

}
