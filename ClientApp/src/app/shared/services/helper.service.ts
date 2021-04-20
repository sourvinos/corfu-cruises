import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    //#region public methods

    public createJsonFile(data: any): void {
        const theJSON = JSON.stringify(data)
        const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON)
        const a = document.createElement('a')
        a.href = uri
        a.innerHTML = "Right-click and choose 'save as...'"
        document.body.appendChild(a)
    }

    public getApplicationTitle(): any {
        return this.appName
    }

    public setFocus(element: string): void {
        setTimeout(() => {
            const input = <HTMLInputElement>document.getElementById(element)
            input.focus()
            input.select()
        }, 500)
    }

    public saveItem(key: string, value: string): void {
        localStorage.setItem(key, value)
    }

    public readItem(item: string): string {
        return localStorage.getItem(item) || ''
    }

    public deviceDetector(): string {
        return 'mobile'
    }

    //#endregion

}
