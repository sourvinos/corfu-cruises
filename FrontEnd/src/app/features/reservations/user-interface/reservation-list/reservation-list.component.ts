import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { DriverPdfService } from '../../classes/services/driver-pdf.service'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { EmojiService } from './../../../../shared/services/emoji.service'
import { HelperService } from './../../../../shared/services/helper.service'
import { MenuItem, MessageService } from 'primeng/api'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ReservationGroupResource } from '../../classes/resources/list/reservation-group-resource'
import { ReservationService } from './../../classes/services/reservation.service'
import { ReservationToDriverComponent } from '../reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToVesselComponent } from '../reservation-to-vessel/reservation-to-vessel-form.component'
import { ShipService } from 'src/app/features/ships/base/classes/services/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { Table } from 'primeng/table'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'reservation-list',
    templateUrl: './reservation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './reservation-list.component.css'],
    animations: [slideFromLeft, slideFromRight],
    providers: [MessageService]
})

export class ReservationListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private baseUrl = '/reservations'
    private url = ''
    private isoDate = ''
    private ngUnsubscribe = new Subject<void>()
    private resolver = 'reservationList'
    private windowTitle = 'Reservations'
    public activePanel: string
    public customers = []
    public destinations = []
    public drivers = []
    public feature = 'reservationList'
    public highlighted: any
    public items: MenuItem[]
    public pickupPoints = []
    public ports = []
    public records = new ReservationGroupResource()
    public routes = []
    public selectedRecords = []
    public ships = []
    public today: string
    public totals: any[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private driverService: DriverService, private emojiService: EmojiService, private helperService: HelperService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private driverPDFService: DriverPdfService, private reservationService: ReservationService, private router: Router, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.initPersonTotals()
        this.updateTotals()
        this.populateDropdowns()
        this.updateDates()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public assignToDriver(): void {
        if (this.isAnyRowSelected()) {
            this.saveSelectedIds()
            const dialogRef = this.dialog.open(ReservationToDriverComponent, {
                height: '350px',
                width: '550px',
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
            const dialogRef = this.dialog.open(ReservationToVesselComponent, {
                height: '350px',
                width: '550px',
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

    public calculateTotals(event?: { filteredValue: any[] }): void {
        setTimeout(() => {
            this.totals[0].sum = this.records.persons
            this.totals[1].sum = event.filteredValue.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
            this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
        }, 500)
    }

    public createPdf(): void {
        this.driverPDFService.createDriverReport(this.records.reservations, this.drivers, this.today)
    }

    public doResetTableTasks(table: { reset: () => void }): void {
        this.clearFilterTextboxes()
        this.resetTable(table)
        this.clearCheckboxes()
        this.clearSelectedRecords()
        this.updateTotals()
    }

    public editRecord(id: string): void {
        this.router.navigate([this.baseUrl, id], { queryParams: { returnUrl: this.baseUrl + '/byDate/' + this.isoDate } })
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
        this.router.navigate([this.baseUrl, 'new'], { queryParams: { returnUrl: this.baseUrl + '/byDate/' + this.isoDate } })
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

    private goBack(): void {
        this.router.navigate([this.baseUrl])
    }

    private populateDropdowns(): void {
        this.destinations = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'destinationDescription')
        this.routes = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'routeAbbreviation')
        this.routes = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'routeAbbreviation')
        this.customers = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'customerDescription')
        this.pickupPoints = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'pickupPointDescription')
        this.drivers = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'driverDescription')
        this.ports = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'portDescription')
        this.ships = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'shipDescription')
    }

    private removeSelectedIdsFromLocalStorage(): void {
        localStorage.removeItem('selectedIds')
    }

    private updateDates(): void {
        this.isoDate = this.helperService.readItem('date')
        this.today = this.helperService.readItem('date')
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

    private updateTotals(): void {
        Promise.resolve(null).then(() => {
            this.totals[0].sum = this.records.persons
            this.totals[1].sum = this.records.reservations.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
            this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
        })
    }

    //#endregion

}
