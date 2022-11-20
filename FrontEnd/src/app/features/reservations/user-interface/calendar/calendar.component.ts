import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { DayVM } from '../../classes/calendar/day-vm'
import { ReservationService } from '../../classes/services/reservation.service'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './calendar.component.css']
})

export class CalendarComponent {

    // #region variables

    private unsubscribe = new Subject<void>()
    private url = 'reservations'
    public feature = 'calendarReservations'
    public featureIcon = 'reservations'
    public icon = 'home'
    public parentUrl = '/'

    public isLeftScrollAllowed: boolean
    public isRightScrollAllowed: boolean
    public year: DayVM[]
    public years: any[]
    private daysWithSchedule = []
    public isLoading: boolean
    public monthSelect: any[] = []
    public dayWidth: number
    private days: any
    public todayScrollPosition: number
    public currentYear: string
    public selectedYear: string
    public months = []

    // #endregion 

    constructor(private dateHelperService: DateHelperService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private reservationService: ReservationService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateYears()
        this.populateMonths()
        this.getCurrentYear()
        this.setSelectedYear()
        this.buildCalendar()
        this.updateCalendar()
    }

    ngAfterViewInit(): void {
        this.updateDaysVariables()
        this.scrollToToday()
        this.scrollToStoredDate()
        this.enableDisableArrows()
        this.updateStorage()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private populateYears(): void {
        this.years = [
            { value: '2022', viewValue: '2022' },
            { value: '2023', viewValue: '2023' },
            { value: '2024', viewValue: '2024' }
        ]
    }

    public changeYear(): void {
        this.buildCalendar()
        this.updateStorage()
        this.enableDisableArrows()
        this.updateCalendar()
    }

    private buildCalendar(): void {
        this.year = []
        this.isLoading = true
        for (let index = 0; index < 12; index++) {
            const startDate = new Date().setFullYear(parseInt(this.selectedYear), index, 1)
            const endDate = new Date().setFullYear(parseInt(this.selectedYear), index + 1, 0)
            const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24) + 1)
            Object.keys([...Array(diffDays)]).map((a: any) => {
                a = parseInt(a) + 1
                const dayObject = new Date(parseInt(this.selectedYear), index, a)
                this.year.push({
                    date: this.dateHelperService.formatDateToIso(dayObject, false),
                    weekdayName: dayObject.toLocaleString('default', { weekday: 'short' }),
                    value: a,
                    // monthName: this.monthNames[index],
                    monthName: dayObject.toLocaleString('default', { month: 'long' }),
                    year: this.selectedYear
                })
            })
        }
        this.isLoading = false
    }

    private updateStorage(): void {
        localStorage.setItem('scrollLeft', this.days.scrollLeft)
        localStorage.setItem('year', this.selectedYear)
    }

    private enableDisableArrows(): void {
        this.isLeftScrollAllowed = this.days.scrollLeft == 0 ? true : false
        this.isRightScrollAllowed = this.days.scrollLeft == this.days.scrollWidth - this.days.clientWidth ? true : false
    }

    private getCurrentYear(): void {
        this.currentYear = isNaN(parseInt(localStorage.getItem('year')))
            ? new Date().getFullYear().toString()
            : localStorage.getItem('year')
    }

    private setSelectedYear(): void {
        this.selectedYear = this.currentYear
    }

    private scrollToToday(): void {
        this.todayScrollPosition = this.getTodayScrollPosition() - 2
        this.days.scrollLeft = this.todayScrollPosition * this.dayWidth
    }

    private getTodayScrollPosition(): number {
        const date = new Date()
        const fromDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        const toDate = Date.UTC(date.getFullYear(), 0, 0)
        const differenceInMilliseconds = fromDate - toDate
        const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24
        return differenceInDays
    }

    private isLeapYear(year: number): boolean {
        if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
            return true
        } else {
            return false
        }
    }

    public scrollToDay(direction: string): void {
        this.scrollLeftOrRight(direction)
        this.enableDisableArrows()
        this.updateStorage()
    }

    private scrollLeftOrRight(direction: string): void {
        this.days.scrollLeft += direction == 'previous' ? -this.dayWidth : this.dayWidth
    }

    public gotoToday(): void {
        this.currentYear = new Date().getFullYear().toString()
        this.selectedYear = this.currentYear
        this.getCurrentYear()
        this.buildCalendar()
        this.scrollToToday()
        this.updateStorage()
        this.enableDisableArrows()
    }

    public gotoMonth(month: number): void {
        this.days.scrollLeft = this.getMonthOffset(month) * this.dayWidth
        this.enableDisableArrows()
        this.updateStorage()
    }

    private getMonthOffset(month: number): number {
        switch (month) {
            case 1: return 0
            case 2: return 31
            case 3: return this.isLeapYear(parseInt(this.selectedYear)) ? 60 : 59
            case 4: return this.isLeapYear(parseInt(this.selectedYear)) ? 91 : 90
            case 5: return this.isLeapYear(parseInt(this.selectedYear)) ? 121 : 120
            case 6: return this.isLeapYear(parseInt(this.selectedYear)) ? 152 : 151
            case 7: return this.isLeapYear(parseInt(this.selectedYear)) ? 182 : 181
            case 8: return this.isLeapYear(parseInt(this.selectedYear)) ? 213 : 212
            case 9: return this.isLeapYear(parseInt(this.selectedYear)) ? 244 : 243
            case 10: return this.isLeapYear(parseInt(this.selectedYear)) ? 274 : 273
            case 11: return this.isLeapYear(parseInt(this.selectedYear)) ? 305 : 304
            case 12: return this.isLeapYear(parseInt(this.selectedYear)) ? 335 : 334
        }
    }
    private updateDaysVariables(): void {
        this.days = document.querySelector('#days')
        this.dayWidth = document.querySelectorAll('.day')[0].getBoundingClientRect().width + 2
    }

    private scrollToStoredDate(): void {
        if (localStorage.getItem('scrollLeft') != undefined && localStorage.getItem('year') != undefined) {
            this.days.scrollLeft = localStorage.getItem('scrollLeft')
        }
    }

    private getReservations(): Promise<any> {
        this.isLoading = true
        const promise = new Promise((resolve) => {
            this.reservationService.getForCalendar(this.selectedYear + '-01-01', this.selectedYear + '-12-31').subscribe(response => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
                this.isLoading = false
            })
        })
        return promise
    }

    private updateCalendarWithReservations(): void {
        this.isLoading = true
        this.daysWithSchedule.forEach(day => {
            const x = this.year.find(x => x.date == day.date)
            this.year[this.year.indexOf(x)].destinations = day.destinations
            this.year[this.year.indexOf(x)].pax = day.pax
            this.isLoading = false
        })
    }

    public getLocaleWeekdayName(weekdayName: string): string {
        return this.messageCalendarService.getDescription('weekdays', weekdayName)
    }

    public getLocaleMonthName(monthName: string): string {
        return this.messageCalendarService.getDescription('months', monthName)
    }

    private populateMonths(): void {
        this.months = [...Array(12).keys()].map(x => ++x)
    }

    private updateCalendar(): void {
        this.getReservations().then(() => {
            this.updateCalendarWithReservations()
        })
    }

}
