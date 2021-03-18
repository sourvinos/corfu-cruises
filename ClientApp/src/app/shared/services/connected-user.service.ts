import { DataService } from 'src/app/shared/services/data.service'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class ConnectedUserService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/connectedUsers')
    }

}
