import Localbase from 'localbase'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class LocalbaseDataService {

    private db = new Localbase('db')

    constructor() {
        console.log('INIT')
        this.db.config.debug = false
        this.db.delete()
    }

    public readFromAPI(table: string, service: any): any {
        const promise = new Promise((resolve) => {
            service.getActiveForDropdown().toPromise().then((response: any) => {
                resolve(this.db.collection(table).set(response))
            })
        })
        return promise
    }

}
