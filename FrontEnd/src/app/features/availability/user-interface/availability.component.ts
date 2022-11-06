import moment, { utc } from 'moment'
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
// Custom
import { AvailabilityService } from '../classes/services/availability.service'
import { DayViewModel } from '../classes/view-models/day-view-model'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from './../../../shared/services/messages-label.service'

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

    private dateSelect: any
    private daysWithSchedule = []
    private startDate: any
    public days: DayViewModel[]
    public isLoading: boolean
    public selectedMonth: any[]
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private availabilityService: AvailabilityService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysForSelectedMonth(moment().month() + 1, moment().year())
        this.getAvailabilityForMonth().then(() => {
            this.updateCalendar()
            this.fixCalendarHeight()
        })
        this.clearStoredVariables()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion 

    //#region public methods

    public changeMonth(month: number): void {
        this.navigateToMonth(month)
        this.getAvailabilityForMonth().then(() => {
            this.updateCalendar()
            this.fixCalendarHeight()
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
        return this.messageCalendarService.getDescription('months', this.startDate.month() + 1) + ' ' + this.startDate.year()
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

    //#endregion

    //#region private methods

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

    private fixCalendarHeight(): void {
        const calendar = document.getElementById('calendar')
        calendar.style.gridTemplateRows = '30px repeat(' + this.calculateWeekCount(this.dateSelect.format('YYYY'), this.dateSelect.format('MM')) + ', 1fr)'
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

    private getDaysForSelectedMonth(month: number, year: number): void {
        this.startDate = utc(`${year}-${month}-01`, 'YYYY-MM-DD')
        this.days = []
        const endDate = this.startDate.clone().endOf('month')
        const diffDays = endDate.diff(this.startDate, 'days', true)
        const numberDays = Math.round(diffDays)
        this.dateSelect = this.startDate
        const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
            a = parseInt(a) + 1
            const dayObject = moment(`${year}-${month}-${a}`, 'YYYY-MM-DD')
            const day = new DayViewModel()
            day.date = dayObject.format('YYYY-MM-DD')
            this.days.push(day)
            return {
                name: dayObject.format('dddd'),
                value: a,
                indexWeek: dayObject.isoWeekday()
            }
        })
        this.selectedMonth = arrayDays
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private navigateToMonth(flag: number): void {
        if (flag < 0) {
            const prevDate = this.dateSelect.clone().subtract(1, 'month')
            this.getDaysForSelectedMonth(prevDate.format('MM'), prevDate.format('YYYY'))
        } else {
            const nextDate = this.dateSelect.clone().add(1, 'month')
            this.getDaysForSelectedMonth(nextDate.format('MM'), nextDate.format('YYYY'))
        }
    }

    public navigateToNewReservation() {
        setTimeout(() => { this.router.navigate(['/reservations/new']) }, 500)
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
