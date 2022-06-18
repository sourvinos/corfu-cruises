import { FormGroup } from '@angular/forms'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { defer, finalize, Observable, Subject } from 'rxjs'
// Custom
import { EmojiService } from './emoji.service'
import { LocalStorageService } from './local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { ModalActionResultService } from './modal-action-result.service'
import { environment } from 'src/environments/environment'
import { DialogService } from './dialog.service'

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

    public changeScrollWheelSpeed(container: HTMLElement): any {
        if (container != null) {
            let scrollY = 0
            const handleScrollReset = function () {
                scrollY = container.scrollTop
            }
            const handleMouseWheel = function (e: any) {
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

    public doPostSaveFormTasks(message: string, iconType: string, returnUrl: string, form: FormGroup, goBack = true): void {
        this.modalActionResultService.open(message, iconType, ['ok']).subscribe(() => {
            if (goBack) {
                form.reset()
                this.router.navigate([returnUrl])
            }
        })
    }

    public confirmationToDelete(message: string, iconType: string, buttons: any[]): void {
        this.dialogService.open(message, iconType, buttons).subscribe(response => {
            return response
        })
    }

    public enableOrDisableAutoComplete(event: { key: string }): boolean {
        return (event.key == 'Enter' || event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'ArrowLeft') ? true : false
    }

    public formatISODateToLocale(date: string, showWeekday = false) {
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
                array.push({ label: element == '(EMPTY)' ? this.emojiService.getEmoji('wildcard') : element, value: element })
            }
            if (typeof (element) == 'object') {
                array.push({ label: element.description == '(EMPTY)' ? this.emojiService.getEmoji('wildcard') : element.description, value: element.description })
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
        }, 500)
    }

    public hideSideMenuAndRestoreScale(): void {
        document.getElementById('side-menu').parentElement.classList.remove('side-menu-is-visible')
        document.getElementById('main').classList.remove('side-menu-is-visible')
        document.querySelector<HTMLElement>('#main').style.transform = 'scale(1, 1)'
    }

    public toggleScaleOnMainWindow(): boolean {
        document.getElementById('side-menu').parentElement.classList.toggle('side-menu-is-visible')
        document.getElementById('main').classList.toggle('side-menu-is-visible')
        if (document.getElementById('main').classList.contains('side-menu-is-visible')) {
            document.querySelector<HTMLElement>('#main').style.transform = 'scale(' + ((100 * (screen.width - 350)) / screen.width) / 100 + ', 0.9)'
            return true
        } else {
            document.querySelector<HTMLElement>('#main').style.transform = 'scale(1, 1)'
            return false
        }
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
            case 'cs-CZ': return '.'
            case 'de-DE': return '.'
            case 'el-GR': return '/'
            case 'en-GB': return '/'
            case 'fr-FR': return '/'
        }
    }

    //#endregion

}
