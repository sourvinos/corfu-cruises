import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import { takeUntil } from 'rxjs/operators'
import moment from 'moment'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { CalendarLegendComponent } from './calendar-legend.component'
import { Destination } from '../../destinations/classes/destination'
import { DestinationService } from '../../destinations/classes/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Port } from '../../ports/classes/port'
import { PortService } from '../../ports/classes/port.service'
import { ReservationService } from './../../reservations/classes/services/reservation.service'
import { ScheduleCreateFormComponent } from './schedule-create-form.component'
import { ScheduleService } from './../classes/schedule.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { AccountService } from 'src/app/shared/services/account.service'

@Component({
    selector: 'schedule-wrapper',
    templateUrl: './schedule-wrapper.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './schedule-wrapper.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ScheduleWrapperComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Schedules'
    public feature = 'scheduleWrapper'

    //#endregion

    //#region particular variables

    private calendarData = []
    private daysISO = []
    private reservations = []
    private schedules = []
    public destinationId = 0
    public destinations: Destination[] = []
    public displayedMonth = ''
    public environment = environment.production
    public form: FormGroup
    public portId = 0
    public ports: Port[] = []
    private userRole: Observable<string>

    //#endregion

    constructor(private accountService: AccountService,private buttonClickService: ButtonClickService, private destinationService: DestinationService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private portService: PortService, private reservationService: ReservationService, private scheduleService: ScheduleService, private titleService: Title, public dialog: MatDialog) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.populateDropDowns()
        this.subscribeToInteractionService()
        this.updateVariables()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onLoadSchedule(month: string): void {
        this.scheduleService.getForDestination(this.destinationId).then(result => {
            this.populateScheduleDays(result)
            this.reservationService.getByDate(this.destinationId).then(result => {
                this.populateReservations(result)
                this.createCalendar(month)
                this.markDaysOnCalendar()
                this.hideDaysWithData()
            })
        })

    }

    public onNew(): void {
        this.openDialog()
    }

    public onShowCalendarLegend(): void {
        this.dialog.open(CalendarLegendComponent)
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'goBack')
                }
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private calculateMaxPersonsForPrimaryPort(maxPersons: { maxPersons: any }): any {
        if (maxPersons) {
            return maxPersons.maxPersons
        } else {
            return 0
        }
    }

    private calculateMaxPersonsForSecondaryPort(maxPersons: { maxPersons: any }): any {
        if (maxPersons) {
            return maxPersons.maxPersons
        } else {
            return 0
        }
    }

    private calculateMonth(month: string): string {
        let x = month
        if (x == undefined) {
            alert('x is undefined')
            x = '0' + (moment().month() + 1).toString()
            if (x.length == 2) {
                return x
            } else {
                return x.substring(1, x.length)
            }
        } else {
            x = '0' + month
            if (x.length == 2) {
                return x
            } else {
                return x.substring(1, x.length)
            }
        }
    }

    private clearCalendarData(): void {
        const elements = document.getElementsByClassName('has-data')
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0])
        }
    }

    private colorizeDays(data: { available: number; maxPersons: number }): string {
        const percentEmpty = (100 * data.available / data.maxPersons)
        switch (true) {
            case (percentEmpty) == 0:
                return 'dark'
            case (percentEmpty <= 10):
                return 'red'
            case (percentEmpty > 10 && percentEmpty <= 40):
                return 'orange'
            case (percentEmpty > 40 && percentEmpty <= 50):
                return 'yellow'
            case (percentEmpty > 50):
                return 'green'
            default:
                return 'none'
        }
    }
    private async createCalendar(month: string): Promise<void> {
        this.daysISO = []
        this.calendarData = []
        this.showDaysWithData()
        this.clearCalendarData()
        const domElements = Array.from(document.querySelectorAll<HTMLDivElement>('.days'))
        domElements.forEach(dayElement => {
            const dayText = dayElement.innerText.length == 2 ? dayElement.innerText : '0' + dayElement.innerText
            const dayTextISO = moment().year() + '-' + this.calculateMonth(month) + '-' + dayText
            this.daysISO.push(dayTextISO)
            dayElement.classList.remove('green', 'yellow', 'orange', 'red', 'dark')
        })
        let isDayProcessed = false
        this.schedules.forEach(schedule => {
            isDayProcessed = false
            this.daysISO.forEach(day => {
                if (schedule.date == day && schedule.portId == this.portId && !isDayProcessed) {
                    isDayProcessed = true
                    const reservations = this.reservations.filter(x => x.date == day)
                    if (reservations.length > 0) {
                        if (this.portId == 2) { this.doPrimaryPortJobs(reservations[0], day) }
                        if (this.portId == 3) { this.doSecondaryPortJobs(reservations[0], day) }
                    } else {
                        this.doNoReservationJobs(day)
                    }
                }
            })
        })
    }

    private doPrimaryPortJobs(reservation: any, day: any): void {
        const primaryPortReservations = this.findReservation(reservation, day, 2) // Find the reservations for the primary port
        const secondaryPortReservations = this.findReservation(reservation, day, 3) // Find the reservations for the secondary port
        const maxPersonsForPrimaryPort = this.findSchedule(day, 2) // Find the max persons for the primary port 
        const maxPersonsForSecondaryPort = this.findSchedule(day, 3) // Find the max persons for the secondary port
        if (secondaryPortReservations.length > 0) { // If the reservations for the secondary port exceed the max persons for this port, add the excess reservations to the primary port
            if (secondaryPortReservations[0].persons > maxPersonsForSecondaryPort[0].maxPersons) {
                primaryPortReservations[0].persons += secondaryPortReservations[0].persons - maxPersonsForSecondaryPort[0].maxPersons
            }
        }
        const availableForPrimaryPort = maxPersonsForPrimaryPort[0].maxPersons - primaryPortReservations[0].persons // Calculate available for primary port
        this.calendarData.push({
            'date': day,
            'maxPersons': maxPersonsForPrimaryPort[0].maxPersons,
            'available': availableForPrimaryPort
        })
    }

    private doSecondaryPortJobs(reservation: any, day: any): void {
        const maxPersonsForPrimaryPort = this.findSchedule(day, 2) // Find the max persons for the primary port
        const maxPersonsForSecondaryPort = this.findSchedule(day, 3) // Find the max persons for the secondary port
        const maxPersonsForBothPorts = this.calculateMaxPersonsForPrimaryPort(maxPersonsForPrimaryPort[0]) + this.calculateMaxPersonsForSecondaryPort(maxPersonsForSecondaryPort[0]) // Calculate the max persons for both ports
        const primaryPortReservations = this.findReservation(reservation, day, 2) // Find the reservations for the primary port
        const secondaryPortReservations = this.findReservation(reservation, day, 3) // Find the reservations for the secondary port
        const reservationsForBothPort = primaryPortReservations[0].persons + secondaryPortReservations[0].persons // Calculate reservations from both ports
        const availableSeatsForSecondaryPort = maxPersonsForBothPorts - reservationsForBothPort // Calculate remaining seats for secondary port
        this.calendarData.push({
            'date': day,
            'maxPersons': maxPersonsForBothPorts,
            'available': availableSeatsForSecondaryPort
        })
    }

    private doNoReservationJobs(day: any): void {
        const maxPersonsForPrimaryPort = this.findSchedule(day, 2) // Find the max persons for the primary port
        const maxPersonsForSecondaryPort = this.findSchedule(day, 3) // Find the max persons for the secondary port
        const maxPersonsForBothPorts = maxPersonsForPrimaryPort[0].maxPersons + maxPersonsForSecondaryPort[0].maxPersons // Calculate the max persons for both ports
        if (this.portId == 2) {
            this.calendarData.push({
                'date': day,
                'maxPersons': maxPersonsForPrimaryPort[0].maxPersons,
                'available': maxPersonsForPrimaryPort[0].maxPersons
            })
        }
        if (this.portId == 3) {
            this.calendarData.push({
                'date': day,
                'maxPersons': maxPersonsForBothPorts,
                'available': maxPersonsForBothPorts
            })
        }

    }

    private findReservation(reservation: any, day: any, portId: any): any {
        const result = reservation.portPersons.filter((x: { portId: any }) => x.portId == portId)
        if (result.length > 0) {
            return result
        } else {
            const reservationHasData = this.reservations.filter(reservation => { return reservation.date == day })
            if (reservationHasData.length > 0) {
                const portPersons = {
                    'portId': portId,
                    'isPrimary': false,
                    'persons': 0
                }
                reservationHasData[0].portPersons.push(portPersons)
                for (let index = 0; index < 1000; index++) {
                    // console.log(index)
                }
                const value = reservation.portPersons.filter((x: { portId: any }) => x.portId == portId)
                return value
            }
        }

    }

    private findSchedule(day: any, portId: number): any {
        const result = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == portId })
        if (result.length > 0) {
            return result
        } else {
            const schedule = {
                'date': day,
                'portId': portId,
                'maxPersons': 0
            }
            this.schedules.push(schedule)
            for (let index = 0; index < 1000; index++) {
                // console.log(index)
            }
            const value = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == portId })
            return value
        }
    }

    private getAnyDescription(id: number, array: { id: any; description: string }[]): string {
        let description = ''
        array.forEach((element: { id: any; description: string }) => {
            if (element.id == id) { description = element.description }
        })
        return description
    }

    private hideDaysWithData(): void {
        const domElements = Array.from(document.querySelectorAll<HTMLSpanElement>('.has-data'))
        domElements.forEach(element => {
            element.previousElementSibling.setAttribute("style", "display: none;")
        })
    }

    private markDaysOnCalendar(): void {
        const domElements = Array.from(document.querySelectorAll<HTMLDivElement>('.days'))
        this.calendarData.forEach(available => {
            this.daysISO.forEach(day => {
                if (available.date == day) {
                    const me = parseInt(available.date.substring(8, 10)).toString()
                    for (let i = 0; i < domElements.length; i++) {
                        if (domElements[i].childNodes[0].textContent.trim() == me) {
                            const customContent = document.createElement("span")
                            customContent.classList.add('has-data')
                            customContent.innerHTML = '<div class="dateWithSchedule">' + me + '</div>' + '<div class="availableSeats">' + '/' + available.available + '</div>'
                            domElements[i].childNodes[0].parentNode.appendChild(customContent)
                            domElements[i].classList.add(this.colorizeDays(available))
                            break
                        }
                    }
                }
            })
        })
    }

    private openDialog(): void {
        this.dialog.open(ScheduleCreateFormComponent, {
            width: '500px',
            data: {
                destinationId: this.destinationId,
                destinationDescription: this.getAnyDescription(this.destinationId, this.destinations),
                portId: this.portId,
                portDescription: this.getAnyDescription(this.portId, this.ports)
            }
        })
    }

    private populateDropDowns(): void {
        this.destinationService.getAllActive().subscribe((result: any) => {
            this.destinations = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
        this.portService.getAllActive().subscribe((result: any) => {
            this.ports = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

    private populateReservations(result: any): void {
        this.reservations = []
        result.forEach((element: any) => {
            this.reservations.push(element)
        })
    }

    private populateScheduleDays(result: any[]): void {
        this.schedules = result
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showDaysWithData(): void {
        const domElements = Array.from(document.querySelectorAll<HTMLSpanElement>('.has-data'))
        domElements.forEach(element => {
            element.previousElementSibling.setAttribute("style", "display: block;")
        })
    }

    private subscribeToInteractionService(): void {
        this.interactionService.calendarNavigation.pipe(takeUntil(this.ngUnsubscribe)).subscribe((month) => {
            this.displayedMonth = month
            this.onLoadSchedule(month)
        })
    }

    private updateVariables(): void {
        this.userRole = this.accountService.currentUserRole
    }

    //#endregion

    //#region getters

    get isConnectedUserAdmin(): boolean {
        let isAdmin = false
        this.userRole.subscribe(result => {
            isAdmin = result == 'Admin' ? true : false
        })
        return isAdmin
    }

    //#endregion

}
