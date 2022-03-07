import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
// Custom
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'


@Injectable({ providedIn: 'root' })

export class MessageMenuService {

    //#region variables

    private messages: any = []

    //#endregion

    constructor(private localStorageService: LocalStorageService, private httpClient: HttpClient) { }

    //#region public methods

    public getDescription(response: any[], feature: string, id: string): string {
        let returnValue = ''
        if (response != undefined) {
            response.filter((f: { feature: string; labels: any[] }) => {
                if (f.feature === feature) {
                    f.labels.filter(l => {
                        if (l.id == id) {
                            returnValue = l.description
                        }
                    })
                }
            })
        }
        return returnValue
    }

    public getMessages(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.httpClient.get('assets/languages/menu/menu.' + this.localStorageService.getLanguage() + '.json').toPromise().then(response => {
                this.messages = response
                resolve(this.messages)
            })
        })
        return promise
    }

    //#endregion

}

