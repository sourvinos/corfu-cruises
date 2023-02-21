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
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
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
    public isVirtual = true
    private scrollableElement: any

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
    public distinctEmbarkationStatuses: string[]

    public url = '/embarkation/list'
    public scannerEnabled: boolean
    public searchByTicketNo: string

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private embarkationPDFService: EmbarkationPDFService, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.isVirtual = true
                this.loadRecords().then(() => {
                    this.isVirtual = false
                    this.populateDropdownFilters()
                    this.filterTableFromStoredFilters()
                    this.updateTotals('totals', this.records.reservations)
                    this.updateTotals('totalsFiltered', this.records.reservations)
                    this.hightlightSavedRow()
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
        this.getScrollerElement()
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
        this.updateTotals('totalsFiltered', event.filteredValue)
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getEmbarkationStatusDescription(reservationStatus: SimpleEntity): string {
        switch (reservationStatus.id) {
            case 1:
                return this.getLabel('boardedFilter')
            case 2:
                return this.getLabel('pendingFilter')
            case 3:
                return this.getLabel('indeterminateFilter')
        }
    }

    public getEmbarkationStatusIcon(reservationStatus: SimpleEntity): string {
        switch (reservationStatus.id) {
            case 1:
                return this.getEmoji('green-circle')
            case 2:
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

    public isListFiltered(): boolean {
        const filters = this.localStorageService.getItem(this.feature)
        if (filters != undefined && filters != '') {
            const x = []
            for (const i in JSON.parse(filters)) {
                x.push(JSON.parse(filters)[i])
            }
            return x.filter(({ value }) => value != null).length != 0
        }
        return false
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['refNo', 'ticketNo', 'totalPersons'])
    }

    public showPassengers(reservation: EmbarkationVM): void {
        this.storeScrollTop()
        this.storeSelectedRefNo(reservation)
        this.highlightRow()
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
            this.helperService.disableTableFilters()
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
                this.filterColumn(filters.embarkationStatusDescription, 'embarkationStatusDescription', 'in')
                this.filterColumn(filters.refNo, 'refNo', 'contains')
                this.filterColumn(filters.ticketNo, 'ticketNo', 'contains')
                this.filterColumn(filters.destinationDescription, 'destinationDescription', 'in')
                this.filterColumn(filters.customerDescription, 'customerDescription', 'in')
                this.filterColumn(filters.pickupPointDescription, 'pickupPointDescription', 'in')
                this.filterColumn(filters.driverDescription, 'driverDescription', 'in')
                this.filterColumn(filters.portDescription, 'portDescription', 'in')
                this.filterColumn(filters.shipDescription, 'shipDescription', 'in')
                this.filterColumn(filters.embarkationStatus, 'embarkationStatus', 'in')
                this.filterColumn(filters.totalPersons, 'totalPersons', 'contains')
            }, 500)
        }
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private getScrollerElement(): void {
        this.scrollableElement = document.getElementsByClassName('p-datatable-wrapper')[0]
    }

    private highlightRow(): void {
        document.getElementById(this.localStorageService.getItem('refNo'))?.classList.add('p-highlight')
    }

    private hightlightSavedRow(): void {
        setTimeout(() => {
            this.scrollToSavedPosition()
            this.highlightRow()
        }, 1000)
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
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
        return promise
    }

    private populateCriteriaPanelsFromStorage(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            this.criteriaPanels = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
        }
    }

    private populateDropdownFilters(): void {
        this.distinctCustomers = this.helperService.getDistinctRecords(this.records.reservations, 'customer', 'description')
        this.distinctDestinations = this.helperService.getDistinctRecords(this.records.reservations, 'destination', 'description')
        this.distinctDrivers = this.helperService.getDistinctRecords(this.records.reservations, 'driver', 'description')
        this.distinctPickupPoints = this.helperService.getDistinctRecords(this.records.reservations, 'pickupPoint', 'description')
        this.distinctPorts = this.helperService.getDistinctRecords(this.records.reservations, 'port', 'description')
        this.distinctShips = this.helperService.getDistinctRecords(this.records.reservations, 'ship', 'description')
        this.distinctEmbarkationStatuses = this.helperService.getDistinctRecords(this.records.reservations, 'embarkationStatus', 'description')
    }

    private positionVideo(): void {
        document.getElementById('video').style.left = (window.outerWidth / 2) - 320 + 'px'
        document.getElementById('video').style.top = (document.getElementById('wrapper').clientHeight / 2) - 240 + 'px'
        document.getElementById('video').style.display = 'flex'
    }

    private scrollToSavedPosition(): void {
        this.scrollableElement.scrollTop = parseInt(this.localStorageService.getItem('scrollTop')) | 0
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
        this.localStorageService.saveItem('scrollTop', this.scrollableElement.scrollTop)
    }

    private updateTotals(totalsArray: string, reservations: any[]): void {
        const x = [0, 0, 0]
        reservations.forEach(reservation => {
            x[0] += reservation.totalPersons
        })
        reservations.reduce((_, reservation) => {
            const embarkedPassengers = reservation.passengers.filter(({ isCheckedIn }) => isCheckedIn)
            if (embarkedPassengers.length > 0) {
                x[1] += embarkedPassengers.length
            }
        }, [])
        x[2] = x[0] - x[1]
        this[totalsArray] = x
    }

    //#endregion

}
