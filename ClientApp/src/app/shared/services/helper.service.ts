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
        return 'desktop'
    }

    public getElementWidth(element: HTMLElement): any {
        return element.clientWidth
    }

    public pushItemToFilteredArray(x: { [x: string]: string }, key: string | number, value: { target: any }, targetArray: any[]): any[] {
        if (value.target.value.startsWith('*')) {
            if (x[key].toUpperCase().includes(this.removeLeadingAsteriskFromString(value.target.value).toUpperCase())) {
                targetArray.push(x)
            }
        }
        if (x[key].toUpperCase().startsWith(value.target.value.toUpperCase())) {
            targetArray.push(x)
        }
        return targetArray
    }

    private removeLeadingAsteriskFromString(value: string): string {
        return value.substr(1, value.length)
    }

    //#endregion

}
