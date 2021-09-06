import { Component, EventEmitter, Output } from "@angular/core"
import moment, { utc } from 'moment'
// Custom
import { MessageCalendarService } from "src/app/shared/services/messages-calendar.service"
import { MessageLabelService } from "src/app/shared/services/messages-label.service"
import { ScheduleService } from 'src/app/features/schedules/classes/schedule.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class CalendarComponent {

    // #region variables

    @Output() event = new EventEmitter()

    public dateSelect: any
    public feature = 'scheduleWrapper'
    public days = []
    public daysWithSchedule = []
    public monthSelect: any[]
    public startDate: any
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private scheduleService: ScheduleService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
        this.getScheduleForMonth()
    }

    //#endregion 

    //#region public methods

    public changeMonth(flag: number): void {
        this.navigateToMonth(flag)
        this.getScheduleForMonth()
    }

    public dayHasSchedule(date: string): boolean {
        const x = JSON.stringify(this.daysWithSchedule)
        if (x.includes(date)) {
            console.log(x)
            return true
        }
        return false
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

    public sendDayToParent(date: string): void {
        this.event.emit(date)
    }

    //#endregion

    //#region private methods

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
            this.days.push(dayObject.format("YYYY-MM-DD"))
            return {
                name: dayObject.format("dddd"),
                value: a,
                indexWeek: dayObject.isoWeekday()
            }
        })
        this.monthSelect = arrayDays
    }

    private navigateToMonth(flag: number): void {
        if (flag < 0) {
            const prevDate = this.dateSelect.clone().subtract(1, "month")
            this.getDaysFromDate(prevDate.format("MM"), prevDate.format("YYYY"))
        } else {
            const nextDate = this.dateSelect.clone().add(1, "month")
            this.getDaysFromDate(nextDate.format("MM"), nextDate.format("YYYY"))
        }
    }

    private getScheduleForMonth(): void {
        this.scheduleService.getForPeriod(this.days[0], this.days[this.days.length - 1]).then(response => {
            this.daysWithSchedule = response
        })
    }

    //#endregion

}
