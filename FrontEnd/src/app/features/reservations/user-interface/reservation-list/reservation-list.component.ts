import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
import { Title } from '@angular/platform-browser'
// Custom
import { DestinationDropdownVM } from 'src/app/features/destinations/classes/view-models/destination-dropdown-vm'
import { ShipRouteDropdownVM } from './../../../shipRoutes/classes/view-models/shipRoute-dropdown-vm'
import { PortDropdownVM } from './../../../ports/classes/view-models/port-dropdown-vm'
import { DriverDropdownVM } from './../../../drivers/classes/view-models/driver-dropdown-vm'
import { CustomerDropdownVM } from './../../../customers/classes/view-models/customer-dropdown-vm'
import { DriverReportService } from '../../classes/driver-report/services/driver-report.service'
import { DriverService } from 'src/app/features/drivers/classes/services/driver.service'
import { EmojiService } from './../../../../shared/services/emoji.service'
import { HelperService } from './../../../../shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ReservationGroupVM } from '../../classes/resources/list/reservation-group-vm'
import { ReservationService } from './../../classes/services/reservation.service'
import { ReservationToDriverComponent } from '../reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToShipComponent } from '../reservation-to-ship/reservation-to-ship-form.component'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { PickupPointDropdownVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-dropdown-vm'
import { CoachRouteDropdownVM } from 'src/app/features/coachRoutes/classes/view-models/coachRoute-dropdown-vm'

@Component({
    selector: 'reservation-list',
    templateUrl: './reservation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './reservation-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ReservationListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    public parentUrl = '/reservations'
    private resolver = 'reservationList'
    private unsubscribe = new Subject<void>()
    public icon = 'arrow_back'
    private url = ''
    private windowTitle = 'Reservations'
    public feature = 'reservationList'


    public highlighted: any
    public records = new ReservationGroupVM()
    public selectedRecords = []
    public totals: any[] = []

    public dropdownCustomers: CustomerDropdownVM[] = []
    public dropdownDestinations: DestinationDropdownVM[] = []
    public dropdownDrivers: DriverDropdownVM[] = []
    public dropdownPickupPoints: PickupPointDropdownVM[] = []
    public dropdownPorts: PortDropdownVM[] = []
    public dropdownCoachRoutes: CoachRouteDropdownVM[] = []
    public dropdownShips: ShipRouteDropdownVM[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private driverReportService: DriverReportService, private driverService: DriverService, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private reservationService: ReservationService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
                this.storeDate()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initPersonTotals()
        this.updateTotals()
        this.populateDropdowns()
    }

    ngAfterViewInit(): void {
        this.changeScrollWheelSpeed()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public onAssignToDriver(): void {
        if (this.isAnyRowSelected()) {
            this.saveSelectedIds()
            const dialogRef = this.dialog.open(ReservationToDriverComponent, {
                height: '550px',
                width: '500px',
                data: {
                    drivers: this.driverService.getActiveForDropdown(),
                    actions: ['abort', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.reservationService.assignToDriver(result, this.selectedRecords).subscribe(() => {
                        this.refreshList()
                        this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
                    })
                }
            })
        }
    }

    public assignToShip(): void {
        if (this.isAnyRowSelected()) {
            this.saveSelectedIds()
            const dialogRef = this.dialog.open(ReservationToShipComponent, {
                height: '550px',
                width: '500px',
                data: {
                    ships: this.shipService.getActiveForDropdown(),
                    actions: ['abort', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.reservationService.assignToShip(result, this.selectedRecords).subscribe(() => {
                        this.refreshList()
                        this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
                    })
                }
            })
        }
    }

    public showEmoji(passengerDifference: number): string {
        if (passengerDifference > 0) {
            return this.emojiService.getEmoji('warning')
        }
        if (passengerDifference == 0) {
            return this.emojiService.getEmoji('ok')
        }
        if (passengerDifference < 0) {
            return this.emojiService.getEmoji('error')
        }
    }

    public calculateTotals(event?: { filteredValue: any[] }): void {
        setTimeout(() => {
            this.totals[0].sum = this.records.persons
            this.totals[1].sum = event.filteredValue.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
            this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
        }, 500)
    }

    public createPdf(): void {
        this.driverReportService.doReportTasks(this.getDistinctDriverIds(this.records.reservations))
    }

    public doResetTableTasks(table: { reset: () => void }): void {
        this.clearFilterTextboxes()
        this.resetTable(table)
        this.clearCheckboxes()
        this.clearSelectedRecords()
        this.updateTotals()
    }

    public onEditRecord(id: string): void {
        this.localStorageService.saveItem('returnUrl', this.url)
        this.router.navigate([this.parentUrl, id])
    }

    public formatDateToLocale() {
        return this.helperService.formatISODateToLocale(this.localStorageService.getItem('date'), true)
    }

    public formatRefNo(refNo: string): string {
        return this.helperService.formatRefNo(refNo, false)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public isAdmin(): boolean {
        return true
    }

    public newRecord(): void {
        this.localStorageService.saveItem('returnUrl', this.url)
        this.router.navigate([this.parentUrl, 'new'])
    }

    public onGoBack(): void {
        this.router.navigate(['reservations'])
    }

    public rowSelect(event: { data: { totalPersons: any } }): void {
        this.totals[2].sum += event.data.totalPersons
    }

    public rowUnselect(event: { data: { totalPersons: number } }): void {
        this.totals[2].sum -= event.data.totalPersons
    }

    public showDate(): string {
        return this.localStorageService.getItem('date') ? this.formatDateToLocale() : '-'
    }

    public toggleVisibleRows(): void {
        this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
    }

    //#endregion

    //#region private methods

    private changeScrollWheelSpeed(): void {
        this.helperService.changeScrollWheelSpeed(document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport'))
    }

    private clearCheckboxes(): void {
        const items = document.querySelectorAll('.pi-check')
        items.forEach(item => {
            item.classList.remove('pi', 'pi-check')
        })
    }

    private clearFilterTextboxes(): void {
        const boxes = document.querySelectorAll<HTMLInputElement>('.p-inputtext[type="text"]')
        boxes.forEach(box => {
            box.value = ''
        })
    }

    private clearSelectedRecords(): void {
        this.selectedRecords = []
    }

    private initPersonTotals(): void {
        this.totals.push(
            { description: 'total', sum: 0 },
            { description: 'displayed', sum: 0 },
            { description: 'selected', sum: 0 }
        )
    }

    private isAnyRowSelected(): boolean {
        if (this.selectedRecords.length == 0) {
            this.showSnackbar(this.messageSnackbarService.noRecordsSelected(), 'error')
            return false
        }
        return true
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.resolver]
        if (listResolved.error === null) {
            this.records = listResolved.result
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private getDistinctDriverIds(reservations: any): any[] {
        const driverIds = []
        const x = [... new Set(reservations.map((x: { driverId: any }) => x.driverId))]
        x.forEach(element => {
            driverIds.push(element)
        })
        return driverIds
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private populateDropdowns(): void {
        this.dropdownCoachRoutes = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'coachRouteAbbreviation')
        this.dropdownCustomers = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'customerDescription')
        this.dropdownDestinations = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'destinationDescription')
        this.dropdownDrivers = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'driverDescription')
        this.dropdownPickupPoints = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'pickupPointDescription')
        this.dropdownPorts = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'portDescription')
        this.dropdownShips = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'shipDescription')
    }

    private resetTable(table: { reset: any }): void {
        table.reset()
        this.table.filter('', 'ticketNo', 'contains')
    }

    private refreshList(): void {
        this.router.navigate([this.url])
    }

    private saveSelectedIds(): void {
        const ids = []
        this.selectedRecords.forEach(record => {
            ids.push(record.reservationId)
        })
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private storeDate(): void {
        if (this.records.reservations.length > 0) {
            this.localStorageService.saveItem('date', this.records.reservations[0].date)
        } else {
            this.localStorageService.deleteItems([
                { 'item': 'date', 'when': 'always' }
            ])
        }
    }

    private updateTotals(): void {
        Promise.resolve(null).then(() => {
            this.totals[0].sum = this.records.persons
            this.totals[1].sum = this.records.reservations.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
            this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
        })
    }

    //#endregion

}
