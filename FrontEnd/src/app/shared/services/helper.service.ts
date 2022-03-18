import { Injectable } from '@angular/core'
// Custom
import { EmojiService } from './emoji.service'
import { environment } from 'src/environments/environment'
import { LocalStorageService } from './local-storage.service'

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    constructor(private emojiService: EmojiService, private localStorageService: LocalStorageService) { }

    //#region public methods

    public changeScrollWheelSpeed(container: HTMLElement, speedY: number): any {
        let scrollY = 0
        const handleScrollReset = function () {
            scrollY = container.scrollTop
        }
        const handleMouseWheel = function (e) {
            e.preventDefault()
            scrollY += speedY * e.deltaY
            if (scrollY < 0) {
                scrollY = 0
            } else {
                const limitY = container.scrollHeight - container.clientHeight
                if (scrollY > limitY) {
                    scrollY = limitY
                }
            }
            container.scrollTop = scrollY
        }
        let removed = false
        container.addEventListener('mouseup', handleScrollReset, false)
        container.addEventListener('mousedown', handleScrollReset, false)
        container.addEventListener('mousewheel', handleMouseWheel, false)
        return () => {
            if (removed) {
                return
            }
            container.removeEventListener('mouseup', handleScrollReset, false)
            container.removeEventListener('mousedown', handleScrollReset, false)
            container.removeEventListener('mousewheel', handleMouseWheel, false)
            removed = true
        }
    }

    public deviceDetector(): string {
        return 'desktop'
    }

    public enableOrDisableAutoComplete(event: { key: string }): boolean {
        return (event.key == 'Enter' || event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'ArrowLeft') ? true : false
    }

    public formatISODateToLocale(date: string) {
        const parts = date.split('-')
        return this.addLeadingZerosToDateParts(new Intl.DateTimeFormat(this.localStorageService.getLanguage()).format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))))
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

    public getDistinctRecords(records: any[], field: string): any[] {
        let unique = []
        const array: any[] = []
        unique = [... new Set(records.map(x => x[field]))]
        unique.forEach(element => {
            array.push({ label: element, value: element })
        })
        return array
    }

    public getHomePage(): string {
        return '/'
    }

    public populateTableFiltersDropdowns(records: any[], field: string): any[] {
        const array: any[] = []
        const elements = [... new Set(records.map(x => x[field]))]
        elements.forEach(element => {
            array.push({ label: element == '(EMPTY)' ? this.emojiService.getEmoji('wildcard') : element, value: element })
        })
        array.sort((a, b) => (a.label > b.label) ? 1 : -1)
        return array
    }

    public setFocus(element: string): void {
        setTimeout(() => {
            const input = <HTMLInputElement>document.getElementById(element)
            input.focus()
            input.select()
        }, 500)
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

    private getDateLocaleSeperator() {
        switch (this.localStorageService.getLanguage()) {
            case 'cs-cz': return '.'
            case 'de-de': return '.'
            case 'el-gr': return '/'
            case 'en-gb': return '/'
            case 'fr-fr': return '/'
        }
    }

    //#endregion

}
