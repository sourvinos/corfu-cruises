import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import HttpDataService from './http-data.service'

@Injectable({ providedIn: 'root' })

export class ConnectedUserService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/connectedUsers')
    }

}
