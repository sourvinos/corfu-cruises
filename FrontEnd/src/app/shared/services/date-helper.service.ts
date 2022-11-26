import { Injectable } from '@angular/core'
// Custom
import { LocalStorageService } from './local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'

@Injectable({ providedIn: 'root' })

export class DateHelperService {

    constructor(private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService) { }

    //#region public methods

    public formatISODateToLocale(date: string, showWeekday = false, showYear = true): string {
        const parts = date.split('-')
        const rawDate = new Date(date)
        const dateWithLeadingZeros = this.addLeadingZerosToDateParts(new Intl.DateTimeFormat(this.localStorageService.getLanguage()).format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))), showYear)
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

    public getMonthFirstDayOffset(month: number, year: string): number {
        const isLeapYear = this.isLeapYear(parseInt(year))
        if (month == 1) return 0
        if (month == 2) return 31
        if (month == 3) return isLeapYear ? 60 : 59
        if (month == 4) return isLeapYear ? 91 : 90
        if (month == 5) return isLeapYear ? 121 : 120
        if (month == 6) return isLeapYear ? 152 : 151
        if (month == 7) return isLeapYear ? 182 : 181
        if (month == 8) return isLeapYear ? 213 : 212
        if (month == 9) return isLeapYear ? 244 : 243
        if (month == 10) return isLeapYear ? 274 : 273
        if (month == 11) return isLeapYear ? 305 : 304
        if (month == 12) return isLeapYear ? 335 : 334
    }

    public isLeapYear(year: number): boolean {
        if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
            return true
        } else {
            return false
        }
    }

    //#endregion

    //#region private methods

    private addLeadingZerosToDateParts(date: string, showYear: boolean): string {
        const seperator = this.getDateLocaleSeperator()
        const parts = date.split(seperator)
        parts[0].replace(' ', '').length == 1 ? parts[0] = '0' + parts[0].replace(' ', '') : parts[0]
        parts[1].replace(' ', '').length == 1 ? parts[1] = '0' + parts[1].replace(' ', '') : parts[1]
        parts[2] = parts[2].replace(' ', '')
        if (showYear) {
            return parts[0] + seperator + parts[1] + seperator + parts[2]
        } else {
            return parts[0] + seperator + parts[1]
        }
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
