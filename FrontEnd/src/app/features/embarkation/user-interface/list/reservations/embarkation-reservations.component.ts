import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core'
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
import { EmbarkationPassengerVM } from '../../../classes/view-models/list/embarkation-passenger-vm'
import { EmbarkationService } from '../../../classes/services/embarkation.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
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
    private response: any
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private dateAdapter: DateAdapter<any>,
        private dateHelperService: DateHelperService,
        private dialogService: DialogService,
        private embarkationDisplayService: EmbarkationService,
        private embarkationPDFService: EmbarkationPDFService,
        private emojiService: EmojiService,
        private helperService: HelperService,
        private localStorageService: LocalStorageService,
        private messageLabelService: MessageLabelService,
        private messageSnackbarService: MessageSnackbarService,
        private modalActionResultService: ModalActionResultService,
        private router: Router,
        public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords().then(() => {
                    this.populateDropdownFilters()
                    this.enableDisableFilters()
                    this.updateTotals(this.totals, this.records.reservations)
                    this.updateTotals(this.totalsFiltered, this.records.reservations)
                })
                this.populateCriteriaPanelsFromStorage()
                this.getLocale()
            }
        })
    }

    //#region lifecycle hooks

    ngAfterContentChecked(): void {
        this.cd.detectChanges()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public filterRecords(event: { filteredValue: any[] }): void {
        this.updateTotals(this.totalsFiltered, event.filteredValue)
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
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

    public getStatusText(reservationStatus: string): string {
        switch (reservationStatus) {
            case 'OK':
                return this.getEmoji('green-circle')
            case 'PENDING':
                return this.getEmoji('red-circle')
            default:
                return this.getEmoji('yellow-circle')
        }
    }

    public goBack(): void {
        this.router.navigate([this.url])
    }

    public hasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public createPdf(): void {
        this.embarkationPDFService.createPDF(this.records.reservations)
    }


    public embarkAllPassengers(ignoreCurrentStatus: boolean, id: number[]): void {
        this.embarkationDisplayService.embarkPassengers(ignoreCurrentStatus, id).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.refreshList()
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', '', false, false)
            }
        })
    }

    public onShowScanner(): void {
        this.searchByTicketNo = ''
        this.scannerEnabled = true
        setTimeout(() => {
            this.positionVideo()
        }, 1000)
    }

    public calculateDifference(totalPersons: number, passengerCount: number): string {
        if (totalPersons > passengerCount) {
            return this.emojiService.getEmoji('warning')
        }
        if (totalPersons == passengerCount) {
            return this.emojiService.getEmoji('ok')
        }
        if (totalPersons < passengerCount) {
            return this.emojiService.getEmoji('error')
        }
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['refNo', 'ticketNo', 'totalPersons'])
    }

    public showPassengers(passengers: EmbarkationPassengerVM): void {
        const response = this.dialog.open(EmbarkationPassengerListComponent, {
            height: '600px',
            width: '1000px',
            data: {
                passengers: passengers,
                actions: ['abort', 'ok']
            },
            panelClass: 'dialog'
        })
        response.afterClosed().subscribe(result => {
            if (result !== undefined) {
                console.log('Updating embarkation status icon')
            }
        })
    }

    public showRemarks(remarks: string): void {
        this.dialogService.open(remarks, 'info', ['ok'])
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

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                console.log(this.records)
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

    private positionVideo(): void {
        document.getElementById('video').style.left = (window.outerWidth / 2) - 320 + 'px'
        document.getElementById('video').style.top = (document.getElementById('wrapper').clientHeight / 2) - 240 + 'px'
        document.getElementById('video').style.display = 'flex'
    }

    public refreshList(): void {
        this.router.navigate([this.url])
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
