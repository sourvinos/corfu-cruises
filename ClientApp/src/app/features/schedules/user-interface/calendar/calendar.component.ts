import { Component } from '@angular/core'
import moment, { utc } from 'moment'
// Custom
import { Day } from '../../classes/day'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ScheduleService } from 'src/app/features/schedules/classes/schedule.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { Router } from '@angular/router'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CalendarComponent {

    // #region variables

    private dateSelect: any
    private daysWithSchedule = []
    private startDate: any
    public days: Day[]
    public feature = 'calendar'
    public monthSelect: any[]
    public selectedDate: any
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private router: Router, private scheduleService: ScheduleService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
        this.getScheduleForMonth().then(() => {
            this.updateCalendar()
            this.fixCalendarHeight()
        })
    }

    //#endregion 

    //#region public methods

    public changeMonth(flag: number): void {
        this.navigateToMonth(flag)
        this.getScheduleForMonth().then(() => {
            this.updateCalendar()
            this.fixCalendarHeight()
        })
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

    public hasDateSchedule(date: string): boolean {
        return this.daysWithSchedule.find(x => x.date == date)
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substr(0, 10)
    }

    public showSchedule(id: any): void {
        if (this.hasDateSchedule(id)) {
            document.getElementById(id).style.transform = 'scale(2,2)'
            document.getElementById(id).style.zIndex = '1'
            document.getElementById(id).style.width = '120%'
        }
    }

    public hideSchedule(id: any): void {
        if (this.hasDateSchedule(id)) {
            document.getElementById(id).style.transform = 'scale(1,1)'
            document.getElementById(id).style.zIndex = '0'
            document.getElementById(id).style.width = '100%'
        }
    }

    public newReservation(): void {
        this.router.navigate(['/reservations/new'], { queryParams: { returnUrl: 'schedules' } })
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

    private navigateToMonth(flag: number): void {
        if (flag < 0) {
            const prevDate = this.dateSelect.clone().subtract(1, 'month')
            this.getDaysFromDate(prevDate.format('MM'), prevDate.format('YYYY'))
        } else {
            const nextDate = this.dateSelect.clone().add(1, 'month')
            this.getDaysFromDate(nextDate.format('MM'), nextDate.format('YYYY'))
        }
    }

    private getScheduleForMonth(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.scheduleService.getForPeriod(this.days[0].date, this.days[this.days.length - 1].date).then((response: any[]) => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
                console.log(this.daysWithSchedule)
            })
        })
        return promise
    }

    private fixCalendarHeight(): void {
        const calendar = document.getElementById('calendar')
        calendar.style.gridTemplateRows = '30px repeat(' + this.calculateWeekCount(this.dateSelect.format('YYYY'), this.dateSelect.format('MM')) + ', 1fr)'
    }

    private updateCalendar(): void {
        this.daysWithSchedule.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            this.days[this.days.indexOf(x)].destinations = day.destinations
        })
    }

    //#endregion

}
