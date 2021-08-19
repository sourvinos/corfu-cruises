import { Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import moment from 'moment'
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

    public deviceDetector(): string {
        return 'desktop'
    }

    public enableField(form: FormGroup, field: string): void {
        form.get(field).enable()
    }

    public formatDateToLocale(date: string | number | Date): string {
        return new Date(date).toLocaleDateString(this.readItem('language'), { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    public formatDateToISO(date: string): string {
        const value = moment(date)
        return value.format('YYYY-MM-DD')
    }

    public getApplicationTitle(): any {
        return this.appName
    }

    public getElementOuterHeight(element: string): any {
        let height = document.getElementById(element).offsetHeight
        const style = getComputedStyle(document.getElementById(element))
        height += parseInt(style.marginTop) + parseInt(style.marginBottom)
        height -= 32
        return height + 'px'
    }

    public findElementById(element: string): boolean {
        const x = document.getElementById(element)
        if (typeof (x) != 'undefined' && x != null) {
            return true
        }
        return false
    }

    public populateTableFiltersDropdowns(records: any[], field: string): any[] {
        const array = []
        const elements = [... new Set(records.map(x => x[field]))]
        elements.forEach(element => {
            array.push({ label: element, value: element })
        })
        array.sort((a, b) => (a.label > b.label) ? 1 : -1)
        return array
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

    public readLanguage(): string {
        return localStorage.getItem('language') ? localStorage.getItem('language') : this.getDefaultLanguage()
    }

    public readItem(item: string): string {
        return localStorage.getItem(item) || ''
    }

    public saveItem(key: string, value: string): void {
        localStorage.setItem(key, value)
    }

    public removeItem(key: string): void {
        localStorage.removeItem(key)
    }

    public setFocus(element: string): void {
        setTimeout(() => {
            const input = <HTMLInputElement>document.getElementById(element)
            input.focus()
            input.select()
        }, 500)
    }

    public refreshPage(router: Router, url: string): void {
        router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            router.navigate([url])
        })
    }

    //#endregion

    //#region private methods

    private removeLeadingAsteriskFromString(value: string): string {
        return value.substr(1, value.length)
    }

    private getDefaultLanguage(): string {
        localStorage.setItem('language', 'en-GB')
        return 'en-GB'
    }

    //#endregion

}
