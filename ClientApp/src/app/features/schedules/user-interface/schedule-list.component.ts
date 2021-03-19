import { ScheduleService } from './../classes/schedule.service'
import { DestinationService } from './../../destinations/classes/destination.service'
import { Component, HostListener, Renderer2 } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Observable, Subject } from 'rxjs'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Port } from '../../ports/classes/port'
import { Destination } from '../../destinations/classes/destination'
import { PortService } from '../../ports/classes/port.service'
import { MatDialog } from '@angular/material/dialog'
import { ScheduleCreateFormComponent } from './schedule-create-form.component'
import moment from 'moment'
import { DateAdapter } from '@angular/material/core'
import { AccountService } from 'src/app/shared/services/account.service'
import { BookingService } from '../../bookings/classes/booking.service'

@Component({
    selector: 'schedule-list',
    templateUrl: './schedule-list.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './schedule-list-component.css'],
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

    constructor(private accountService: AccountService, private bookingService: BookingService, private buttonClickService: ButtonClickService, private dateAdapter: DateAdapter<any>, private destinationService: DestinationService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private portService: PortService, private renderer: Renderer2, private scheduleService: ScheduleService, private titleService: Title, public dialog: MatDialog) {
        this.dateAdapter.setLocale(this.helperService.readItem("language"))
    }

    @HostListener('window:resize', ['$event']) onResize(): any {
        this.setSidebarVisibility('hidden')
        this.setTopLogoVisibility('visible')
        this.adjustCalendarSize()
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.loadDestinations()
        this.loadPorts()
        this.addShortcuts()
        this.updateVariables()
        this.setSidebarVisibility('hidden')
        this.setTopLogoVisibility('visible')
        this.setCalendarOpacity('0')
    }

    ngAfterViewInit(): void {
        this.adjustCalendarSize()
        this.addClickEventToMonthArrows()
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
        this.setCalendarOpacity('1')
        this.scheduleService.getForDestinationAndPort(this.destinationId, this.portId).then(result => {
            this.populateScheduleDays(result)
            this.onMarkDaysOnCalendar()
            this.showCalendar()
        })
        this.bookingService.getByDate(this.destinationId, this.portId).then(result => {
            this.populateReservations(result)
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
                this.daysISO.push(dayTextISO + 'T00:00:00')
                dayElement.classList.remove('green', 'light-green', 'yellow', 'orange', 'red', 'dark-red')
            })
            this.schedules.forEach(schedule => {
                this.daysISO.forEach(day => {
                    if (schedule.date == day) {
                        const me = parseInt(schedule.date.substring(8, 10)).toString()
                        for (let i = 0; i < dayElements.length; i++) {
                            if (dayElements[i].textContent.trim() == me) {
                                this.colorizeDays(dayElements[i], day, schedule)
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
        this.schedules = result
        console.log(this.schedules)
    }

    private populateReservations(result: any): void {
        this.reservations = []
        result.forEach((element: any) => {
            this.reservations.push(element)
        })
        console.log(this.reservations)
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

    private setSidebarVisibility(visibility?: string): void {
        if (screen.width < 1599 && visibility) {
            document.getElementById('side-logo').style.opacity = '0'
            document.getElementById('side-image').style.opacity = '0'
            document.getElementById('side-footer').style.opacity = '0'
            document.getElementById('side-bar').style.width = '0'
            document.getElementById('side-bar').style.overflow = 'hidden'
        } else {
            document.getElementById('side-logo').style.opacity = '1'
            document.getElementById('side-image').style.opacity = '1'
            document.getElementById('side-footer').style.opacity = '1'
            document.getElementById('side-bar').style.width = '16.5rem'
        }
    }

    private setTopLogoVisibility(visibility?: string): void {
        if (screen.width < 1599 && visibility) {
            document.getElementById('top-logo').style.display = 'flex'
        } else {
            document.getElementById('top-logo').style.display = 'none'
        }
    }

    private setCalendarOpacity(opacity: string): void {
        document.getElementById('calendar-wrapper').style.opacity = opacity
    }

}
