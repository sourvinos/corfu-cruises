import * as XLSX from 'xlsx'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { LedgerCriteriaVM } from '../../classes/view-models/ledger-criteria-vm'
import { LedgerPDFService } from '../../classes/services/ledger-pdf.service'
import { LedgerVM } from '../../classes/view-models/ledger-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { Table } from 'primeng/table'
import { HelperService } from 'src/app/shared/services/helper.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'ledger-list',
    templateUrl: './ledger-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './ledger-list.component.css']
})

export class LedgerListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private unsubscribe = new Subject<void>()
    public feature = 'ledgerList'
    public featureIcon = 'ledgers'
    public icon = 'arrow_back'
    public parentUrl = '/ledgers'

    public imgIsLoaded = false
    public criteria: LedgerCriteriaVM
    public records: LedgerVM[]
    public customers: any[]
    public destinations: any[]
    distinctDestinations = new Set()
    distinctShips = new Set()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private emojiService: EmojiService, private helperService: HelperService, private ledgerPdfService: LedgerPDFService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.populateCriteriaFromStorage()
        this.customers = this.helperService.getDistinctRecords(this.records, 'customer')
        for (let i = 0; i < this.records.length; i++) {
            this.records[i].reservations.map((x) => this.distinctDestinations.add(x.destination))
        }
        for (let i = 0; i < this.records.length; i++) {
            this.records[i].reservations.map((x) => this.distinctShips.add(x.ship))
        }
        console.log('destinations', [...this.distinctDestinations])
        console.log('ships', [...this.distinctShips])
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public exportAllCustomers(): void {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table)
        const wb: XLSX.WorkBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Ledger')
        XLSX.writeFile(wb, 'Billings ' + '.xlsx')
    }

    public exportSingleCustomer(customerId: number): void {
        const customerRecords = this.records.find(x => x.customer.id == customerId)
        this.ledgerPdfService.createPDF(customerRecords)
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getCustomerDescriptions(): string {
        return this.criteria.customers.map((customer) => customer.description).join(' ▪️ ')
    }

    public getDestinationDescriptions(): string {
        return this.criteria.destinations.map((destination) => destination.description).join(' ▪️ ')
    }

    public getShipDescriptions(): string {
        return this.criteria.ships.map((ship) => ship.description).join(' ▪️ ')
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '.svg'
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = Object.assign([], listResolved.result)
            console.log('api', this.records)
        } else {
            this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                this.goBack()
            })
        }
    }

    private populateCriteriaFromStorage(): void {
        if (this.localStorageService.getItem('ledger-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('ledger-criteria'))
        }
    }

    //#endregion

}
