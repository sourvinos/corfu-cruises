import { HelperService } from './../../../../shared/services/helper.service'
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Title } from '@angular/platform-browser'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { DriverPdfService } from '../../classes/services/driver-pdf.service'
import { DriverService } from 'src/app/features/drivers/classes/driver.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ReservationGroupResource } from '../../classes/resources/list/reservation-group-resource'
import { ReservationService } from '../../classes/services/reservation.service'
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

    private ngUnsubscribe = new Subject<void>()
    private resolver = 'reservationList'
    private unlisten: Unlisten
    private windowTitle = 'Reservations'
    public feature = 'reservationList'
    public destinations = []
    public routes = []
    public customers = []
    public pickupPoints = []
    public drivers = []
    public ports = []
    public ships = []

    private date: string
    private mustRefreshReservationList = true
    public activePanel: string
    public records = new ReservationGroupResource()
    public totals: any[] = []
    private baseUrl = '/reservations'


    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private reservationService: ReservationService, private buttonClickService: ButtonClickService, private driverService: DriverService, private helperService: HelperService, private interactionService: InteractionService, private keyboardShortcutsService: KeyboardShortcuts, private location: Location, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private pdfService: DriverPdfService, private router: Router, private scheduleService: ScheduleService, private shipService: ShipService, private snackbarService: SnackbarService, private titleService: Title, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe((params: Params) => this.date = params['date'])
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && this.date !== '' && this.router.url.split('/').length === 4) {
                this.mustRefreshReservationList = true
                this.loadRecords()
                this.populateDropdowns()
                this.onFocusSummaryPanel()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setWindowTitle()
        this.addShortcuts()
        this.initPersonsSumArray()
        this.onFocusSummaryPanel()
    }

    ngAfterViewInit(): void {
        // if (this.isDataInLocalStorage()) {
        //     this.updateSelectedArraysFromLocalStorage()
        // } else {
        //     this.updateSelectedArraysFromInitialResults()
        //     this.saveSelectedItemsToLocalStorage()
        // }
        // this.addActiveClassToSummaryItems()
        // this.filterByCriteria()
        // this.initCheckedPersons()
        this.updateTotals()
        // this.updateParentCheckboxes()
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
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public onAssignToDriver(): void {
        if (this.isAnyRowSelected()) {
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
                    // this.reservationService.assignToDriver(result, this.records.reservations).subscribe(() => {
                    this.removeSelectedIdsFromLocalStorage()
                    this.navigateToList()
                    this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
                    // })
                }
            })
        }
    }

    public onAssignToShip(): void {
        if (this.isAnyRowSelected()) {
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
                    // this.reservationService.assignToShip(result, this.records.reservations).subscribe(() => {
                    this.removeSelectedIdsFromLocalStorage()
                    this.navigateToList()
                    this.showSnackbar(this.messageSnackbarService.selectedRecordsHaveBeenProcessed(), 'info')
                    // })
                }
            })
        }
    }

    public onCreatePdf(): void {
        this.pdfService.createReport(this.records.reservations, this.getDriversFromLocalStorage(), this.date)
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

    private goBack(): void {
        this.router.navigate(['/reservations'])
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



    private determinePanelToFocus(): void {
        console.log('2. focusing')
        const panelToFocus = this.helperService.readItem('focusOnTheList')
        if (panelToFocus == 'true') {
            this.onFocusListPanel()
        } else {
            this.onFocusSummaryPanel()
        }
    }

    public onEditRecord(id: number): void {
        this.router.navigate([this.baseUrl, id])
    }

    private getDriversFromLocalStorage(): any {
        const localStorageData = JSON.parse(this.helperService.readItem('reservations'))
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

    private isAdmin(): boolean {
        let isAdmin = false
        this.accountService.currentUserRole.subscribe(result => {
            isAdmin = result.toLowerCase() == 'admin'
        })
        return isAdmin
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
            this.records = listResolved.result
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private navigateToList(): void {
        this.router.navigate(['reservations/date/', this.helperService.readItem('date')])
    }

    private removeSelectedIdsFromLocalStorage(): void {
        localStorage.removeItem('selectedIds')
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private updateTotals(): void {
        // this.totals[0].sum = this.queryResult.persons
        // this.totals[1].sum = this.queryResultClone.reservations.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
        // this.interactionService.checked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        // this.totals[2].sum = result
        // })
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

    //#endregion

}
