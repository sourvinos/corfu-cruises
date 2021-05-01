import { SnackbarService } from './../../../shared/services/snackbar.service'
import { Component } from "@angular/core"
import moment, { utc } from 'moment'
// Custom
import { InteractionService } from './../../../shared/services/interaction.service'
import { MessageCalendarService } from "src/app/shared/services/messages-calendar.service"
import { Router } from "@angular/router"
import { HelperService } from "src/app/shared/services/helper.service"
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

    // #region variables

    public dateSelect: any
    public monthSelect: any[]
    public startDate: any
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // #endregion 

    constructor(private router: Router, private interactionService: InteractionService, private messageCalendarService: MessageCalendarService, private helperService: HelperService, private messageSnackbarService: MessageSnackbarService, private snackbarService: SnackbarService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
        this.interactionService.changeCalendarMonth(moment().month() + 1)
    }

    //#endregion 

    //#region public methods

    public onChangeMonth(flag: number): void {
        this.navigateToMonth(flag)
    }

    public onGetMonthAndYear(): string {
        return this.messageCalendarService.getDescription('months', this.startDate.month() + 1) + ' ' + this.startDate.year()
    }

    public onGetWeekday(id: string): string {
        return this.messageCalendarService.getDescription('weekdays', id)
    }

    public onCanProceed(event: any, day: { value: any }): void {
        const response = this.newReservationsAreAllowed(event.currentTarget.className)
        switch (response) {
            case 'ok':
                this.gotoDashboard(day)
                break
            case 'fully-booked':
                this.showSnackbar(this.messageSnackbarService.fullyBooked(), 'error')
                break
            default:
                this.showSnackbar(this.messageSnackbarService.noScheduleFound(), 'error')
        }
    }

    private gotoDashboard(day: { value: any }): void {
        const date = this.createISODate(day)
        this.saveDateToStorage(date)
        this.router.navigate(['/reservations/date/' + date])
    }

    //#endregion

    //#region private methods

    private createISODate(day: { value: any }): string {
        return this.startDate.format('YYYY') + '-' + this.startDate.format('MM') + '-' + this.formatDayWithLeadingZero(day.value)
    }

    private formatDayWithLeadingZero(day: number): string {
        const formattedDay = day.toString().length == 1 ? '0' + day : day
        return formattedDay.toString()
    }

    private getDaysFromDate(month: number, year: number): void {
        this.startDate = utc(`${year}/${month}/01`)
        const endDate = this.startDate.clone().endOf('month')
        const diffDays = endDate.diff(this.startDate, 'days', true)
        const numberDays = Math.round(diffDays)
        this.dateSelect = this.startDate
        const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
            a = parseInt(a) + 1
            const dayObject = moment(`${year}-${month}-${a}`)
            return {
                name: dayObject.format("dddd"),
                value: a,
                indexWeek: dayObject.isoWeekday()
            }
        })
        this.monthSelect = arrayDays
    }

    private newReservationsAreAllowed(classList: any): string {
        switch (true) {
            case classList.includes('green') || classList.includes('yellow') || classList.includes('orange') || classList.includes('red'):
                return 'ok'
            case classList.includes('dark'):
                return 'fully-booked'
            default:
                return 'day-off'
        }
    }

    private navigateToMonth(flag: number): void {
        if (flag < 0) {
            const prevDate = this.dateSelect.clone().subtract(1, "month")
            this.getDaysFromDate(prevDate.format("MM"), prevDate.format("YYYY"))
            this.interactionService.changeCalendarMonth(prevDate.month() + 1)
        } else {
            const nextDate = this.dateSelect.clone().add(1, "month")
            this.getDaysFromDate(nextDate.format("MM"), nextDate.format("YYYY"))
            this.interactionService.changeCalendarMonth(nextDate.month() + 1)
        }
    }

    private saveDateToStorage(date: string): void {
        this.helperService.saveItem('date', date)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}
