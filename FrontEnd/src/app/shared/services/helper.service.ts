import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { defer, finalize, Observable, Subject } from 'rxjs'
// Custom
import { DialogService } from './dialog.service'
import { EmojiService } from './emoji.service'
import { LocalStorageService } from './local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { ModalActionResultService } from './modal-action-result.service'
import { environment } from 'src/environments/environment'

export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => defer(() => {
        callback()
        return source
    })
}

export function indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => source.pipe(
        prepare(() => indicator.next(true)),
        finalize(() => indicator.next(false))
    )
}

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    constructor(private dialogService: DialogService, private emojiService: EmojiService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region public methods

    public convertLongDateToISODate(date: string | number | Date): string {
        const x = new Date(date)
        let month = (x.getMonth() + 1).toString()
        let day = x.getDate().toString()
        const year = x.getFullYear()
        const weekday = x.toLocaleString('default', { weekday: 'short' })
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return weekday + ' ' + [year, month, day].join('-')
    }

    public changeScrollWheelSpeed(container: HTMLElement): any {
        if (container != null) {
            let scrollY = 0
            const handleScrollReset = function (): void {
                scrollY = container.scrollTop
            }
            const handleMouseWheel = function (e: any): void {
                e.preventDefault()
                scrollY += environment.scrollWheelSpeed * e.deltaY
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
    }

    public deviceDetector(): string {
        return 'desktop'
    }

    public doPostSaveFormTasks(message: string, iconType: string, returnUrl: string, form: any, formReset = true, goBack = true): Promise<any> {
        const promise = new Promise((resolve) => {
            this.modalActionResultService.open(message, iconType, ['ok']).subscribe(() => {
                formReset ? form.reset() : null
                goBack ? this.router.navigate([returnUrl]) : null
                resolve(null)
            })
        })
        return promise
    }

    public calculateTableWrapperHeight(topBar: string, header: string, footer: string): string {
        return window.innerHeight
            - document.getElementById(topBar).getBoundingClientRect().height
            - document.getElementById(header).getBoundingClientRect().height
            - document.getElementById(footer).getBoundingClientRect().height + 'px'
    }

    public confirmationToDelete(message: string, iconType: string, buttons: any[]): void {
        this.dialogService.open(message, iconType, buttons).subscribe(response => {
            return response
        })
    }

    public enableOrDisableAutoComplete(event: { key: string }): boolean {
        return (event.key == 'Enter' || event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'ArrowLeft') ? true : false
    }

    public formatISODateToLocale(date: string, showWeekday = false): string {
        const parts = date.split('-')
        const rawDate = new Date(date)
        const dateWithLeadingZeros = this.addLeadingZerosToDateParts(new Intl.DateTimeFormat(this.localStorageService.getLanguage()).format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))))
        const weekday = this.messageCalendarService.getDescription('weekdays', rawDate.toDateString().substring(0, 3))
        return showWeekday ? weekday + ' ' + dateWithLeadingZeros : dateWithLeadingZeros
    }

    public formatRefNo(refNo: string, returnsHTML: boolean): string {
        const destination = new RegExp(/[a-zA-Z]{1,5}/).exec(refNo)[0]
        const number = new RegExp(/[0-9]{1,5}/g).exec(refNo).slice(-5)[0]
        const zeros = '00000'.slice(number.length)
        if (returnsHTML)
            return '<span>' + destination.toUpperCase() + '</span>' + '-' + '<span>' + zeros + '</span>' + '<span>' + number + '</span>'
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

    public populateTableFiltersDropdowns(records: any[], field: any): any[] {
        const array: any[] = []
        const elements = [... new Set(records.map(x => x[field]))]
        elements.forEach(element => {
            if (typeof (element) == 'string') {
                array.push({ label: element == '(EMPTY)' ? '(EMPTY)' : element, value: element })
            }
            if (typeof (element) == 'object') {
                array.push({ label: element.description == '(EMPTY)' ? '(EMPTY)' : element.description, value: element.description })
            }

        })
        array.sort((a, b) => (a.label > b.label) ? 1 : -1)
        return array
    }

    public focusOnField(element: string): void {
        setTimeout(() => {
            const input = <HTMLInputElement>document.getElementById(element)
            input.focus()
            input.select()
        }, 1000)
    }

    public getISODate(date?: string): string {
        if (date) {
            return this.formatDate(date)
        } else {
            return new Date().toISOString().substring(0, 10)
        }
    }

    public getCurrentMonth(): number {
        return new Date().getMonth()
    }

    public getCurrentYear(): number {
        return new Date().getFullYear()
    }

    public toggleActiveItem(item: string, lookupArray: string[], className: string): any {
        const element = document.getElementById(item)
        if (element.classList.contains(className)) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove(className)
                    break
                }
            }
        } else {
            element.classList.add(className)
            lookupArray.push(item)
        }
        return lookupArray
    }

    public convertUnixToISODate(unixdate: number): string {
        const date = new Date(unixdate)
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        const twoDigitDay = day.toString().length == 1 ? '0' + day : day
        const twoDigitMonth = month.toString().length == 1 ? '0' + month : month
        const formattedTime = year + '-' + twoDigitMonth + '-' + twoDigitDay
        return formattedTime
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

    private getDateLocaleSeperator(): string {
        switch (this.localStorageService.getLanguage()) {
            case 'cs-CZ': return '.'
            case 'de-DE': return '.'
            case 'el-GR': return '/'
            case 'en-GB': return '/'
            case 'fr-FR': return '/'
        }
    }

    private formatDate(date): string {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()

        if (month.length < 2)
            month = '0' + month
        if (day.length < 2)
            day = '0' + day
        return [year, month, day].join('-')
    }

    //#endregion

}
