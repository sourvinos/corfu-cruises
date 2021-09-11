import { Component } from "@angular/core"
import moment, { utc } from 'moment'
// Custom
import { Day } from "../../classes/day"
import { MessageCalendarService } from "src/app/shared/services/messages-calendar.service"
import { MessageLabelService } from "src/app/shared/services/messages-label.service"
import { ReservationService } from "src/app/features/reservations/classes/services/reservation.service"
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

    private dateSelect: any
    private daysWithReservations = []
    private daysWithSchedule = []
    private startDate: any
    public days: Day[]
    public feature = 'calendar'
    public monthSelect: any[]
    public selectedDate: any
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private reservationService: ReservationService, private scheduleService: ScheduleService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
        this.getScheduleForMonth().then(() => {
            this.getReservationsForMonth().then(() => {
                this.updateDaysWithSchedule()
            })
        })
    }

    //#endregion 

    //#region public methods

    public changeMonth(flag: number): void {
        this.navigateToMonth(flag)
        this.getScheduleForMonth().then(() => {
            this.getReservationsForMonth().then(() => {
                this.updateDaysWithSchedule()
            })
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

    public getScheduleForSelectedDate(date: string): any {
        this.selectedDate = this.daysWithSchedule.find(x => x.date == date)
        return this.selectedDate
    }

    public hasDateSchedule(date: string): boolean {
        return this.daysWithSchedule.find(x => x.date == date)
    }

    public hideSchedule(id: any): void {
        document.getElementById(id).style.display = 'none'
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substr(0, 10)
    }

    public showSchedule(id: any): void {
        if (this.hasDateSchedule(id)) {
            document.getElementById(id).style.display = 'flex'
            document.getElementById(id).style.position = 'relative'
            // document.getElementById(id).style.transform = 'scale(2,2)'
        }
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
            const day = new Day()
            day.date = dayObject.format("YYYY-MM-DD")
            this.days.push(day)
            return {
                name: dayObject.format("dddd"),
                value: a,
                indexWeek: dayObject.isoWeekday()
            }
        })
        this.monthSelect = arrayDays
        console.log('1. Calendar', this.days)
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

    private getReservationsForMonth(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.reservationService.getForPeriod(this.days[0].date, this.days[this.days.length - 1].date).then((response: any[]) => {
                this.daysWithReservations = response
                resolve(this.daysWithReservations)
                console.log('3. Reservations', this.daysWithReservations)
            })
        })
        return promise
    }

    private getScheduleForMonth(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.scheduleService.getForPeriod(this.days[0].date, this.days[this.days.length - 1].date).then((response: any[]) => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
                console.log('2. Schedule', this.daysWithSchedule)
            })
        })
        return promise
    }

    private updateDaysWithReservations(): void {
        this.daysWithReservations.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            this.days[this.days.indexOf(x)].destinations = day.destinations
        })
        console.log('4', this.days)
    }

    private updateDaysWithSchedule(): void {
        this.daysWithSchedule.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            this.days[this.days.indexOf(x)].destinations = day.destinations
        })
        console.log('4', this.days)
    }

    //#endregion

}
