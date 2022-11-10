import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
// Custom
import { DayVM } from '../../classes/calendar/day-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
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
    private url = 'reservations'
    public feature = 'calendarReservations'
    public featureIcon = 'reservations'
    public icon = 'home'
    public parentUrl = '/'

    private daysWithSchedule = []
    private startDate: any
    public days: DayVM[] = []
    public monthSelect: any[] = []
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    public isLoading: boolean

    // #endregion 

    constructor(private helperService: HelperService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private reservationService: ReservationService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.clearStoredVariables()
        this.buildMonth(this.helperService.getCurrentMonth(), this.helperService.getCurrentYear())
        this.adjustCalendarHeight()
        this.getScheduleWithReservations().then(() => {
            this.updateCalendarWithReservations()
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion 

    //#region public methods

    public changeMonth(direction: string): void {
        this.navigateToMonth(direction)
        this.adjustCalendarHeight()
        this.getScheduleWithReservations().then(() => {
            this.updateCalendarWithReservations()
        })
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getMonthAndYear(): string {
        return this.messageCalendarService.getDescription('months', (new Date(this.startDate).getMonth() + 1).toString()) + ' ' + new Date(this.startDate).getFullYear()
    }

    public getWeekday(id: string): string {
        return this.messageCalendarService.getDescription('weekdays', id)
    }

    public hasSchedule(day: any): boolean {
        return this.daysWithSchedule.find(x => x.date == day.date)
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substring(0, 10)
    }

    public isSaturday(day: any): boolean {
        const isSaturday = new Date(day.date).getDay()
        if (isSaturday == 6)
            return true
    }

    public isSunday(day: any): boolean {
        const isSunday = new Date(day.date).getDay()
        if (isSunday == 0)
            return true
    }

    public showReservationsForSelectedDay(date: any): void {
        if (this.hasSchedule(date)) {
            this.storeCriteria(date.date)
            this.clearTableFilters()
            this.navigateToList()
        }
    }

    //#endregion

    //#region private methods

    private adjustCalendarHeight(): void {
        const calendar = document.getElementById('calendar')
        calendar.style.gridTemplateRows = '30px repeat(' + this.calculateWeekCount(new Date(this.startDate).getFullYear(), new Date(this.startDate).getMonth() + 1) + ', 1fr)'
    }

    private buildMonth(month: number, year: number): void {
        this.days = []
        this.startDate = new Date().setFullYear(year, month, 1)
        const endDate = new Date().setFullYear(year, month + 1, 0)
        const diffDays = Math.round((endDate - this.startDate) / (1000 * 60 * 60 * 24) + 1)
        const arrayDays = Object.keys([...Array(diffDays)]).map((a: any) => {
            a = parseInt(a) + 1
            const dayObject = new Date(year, month, a)
            const day: DayVM = {
                date: this.helperService.formatDateToIso(dayObject.toDateString(), false),
                destinations: []
            }
            this.days.push(day)
            return {
                name: dayObject.toLocaleString('default', { weekday: 'long' }),
                value: a,
                indexWeek: dayObject.getDay()
            }
        })
        this.monthSelect = arrayDays
    }

    private calculateWeekCount(year: number, month: number): number {
        const firstOfMonth = new Date(year, month - 1, 1)
        let day = firstOfMonth.getDay() || 6
        day = day === 1 ? 0 : day
        if (day) {
            day--
        }
        let diff = 7 - day
        const lastOfMonth = new Date(year, month, 0)
        const lastDate = lastOfMonth.getDate()
        if (lastOfMonth.getDay() === 1) {
            diff--
        }
        const result = Math.ceil((lastDate - diff) / 7)
        return result + 1
    }

    private clearTableFilters(): void {
        this.localStorageService.clearStoredPrimeTableFilters()
    }

    private clearStoredVariables(): void {
        this.localStorageService.deleteItems([
            { 'item': 'date', 'when': 'always' },
            { 'item': 'refNo', 'when': 'always' },
            { 'item': 'returnUrl', 'when': 'always' }
        ])
    }

    private getScheduleWithReservations(): Promise<any> {
        this.isLoading = true
        const promise = new Promise((resolve) => {
            this.reservationService.getForCalendar(this.days[0].date, this.days[this.days.length - 1].date).subscribe(response => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
                this.isLoading = false
            })
        })
        return promise
    }

    private navigateToList(): void {
        this.router.navigate([this.url, 'date', this.localStorageService.getItem('date')])
    }

    private navigateToMonth(direction: string): void {
        const date = new Date(this.startDate)
        direction == 'previous' ? date.setMonth(date.getMonth() - 1) : date.setMonth(date.getMonth() + 1)
        this.buildMonth(date.getMonth(), date.getFullYear())
    }

    private storeCriteria(date: string): void {
        this.localStorageService.saveItem('date', date)
    }

    private updateCalendarWithReservations(): void {
        this.daysWithSchedule.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            this.days[this.days.indexOf(x)].destinations = day.destinations
        })
    }

    //#endregion

}
