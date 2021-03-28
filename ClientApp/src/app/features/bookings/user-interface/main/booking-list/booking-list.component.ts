import { Location } from '@angular/common'
import { Component, HostListener } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { BookingFlat } from '../../../classes/booking-flat'
import { BookingPdfService } from '../../../classes/booking-pdf.service'
import { BookingService } from '../../../classes/booking.service'
import { BookingViewModel } from '../../../classes/booking-view-model'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { BookingAssignToDriverComponent } from '../../assign-driver/assign-driver-form.component'
import { ShipService } from 'src/app/features/ships/classes/ship.service'
import { BookingAssignToShipComponent } from '../../assign-ship/assign-ship-form.component'

@Component({
    selector: 'booking-list',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.css', '../../../../../../assets/styles/summaries.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class BookingListComponent {

    //#region variables

    private ngUnsubscribe = new Subject<void>()
    private records: string[] = []
    private resolver = 'bookingList'
    private unlisten: Unlisten
    private windowTitle = 'Bookings'
    public feature = 'bookingList'
    public highlightFirstRow = false
    public sortColumn: string
    public sortOrder: string

    //#endregion

    //#region particular variables

    private dateIn: string
    private mustRefreshBookingList = true
    private queryResultClone = new BookingViewModel()
    public activePanel: string
    public bookingsFlat: BookingFlat[] = []
    public checkedCustomers = true
    public checkedDestinations = true
    public checkedDrivers = true
    public checkedPorts = true
    public checkedRoutes = true
    public checkedShips = true
    public indeterminateCustomers: boolean
    public indeterminateDestinations: boolean
    public indeterminateDrivers: boolean
    public indeterminatePorts: boolean
    public indeterminateRoutes: boolean
    public indeterminateShips: boolean
    public queryResult = new BookingViewModel()
    public selectedCustomers: string[] = []
    public selectedDestinations: string[] = []
    public selectedDrivers: string[] = []
    public selectedPorts: string[] = []
    public selectedRoutes: string[] = []
    public selectedShips: string[] = []
    public totals: any[] = []

    //#endregion

    //#region table

    headers = ['', 'Id', 'headerDestination', 'headerDestinationAbbreviation', 'headerRoute', 'headerCustomer', 'headerPickupPoint', 'headerTime', 'headerAdults', 'headerKids', 'headerFree', 'headerTotal', 'headerDriver', 'headerPort', 'headerShip', '']
    widths = ['40px', '100px', '180px', '0px', '120px', '180px', '180px', '50px', '40px', '40px', '40px', '40px', '100px', '100px', '100px', '45px']
    visibility = ['', 'none', '', 'none']
    justify = ['center', 'center', 'left', 'left', 'left', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left', 'left', 'center']
    types = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    fields = ['', 'id', 'destination', 'destinationAbbreviation', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port', 'ship', '']

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private bookingService: BookingService, private buttonClickService: ButtonClickService, private driverService: DriverService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private location: Location, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pdfService: BookingPdfService, private router: Router, private service: BookingService, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe((params: Params) => this.dateIn = params['dateIn'])
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && this.dateIn !== '' && this.router.url.split('/').length === 4) {
                this.mustRefreshBookingList = true
                this.loadRecords()
                this.onFocusSummaryPanel()
            }
        })
    }

    @HostListener('window:resize', ['$event']) onResize(): any {
        this.setElementVisibility('')
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.initPersonsSumArray()
        this.subscribeToInteractionService()
        this.onFocusSummaryPanel()
        this.setElementVisibility('hide')
    }

    ngAfterViewInit(): void {
        if (this.isDataInLocalStorage()) {
            this.updateSelectedArraysFromLocalStorage()
        } else {
            this.updateSelectedArraysFromInitialResults()
            this.saveSelectedItemsToLocalStorage()
        }
        this.addActiveClassToSummaryItems()
        this.filterByCriteria()
        this.initCheckedPersons()
        this.updateTotals()
        this.updateParentCheckboxes()
    }

    ngDoCheck(): void {
        if (this.mustRefreshBookingList) {
            this.mustRefreshBookingList = false
            this.ngAfterViewInit()
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.setElementVisibility('show')
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onAssignToDriver(): void {
        if (this.isAnyRowSelected()) {
            const dialogRef = this.dialog.open(BookingAssignToDriverComponent, {
                height: '350px',
                width: '550px',
                data: {
                    drivers: this.driverService.getAllActive(),
                    actions: ['abort', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.bookingService.assignToDriver(result, this.records).subscribe(() => {
                        this.removeSelectedIdsFromLocalStorage()
                        this.navigateToList()
                        this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
                    })
                }
            })
        }
    }

    public onAssignToShip(): void {
        if (this.isAnyRowSelected()) {
            const dialogRef = this.dialog.open(BookingAssignToShipComponent, {
                height: '350px',
                width: '550px',
                data: {
                    ships: this.shipService.getAllActive(),
                    actions: ['abort', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.bookingService.assignToShip(result, this.records).subscribe(() => {
                        this.removeSelectedIdsFromLocalStorage()
                        this.navigateToList()
                        this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
                    })
                }
            })
        }
    }

    public onCreatePdf(): void {
        this.pdfService.createReport(this.bookingsFlat, this.getDriversFromLocalStorage(), this.dateIn)
    }

    public onFocusListPanel(): void {
        this.activePanel = 'list'
        document.getElementById('summaryTab').classList.remove('active')
        document.getElementById('listTab').classList.add('active')
        document.getElementById('table-wrapper').style.display = 'block'
        this.flattenResults()
    }

    public onFocusSummaryPanel(): void {
        this.activePanel = 'summary'
        document.getElementById('summaryTab').classList.add('active')
        document.getElementById('listTab').classList.remove('active')
        document.getElementById('table-wrapper').style.display = 'none'
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onGoBack(): void {
        this.router.navigate(['/'])
    }

    public onNew(): void {
        document.getElementById('listTab').click()
        this.router.navigate([this.location.path() + '/booking/new'])
    }

    public onToggleItem(item: any, lookupArray: string[], checkedVariable: any, indeterminate: any, className: string): void {
        this.toggleActiveItem(item, lookupArray)
        this.initCheckedPersons()
        this.filterByCriteria()
        this.updateTotals()
        this.saveSelectedItemsToLocalStorage()
        this.updateParentCheckBox(className, indeterminate, checkedVariable)
    }

    public onToggleParentCheckbox(className: string, lookupArray: any[], checkedArray: any): void {
        event.stopPropagation()
        lookupArray.splice(0)
        this.selectItems(className, lookupArray, !checkedArray)
        this.filterByCriteria()
        this.initCheckedPersons()
        this.saveSelectedItemsToLocalStorage()
        this.updateTotals()
    }

    //#endregion

    //#region private methods

    private addActiveClassToElements(className: string, lookupArray: string[]): void {
        const elements = document.querySelectorAll(className)
        elements.forEach((element) => {
            const position = lookupArray.indexOf(element.id)
            if (position >= 0) {
                element.classList.add('activeItem')
            }
        })
    }

    private addActiveClassToSummaryItems(): void {
        setTimeout(() => {
            this.addActiveClassToElements('.item.destination', this.selectedDestinations)
            this.addActiveClassToElements('.item.customer', this.selectedCustomers)
            this.addActiveClassToElements('.item.route', this.selectedRoutes)
            this.addActiveClassToElements('.item.driver', this.selectedDrivers)
            this.addActiveClassToElements('.item.port', this.selectedPorts)
            this.addActiveClassToElements('.item.ship', this.selectedShips)
        }, 100)
    }

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            },
            'Alt.A': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'assignToDriver')
            },
            'Alt.C': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'createPdf')
            },
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'new')
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'search')
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private editRecord(id: number): void {
        this.router.navigate(['booking/', id], { relativeTo: this.activatedRoute })
    }

    private filterByCriteria(): void {
        this.queryResultClone.bookings = this.queryResult.bookings
            .filter((destination: { destination: { description: string } }) => this.selectedDestinations.indexOf(destination.destination.description) !== -1)
            .filter((customer: { customer: { description: string } }) => this.selectedCustomers.indexOf(customer.customer.description) !== -1)
            .filter((route: { pickupPoint: { route: { abbreviation: string } } }) => this.selectedRoutes.indexOf(route.pickupPoint.route.abbreviation) !== -1)
            .filter((driver: { driver: { description: string } }) => this.selectedDrivers.indexOf(driver.driver.description) !== -1)
            .filter((port: { pickupPoint: { route: { port: { description: string } } } }) => this.selectedPorts.indexOf(port.pickupPoint.route.port.description) !== -1)
            .filter((ship: { ship: { description: string } }) => this.selectedShips.indexOf(ship.ship.description) !== -1)
    }

    private flattenResults(): void {
        this.bookingsFlat.splice(0)
        for (const {
            bookingId: a,
            destination: { description: b, abbreviation: c },
            customer: { description: d },
            adults: e,
            kids: f,
            free: g,
            totalPersons: h,
            pickupPoint: { description: i, time: j, route: { abbreviation: k, port: { description: l } } },
            driver: { description: m },
            ship: { description: n },
            date: o,
            remarks: p
        } of this.queryResultClone.bookings) {
            this.bookingsFlat.push({ id: a, destination: b, destinationAbbreviation: c, customer: d, adults: e, kids: f, free: g, totalPersons: h, pickupPoint: i, time: j, route: k, port: l, driver: m, ship: n, dateIn: o, remarks: p })
        }
    }

    private getDriversFromLocalStorage(): any {
        const localStorageData = JSON.parse(this.helperService.readItem('bookings'))
        return JSON.parse(localStorageData.drivers)
    }

    private initCheckedPersons(): void {
        this.interactionService.setCheckedTotalPersons(0)
    }

    private initPersonsSumArray(): void {
        this.totals.push(
            { description: 'total', sum: 0 },
            { description: 'displayed', sum: 0 },
            { description: 'selected', sum: 0 },
            { description: 'filtered', sum: 0 }
        )
    }

    private isDataInLocalStorage(): string {
        return this.helperService.readItem('bookings')
    }

    private isAnyRowSelected(): boolean {
        if (this.totals[2].sum === 0) {
            this.showSnackbar(this.messageSnackbarService.noRecordsSelected(), 'error')
            return false
        }
        this.records = JSON.parse(this.helperService.readItem('selectedIds'))
        return true
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.queryResult = listResolved.result
        } else {
            this.onGoBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private navigateToList(): void {
        this.router.navigate(['bookings/date/', this.helperService.readItem('date')])
    }

    private removeSelectedIdsFromLocalStorage(): void {
        localStorage.removeItem('selectedIds')
    }

    private saveSelectedItemsToLocalStorage(): void {
        const summaryItems = {
            'destinations': JSON.stringify(this.selectedDestinations),
            'customers': JSON.stringify(this.selectedCustomers),
            'routes': JSON.stringify(this.selectedRoutes),
            'drivers': JSON.stringify(this.selectedDrivers),
            'ports': JSON.stringify(this.selectedPorts),
            'ships': JSON.stringify(this.selectedShips),
        }
        this.helperService.saveItem('bookings', JSON.stringify(summaryItems))
        localStorage.removeItem('selectedIds')
    }

    private selectItems(className: string, lookupArray: string[], checked: boolean): void {
        const elements = document.getElementsByClassName('item ' + className)
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index]
            if (checked) {
                element.classList.add('activeItem')
                lookupArray.push(element.id)
            } else {
                element.classList.remove('activeItem')
            }
        }
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private setElementVisibility(action: string): void {
        this.interactionService.setSidebarAndTopLogoVisibility(action)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
        this.interactionService.refreshBookingList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.service.get(this.dateIn).subscribe(result => {
                this.queryResult = result
                this.ngAfterViewInit()
            })
        })
        this.interactionService.tableRow.subscribe(result => {
            this.bookingsFlat.splice(Number(result), 1)
            this.updateTotals()
        })

    }

    private toggleActiveItem(item: { description: string }, lookupArray: string[]): void {
        const element = document.getElementById(item.description)
        if (element.classList.contains('activeItem')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item.description) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('activeItem')
                    break
                }
            }
        } else {
            element.classList.add('activeItem')
            lookupArray.push(item.description)
        }
    }

    private updateSelectedArraysFromInitialResults(): void {
        this.queryResult.personsPerDestination.forEach((element: { description: string }) => { this.selectedDestinations.push(element.description) })
        this.queryResult.personsPerCustomer.forEach((element: { description: string }) => { this.selectedCustomers.push(element.description) })
        this.queryResult.personsPerRoute.forEach((element: { description: string }) => { this.selectedRoutes.push(element.description) })
        this.queryResult.personsPerDriver.forEach((element: { description: string }) => { this.selectedDrivers.push(element.description) })
        this.queryResult.personsPerPort.forEach((element: { description: string }) => { this.selectedPorts.push(element.description) })
        this.queryResult.personsPerShip.forEach((element: { description: string }) => { this.selectedShips.push(element.description) })
    }

    private updateSelectedArraysFromLocalStorage(): void {
        const localStorageData = JSON.parse(this.helperService.readItem('bookings'))
        this.selectedDestinations = JSON.parse(localStorageData.destinations)
        this.selectedCustomers = JSON.parse(localStorageData.customers)
        this.selectedRoutes = JSON.parse(localStorageData.routes)
        this.selectedDrivers = JSON.parse(localStorageData.drivers)
        this.selectedPorts = JSON.parse(localStorageData.ports)
        this.selectedShips = JSON.parse(localStorageData.ships)
    }

    private updateTotals(): void {
        this.totals[0].sum = this.queryResult.persons
        this.totals[1].sum = this.queryResultClone.bookings.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
        this.interactionService.checked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            this.totals[2].sum = result
        })
    }

    private updateParentCheckboxes(): void {
        setTimeout(() => {
            this.updateParentCheckBox('destination', 'indeterminateDestinations', 'checkedDestinations')
            this.updateParentCheckBox('customer', 'indeterminateCustomers', 'checkedCustomers')
            this.updateParentCheckBox('route', 'indeterminateRoutes', 'checkedRoutes')
            this.updateParentCheckBox('driver', 'indeterminateDrivers', 'checkedDrivers')
            this.updateParentCheckBox('port', 'indeterminatePorts', 'checkedPorts')
            this.updateParentCheckBox('ship', 'indeterminateShips', 'checkedShips')
        }, 100)
    }

    private updateParentCheckBox(summary: string, indeterminateVariable: string, checkedVariable: string): void {
        const allItems = document.querySelectorAll('.item.' + summary).length
        const activeItems = document.querySelectorAll('.item.' + summary + '.activeItem').length
        this[indeterminateVariable] = activeItems == allItems || activeItems == 0 ? false : true
        this[checkedVariable] = activeItems == 0 || (activeItems < allItems && activeItems != 0) ? false : true
    }

    //#endregion

}
