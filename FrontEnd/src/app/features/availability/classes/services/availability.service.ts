import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class AvailabilityService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/schedules')
    }

    //#region public methods

    public async getForCalendar(fromDate: string, toDate: string): Promise<any> {
        return await firstValueFrom(this.http.get<any>(this.url + '/fromDate/' + fromDate + '/toDate/' + toDate))
    }

    //#endregion

}
