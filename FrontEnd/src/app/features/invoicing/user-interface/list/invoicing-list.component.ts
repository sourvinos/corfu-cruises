import * as XLSX from 'xlsx'
import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subject } from 'rxjs'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InvoicingCriteriaVM } from '../../classes/view-models/invoicing-criteria-vm'
import { InvoicingPDFService } from '../../classes/services/invoicing-pdf.service'
import { InvoicingVM } from '../../classes/view-models/invoicing-vm'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'invoicing-list',
    templateUrl: './invoicing-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './invoicing-list.component.css']
})

export class InvoicingListComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'invoicingList'
    public featureIcon = ''
    public icon = 'arrow_back'
    public parentUrl = '/invoicing'

    public invoicingCriteria: InvoicingCriteriaVM
    public records: InvoicingVM[] = []
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private emojiService: EmojiService, private helperService: HelperService, private invoicingPdfService: InvoicingPDFService, private keyboardShortcutsService: KeyboardShortcuts, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

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
        XLSX.writeFile(wb, 'Billings for ' + this.invoicingCriteria.fromDate + '.xlsx')
    }

    public exportSingleCustomer(customerId: number): void {
        const customerRecords = this.records.find(x => x.customer.id == customerId)
        this.invoicingPdfService.createPDF(customerRecords)
    }

    public formatDatePeriod(): string {
        if (this.invoicingCriteria.fromDate == this.invoicingCriteria.toDate) {
            return this.formatDateToLocale(this.invoicingCriteria.fromDate, true)
        } else {
            return this.formatDateToLocale(this.invoicingCriteria.fromDate, true) + ' - ' + this.formatDateToLocale(this.invoicingCriteria.toDate, true)
        }
    }

    public formatDateToLocale(date: string, showWeekday = false): string {
        return this.helperService.formatISODateToLocale(date, showWeekday)
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
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
            priority: 0,
            inputs: true
        })
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = Object.assign([], listResolved.result)
        } else {
            this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                this.goBack()
            })
        }
    }

    private populateCriteriaFromStoredVariables(): void {
        if (this.localStorageService.getItem('invoicing-criteria')) {
            const criteria = JSON.parse(this.localStorageService.getItem('invoicing-criteria'))
            this.invoicingCriteria = {
                fromDate: criteria.fromDate,
                toDate: criteria.toDate,
                customer: criteria.customer,
                destination: criteria.destination,
                ship: criteria.ship
            }
        }
    }

    //#endregion

}
