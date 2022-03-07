import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
// Custom
import { LocalStorageService } from './local-storage.service'

@Injectable({ providedIn: 'root' })

export class MessageCalendarService {

    //#region variables

    private messages: any = []

    //#endregion

    constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
        this.getMessages()
    }

    //#region public methods

    public getDescription(feature: string, id: string): string {
        let returnValue = ''
        if (this.messages != undefined) {
            this.messages.filter((f: { feature: string; labels: any[] }) => {
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
            const language = this.localStorageService.getLanguage() == null ? 'en-gb' : localStorage.getItem('language')
            this.httpClient.get('assets/languages/calendar/calendar.' + language + '.json').toPromise().then(response => {
                this.messages = response
                resolve(this.messages)
            })
        })
        return promise
    }

}