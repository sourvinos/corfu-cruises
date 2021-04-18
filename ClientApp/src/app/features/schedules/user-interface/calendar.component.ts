import { Component } from "@angular/core"
import moment, { utc } from 'moment'
// Custom
import { InteractionService } from './../../../shared/services/interaction.service'

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
    public week: any = ["ΔΕΥ", "ΤΡΙ", "ΤΕΤ", "ΠΕΜ", "ΠΑΡ", "ΣΑΒ", "ΚΥΡ"]

    // #endregion 

    constructor(private interactionService: InteractionService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getDaysFromDate(moment().month() + 1, moment().year())
        this.interactionService.changeCalendarMonth(moment().month() + 1)
    }

    //#endregion 

    //#region public methods

    public changeMonth(flag: number): void {
        this.navigateToMonth(flag)
    }

    //#endregion

    //#region private methods

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

    //#endregion

}
