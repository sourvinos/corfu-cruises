import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class VoucherService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/voucher')
    }

    createVoucher(formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/createVoucher', formData)
    }

    emailVoucher(formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/emailVoucher', formData)
    }

}
