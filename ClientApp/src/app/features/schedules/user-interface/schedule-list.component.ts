import { Component, HostListener, Renderer2 } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import moment from 'moment'

import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { Destination } from '../../destinations/classes/destination'
import { DestinationService } from './../../destinations/classes/destination.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Port } from '../../ports/classes/port'
import { PortService } from '../../ports/classes/port.service'
import { ReservationService } from '../../reservations/classes/services/reservation.service'
import { ScheduleCreateFormComponent } from './schedule-create-form.component'
import { ScheduleService } from './../classes/schedule.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'schedule-list',
    templateUrl: './schedule-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', '../../../../assets/styles/summaries.css', './schedule-list-component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ScheduleListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private unlisten: Unlisten
    private windowTitle = 'Schedules'
    public feature = 'scheduleList'

    //#endregion

    //#region particular variables

    public destinationId = 0
    public destinationDescription = ''
    public destinations: Destination[]
    public portId = 0
    public portDescription = ''
    public ports: Port[]
    public isCalendarVisible = false
    private daysISO = []
    private schedules = []
    private reservations = []
    private userRole: Observable<string>

    //#endregion

    constructor(private accountService: AccountService, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private portService: PortService, private renderer: Renderer2, private reservationService: ReservationService, private scheduleService: ScheduleService, private titleService: Title, public dialog: MatDialog) {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    @HostListener('window:resize', ['$event']) onResize(): any {
        this.setElementVisibility('')
        this.adjustCalendarSize()
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.loadDestinations()
        this.loadPorts()
        this.addShortcuts()
        this.updateVariables()
        this.setElementVisibility('hide')
        this.setCalendarOpacity('0')
    }

    ngAfterViewInit(): void {
        this.adjustCalendarSize()
        this.addClickEventToMonthArrows()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.setElementVisibility('show')
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onLoadSchedule(): void {
        this.setCalendarOpacity('1')
        this.scheduleService.getForDestination(this.destinationId).then(result => {
            this.populateScheduleDays(result)
            this.reservationService.getByDate(this.destinationId).then(result => {
                this.populateReservations(result)
                this.onMarkDaysOnCalendar()
                this.showCalendar()
            })
        })
    }

    public onMarkDaysOnCalendar(): void {
        setTimeout(() => {
            const dayElements = Array.from(document.querySelectorAll<HTMLDivElement>('.mat-calendar .mat-calendar-body-cell-content'))
            const monthAndYear = document.getElementsByClassName('mat-focus-indicator mat-calendar-period-button mat-button mat-button-base')[0].textContent.trim()
            const month = monthAndYear.trim().split(' ')[0]
            const year = parseInt(monthAndYear.trim().split(' ')[1])
            dayElements.forEach(dayElement => {
                const dayText = parseInt(dayElement.innerText)
                const dayTextISO = moment(new Date(year + ',' + this.helperService.convertMonthStringToNumber(month) + ',' + dayText)).format('YYYY-MM-DD')
                this.daysISO.push(dayTextISO)
                dayElement.classList.remove('green', 'light-green', 'yellow', 'orange', 'red', 'dark-red')
            })
            // Loop through the schedule 
            this.schedules.forEach(schedule => {
                // Loop through the days on the calendar
                this.daysISO.forEach(day => {
                    // If the days match
                    if (schedule.date == day) {
                        // Find the reservations for this day
                        const reservations = this.reservations.filter(x => x.date == day)
                        // If there are any reservations
                        if (reservations.length > 0) {
                            // If we selected the primary port
                            if (schedule.portId == 2) {
                                // Find the reservations for the primary port
                                const primaryPortReservations = reservations[0].portPersons.filter(x => x.portId == 2)
                                // Find the reservations for the secondary port
                                const secondaryPortReservations = reservations[0].portPersons.filter(x => x.portId == 3)
                                // Find the max persons for the primary port 
                                const maxPersonsForPrimaryPort = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == 2 })
                                // Find the max persons for the secondary port
                                const maxPersonsForSecondaryPort = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == 3 })
                                // If the reservations for the secondary port exceed the max persons for this port, add the excess reservations to the primary port
                                if (secondaryPortReservations.length > 0) {
                                    if (secondaryPortReservations[0].persons > maxPersonsForSecondaryPort[0].maxPersons) {
                                        primaryPortReservations[0].persons += secondaryPortReservations[0].persons - maxPersonsForSecondaryPort[0].maxPersons
                                    }
                                }
                                // Calculate available for primary port
                                const availableForPrimaryPort = maxPersonsForPrimaryPort[0].maxPersons - primaryPortReservations[0].persons
                                // Show
                                console.log(day, 'Primary:', 'Max', schedule.maxPersons, 'Reservations', primaryPortReservations[0].persons, 'Available', availableForPrimaryPort)
                            }
                            // If we selected the secondary port
                            if (schedule.portId == 3) {
                                // Find the max persons for the primary port 
                                const maxPersonsForPrimaryPort = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == 3 })
                                // Find the max persons for the secondary port of this day
                                const maxPersonsForSecondaryPort = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == 3 })
                                // Calculate the max persons for both ports of this day
                                const maxPersonsForBothPorts = this.calculateMaxPersonsForPrimaryPort(maxPersonsForPrimaryPort[0]) + this.calculateMaxPersonsForSecondaryPort(maxPersonsForSecondaryPort[0])
                                // Find the reservations for the primary port
                                const primaryPortReservations = this.calculateReservationsForPrimaryPort(reservations[0])
                                // Find the reservations for the secondary port
                                const secondaryPortReservations = this.calculateReservationsForSecondaryPort(reservations[0], maxPersonsForPrimaryPort[0])
                                // Calculate reservations from both ports
                                const reservationsForBothPort = primaryPortReservations + secondaryPortReservations
                                // Calculate remaining seats for secondary port
                                const availableSeatsForSecondaryPort = maxPersonsForBothPorts - reservationsForBothPort
                                // Show
                                console.log(day, 'Secondary:', 'Max', maxPersonsForBothPorts, 'Reservations', secondaryPortReservations, 'Reservations both', reservationsForBothPort, 'Available', availableSeatsForSecondaryPort)
                            }
                        } else {
                            // No reservations
                            // Find the max persons for the primary port of this day
                            const maxPersonsForPrimaryPort = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == 2 })
                            // Find the max persons for the secondary port of this day
                            const maxPersonsForSecondaryPort = this.schedules.filter(schedule => { return schedule.date == day && schedule.portId == 3 })
                            // Calculate the max persons for both ports of this day
                            const maxPersonsForBothPorts = this.calculateMaxPersonsForPrimaryPort(maxPersonsForPrimaryPort[0]) + this.calculateMaxPersonsForSecondaryPort(maxPersonsForSecondaryPort[0])
                            if (schedule.portId == 2) {
                                console.log(day, 'Primary:', 'Max', maxPersonsForPrimaryPort[0].maxPersons, 'Reservations', 0, 'Available', maxPersonsForPrimaryPort[0].maxPersons)
                            }
                            if (schedule.portId == 3) {
                                console.log(day, 'Secondary:', 'Max', maxPersonsForBothPorts, 'Reservations both', 0, 'Available', maxPersonsForBothPorts)
                            }
                        }
                    }
                })
            })
        })
    }

    public onNew(): void {
        this.openDialog()
    }

    public onToggleItem(description: string, objectKey: string, objectValue: string, idValue: number, lookupArray: string): void {
        this.toggleActiveItem(description, lookupArray)
        this[objectKey] = idValue
        this[objectValue] = description
        this.setCalendarOpacity('0')
    }

    //#endregion

    //#region private methods

    private addClickEventToMonthArrows(): void {
        const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button')
        if (buttons) {
            Array.from(buttons).forEach(button => {
                this.renderer.listen(button, 'click', () => {
                    this.daysISO = []
                    this.onMarkDaysOnCalendar()
                })
            })
        }
    }

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'goBack')
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'searchButton')
            },
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'newButton')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private adjustCalendarSize(): void {
        const calendars = Array.from(document.getElementsByClassName('mat-calendar-content') as HTMLCollectionOf<HTMLElement>)
        for (let i = 0; i < calendars.length; i++) {
            calendars[i].style.width = document.getElementById('calendar-wrapper').clientWidth * (60 / 100) + 'px'
        }
    }

    private colorizeDays(element: HTMLDivElement, day: string, schedule: any): void {
        const reservation = this.reservations.filter(x => x.date == day)
        const reservationPersons = reservation.length != 0 ? reservation[0].persons : 0
        const percentFull = (100 * reservationPersons / schedule.maxPersons)
        switch (true) {
            case (percentFull <= 60):
                element.classList.add('green')
                break
            case (percentFull > 61 && percentFull <= 70):
                element.classList.add('light-green')
                break
            case (percentFull > 70 && percentFull <= 80):
                element.classList.add('yellow')
                break
            case (percentFull > 80 && percentFull <= 90):
                element.classList.add('orange')
                break
            case (percentFull > 90 && percentFull <= 95):
                element.classList.add('red')
                break
            case (percentFull > 95):
                element.classList.add('dark-red')
                break
            default:
                element.classList.add('green')
            // }
        }
    }

    private loadDestinations(): void {
        this.destinationService.getAllActive().subscribe(result => {
            this.destinations = result
        })
    }

    private loadPorts(): void {
        this.portService.getAllActive().subscribe(result => {
            this.ports = result
        })
    }

    private openDialog(): void {
        this.dialog.open(ScheduleCreateFormComponent, {
            width: '500px',
            data: {
                destinationId: this.destinationId,
                destinationDescription: this.destinationDescription,
                portId: this.portId,
                portDescription: this.portDescription
            }
        })
    }

    private populateScheduleDays(result: any[]): void {
        this.schedules = []
        this.schedules = result.filter(x => x.port.id = 2)
    }

    private populateReservations(result: any): void {
        this.reservations = []
        result.forEach((element: any) => {
            this.reservations.push(element)
        })
    }

    private setCalendarOpacity(opacity: string): void {
        document.getElementById('calendar-wrapper').style.opacity = opacity
    }

    private setElementVisibility(action: string): void {
        this.interactionService.setSidebarAndTopLogoVisibility(action)
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showCalendar(): void {
        this.isCalendarVisible = true
    }

    private toggleActiveItem(item: string, lookupArray: string): void {
        const elements = document.getElementsByClassName(lookupArray)
        const element = document.getElementById(item)
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            element.classList.remove('activeItem')
        }
        element.classList.add('activeItem')
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

    private calculateReservationsForPrimaryPort(m): any {
        const a = m.portPersons.filter(x => x.portId == 2)
        if (a.length > 0) {
            return a[0].persons
        }
        return 0
    }

    private calculateReservationsForSecondaryPort(reservation, schedule): any {
        const reservations = reservation.portPersons.filter(x => x.portId == 3)
        if (reservations.length > 0) {
            return reservations[0].persons
        }
        return 0
    }


}
