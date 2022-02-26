import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import moment, { utc } from 'moment'
// Custom
import { Day } from '../../classes/calendar/day'
import { HelperService } from './../../../../shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ScheduleService } from 'src/app/features/schedules/classes/calendar/schedule.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './calendar.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CalendarComponent {

    // #region variables

    private dateSelect: any
    private daysWithSchedule = []
    private ngUnsubscribe = new Subject<void>()
    private startDate: any
    private unlisten: Unlisten
    public days: Day[]
    public feature = 'calendarReservations'
    public monthSelect: any[]
    public selectedDate: any
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private activatedRoute: ActivatedRoute, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private router: Router, private scheduleService: ScheduleService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
        this.getScheduleForMonth().then(() => {
            this.updateCalendar()
            this.fixCalendarHeight()
        })
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion 

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getMonthAndYear(): string {
        return this.messageCalendarService.getDescription('months', this.startDate.month() + 1) + ' ' + this.startDate.year()
    }

    public getWeekday(id: string): string {
        return this.messageCalendarService.getDescription('weekdays', id)
    }

    public hasDateSchedule(date: string): boolean {
        return this.daysWithSchedule.find(x => x.date == date)
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substr(0, 10)
    }

    public onChangeMonth(flag: number): void {
        this.navigateToMonth(flag)
        this.getScheduleForMonth().then(() => {
            this.updateCalendar()
            this.fixCalendarHeight()
        })
    }

    public onShowReservationsForSelectedDay(day: any): void {
        this.storeDate(day)
        this.navigateToList()
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
            }
        }, {
            priority: 0,
            inputs: true
        })
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
            const day = new Day()
            day.date = dayObject.format('YYYY-MM-DD')
            this.days.push(day)
            return {
                name: dayObject.format('dddd'),
                value: a,
                indexWeek: dayObject.isoWeekday()
            }
        })
        this.monthSelect = arrayDays
    }

    private getScheduleForMonth(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.scheduleService.getForCalendar(this.days[0].date, this.days[this.days.length - 1].date).then((response: any[]) => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
            })
        })
        return promise
    }

    private goBack(): void {
        this.router.navigate(['/'])
    }

    private navigateToList(): void {
        this.router.navigate(['byDate', this.helperService.readItem('date')], { relativeTo: this.activatedRoute })
        // this.router.navigate(['byRefNo', 'PA-00001'], { relativeTo: this.activatedRoute })
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

    private storeDate(day: string): void {
        this.helperService.saveItem('date', day)
    }

    private updateCalendar(): void {
        this.daysWithSchedule.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            this.days[this.days.indexOf(x)].destinations = day.destinations
        })
    }

    //#endregion

}
