import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { CustomerActiveVM } from 'src/app/features/customers/classes/view-models/customer-active-vm'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { DriverActiveVM } from 'src/app/features/drivers/classes/view-models/driver-active-vm'
import { EmbarkationGroupVM } from '../../classes/view-models/embarkation-group-vm'
import { EmbarkationPDFService } from '../../classes/services/embarkation-pdf.service'
import { EmbarkationService } from '../../classes/services/embarkation-display.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ShipActiveVM } from 'src/app/features/ships/classes/view-models/ship-active-vm'
import { environment } from 'src/environments/environment'
import { EmbarkationCriteriaVM } from '../../classes/view-models/embarkation-criteria-vm'

@Component({
    selector: 'embarkation-list',
    templateUrl: './embarkation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './embarkation-list.component.css']
})

export class EmbarkationListComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    public feature = 'embarkationList'
    public featureIcon = 'embarkation'
    public icon = 'arrow_back'
    public parentUrl = '/embarkation'
    public url = '/embarkation/list'

    public criteria: EmbarkationCriteriaVM
    public filteredRecords: EmbarkationGroupVM
    public isLoading = new Subject<boolean>()
    public records: EmbarkationGroupVM

    public dropdownCustomers: CustomerActiveVM[] = []
    public dropdownDestinations: DestinationActiveVM[] = []
    public dropdownDrivers: DriverActiveVM[] = []
    public dropdownPorts: PortActiveVM[] = []
    public dropdownShips: ShipActiveVM[] = []
    public dropdownEmbarkationStatuses = []
    public scannerEnabled: boolean
    public searchByTicketNo: string

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private embarkationDisplayService: EmbarkationService, private embarkationPDFService: EmbarkationPDFService, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
                this.updatePassengerStatusPills()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.updatePassengerStatusPills()
        this.populateCriteriaFromStorage()
        this.populateDropdownFilters()
        this.getDistinctEmbarkationStatus()
        this.getLocale()
    }

    ngAfterContentChecked(): void {
        this.cd.detectChanges()
    }

    ngAfterViewInit(): void {
        this.enableDisableFilters()
        this.dontScrollToTop()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public camerasFound(): void {
        console.log('Camera list')
    }

    public doPostScanTasks(event: string): void {
        this.scannerEnabled = false
        document.getElementById('video').style.display = 'none'
        this.filterByTicketNo(event)
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.filteredRecords.reservations = event.filteredValue
    }

    public formatDateToLocale(date: string, showWeekday: boolean): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, false)
    }

    public getDestinationDescriptions(): string {
        return this.criteria.destinations.map((destination: { description: any }) => destination.description).join(' ▪️ ')
    }

    public getPortDescriptions(): string {
        return this.criteria.ports.map((port: { description: any }) => port.description).join(' ▪️ ')
    }

    public getShipDescriptions(): string {
        return this.criteria.ships.map((ship: { description: any }) => ship.description).join(' ▪️ ')
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

    public hasDevices(): void {
        console.log('Devices found')
    }

    public hasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public doReportTasks(): void {
        this.embarkationPDFService.createPDF(this.filteredRecords.reservations)
    }

    public embarkPassenger(id: number): void {
        const ids = []
        ids.push(id)
        this.embarkAllPassengers(false, ids)
    }

    public embarkAllPassengers(ignoreCurrentStatus: boolean, id: number[]): void {
        this.embarkationDisplayService.embarkAllPassengers(ignoreCurrentStatus, id).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.refreshList()
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', '', false, false)
            }
        })
    }

    public onHideScanner(): void {
        this.scannerEnabled = false
        document.getElementById('video').style.display = 'none'
    }

    public onShowScanner(): void {
        this.searchByTicketNo = ''
        this.scannerEnabled = true
        setTimeout(() => {
            this.positionVideo()
        }, 1000)
    }

    public onShowRemarks(remarks: string): void {
        this.dialogService.open(remarks, 'info', ['ok'])
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

    public showEmbarkationStatus(embarkationStatus: any): string {
        return embarkationStatus ? this.emojiService.getEmoji('ok') : this.emojiService.getEmoji('warning')
    }

    public shouldDisableResetFiltersButton(): any {
        return this.records.reservations.length == 0 || this.filteredRecords.reservations.length == this.records.reservations.length
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private dontScrollToTop(): void {
        this.helperService.dontScrollToTop(this.table)
    }

    private enableDisableFilters(): void {
        if (this.records.reservations.length == 0) {
            this.helperService.disableTableDropdownFilters()
            this.helperService.disableTableTextFilters()
        }
    }

    private filterByTicketNo(query: string): void {
        this.filteredRecords.reservations = []
        this.records.reservations.forEach((record) => {
            if (record.ticketNo.toLowerCase().startsWith(query.toLowerCase())) {
                this.filteredRecords.reservations.push(record)
            }
        })
    }

    private getDistinctEmbarkationStatus(): void {
        this.dropdownEmbarkationStatuses = []
        this.dropdownEmbarkationStatuses.push({ label: this.getLabel('boardedFilter'), value: 'OK' })
        this.dropdownEmbarkationStatuses.push({ label: this.getLabel('pendingFilter'), value: 'PENDING' })
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = listResolved.result
            this.filteredRecords = Object.assign([], this.records)
            console.log(this.records)
        } else {
            this.goBack()
            this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
        }
    }

    private populateCriteriaFromStorage(): void {
        if (this.localStorageService.getItem('embarkation-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('embarkation-criteria'))
        }
    }

    private populateDropdownFilters(): void {
        this.dropdownCustomers = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'customer')
        this.dropdownDestinations = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'destination')
        this.dropdownDrivers = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'driver')
        this.dropdownPorts = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'port')
        this.dropdownShips = this.helperService.populateTableFiltersDropdowns(this.records.reservations, 'ship')
    }

    private positionVideo(): void {
        document.getElementById('video').style.left = (window.outerWidth / 2) - 320 + 'px'
        document.getElementById('video').style.top = (document.getElementById('wrapper').clientHeight / 2) - 240 + 'px'
        document.getElementById('video').style.display = 'flex'
    }

    public refreshList(): void {
        this.router.navigate([this.url])
    }

    private updatePassengerStatusPills(): void {
        this.records.reservations.forEach(record => {
            if (record.passengers.filter(x => x.isCheckedIn).length == record.passengers.length) {
                record.isCheckedIn = this.getLabel('boarded').toUpperCase()
            }
            if (record.passengers.filter(x => !x.isCheckedIn).length == record.passengers.length) {
                record.isCheckedIn = this.getLabel('pending').toUpperCase()
            }
            if (record.passengers.filter(x => x.isCheckedIn).length != record.passengers.length && record.passengers.filter(x => !x.isCheckedIn).length != record.passengers.length) {
                record.isCheckedIn = 'MIX'
            }
        })
    }

    //#endregion

}
