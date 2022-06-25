import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { ChangePasswordViewModel } from '../view-models/change-password-view-model'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class UserService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/users')
    }

    //#region public methods

    public getConnectedUsers(): Observable<any> {
        return this.http.get<any[]>(this.url + '/getConnectedUsers')
    }

    public sendLoginCredentials(formData: any): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/users/sendLoginCredentials/', formData)
    }

    public updatePassword(formData: ChangePasswordViewModel): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/changePassword/', formData)
    }

    //#endregion

}
