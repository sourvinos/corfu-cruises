import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Destination } from '../../destinations/classes/destination'
import { DestinationService } from '../../destinations/classes/destination.service'
import { FormGroup } from '@angular/forms'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Port } from '../../ports/classes/port'
import { PortService } from '../../ports/classes/port.service'
import { ReservationService } from './../../reservations/classes/services/reservation.service'
import { ScheduleService } from './../classes/schedule.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

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
    public destinationId = ''
    public destinations: Destination[] = []
    public environment = environment.production
    public form: FormGroup
    public portId = ''
    public ports: Port[] = []

    //#endregion

    constructor(private buttonClickService: ButtonClickService, private destinationService: DestinationService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private portService: PortService, private reservationService: ReservationService, private scheduleService: ScheduleService, private titleService: Title) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.populateDropDowns()
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

    public onLoadSchedule(): void {
        this.scheduleService.getForDestination(parseInt(this.destinationId)).then(result => {
            console.log('Schedule', result)
            this.populateScheduleDays(result)
            this.reservationService.getByDate(parseInt(this.destinationId)).then(result => {
                console.log('Reservations', result)
                this.populateReservations(result)
                this.onCreateCalendar()
                this.markDaysOnCalendar()
            })
        })

    }

    public gotoWrapperUrl(): void {
        // this.router.navigate([this.baseUrl])
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
        console.log(day, 'Primary:', 'Max', maxPersonsForPrimaryPort[0].maxPersons, 'Reservations', primaryPortReservations[0].persons, 'Available', availableForPrimaryPort)
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
        console.log(day, 'Secondary:', 'Max', maxPersonsForBothPorts, 'Reservations', secondaryPortReservations[0].persons, 'Reservations both', reservationsForBothPort, 'Available', availableSeatsForSecondaryPort)
    }

    private doNoReservationJobs(day: any): void {
        const maxPersonsForPrimaryPort = this.findSchedule(day, 2) // Find the max persons for the primary port
        const maxPersonsForSecondaryPort = this.findSchedule(day, 3) // Find the max persons for the secondary port
        const maxPersonsForBothPorts = maxPersonsForPrimaryPort[0].maxPersons + maxPersonsForSecondaryPort[0].maxPersons // Calculate the max persons for both ports
        if (this.portId == '2') {
            this.calendarData.push({
                'date': day,
                'maxPersons': maxPersonsForPrimaryPort[0].maxPersons,
                'available': maxPersonsForPrimaryPort[0].maxPersons
            })
            console.log(day, 'Primary:', 'Max', maxPersonsForPrimaryPort[0].maxPersons, 'Reservations', 0, 'Available', maxPersonsForPrimaryPort[0].maxPersons)
        }
        if (this.portId == '3') {
            this.calendarData.push({
                'date': day,
                'maxPersons': maxPersonsForBothPorts,
                'available': maxPersonsForBothPorts
            })
            console.log(day, 'Secondary:', 'Max', maxPersonsForBothPorts, 'Reservations both', 0, 'Available', maxPersonsForBothPorts)
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

    private markDaysOnCalendar(): void {
        const domElements = Array.from(document.querySelectorAll<HTMLDivElement>('.days'))
        this.calendarData.forEach(available => {
            this.daysISO.forEach(day => {
                if (available.date == day) {
                    const me = parseInt(available.date.substring(8, 10)).toString()
                    for (let i = 0; i < domElements.length; i++) {
                        if (domElements[i].textContent.trim() == me) {
                            const customContent = document.createElement("li")
                            customContent.classList.add('has-data')
                            customContent.innerHTML = '<div class="dateWithSchedule">' + me + '</div>' + '<div class="availableSeats">' + available.available + '</div>'
                            domElements[i].parentNode.replaceChild(customContent, domElements[i])
                            // customContent.classList.add(this.colorizeDays(available))
                            break
                        }
                    }
                }
            })
        })
    }

    public async onCreateCalendar(): Promise<void> {
        const domElement = Array.from(document.querySelectorAll<HTMLDivElement>('.days'))
        domElement.forEach(dayElement => {
            const dayText = dayElement.innerText.length == 2 ? dayElement.innerText : '0' + dayElement.innerText
            const dayTextISO = '2021-04-' + dayText
            this.daysISO.push(dayTextISO)
            dayElement.parentElement.classList.remove('green', 'yellow', 'orange', 'red', 'dark-red')
        })
        console.log('ISO dates', this.daysISO)
        let isDayProcessed = false
        this.schedules.forEach(schedule => {
            isDayProcessed = false
            this.daysISO.forEach(day => {
                if (schedule.date == day && schedule.portId == this.portId && !isDayProcessed) {
                    isDayProcessed = true
                    const reservations = this.reservations.filter(x => x.date == day)
                    if (reservations.length > 0) {
                        if (this.portId == '2') { this.doPrimaryPortJobs(reservations[0], day) }
                        if (this.portId == '3') { this.doSecondaryPortJobs(reservations[0], day) }
                    } else {
                        this.doNoReservationJobs(day)
                    }
                }
            })
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

    //#endregion

}

