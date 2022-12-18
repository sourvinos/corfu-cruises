import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
// Custom
import { ActiveYearDialogComponent } from 'src/app/shared/components/active-year-dialog/active-year-dialog.component'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DayVM } from '../../classes/calendar/day-vm'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MatDialog } from '@angular/material/dialog'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ReservationService } from '../../classes/services/reservation.service'
import { MatCalendar } from '@angular/material/datepicker'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './calendar.component.css']
})

export class CalendarComponent {

    // #region variables

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>

    private unsubscribe = new Subject<void>()
    public feature = 'reservationsCalendar'
    public featureIcon = 'reservations'
    public icon = 'home'
    public parentUrl = '/'

    private daysWithSchedule = []
    public activeYear: number
    public dayWidth: number
    public isLeftScrollAllowed: boolean
    public isLoading: boolean
    public isRightScrollAllowed: boolean
    public months: any[]
    public todayScrollPosition: number
    public year: DayVM[]
    public imgIsLoaded = false

    // #endregion 

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private reservationService: ReservationService, private router: Router, public dialog: MatDialog) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getActiveYear()
        this.populateMonths()
        this.buildCalendar()
        this.updateCalendar()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.scrollToToday()
            this.scrollToStoredDate()
        }, 500)
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public dayHasSchedule(day: DayVM): boolean {
        return day.destinations?.length >= 1
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getLocaleMonthName(monthName: string): string {
        return this.messageCalendarService.getDescription('months', monthName)
    }

    public getLocaleWeekdayName(weekdayName: string): string {
        return this.messageCalendarService.getDescription('weekdays', weekdayName)
    }

    public gotoMonth(month: number): void {
        this.scrollToMonth(month)
    }

    public gotoReservationsList(date: any): void {
        if (this.dayHasSchedule(date)) {
            this.storeVariables(date.date)
            this.navigateToList()
        }
    }

    public gotoToday(): void {
        this.saveYear()
        if (this.mustRebuildCalendar()) {
            this.buildCalendar()
            this.updateCalendar()
        }
        this.scrollToToday()
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public isSaturday(day: any): boolean {
        return day.weekdayName == 'Sat'
    }

    public isSunday(day: any): boolean {
        return day.weekdayName == 'Sun'
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substring(0, 10)
    }

    public setActiveYear(): void {
        const dialogRef = this.dialog.open(ActiveYearDialogComponent, {
            height: '550px',
            width: '500px',
            data: {
                activeYear: '',
                actions: ['abort', 'ok']
            },
            panelClass: 'dialog'
        })
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.saveYear(result)
                if (this.mustRebuildCalendar()) {
                    this.buildCalendar()
                    this.updateCalendar()
                }
            }
        })
    }

    //#endregion

    //#region private methods

    /**
     * Creates the year array with 365 or 366 elements
     * Called from 
     *  a. onInit
     *  b. When gotoToday button is clicked, only if mustRebuildCalendar() returns true
     *  c. When the modal dialog (to select a working year) is closed, only if mustRebuildCalendar() returns true 
     */
    private buildCalendar(): void {
        this.year = []
        for (let index = 0; index < 12; index++) {
            const startDate = new Date().setFullYear((this.activeYear), index, 1)
            const endDate = new Date().setFullYear((this.activeYear), index + 1, 0)
            const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24) + 1)
            Object.keys([...Array(diffDays)]).map((a: any) => {
                a = parseInt(a) + 1
                const dayObject = new Date((this.activeYear), index, a)
                this.year.push({
                    date: this.dateHelperService.formatDateToIso(dayObject, false),
                    weekdayName: dayObject.toLocaleString('default', { weekday: 'short' }),
                    value: a,
                    monthName: dayObject.toLocaleString('default', { month: 'long' }),
                    year: this.activeYear.toString()
                })
            })
        }
    }

    private getActiveYear(): void {
        this.activeYear = isNaN(parseInt(this.localStorageService.getItem('year')))
            ? this.dateHelperService.getCurrentYear()
            : parseInt(this.localStorageService.getItem('year'))
    }

    private getReservations(): Promise<any> {
        const promise = new Promise((resolve) => {
            this.reservationService.getForCalendar(this.activeYear + '-01-01', this.activeYear + '-12-31').subscribe(response => {
                this.daysWithSchedule = response
                resolve(this.daysWithSchedule)
            })
        })
        return promise
    }


    /**
     * Decides whether to re-create the calendar (build the days and read the reservations from the backend) or not
     * Called when either:
     *  a. The gotoToday button is clicked.
     *  b. The user has given a working year
     * @returns 
     *  a. True if we are working in another year (not the current), therefore it must be re-created
     *  b. False if the working year is equal to the active year
     */
    private mustRebuildCalendar(): boolean {
        const storedYear = this.localStorageService.getItem('year')
        if (storedYear != this.activeYear.toString()) {
            this.activeYear = parseInt(storedYear)
            return true
        }
        return false
    }

    private navigateToList(): void {
        this.router.navigate(['reservations/date/', this.localStorageService.getItem('date')])
    }

    private populateMonths(): void {
        this.months = [...Array(12).keys()].map(x => ++x)
    }

    /**
     * Stores the optional year as a string
     * Called when either:
     *  a. The gotoToday button is clicked (the year is left empty because it will be taken from the system)
     *  b. The user has given a year to work on in the modal dialog
     * @param year 
     */
    private saveYear(year?: string): void {
        this.localStorageService.saveItem('year', year
            ? year
            : this.dateHelperService.getCurrentYear().toString())
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private scrollToMonth(month: number): void {
        document.getElementById(this.activeYear.toString() + '-' + (month.toString().length == 1 ? '0' + month.toString() : month.toString()) + '-' + '01').scrollIntoView()
    }

    private scrollToStoredDate(): void {
        if (localStorage.getItem('scrollTop') != undefined) {
            const me = localStorage.getItem('scrollTop')
            const z = document.getElementById('days')
            z.scrollTop = parseInt(me)
        }
    }

    private scrollToToday(): void {
        if (localStorage.getItem('scrollTop') == undefined) {
            setTimeout(() => {
                const element = document.querySelector('.is-today')
                if (element != null) {
                    element.scrollIntoView()
                }
            }, 500)
        }
    }

    private storeVariables(date: string): void {
        this.localStorageService.saveItem('scrollTop', document.getElementById('days').scrollTop.toString())
        this.localStorageService.saveItem('date', date)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    private updateCalendar(): void {
        this.getReservations().then(() => {
            this.updateCalendarWithReservations()
        })
    }

    private updateCalendarWithReservations(): void {
        this.daysWithSchedule.forEach(day => {
            const x = this.year.find(x => x.date == day.date)
            this.year[this.year.indexOf(x)].destinations = day.destinations
            this.year[this.year.indexOf(x)].pax = day.pax
        })
    }

    //#endregion

}
