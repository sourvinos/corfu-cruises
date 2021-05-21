import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { ChangePassword } from './change-password'
import { DataService } from 'src/app/shared/services/data.service'
import { HelperService } from './../../../shared/services/helper.service'

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    constructor(httpClient: HttpClient, private helperService: HelperService) {
        super(httpClient, '/api/users')
    }

    //#region public methods

    public updatePassword(formData: ChangePassword): Observable<any> {
        return this.http.post<any>('/api/account/changePassword/', formData)
    }

    public sendLoginCredentials(formData: any): Observable<any> {
        return this.http.post<any>('/api/users/sendLoginCredentials/', formData)
    }

    //#endregion

}
