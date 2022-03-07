import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
// Custom
import { EmojiService } from './emoji.service'
import { environment } from 'src/environments/environment'
import { FormGroup } from '@angular/forms'

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    constructor(private emojiService: EmojiService) { }

    //#region public methods

    public clearStorageItems(items: string[]): void {
        items.forEach(element => {
            this.removeItem(element)
        })
    }

    public deviceDetector(): string {
        return 'desktop'
    }

    public enableField(form: FormGroup, field: string): void {
        form.get(field).enable()
    }

    public formatDateToLocale(date: string) {
        const parts = date.split('-')
        return this.addLeadingZerosToDateParts(new Intl.DateTimeFormat(this.readLanguage()).format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))))
    }

    public formatRefNo(refNo: string, returnsHTML: boolean): string {
        const destination = new RegExp(/[a-zA-Z]{1,5}/).exec(refNo)[0]
        const number = new RegExp(/[0-9]{1,5}/g).exec(refNo).slice(-5)[0]
        const zeros = '00000'.slice(number.length)
        if (returnsHTML)
            return '<span class="ref-no">' + destination.toUpperCase() + '</span>' + '-' + '<span class="zeros">' + zeros + '</span>' + '<span class="ref-no">' + number + '</span>'
        else
            return destination.toUpperCase() + '-' + zeros + number
    }

    public getApplicationTitle(): any {
        return this.appName
    }

    public getHomePage(): string {
        return '/'
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

    private addLeadingZerosToDateParts(date: string): string {
        const seperator = this.getDateLocaleSeperator()
        const parts = date.split(seperator)
        parts[0].replace(' ', '').length == 1 ? parts[0] = '0' + parts[0].replace(' ', '') : parts[0]
        parts[1].replace(' ', '').length == 1 ? parts[1] = '0' + parts[1].replace(' ', '') : parts[1]
        parts[2] = parts[2].replace(' ', '')
        return parts[0] + seperator + parts[1] + seperator + parts[2]
    }

    private getDefaultLanguage(): string {
        localStorage.setItem('language', 'en-gb')
        return 'en-gb'
    }

    private getDateLocaleSeperator() {
        switch (this.readLanguage()) {
            case 'cs-cz': return '.'
            case 'de-de': return '.'
            case 'el-gr': return '/'
            case 'en-gb': return '/'
            case 'fr-fr': return '/'
        }
    }

    private removeItem(key: string): void {
        localStorage.removeItem(key)
    }

    //#endregion

}
