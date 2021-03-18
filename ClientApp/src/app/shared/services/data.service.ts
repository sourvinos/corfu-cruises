import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export class DataService {

    constructor(public http: HttpClient, public url: string) { }

    //#region public methods

    public add(formData: any): Observable<any> {
        return this.http.post<any>(this.url, formData)
    }

    public delete(id: string | number): Observable<any> {
        if (id != undefined)
            return this.http.delete<any>(this.url + '/' + id)
    }

    public getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.url)
    }

    public getSingle(id: string | number): Observable<any> {
        if (id != undefined)
            return this.http.get<any>(this.url + '/' + id)
    }

    public update(id: string | number, formData: any): Observable<any> {
        if (id != undefined)
            return this.http.put<any>(this.url + '/' + id, formData)
    }

    //#endregion

}
