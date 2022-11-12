import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
// Custom
import { AvailabilityService } from '../classes/services/availability.service'
import { DayVM } from '../classes/view-models/day-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from './../../../shared/services/messages-label.service'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'

@Component({
    selector: 'availability',
    templateUrl: './availability.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './availability.component.css']
})

export class AvailabilityComponent {

    // #region variables

    private unsubscribe = new Subject<void>()
    public feature = 'availability'
    public featureIcon = 'availability'
    public icon = 'home'
    public parentUrl = '/'

    private daysWithSchedule = []
    private startDate: any
    public days: DayVM[]
    public isLoading: boolean
    public monthSelect: any[] = []
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private availabilityService: AvailabilityService, private dateHelperService: DateHelperService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.buildMonth(this.dateHelperService.getCurrentMonth(), this.dateHelperService.getCurrentYear())
        this.adjustCalendarHeight()
        this.getAvailabilityForMonth().then(() => {
            this.updateCalendar()
        })
        this.clearStoredVariables()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion 

    //#region public methods

    public changeMonth(direction: string): void {
        this.navigateToMonth(direction)
        this.adjustCalendarHeight()
        this.getAvailabilityForMonth().then(() => {
            this.updateCalendar()
        })
    }

    public doReservationTasks(date: string, destinationId: number, destinationDescription: string): void {
        this.storeCriteria(date, destinationId, destinationDescription)
        this.navigateToNewReservation()
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

    public isSaturday(day: any): boolean {
        return new Date(day.date).getDay() == 6
    }

    public isSunday(day: any): boolean {
        return new Date(day.date).getDay() == 0
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substring(0, 10)
    }

    public navigateToNewReservation(): void {
        setTimeout(() => { this.router.navigate(['/reservations/new']) }, 500)
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
                date: this.dateHelperService.formatDateToIso(dayObject, false),
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

    private clearStoredVariables(): void {
        this.localStorageService.deleteItems([
            { 'item': 'date', 'when': 'always' },
            { 'item': 'destinationId', 'when': 'always' },
            { 'item': 'destinationDescription', 'when': 'always' }
        ])
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private getAvailabilityForMonth(): Promise<any> {
        this.isLoading = true
        const promise = new Promise((resolve) => {
            this.availabilityService.getForCalendar(this.days[0].date, this.days[this.days.length - 1].date).then((response: any[]) => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
                this.isLoading = false
            })
        })
        return promise
    }

    private navigateToMonth(direction: string): void {
        const date = new Date(this.startDate)
        direction == 'previous' ? date.setMonth(date.getMonth() - 1) : date.setMonth(date.getMonth() + 1)
        this.buildMonth(date.getMonth(), date.getFullYear())
    }

    private storeCriteria(date: string, destinationId: number, destinationDescription: string): void {
        this.localStorageService.saveItem('date', date)
        this.localStorageService.saveItem('destinationId', destinationId.toString())
        this.localStorageService.saveItem('destinationDescription', destinationDescription.toString())
        this.localStorageService.saveItem('returnUrl', '/availability')
    }

    private updateCalendar(): void {
        this.daysWithSchedule.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            this.days[this.days.indexOf(x)].destinations = day.destinations
        })
    }

    //#endregion

}
