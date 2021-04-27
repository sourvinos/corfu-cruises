import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({ providedIn: 'root' })

export class MessageSnackbarService {

    //#region variables

    private messages: any = []
    private feature = 'snackbarMessages'

    //#endregion

    constructor(private httpClient: HttpClient) {
        this.getMessages()
    }

    //#region public methods

    public getDescription(feature: string, id: string): string {
        let returnValue = ''
        if (this.messages.length > 0) {
            this.messages.filter((f: { feature: string; labels: any[] }) => {
                if (f.feature === feature) {
                    f.labels.filter(l => {
                        if (l.id == id) {
                            returnValue = l.message
                        }
                    })
                }
            })
        }
        return returnValue
    }

    public getMessages(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.httpClient.get('assets/languages/snackbar/snackbar.' + localStorage.getItem('language') + '.json').toPromise().then(
                response => {
                    this.messages = response
                    resolve(this.messages)
                })
        })
        return promise
    }

    public accountNotConfirmed(): string { return this.getDescription(this.feature, "accountNotConfirmed") }
    public askConfirmationToAbortEditing(): string { return this.getDescription(this.feature, "askConfirmationToAbortEditing") }
    public askConfirmationToDelete(): string { return this.getDescription(this.feature, "askConfirmationToDelete") }
    public authenticationFailed(): string { return this.getDescription(this.feature, "authenticationFailed") }
    public emailSent(): string { return this.getDescription(this.feature, "emailSent") }
    public formIsDirty(): string { return this.getDescription(this.feature, "formIsDirty") }
    public noVideoDevicesFound(): string { return this.getDescription(this.feature, "noVideoDevicesFound") }
    public noRecordsSelected(): string { return this.getDescription(this.feature, "noRecordsSelected") }
    public passwordChanged(): string { return this.getDescription(this.feature, "passwordChanged") }
    public recordCreated(): string { return this.getDescription(this.feature, "recordCreated") }
    public recordDeleted(): string { return this.getDescription(this.feature, "recordDeleted") }
    public recordUpdated(): string { return this.getDescription(this.feature, "recordUpdated") }
    public selectedRecordsHaveBeenProcessed(): string { return this.getDescription(this.feature, "selectedRecordsHaveBeenProcessed") }
    public unableToResetPassword(): string { return this.getDescription(this.feature, "unableToResetPassword") }
    public invalidModel(): string { return this.getDescription(this.feature, "invalidModel") }

    public filterError(errorCode: number, feature = 'snackbarMessages'): string {
        let returnValue = ''
        this.messages.filter((f: { feature: string; labels: any[] }) => {
            if (f.feature === feature) {
                if (typeof errorCode == 'number') {
                    f.labels.filter(l => { if (l.error == errorCode) { returnValue = l.message } })
                } else {
                    f.labels.filter(l => { if (l.error == 499) { returnValue = l.message } })
                }
            }
        })
        return returnValue
    }

}