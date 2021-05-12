import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({ providedIn: 'root' })

export class MessageHintService {

    //#region variables

    private messages: any = []

    //#endregion

    constructor(private httpClient: HttpClient) {
        this.getMessages()
    }

    //#region public methods

    public getDescription(id: string, stringLength = 0): string {
        let returnValue = ''
        if (this.messages.length > 0) {
            this.messages.labels.filter((l: { id: string; description: string }) => {
                if (l.id == id) {
                    returnValue = l.description.replace('xx', stringLength.toString())
                }
            })
        }
        return returnValue
    }

    public getMessages(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.httpClient.get('assets/languages/hint/hint.' + localStorage.getItem('language') + '.json').toPromise().then(
                response => {
                    this.messages = response
                    resolve(this.messages)
                })
        })
        return promise
    }

    //#endregion

}

