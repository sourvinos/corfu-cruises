import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ScheduleService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/schedules')
    }

    //#region public methods

    public getForList(): Observable<any> {
        return this.http.get<any>(this.url+'/getForList')
    }

    public getForCalendar(fromDate: string, toDate: string): Promise<any> {
        return this.http.get<any>(this.url + '/getForCalendar/from/' + fromDate + '/to/' + toDate).toPromise()
    }

    public addRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url, formData)
    }

    public deleteRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url + '/range/', formData)
    }

    //#endregion

}
