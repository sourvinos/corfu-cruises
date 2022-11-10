import { Injectable } from '@angular/core'
// Custom
import { LocalStorageService } from './local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'

@Injectable({ providedIn: 'root' })

export class DateHelperService {

    constructor(private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService) { }

    //#region public methods

    public convertLongDateToISODate(date: string | number | Date, includeWeekday: boolean): string {
        const x = new Date(date)
        let month = (x.getMonth() + 1).toString()
        let day = x.getDate().toString()
        const year = x.getFullYear()
        const weekday = x.toLocaleString('default', { weekday: 'short' })
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        const formattedDate = [year, month, day].join('-')
        return includeWeekday ? weekday + ' ' + formattedDate : formattedDate
    }

    public formatISODateToLocale(date: string, showWeekday = false): string {
        const parts = date.split('-')
        const rawDate = new Date(date)
        const dateWithLeadingZeros = this.addLeadingZerosToDateParts(new Intl.DateTimeFormat(this.localStorageService.getLanguage()).format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))))
        const weekday = this.messageCalendarService.getDescription('weekdays', rawDate.toDateString().substring(0, 3))
        return showWeekday ? weekday + ' ' + dateWithLeadingZeros : dateWithLeadingZeros
    }

    /**
     * Formats a date formatted as "Tue Nov 01 2022" into a string formatted as "2022-11-01" with optional weekday name
     * @param date Date formatted as "Tue Nov 01 2022"
     * @param includeWeekday Boolean whether to include the weekday in the return string
     * @returns String formatted as "YYYY-MM-DD" or "Tue YYYY-MM-DD"
    */
    public formatDateToIso(date: Date, includeWeekday: boolean): string {
        let day = date.getDate().toString()
        let month = (date.getMonth() + 1).toString()
        const year = date.getFullYear()
        const weekday = date.toLocaleString('default', { weekday: 'short' })
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        const formattedDate = [year, month, day].join('-')
        return includeWeekday ? weekday + ' ' + formattedDate : formattedDate
    }

    public getCurrentMonth(): number {
        return new Date().getMonth()
    }

    public getCurrentYear(): number {
        return new Date().getFullYear()
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

    //#endregion

}
