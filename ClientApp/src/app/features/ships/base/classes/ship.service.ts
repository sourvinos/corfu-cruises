import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
// Custom
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { Ship } from './ship'

@Injectable({ providedIn: 'root' })

export class ShipService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/ships')
    }

    getAllActive(): Observable<Ship[]> {
        return this.http.get<Ship[]>('/api/ships/getActiveForDropdown')
    }

}
