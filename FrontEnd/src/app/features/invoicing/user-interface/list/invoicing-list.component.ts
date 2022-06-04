import * as XLSX from 'xlsx'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InvoicingCriteriaVM } from '../../classes/view-models/invoicing-criteria-vm'
import { InvoicingVM } from '../../classes/view-models/invoicing-vm'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'
import { InvoicingDisplayService } from '../../classes/services/invoicing-display.service'
import { InvoicingPDFService } from '../../classes/services/invoicing-pdf.service'

@Component({
    selector: 'invoicing-list',
    templateUrl: './invoicing-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './invoicing-list.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class InvoicingListComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'invoicingList'
    public icon = 'arrow_back'
    public parentUrl = '/invoicing'

    public invoicingCriteria: InvoicingCriteriaVM
    public records: InvoicingVM[] = []
    private customerRecords: any
    public filteredRecords: InvoicingVM[] = []
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private emojiService: EmojiService, private helperService: HelperService, private invoicingDisplayService: InvoicingDisplayService, private invoicingPdfService: InvoicingPDFService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private snackbarService: SnackbarService,) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.addShortcuts()
        this.loadRecords()
        this.populateCriteriaFromStoredVariables()
    }

    ngOnDestroy(): void {
        this.cleanup()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public exportAllCustomers(): void {
        const element = document.getElementById('table-wrapper')
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
        const wb: XLSX.WorkBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Invoicing')
        XLSX.writeFile(wb, 'Invoicing for ' + this.invoicingCriteria.date + '.xlsx')
    }

    public exportSingleCustomer(customerId: number): void {
        console.log('List', this.records)
        const customer = this.records.find(x => x.customer.id == customerId)
        console.log('Customer', customer)
        this.invoicingPdfService.createPDF(customer)
    }

    public hasTransfer(value: any): boolean {
        return value ? true : false
    }

    public formatDate(): string {
        return this.formatDateToLocale(this.invoicingCriteria.date, true)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    public replaceWildcardWithText(criteria: any): string {
        if (criteria.description.includes(this.emojiService.getEmoji('wildcard'))) {
            return this.emojiService.getEmoji('wildcard')
        } else {
            return criteria.description
        }
    }

    public showEmoji(passengerDifference: number): string {
        if (passengerDifference > 0) {
            return this.emojiService.getEmoji('warning')
        }
        if (passengerDifference == 0) {
            return this.emojiService.getEmoji('ok')
        }
        if (passengerDifference < 0) {
            return this.emojiService.getEmoji('error')
        }
    }

    //#endregion

    //#region private methods

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private formatDateToLocale(date: string, showWeekday = false): string {
        return this.helperService.formatISODateToLocale(date, showWeekday)
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = Object.assign([], listResolved.result)
        } else {
            this.goBack()
            this.showSnackbar(this.messageSnackbarService.filterError(listResolved.error), 'error')
        }
    }

    private populateCriteriaFromStoredVariables(): void {
        if (this.localStorageService.getItem('invoicing-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('invoicing-criteria'))
            this.invoicingCriteria = {
                date: criteria.date,
                customer: criteria.customer,
                destination: criteria.destination,
                ship: criteria.ship
            }
        }
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    //#endregion

}
