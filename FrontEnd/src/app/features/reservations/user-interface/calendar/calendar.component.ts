import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DayVM } from '../../classes/calendar/day-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ReservationService } from '../../classes/services/reservation.service'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './calendar.component.css']
})

export class CalendarComponent {

    // #region variables

    private unsubscribe = new Subject<void>()
    public feature = 'reservationsCalendar'
    public featureIcon = 'reservations'
    public icon = 'home'
    public parentUrl = '/'

    private days: any
    private daysWithSchedule = []
    public currentYear: string
    public dayWidth: number
    public isLeftScrollAllowed: boolean
    public isLoading: boolean
    public isRightScrollAllowed: boolean
    public months: number[]
    public selectedYear: number
    public todayScrollPosition: number
    public year: DayVM[]
    public years: number[]

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
        this.updateDayVariables()
        this.scrollToToday()
        this.scrollToStoredDate()
        this.enableDisableArrows()
        this.updateStorage()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public changeYear(direction: string): void {
        this.scrollToYear(direction)
        this.buildCalendar()
        this.updateStorage()
        this.updateCalendar()
        this.enableDisableTodayButton()
    }

    public currentYearIsNotSelectedYear(): boolean {
        return new Date().getFullYear().toString() != this.localStorageService.getItem('year')
    }

    public dayHasSchedule(day: DayVM): boolean {
        return day.destinations?.length >= 1
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getLocaleMonthName(monthName: string): string {
        return this.messageCalendarService.getDescription('months', monthName)
    }

    public getLocaleWeekdayName(weekdayName: string): string {
        return this.messageCalendarService.getDescription('weekdays', weekdayName)
    }

    public getSelectedYear(): string {
        return this.localStorageService.getItem('year').toString()
    }

    public gotoMonth(month: number): void {
        this.days.scrollLeft = this.getMonthOffset(month) * this.dayWidth
        this.enableDisableArrows()
        this.updateStorage()
    }

    public gotoToday(): void {
        this.currentYear = new Date().getFullYear().toString()
        this.selectedYear = parseInt(this.currentYear)
        this.scrollToToday()
        this.updateStorage()
        this.enableDisableArrows()
    }

    public isSaturday(day: any): boolean {
        return day.weekdayName == 'Sat'
    }

    public isSunday(day: any): boolean {
        return day.weekdayName == 'Sun'
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substring(0, 10)
    }

    public scrollDays(direction: string): void {
        this.scrollLeftOrRight(direction)
        this.enableDisableArrows()
        this.updateStorage()
    }

    public showReservationsForSelectedDay(date: any): void {
        if (this.dayHasSchedule(date)) {
            this.storeCriteria(date.date)
            this.clearTableFilters()
            this.navigateToList()
        }
    }

    //#endregion

    //#region private methods

    private buildCalendar(): void {
        this.year = []
        for (let index = 0; index < 12; index++) {
            const startDate = new Date().setFullYear((this.selectedYear), index, 1)
            const endDate = new Date().setFullYear((this.selectedYear), index + 1, 0)
            const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24) + 1)
            Object.keys([...Array(diffDays)]).map((a: any) => {
                a = parseInt(a) + 1
                const dayObject = new Date((this.selectedYear), index, a)
                this.year.push({
                    date: this.dateHelperService.formatDateToIso(dayObject, false),
                    weekdayName: dayObject.toLocaleString('default', { weekday: 'short' }),
                    value: a,
                    monthName: dayObject.toLocaleString('default', { month: 'long' }),
                    year: this.selectedYear.toString()
                })
            })
        }
    }

    private clearTableFilters(): void {
        this.localStorageService.clearStoredPrimeTableFilters()
    }

    private enableDisableArrows(): void {
        this.isLeftScrollAllowed = this.days.scrollLeft == 0 ? false : true
        this.isRightScrollAllowed = this.days.scrollLeft == this.days.scrollWidth - this.days.clientWidth ? false : true
    }

    private enableDisableTodayButton(): void {
        this.currentYearIsNotSelectedYear()
    }

    private getCurrentYear(): void {
        this.currentYear = isNaN(parseInt(localStorage.getItem('year')))
            ? new Date().getFullYear().toString()
            : localStorage.getItem('year')
    }

    private getMonthOffset(month: number): number {
        return this.dateHelperService.getMonthFirstDayOffset(month, this.selectedYear.toString())
    }

    private getReservations(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.reservationService.getForCalendar(this.selectedYear + '-01-01', this.selectedYear + '-12-31').subscribe(response => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
            })
        })
        return promise
    }

    private getTodayScrollPosition(): number {
        const date = new Date()
        const fromDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        const toDate = Date.UTC(date.getFullYear(), 0, 0)
        const differenceInMilliseconds = fromDate - toDate
        const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24
        return differenceInDays
    }

    private navigateToList(): void {
        this.router.navigate(['reservations/date/', this.localStorageService.getItem('date')])
    }

    private populateMonths(): void {
        this.months = [...Array(12).keys()].map(x => ++x)
    }

    private populateYears(): void {
        this.years = Array.from({ length: 3 }, (_, i) => i + 2021)
    }

    private scrollLeftOrRight(direction: string): void {
        this.days.scrollLeft += direction == 'previous' ? -this.dayWidth : this.dayWidth
    }

    private scrollToToday(): void {
        this.todayScrollPosition = this.getTodayScrollPosition() - 2
        this.days.scrollLeft = this.todayScrollPosition * this.dayWidth
    }

    private scrollToStoredDate(): void {
        if (localStorage.getItem('scrollLeft') != undefined && localStorage.getItem('year') != undefined) {
            this.days.scrollLeft = localStorage.getItem('scrollLeft')
        }
    }

    private scrollToYear(direction: string): void {
        direction == 'previous' ? --this.selectedYear : ++this.selectedYear
    }

    private setSelectedYear(): void {
        this.selectedYear = parseInt(this.currentYear)
    }

    private storeCriteria(date: string): void {
        this.localStorageService.saveItem('date', date)
    }

    private updateCalendar(): void {
        this.getReservations().then(() => {
            this.updateCalendarWithReservations()
        })
    }

    private updateCalendarWithReservations(): void {
        this.daysWithSchedule.forEach(day => {
            const x = this.year.find(x => x.date == day.date)
            this.year[this.year.indexOf(x)].destinations = day.destinations
            this.year[this.year.indexOf(x)].pax = day.pax
        })
    }

    private updateDayVariables(): void {
        this.days = document.querySelector('#days')
        this.dayWidth = document.querySelectorAll('.day')[0].getBoundingClientRect().width + 2
    }

    private updateStorage(): void {
        localStorage.setItem('scrollLeft', this.days.scrollLeft)
        localStorage.setItem('year', this.selectedYear.toString())
    }

    //#endregion

}
