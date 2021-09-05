import { Component, EventEmitter, Output } from "@angular/core"
import moment, { utc } from 'moment'
// Custom
import { MessageCalendarService } from "src/app/shared/services/messages-calendar.service"

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

    // #region variables

    @Output() event = new EventEmitter()

    public dateSelect: any
    public isoDate = []
    public monthSelect: any[]
    public startDate: any
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private messageCalendarService: MessageCalendarService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
    }

    //#endregion 

    //#region public methods

    public changeMonth(flag: number): void {
        this.navigateToMonth(flag)
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

    public selectDay(day: any): void {
        console.log('Day selected', day)
    }

    //#endregion

    //#region private methods

    private getDaysFromDate(month: number, year: number): void {
        this.startDate = utc(`${year}/${month}/01`)
        this.isoDate = []
        const endDate = this.startDate.clone().endOf('month')
        const diffDays = endDate.diff(this.startDate, 'days', true)
        const numberDays = Math.round(diffDays)
        this.dateSelect = this.startDate
        const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
            a = parseInt(a) + 1
            const dayObject = moment(`${year}-${month}-${a}`)
            this.isoDate.push(dayObject.format("YYYY-MM-DD"))
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

    //#endregion

}
