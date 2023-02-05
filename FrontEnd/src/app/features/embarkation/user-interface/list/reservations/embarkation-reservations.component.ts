import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmbarkationCriteriaVM } from '../../../classes/view-models/criteria/embarkation-criteria-vm'
import { EmbarkationGroupVM } from '../../../classes/view-models/list/embarkation-group-vm'
import { EmbarkationPDFService } from '../../../classes/services/embarkation-pdf.service'
import { EmbarkationPassengerListComponent } from '../passengers/embarkation-passengers.component'
import { EmbarkationVM } from '../../../classes/view-models/list/embarkation-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../../shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'embarkation-reservations',
    templateUrl: './embarkation-reservations.component.html',
    styleUrls: ['../../../../../../assets/styles/lists.css', './embarkation-reservations.component.css', '../../../../../../assets/styles/criteria-panel.css']
})

export class EmbarkationReservationsComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    public feature = 'embarkationList'
    public featureIcon = 'embarkation'
    public icon = 'arrow_back'
    public parentUrl = '/embarkation'

    public criteriaPanels: EmbarkationCriteriaVM

    public records: EmbarkationGroupVM
    public totals = [0, 0, 0]
    public totalsFiltered = [0, 0, 0]

    public distinctCustomers: string[]
    public distinctDestinations: string[]
    public distinctDrivers: string[]
    public distinctPickupPoints: string[]
    public distinctPorts: string[]
    public distinctShips: string[]
    public distinctEmbarkationStates: any[]

    public url = '/embarkation/list'
    public scannerEnabled: boolean
    public searchByTicketNo: string
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private embarkationPDFService: EmbarkationPDFService, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords().then(() => {
                    this.scrollToSavedRow().then(() => {
                        this.highlightRowFromStorage()
                        this.populateDropdownFilters()
                        this.filterTableFromStoredFilters()
                        this.updateTotals(this.totals, this.records.reservations)
                        this.updateTotals(this.totalsFiltered, this.records.reservations)
                    })
                })
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateCriteriaPanelsFromStorage()
        this.getLocale()
    }

    ngAfterViewInit(): void {
        this.enableDisableFilters()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public createPdf(): void {
        this.embarkationPDFService.createPDF(this.records.reservations)
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
        this.updateTotals(this.totalsFiltered, event.filteredValue)
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getEmbarkationStatusIcon(reservationStatus: string): string {
        switch (reservationStatus) {
            case 'OK':
                return this.getEmoji('green-circle')
            case 'PENDING':
                return this.getEmoji('red-circle')
            default:
                return this.getEmoji('yellow-circle')
        }
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

    public goBack(): void {
        this.router.navigate([this.url])
    }

    public hasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public calculateDifference(totalPersons: number, embarkedPassengers: number): string {
        if (totalPersons > embarkedPassengers) {
            return this.emojiService.getEmoji('warning')
        }
        if (totalPersons == embarkedPassengers) {
            return this.emojiService.getEmoji('ok')
        }
        if (totalPersons < embarkedPassengers) {
            return this.emojiService.getEmoji('error')
        }
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['refNo', 'ticketNo', 'totalPersons'])
    }

    public showPassengers(reservation: EmbarkationVM): void {
        this.storeScrollTop()
        this.storeSelectedRefNo(reservation)
        this.highlightRow(reservation)
        this.showPassengersDialog(reservation)
    }

    public showRemarks(remarks: string): void {
        this.dialogService.open(remarks, 'info', 'center-buttons', ['ok'])
    }

    public showScannerWindow(): void {
        this.searchByTicketNo = ''
        this.scannerEnabled = true
        setTimeout(() => {
            this.positionVideo()
        }, 1000)
    }

    public unHighlightAllRows(): void {
        this.helperService.unHighlightAllRows()
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private enableDisableFilters(): void {
        if (this.records.reservations.length == 0) {
            this.helperService.disableTableDropdownFilters()
            this.helperService.disableTableTextFilters()
        }
    }

    private filterColumn(element: { value: any }, field: string, matchMode: string): void {
        if (element != undefined && (element.value != null || element.value != undefined)) {
            this.table.filter(element.value, field, matchMode)
        }
    }

    private filterTableFromStoredFilters(): void {
        const filters = this.localStorageService.getFilters(this.feature)
        if (filters != undefined) {
            setTimeout(() => {
                this.filterColumn(filters.refNo, 'refNo', 'contains')
                this.filterColumn(filters.ticketNo, 'ticketNo', 'contains')
                this.filterColumn(filters.destinationDescription, 'destinationDescription', 'equals')
                this.filterColumn(filters.customerDescription, 'customerDescription', 'equals')
                this.filterColumn(filters.pickupPointDescription, 'pickupPointDescription', 'equals')
                this.filterColumn(filters.driverDescription, 'driverDescription', 'equals')
                this.filterColumn(filters.portDescription, 'portDescription', 'equals')
                this.filterColumn(filters.shipDescription, 'shipDescription', 'equals')
                this.filterColumn(filters.embarkationStatus, 'embarkationStatus', 'equals')
                this.filterColumn(filters.totalPersons, 'totalPersons', 'contains')
            }, 500)
        }
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private highlightRow(reservation: EmbarkationVM): void {
        document.getElementById(reservation.refNo)?.classList.add('p-highlight')
    }

    private highlightRowFromStorage(): void {
        setTimeout(() => {
            document.getElementById(this.localStorageService.getItem('refNo'))?.classList.add('p-highlight')
        }, 1000)
    }

    private loadRecords(): Promise<any> {
        return new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                    this.goBack()
                })
            }
        })
    }

    private populateCriteriaPanelsFromStorage(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            this.criteriaPanels = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
        }
    }

    private populateDropdownFilters(): void {
        if (this.records != null) {
            this.distinctCustomers = this.helperService.getDistinctRecords(this.records.reservations, 'customerDescription')
            this.distinctDestinations = this.helperService.getDistinctRecords(this.records.reservations, 'destinationDescription')
            this.distinctDrivers = this.helperService.getDistinctRecords(this.records.reservations, 'driverDescription')
            this.distinctPickupPoints = this.helperService.getDistinctRecords(this.records.reservations, 'pickupPointDescription')
            this.distinctPorts = this.helperService.getDistinctRecords(this.records.reservations, 'portDescription')
            this.distinctShips = this.helperService.getDistinctRecords(this.records.reservations, 'shipDescription')
            this.distinctEmbarkationStates = [
                { label: this.getLabel('boardedFilter'), value: 'OK' },
                { label: this.getLabel('pendingFilter'), value: 'PENDING' }
            ]
        }
    }

    private positionVideo(): void {
        document.getElementById('video').style.left = (window.outerWidth / 2) - 320 + 'px'
        document.getElementById('video').style.top = (document.getElementById('wrapper').clientHeight / 2) - 240 + 'px'
        document.getElementById('video').style.display = 'flex'
    }

    private scrollToSavedRow(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                document.getElementsByClassName('p-scroller-inline')[0]?.scrollTo({
                    top: parseInt(this.localStorageService.getItem('scrollTop')) || 0,
                    left: 0,
                    behavior: 'auto'
                })
                resolve(null)
            }, 0)
        })
    }

    private showPassengersDialog(reservation: EmbarkationVM): void {
        const response = this.dialog.open(EmbarkationPassengerListComponent, {
            data: {
                reservation: reservation
            },
            disableClose: true,
            height: '500px',
            panelClass: 'dialog',
            width: '800px',
        })
        response.afterClosed().subscribe(result => {
            if (result !== undefined && result == true) {
                this.router.navigate([this.url])
            }
        })
    }

    private storeSelectedRefNo(reservation: EmbarkationVM): void {
        this.localStorageService.saveItem('refNo', reservation.refNo)
    }

    private storeScrollTop(): void {
        this.helperService.storeScrollTop('p-scroller-inline')
    }

    private updateTotals(totals: number[], filteredValue: any[]): void {
        totals[0] = 0
        totals[1] = 0
        totals[2] = 0
        filteredValue.forEach(reservation => {
            totals[0] += reservation.totalPersons
            if (reservation.passengers && reservation.passengers.length > 0) {
                totals[1] += reservation.passengers.filter((x: { isCheckedIn: any }) => x.isCheckedIn).length
            }
        })
        totals[2] = totals[0] - totals[1]
    }

    //#endregion

}
