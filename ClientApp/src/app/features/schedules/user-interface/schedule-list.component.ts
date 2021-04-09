import { Component, HostListener, Renderer2 } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
import moment from 'moment'

import { AccountService } from 'src/app/shared/services/account.service'
import { ActivatedRoute, Router } from '@angular/router'
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

    private mustRefreshReservationList = true
    public destinationId = 0
    public destinationDescription = ''
    public destinations: Destination[]
    public portId = 0
    public portDescription = ''
    public ports: Port[]
    public isCalendarVisible = false
    private daysISO = []
    private schedules = []
    // private filteredSchedules = []
    private reservations = []
    private calendarData = []

    private userRole: Observable<string>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private portService: PortService, private renderer: Renderer2, private reservationService: ReservationService, private router: Router, private scheduleService: ScheduleService, private titleService: Title, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(params => {
            console.log(params, params['rowid'])
            this.destinationId = params['destinationId']
            this.portId = params['portId']
            this.loadRecords()
        })
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
        this.updateVariables()
    }

    ngAfterViewInit(): void {
        this.adjustCalendarSize()
        this.addClickEventToMonthArrows()
    }

    ngDoCheck(): void {
        if (this.mustRefreshReservationList) {
            this.mustRefreshReservationList = false
            this.ngAfterViewInit()
        }
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.setElementVisibility('show')
    }

    //#endregion

    //#region public methods

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    private loadRecords(): void {
        this.scheduleService.getForDestination(this.destinationId).then(result => {
            console.log('Schedule', result)
            this.populateScheduleDays(result)
            this.reservationService.getByDate(this.destinationId).then(result => {
                console.log('Reservations', result)
                this.populateReservations(result)
                this.onCreateCalendar()
                this.markDaysOnCalendar()
                this.showCalendar()
            })
        })
    }

    public async onCreateCalendar(): Promise<void> {
        const domElement = Array.from(document.querySelectorAll<HTMLDivElement>('.mat-calendar .mat-calendar-body-cell-content'))
        const monthAndYear = document.getElementsByClassName('mat-focus-indicator mat-calendar-period-button mat-button mat-button-base')[0].textContent.trim()
        const month = monthAndYear.trim().split(' ')[0]
        const year = parseInt(monthAndYear.trim().split(' ')[1])
        domElement.forEach(dayElement => {
            const dayText = parseInt(dayElement.innerText)
            const dayTextISO = moment(new Date(year + ',' + this.helperService.convertMonthStringToNumber(month) + ',' + dayText)).format('YYYY-MM-DD')
            this.daysISO.push(dayTextISO)
            dayElement.parentElement.classList.remove('green', 'yellow', 'orange', 'red', 'dark-red')
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
        console.log('Calendar', this.calendarData)
    }

    private markDaysOnCalendar(): void {
        const domElements = Array.from(document.querySelectorAll<HTMLDivElement>('.mat-calendar .mat-calendar-body-cell-content'))
        this.calendarData.forEach(available => {
            this.daysISO.forEach(day => {
                if (available.date == day) {
                    const me = parseInt(available.date.substring(8, 10)).toString()
                    for (let i = 0; i < domElements.length; i++) {
                        if (domElements[i].textContent.trim() == me) {
                            const textnode = document.createElement("div")
                            textnode.classList.add('mat-calendar-body-cell-content')
                            textnode.classList.add('mat-focus-indicator')
                            domElements[i].parentElement.classList.add(this.colorizeDays(available))
                            textnode.innerHTML = '<div class="dateWithSchedule">' + me + '</div>' + '<div class="availableSeats">' + available.available + '</div>' + '<div class="availableSeats">' + available.maxPersons + '</div>'
                            domElements[i].parentNode.replaceChild(textnode, domElements[i])
                            break
                        }
                    }
                }
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
    }

    //#endregion

    //#region private methods

    private async addClickEventToMonthArrows(): Promise<void> {
        const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button')
        if (buttons) {
            Array.from(buttons).forEach(button => {
                this.renderer.listen(button, 'click', () => {
                    this.daysISO = []
                    this.onCreateCalendar()
                    this.markDaysOnCalendar()
                    this.showCalendar()
                })
            })
        }
    }

    private adjustCalendarSize(): void {
        const calendars = Array.from(document.getElementsByClassName('mat-calendar-content') as HTMLCollectionOf<HTMLElement>)
        for (let i = 0; i < calendars.length; i++) {
            calendars[i].style.width = document.getElementById('calendar-wrapper').clientWidth * (60 / 100) + 'px'
        }
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

    private colorizeDays(data: { available: number; maxPersons: number }): string {
        const percentEmpty = (100 * data.available / data.maxPersons)
        switch (true) {
            case (percentEmpty) == 0:
                return 'dark-red'
            case (percentEmpty <= 10):
                return 'red'
            case (percentEmpty > 10 && percentEmpty <= 40):
                return 'orange'
            case (percentEmpty > 40 && percentEmpty <= 50):
                return 'yellow'
            default:
                return 'green'
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
        this.schedules = result
        // this.schedules = []
        // this.schedules = result.filter(schedule => { return schedule.portId == this.portId })
        // this.filteredSchedules = result.filter(schedule => { return schedule.portId == this.portId })
    }

    private populateReservations(result: any): void {
        this.reservations = []
        result.forEach((element: any) => {
            this.reservations.push(element)
        })
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

    private doPrimaryPortJobs(reservation, day): void {
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

    private doSecondaryPortJobs(reservation, day): void {
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

    private doNoReservationJobs(day): void {
        const maxPersonsForPrimaryPort = this.findSchedule(day, 2) // Find the max persons for the primary port
        const maxPersonsForSecondaryPort = this.findSchedule(day, 3) // Find the max persons for the secondary port
        const maxPersonsForBothPorts = maxPersonsForPrimaryPort[0].maxPersons + maxPersonsForSecondaryPort[0].maxPersons // Calculate the max persons for both ports
        if (this.portId == 2) {
            this.calendarData.push({
                'date': day,
                'maxPersons': maxPersonsForPrimaryPort[0].maxPersons,
                'available': maxPersonsForPrimaryPort[0].maxPersons
            })
            console.log(day, 'Primary:', 'Max', maxPersonsForPrimaryPort[0].maxPersons, 'Reservations', 0, 'Available', maxPersonsForPrimaryPort[0].maxPersons)
        }
        if (this.portId == 3) {
            this.calendarData.push({
                'date': day,
                'maxPersons': maxPersonsForBothPorts,
                'available': maxPersonsForBothPorts
            })
            console.log(day, 'Secondary:', 'Max', maxPersonsForBothPorts, 'Reservations both', 0, 'Available', maxPersonsForBothPorts)

        }

    }

}