import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { ShipOwner } from './ship-owner'

@Injectable({ providedIn: 'root' })

export class ShipOwnerService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/shipOwners')
    }

    getAllActive(): Observable<ShipOwner[]> {
        return this.http.get<ShipOwner[]>('/api/shipOwners/getActive')
    }

}
