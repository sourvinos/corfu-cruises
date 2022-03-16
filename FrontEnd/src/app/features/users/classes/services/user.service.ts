import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { ChangePasswordViewModel } from '../view-models/change-password-view-model'
import { DataService } from 'src/app/shared/services/data.service'
import { HelperService } from '../../../../shared/services/helper.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    constructor(httpClient: HttpClient, private helperService: HelperService) {
        super(httpClient, environment.apiUrl + '/users')
    }

    //#region public methods

    public updatePassword(formData: ChangePasswordViewModel): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/changePassword/', formData)
    }

    public sendLoginCredentials(formData: any): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/users/sendLoginCredentials/', formData)
    }

    //#endregion

}
