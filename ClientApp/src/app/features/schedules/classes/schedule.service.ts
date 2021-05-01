import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DataService } from 'src/app/shared/services/data.service'
import { Schedule } from './schedule'

@Injectable({ providedIn: 'root' })

export class ScheduleService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/schedules')
    }

    //#region public methods

    public getForDate(date: string): Promise<boolean> {
        return this.http.get<boolean>(this.url + '/getForDate/date/' + date).toPromise()
    }

    public getAllActive(): Observable<Schedule[]> {
        return this.http.get<Schedule[]>('/api/schedules/getActive')
    }

    public getForDestination(destinationId: number): Promise<Schedule[]> {
        return this.http.get<Schedule[]>('/api/schedules/getForDestination/destinationId/' + destinationId).toPromise()
    }

    public addRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url, formData)
    }

    public deleteRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url + '/range/', formData)
    }

    //#endregion

}
