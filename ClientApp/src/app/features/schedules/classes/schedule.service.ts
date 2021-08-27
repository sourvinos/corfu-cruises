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

    public isSchedule(date: string): Promise<boolean> {
        return this.http.get<boolean>(this.url + '/isSchedule/date/' + date).toPromise()
    }

    public getAllActive(): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(this.url + '/getActive')
    }

    public getForDestination(destinationId: number): Promise<Schedule[]> {
        return this.http.get<Schedule[]>(this.url + '/getForDestination/destinationId/' + destinationId).toPromise()
    }

    public getForDateAndDestination(date: string, destinationId: number): Promise<any> {
        return this.http.get<any>(this.url + '/getForDateAndDestination/date/' + date + '/destinationId/' + destinationId).toPromise()
    }

    public getForDateAndDestinationAndPort(date: string, destinationId: number, portId: number): Promise<any> {
        return this.http.get<any>(this.url + '/getForDateAndDestinationAndPort/date/' + date + '/destinationId/' + destinationId + '/portId/' + portId).toPromise()
    }

    public addRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url, formData)
    }

    public deleteRange(formData: any[]): Observable<any[]> {
        return this.http.post<any[]>(this.url + '/range/', formData)
    }

    //#endregion

}
