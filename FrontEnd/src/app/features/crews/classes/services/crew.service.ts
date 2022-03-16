import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CrewService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/crews')
    }

}
