import moment, { utc } from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { DayVM } from '../../classes/calendar/day-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ScheduleService } from 'src/app/features/schedules/classes/services/schedule.service'
import { ReservationService } from '../../classes/services/reservation.service'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './calendar.component.css']
})

export class CalendarComponent {

    // #region variables

    private unsubscribe = new Subject<void>()
    public feature = 'calendarReservations'
    public featureIcon = 'reservations'
    public icon = 'home'
    public parentUrl = '/'

    private dateSelect: any
    private daysWithSchedule = []
    private startDate: any
    public days: DayVM[]
    public monthSelect: any[]
    public selectedDate: any
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    public isLoading: boolean

    // #endregion 

    constructor(
        private activatedRoute: ActivatedRoute,
        private helperService: HelperService,
        private localStorageService: LocalStorageService,
        private messageCalendarService: MessageCalendarService,
        private messageLabelService: MessageLabelService,
        private router: Router,
        private scheduleService: ScheduleService,
        private reservationService: ReservationService
    ) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.clearStoredVariables()
        this.doCalendarTasks()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion 

    //#region public methods

    public changeMonth(flag: number): void {
        this.navigateToMonth(flag)
        this.getReservationsForMonth()
        this.updateCalendar()
        this.fixCalendarHeight()
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
        // if (this.hasSchedule(date)) {
        //     this.storeCriteria(date.date)
        //     this.clearTableFilters()
        //     this.navigateToList()
        // }
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

    private doCalendarTasks(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
        this.getReservationsForMonth()
        this.updateCalendar()
        this.fixCalendarHeight()
        // .then(() => {
        //     this.updateCalendar()
        //     this.fixCalendarHeight()
        // })
    }

    private fixCalendarHeight(): void {
        const calendar = document.getElementById('calendar')
        calendar.style.gridTemplateRows = '30px repeat(' + this.calculateWeekCount(this.dateSelect.format('YYYY'), this.dateSelect.format('MM')) + ', 1fr)'
    }

    private getDaysFromDate(month: number, year: number): void {
        this.startDate = utc(`${year}-${month}-01`, 'YYYY-MM-DD')
        this.days = []
        const endDate = this.startDate.clone().endOf('month')
        const diffDays = endDate.diff(this.startDate, 'days', true)
        const numberDays = Math.round(diffDays)
        this.dateSelect = this.startDate
        const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
            a = parseInt(a) + 1
            const dayObject = moment(`${year}-${month}-${a}`, 'YYYY-MM-DD')
            const day: DayVM = {
                date: dayObject.format('YYYY-MM-DD'),
                destinations: []
            }
            this.days.push(day)
            return {
                name: dayObject.format('dddd'),
                value: a,
                indexWeek: dayObject.isoWeekday()
            }
        })
        this.monthSelect = arrayDays
    }

    private getReservationsForMonth(): any {
        this.isLoading = true
        this.reservationService.getForCalendar(this.days[0].date, this.days[this.days.length - 1].date).subscribe(response => {
            this.daysWithSchedule = response
            console.log(response)
        })
        this.isLoading = false
    }

    // private getReservationsForMonth(): Promise<any> {
    //     this.isLoading = true
    //     const promise = new Promise((resolve) => {
    //         this.reservationService.getForCalendar(this.days[0].date, this.days[this.days.length - 1].date).then((response: any[]) => {
    //             this.daysWithSchedule = response
    //             resolve(this.daysWithSchedule)
    //             this.isLoading = false
    //             console.log(response)
    //         })
    //     })
    //     return promise
    // }

    private navigateToList(): void {
        this.router.navigate(['date', this.localStorageService.getItem('date')], { relativeTo: this.activatedRoute })
    }

    private navigateToMonth(flag: number): void {
        if (flag < 0) {
            const prevDate = this.dateSelect.clone().subtract(1, 'month')
            this.getDaysFromDate(prevDate.format('MM'), prevDate.format('YYYY'))
        } else {
            const nextDate = this.dateSelect.clone().add(1, 'month')
            this.getDaysFromDate(nextDate.format('MM'), nextDate.format('YYYY'))
        }
    }

    private storeCriteria(date: string): void {
        this.localStorageService.saveItem('date', date)
    }

    private updateCalendar(): void {
        setTimeout(() => {
            this.daysWithSchedule.forEach(day => {
                const x = this.days.find(x => x.date == day.date)
                this.days[this.days.indexOf(x)].destinations = day.destinations
            })
        }, 2000)
    }

    //#endregion

}
