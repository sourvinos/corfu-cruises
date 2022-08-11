import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Table } from 'primeng/table'
import { firstValueFrom, Subject } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { CoachRouteDropdownVM } from 'src/app/features/coachRoutes/classes/view-models/coachRoute-dropdown-vm'
import { CustomerDropdownVM } from './../../../customers/classes/view-models/customer-dropdown-vm'
import { DestinationDropdownVM } from './../../../destinations/classes/view-models/destination-dropdown-vm'
import { DestinationService } from 'src/app/features/destinations/classes/services/destination.service'
import { DriverDropdownVM } from './../../../drivers/classes/view-models/driver-dropdown-vm'
import { DriverReportService } from '../../classes/driver-report/services/driver-report.service'
import { DriverService } from 'src/app/features/drivers/classes/services/driver.service'
import { EmojiService } from './../../../../shared/services/emoji.service'
import { HelperService } from './../../../../shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PickupPointDropdownVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-dropdown-vm'
import { PortDropdownVM } from './../../../ports/classes/view-models/port-dropdown-vm'
import { ReservationGroupDto } from '../../classes/dtos/list/reservation-group-dto'
import { ReservationService } from './../../classes/services/reservation.service'
import { ReservationToDriverComponent } from '../reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToShipComponent } from '../reservation-to-ship/reservation-to-ship-form.component'
import { ShipRouteDropdownVM } from './../../../shipRoutes/classes/view-models/shipRoute-dropdown-vm'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { environment } from 'src/environments/environment'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

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
    private unsubscribe = new Subject<void>()
    public icon = 'arrow_back'
    private url = ''
    public feature = 'reservationList'
    public overbookedDestinations: any

    public isAdmin: boolean
    public highlighted: any
    public reservationGroupDto: ReservationGroupDto
    public selectedRecords = []
    public totals: any[] = []
    public areDestinationsOverbooked = []

    public dropdownCustomers: CustomerDropdownVM[] = []
    public dropdownDestinations: DestinationDropdownVM[] = []
    public dropdownDrivers: DriverDropdownVM[] = []
    public dropdownPickupPoints: PickupPointDropdownVM[] = []
    public dropdownPorts: PortDropdownVM[] = []
    public dropdownCoachRoutes: CoachRouteDropdownVM[] = []
    public dropdownShips: ShipRouteDropdownVM[] = []

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private destinationService: DestinationService, private driverReportService: DriverReportService, private driverService: DriverService, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private reservationService: ReservationService, private router: Router, private shipService: ShipService, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
                this.populateDropdowns()
                this.storeDate()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initPersonTotals()
        this.updateTotals()
        this.getConnectedUserRole()
        this.doDestinationForOverbookingTasks()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public assignToDriver(): void {
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
                        this.modalActionResultService.open(this.messageSnackbarService.success(), 'success', ['ok']).subscribe(() => {
                            this.clearSelectedRecords()
                            this.clearStorage(false, true)
                            this.refreshList()
                        })
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
                        this.modalActionResultService.open(this.messageSnackbarService.success(), 'success', ['ok']).subscribe(() => {
                            this.clearSelectedRecords()
                            this.clearStorage(false, true)
                            this.refreshList()
                        })
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

    public createPdf(): void {
        this.driverReportService.doReportTasks(this.getDistinctDriverIds(this.reservationGroupDto.reservations))
    }

    public doResetTableTasks(table): void {
        this.clearTableFilters(table)
        this.initPersonTotals()
        this.updateTotals()
    }

    public editRecord(id: string): void {
        this.localStorageService.saveItem('returnUrl', this.url)
        this.router.navigate([this.parentUrl, id])
    }

    public filterRecords(event?: { filteredValue: any[] }): void {
        setTimeout(() => {
            this.totals[0].sum = this.reservationGroupDto.persons
            this.totals[1].sum = event.filteredValue.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
            this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
        }, 500)
    }

    public formatDate(): string {
        if (this.localStorageService.getItem('date')) {
            return this.helperService.formatISODateToLocale(this.localStorageService.getItem('date'), true)
        } else {
            return '-'
        }
    }

    public formatRefNo(refNo: string): string {
        return this.helperService.formatRefNo(refNo, false)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public newRecord(): void {
        this.localStorageService.saveItem('returnUrl', this.url)
        this.router.navigate([this.parentUrl, 'new'])
    }

    public onGoBack(): void {
        this.router.navigate([this.parentUrl])
    }

    public rowSelect(event: { data: { totalPersons: any } }): void {
        this.totals[2].sum += event.data.totalPersons
    }

    public rowUnselect(event: { data: { totalPersons: number } }): void {
        this.totals[2].sum -= event.data.totalPersons
    }

    public toggleVisibleRows(): void {
        this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
    }

    //#endregion

    //#region private methods

    private clearSelectedRecords(): void {
        this.selectedRecords = []
    }

    private clearStorage(all: boolean, selectedRows: boolean): void {
        all ? this.localStorageService.clearSessionStorage('reservation-list', 'all') : null
        selectedRows ? this.localStorageService.clearSessionStorage('reservation-list', 'selected-rows') : null
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
            this.modalActionResultService.open(this.messageSnackbarService.noRecordsSelected(), 'error', ['ok'])
            return false
        }
        return true
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.reservationGroupDto = listResolved.list
                resolve(this.reservationGroupDto)
            } else {
                this.router.navigate([this.parentUrl])
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private getConnectedUserRole(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.accountService.isConnectedUserAdmin()).then((response) => {
                this.isAdmin = response
                resolve(this.isAdmin)
            })
        })
        return promise
    }

    private getDistinctDestinations(reservations: any[], field: any): any {
        const promise = new Promise((resolve) => {
            let activeDestinations = []
            let inter = []
            const elements = [... new Set(reservations.map(x => x[field]))]
            this.destinationService.getActiveForDropdown().subscribe(response => {
                activeDestinations = response
                inter = activeDestinations.filter(element => elements.includes(element.description))
                resolve(inter)
            })
        })
        return promise
    }

    private getDistinctDriverIds(reservations: any): any[] {
        const driverIds = []
        const x = [... new Set(reservations.map((x: { driverId: any }) => x.driverId))]
        x.forEach(element => {
            driverIds.push(element)
        })
        return driverIds
    }

    private doDestinationForOverbookingTasks(): void {
        this.getDistinctDestinations(this.reservationGroupDto.reservations, 'destinationDescription').then((response: any) => {
            this.overbookedDestinations = response
            this.overbookedDestinations.forEach((destination: { id: number }, index: string | number) => {
                this.reservationService.isDestinationOverbooked(this.localStorageService.getItem('date'), destination.id).subscribe((response) => {
                    this.overbookedDestinations[index].status = response
                })
            })
        })
    }

    private populateDropdowns(): void {
        this.dropdownCoachRoutes = this.helperService.populateTableFiltersDropdowns(this.reservationGroupDto.reservations, 'coachRouteAbbreviation')
        this.dropdownCustomers = this.helperService.populateTableFiltersDropdowns(this.reservationGroupDto.reservations, 'customerDescription')
        this.dropdownDestinations = this.helperService.populateTableFiltersDropdowns(this.reservationGroupDto.reservations, 'destinationDescription')
        this.dropdownDrivers = this.helperService.populateTableFiltersDropdowns(this.reservationGroupDto.reservations, 'driverDescription')
        this.dropdownPickupPoints = this.helperService.populateTableFiltersDropdowns(this.reservationGroupDto.reservations, 'pickupPointDescription')
        this.dropdownPorts = this.helperService.populateTableFiltersDropdowns(this.reservationGroupDto.reservations, 'portDescription')
        this.dropdownShips = this.helperService.populateTableFiltersDropdowns(this.reservationGroupDto.reservations, 'shipDescription')
    }

    private clearTableFilters(table: { clear: () => void }): void {
        table.clear()
        this.table.filter('', 'refNo', 'contains')
        this.table.filter('', 'ticketNo', 'contains')
        const boxes = document.querySelectorAll<HTMLInputElement>('.p-inputtext[type="text"]')
        boxes.forEach(box => {
            box.value = ''
        })
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

    private storeDate(): void {
        if (this.url.includes('byRefNo')) {
            if (this.reservationGroupDto.reservations.length > 0) {
                this.localStorageService.saveItem('date', this.reservationGroupDto.reservations[0].date)
            } else {
                this.localStorageService.deleteItems([
                    { 'item': 'date', 'when': 'always' }
                ])
            }
        }
    }

    private updateTotals(): void {
        Promise.resolve(null).then(() => {
            this.totals[0].sum = this.reservationGroupDto.persons
            this.totals[1].sum = this.reservationGroupDto.reservations.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
            this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
        })
    }

    //#endregion

}
