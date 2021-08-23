import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DriverPdfService } from '../../classes/services/driver-pdf.service'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { HelperService } from './../../../../shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ReservationGroupResource } from '../../classes/resources/list/reservation-group-resource'
import { ReservationService } from './../../classes/services/reservation.service'
import { ReservationToDriverComponent } from '../reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToVesselComponent } from '../reservation-to-vessel/reservation-to-vessel-form.component'
import { ScheduleService } from 'src/app/features/schedules/classes/schedule.service'
import { ShipService } from 'src/app/features/ships/base/classes/ship.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'reservation-list',
    templateUrl: './reservation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './reservation-list.component.css', '../../../../../assets/styles/summaries.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ReservationListComponent {

    //#region variables

    private baseUrl = '/reservations'
    private date: string
    private ngUnsubscribe = new Subject<void>()
    private resolver = 'reservationList'
    private unlisten: Unlisten
    private windowTitle = 'Reservations'
    public activePanel: string
    public customers = []
    public destinations = []
    public drivers = []
    public feature = 'reservationList'
    public highlighted: any
    public pickupPoints = []
    public ports = []
    public records = new ReservationGroupResource()
    public routes = []
    public selectedRecords = []
    public ships = []
    public totals: any[] = []
    public downArrow: boolean[] = []
    public upArrow: boolean[] = []

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private driverService: DriverService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pdfService: DriverPdfService, private reservationService: ReservationService, private router: Router, private scheduleService: ScheduleService, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.loadRecords()
                this.onFocusSummaryPanel()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.populateDropdowns()
        this.addShortcuts()
        this.initPersonsSumArray()
        this.onFocusSummaryPanel()
    }

    ngAfterViewInit(): void {
        this.updateTotals()
        this.showDownArrow(0, 'destinations')
        this.showDownArrow(1, 'customers')
        this.showDownArrow(2, 'routes')
        this.showDownArrow(3, 'drivers')
        this.showDownArrow(4, 'ports')
        this.showDownArrow(5, 'ships')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onAssignToDriver(): void {
        if (this.isAnyRowSelected()) {
            this.saveSelectedIds()
            const dialogRef = this.dialog.open(ReservationToDriverComponent, {
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
                    this.reservationService.assignToDriver(result, this.selectedRecords).subscribe(() => {
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
            this.saveSelectedIds()
            const dialogRef = this.dialog.open(ReservationToVesselComponent, {
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
                    this.reservationService.assignToShip(result, this.selectedRecords).subscribe(() => {
                        this.removeSelectedIdsFromLocalStorage()
                        this.navigateToList()
                        this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
                    })
                }
            })
        }
    }

    public onEditRecord(id: string): void {
        this.router.navigate([this.baseUrl, id])
    }

    public onResetTable(table: { reset: () => void }): void {
        this.resetTable(table)
        this.clearCheckboxes()
        this.clearHighlights()
        this.emptySelectedRecords()
        this.updateTotals()
    }

    public onCreatePdf(): void {
        this.pdfService.createReport(this.records.reservations, this.drivers, this.onGetStoredDate())
    }

    public onFilter(event?: { filteredValue: any[] }): void {
        setTimeout(() => {
            this.totals[0].sum = this.records.persons
            this.totals[1].sum = event.filteredValue.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
            this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
        }, 500)
    }

    public onFocusListPanel(): void {
        this.activePanel = 'list'
        document.getElementById('summaryTab').classList.remove('active')
        document.getElementById('listTab').classList.add('active')
        document.getElementById('table-wrapper').style.display = 'block'
    }

    public onFocusSummaryPanel(): void {
        this.activePanel = 'summary'
        document.getElementById('summaryTab').classList.add('active')
        document.getElementById('listTab').classList.remove('active')
        document.getElementById('table-wrapper').style.display = 'none'
    }

    public onGetStoredDate(): string {
        const dashboard = JSON.parse(this.helperService.readItem('dashboard'))
        return this.helperService.formatDateToLocale(dashboard.date)
    }

    public onGetLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onMustBeAdmin(): boolean {
        return this.isAdmin()
    }

    public onNew(): void {
        this.scheduleService.getForDate(this.date).then(result => {
            if (result) {
                document.getElementById('listTab').click()
                this.router.navigate([this.baseUrl, 'new'])
            } else {
                this.showSnackbar(this.messageSnackbarService.noScheduleFound(), 'error')
            }
        })
    }

    public scrollToBottom(element: string): void {
        const el = document.getElementById(element)
        el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight)
    }

    public scrollToTop(element: string): void {
        const el = document.getElementById(element)
        el.scrollTop = Math.max(0, 0)
    }

    public onRowSelect(event: any): void {
        this.totals[2].sum += event.data.totalPersons
    }

    public onRowUnselect(event: any): void {
        this.totals[2].sum -= event.data.totalPersons
    }

    public onToggleVisibleRows(): void {
        this.totals[2].sum = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
    }

    public onWindowScroll(index: string | number, event?: { target: { scrollTop: number; clientHeight: any; scrollHeight: number } }): void {
        this.upArrow[index] = event.target.scrollTop > 0 ? true : false
        this.downArrow[index] = event.target.clientHeight + event.target.scrollTop < event.target.scrollHeight ? true : false
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.goBack()
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

    private clearCheckboxes(): void {
        const items = document.querySelectorAll('.pi-check')
        items.forEach(item => {
            item.classList.remove('pi', 'pi-check')
        })
    }

    private clearHighlights(): void {
        const item = document.querySelectorAll('tr.p-highlight')
        item.forEach(item => {
            item.classList.remove('p-highlight')
        })
    }

    private determinePanelToFocus(): void {
        const panelToFocus = this.helperService.readItem('focusOnTheList')
        if (panelToFocus == 'true') {
            this.onFocusListPanel()
        } else {
            this.onFocusSummaryPanel()
        }
    }

    private emptySelectedRecords(): void {
        this.selectedRecords = []
    }

    private getDriversFromLocalStorage(): any {
        const localStorageData = JSON.parse(this.helperService.readItem('reservations'))
        return JSON.parse(localStorageData.drivers)
    }

    private initPersonsSumArray(): void {
        this.totals.push(
            { description: 'total', sum: 0 },
            { description: 'displayed', sum: 0 },
            { description: 'selected', sum: 0 },
            { description: 'filtered', sum: 0 }
        )
    }

    private isAdmin(): boolean {
        let isAdmin = false
        this.accountService.currentUserRole.subscribe(result => {
            isAdmin = result.toLowerCase() == 'admin'
        })
        return isAdmin
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

    private navigateToList(): void {
        const criteria = JSON.parse(this.helperService.readItem('dashboard'))
        const date = this.helperService.formatDateToISO(criteria.date)
        this.router.navigate(['reservations/date/', date])
    }

    private goBack(): void {
        this.router.navigate(['/reservations'])
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

    private resetTable(table: { reset: () => void }): void {
        table.reset()
    }

    private saveSelectedIds(): void {
        const ids = []
        this.selectedRecords.forEach(record => {
            ids.push(record.reservationId)
        })
        this.helperService.saveItem('selectedIds', JSON.stringify(ids))
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showDownArrow(index: number, element: string): void {
        const div = document.getElementById(element)
        Promise.resolve(null).then(() => {
            this.downArrow[index] = div.clientHeight + div.scrollTop < div.scrollHeight ? true : false
        })
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
