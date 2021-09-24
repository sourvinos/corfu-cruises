import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class ScheduleService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/schedules')
    }

    //#region public methods

    public getForPeriod(fromDate: string, toDate: string): Promise<any> {
        return this.http.get<any>(this.url + '/from/' + fromDate + '/to/' + toDate).toPromise()
    }

    public addRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url, formData)
    }

    public deleteRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url + '/range/', formData)
    }

    //#endregion

}
