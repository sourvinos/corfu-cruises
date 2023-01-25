import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmbarkationCriteriaVM } from '../../classes/view-models/criteria/embarkation-criteria-vm'
import { EmbarkationGroupVM } from '../../classes/view-models/list/embarkation-group-vm'
import { EmbarkationPDFService } from '../../classes/services/embarkation-pdf.service'
import { EmbarkationService } from '../../classes/services/embarkation.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'embarkation-list',
    templateUrl: './embarkation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './embarkation-list.component.css', '../../../../../assets/styles/criteria-panel.css']
})

export class EmbarkationListComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    public feature = 'embarkationList'
    public featureIcon = 'embarkation'
    public icon = 'arrow_back'
    public parentUrl = '/embarkation'

    public criteriaPanels: EmbarkationCriteriaVM

    public records: EmbarkationGroupVM
    public recordsFiltered: EmbarkationGroupVM

    public distinctCustomers: string[]
    public distinctDestinations: string[]
    public distinctDrivers: string[]
    public distinctPorts: string[]
    public distinctShips: string[]
    public distinctEmbarkationStates: any[]

    public url = '/embarkation/list'
    public scannerEnabled: boolean
    public searchByTicketNo: string
    public isLoading = new Subject<boolean>()

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
        // this.loadRecords()
        // this.updatePassengerStatusPills()
        this.populateCriteriaPanelsFromStorage()
        this.populateDropdownFilters()
        this.getLocale()
    }

    ngAfterContentChecked(): void {
        this.cd.detectChanges()
    }

    ngAfterViewInit(): void {
        this.enableDisableFilters()
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
        this.recordsFiltered.reservations = event.filteredValue
        // this.countFilteredPersons()
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
        // console.log(this.recordsFiltered)
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

    public getNationalityIcon(nationalityCode: string): any {
        return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
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
        this.embarkationPDFService.createPDF(this.recordsFiltered.reservations)
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
        return this.records.reservations.length == 0 || this.recordsFiltered.reservations.length == this.records.reservations.length
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

    private filterByTicketNo(query: string): void {
        this.recordsFiltered.reservations = []
        this.records.reservations.forEach((record) => {
            if (record.ticketNo.toLowerCase().startsWith(query.toLowerCase())) {
                this.recordsFiltered.reservations.push(record)
            }
        })
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.result
                this.recordsFiltered = this.records
                resolve(this.records)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
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

    public countFilteredPersons(): void {
        this.recordsFiltered.totalPersons = 0
        this.recordsFiltered.embarkedPassengers = 0
        this.recordsFiltered.pendingPersons = 0
        this.recordsFiltered.reservations.forEach((x) => {
            if (x.passengers && x.passengers.length > 0) {
                this.recordsFiltered.totalPersons += x.passengers.filter(Boolean).length
                x.passengers.forEach(element => {
                    element.isCheckedIn ? this.recordsFiltered.embarkedPassengers++ : this.recordsFiltered.pendingPersons++
                })
            }
        })
    }

}
