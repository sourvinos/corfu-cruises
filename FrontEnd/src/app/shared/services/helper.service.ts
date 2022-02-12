import { Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { EmojiService } from './emoji.service'

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    /**
     *
     */
    constructor(private emojiService: EmojiService) { }

    //#region public methods

    public deviceDetector(): string {
        return 'desktop'
    }

    public enableField(form: FormGroup, field: string): void {
        form.get(field).enable()
    }

    public formatDateToLocale(date: string | number | Date): string {
        return new Date(date).toLocaleDateString(this.readItem('language'), { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    public formatDateToISO(date: any): string {
        return date.substring(0, 10)
    }

    public getApplicationTitle(): any {
        return this.appName
    }

    public populateTableFiltersDropdowns(records: any[], field: string): any[] {
        const array = []
        const elements = [... new Set(records.map(x => x[field]))]
        elements.forEach(element => {
            array.push({ label: element == '(EMPTY)' ? this.emojiService.getEmoji('wildcard') : element, value: element })
        })
        array.sort((a, b) => (a.label > b.label) ? 1 : -1)
        return array
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

    private getDefaultLanguage(): string {
        localStorage.setItem('language', 'en-gb')
        return 'en-gb'
    }

    //#endregion

}
