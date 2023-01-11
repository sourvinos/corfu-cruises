import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { LedgerCriteriaVM } from '../../../classes/view-models/ledger-criteria-vm'
import { LedgerPDFService } from '../../../classes/services/ledger-pdf.service'
import { LedgerVM } from '../../../classes/view-models/ledger-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MatDialog } from '@angular/material/dialog'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SecondaryLedgerListComponent } from '../secondary/secondary-ledger-list.component'
import { Table } from 'primeng/table'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'primary-ledger-list',
    templateUrl: './primary-ledger-list.component.html',
    styleUrls: ['../../../../../../assets/styles/lists.css', './primary-ledger-list.component.css']
})

export class PrimaryLedgerListComponent {

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
    public distinctCustomers: any[]
    public distinctDestinations: any[]
    public distinctShips: any[]

    //#endregion

    constructor(
        private activatedRoute: ActivatedRoute,
        private dateHelperService: DateHelperService,
        private emojiService: EmojiService,
        private helperService: HelperService,
        private ledgerPdfService: LedgerPDFService,
        private localStorageService: LocalStorageService,
        private messageLabelService: MessageLabelService,
        private messageSnackbarService: MessageSnackbarService,
        private modalActionResultService: ModalActionResultService,
        private dialogService: DialogService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.populateCriteriaFromStorage()
        this.getDistinctCriteria()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods


    public exportSingleCustomer(customerId: number): void {
        console.log(customerId)
        // const customerRecords = this.records.find(x => x.customer.id == customerId)
        // this.ledgerPdfService.createPDF(customerRecords)
    }

    public exportAll(): void {
        this.ledgerPdfService.createPDF(this.records,this.criteria)
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

    public showCustomerReservations(customer: LedgerVM): void {
        this.dialog.open(SecondaryLedgerListComponent, {
            height: '600px',
            width: '1400px',
            data: {
                customer: customer,
                actions: ['abort', 'ok']
            },
            panelClass: 'dialog'
        })


    }
    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private getDistinctCriteria(): void {
        this.distinctCustomers = this.helperService.getDistinctRecords(this.records.flat(), 'customer')
        this.distinctDestinations = this.helperService.getDistinctRecords(this.records.map(x => x.reservations).flat(), 'destination')
        this.distinctShips = this.helperService.getDistinctRecords(this.records.map(x => x.reservations).flat(), 'ship')
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = Object.assign([], listResolved.result)
            console.log('All', this.records)
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
